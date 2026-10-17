import os
from pathlib import Path

import dj_database_url

BASE_DIR = Path(__file__).resolve().parent.parent
debug_default = "false" if os.environ.get("VERCEL_ENV") in {"production", "preview"} else "true"
DEBUG = os.environ.get("DEBUG", debug_default).lower() == "true"
SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-development-key-change-before-deployment")
if not DEBUG and SECRET_KEY == "django-insecure-development-key-change-before-deployment":
    raise RuntimeError("Set SECRET_KEY in the environment when DEBUG is false.")

def environment_list(name, default=""):
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


def configured_frontend_origins():
    return list(dict.fromkeys(
        origin.rstrip("/")
        for origin in [
            *environment_list("CORS_ALLOWED_ORIGINS"),
            *environment_list("FRONTEND_URL"),
        ]
    ))


def configured_allowed_hosts():
    return list(dict.fromkeys(
        host.rstrip("/")
        for host in [
            *environment_list("ALLOWED_HOSTS", "127.0.0.1,localhost"),
            *environment_list("VERCEL_URL"),
            *environment_list("VERCEL_PROJECT_PRODUCTION_URL"),
        ]
    ))


def is_vercel_environment():
    return os.environ.get("VERCEL") == "1" or bool(os.environ.get("VERCEL_ENV"))


def database_connection_max_age():
    return 0 if is_vercel_environment() else 600


def database_connection_options():
    if is_vercel_environment():
        return {"prepare_threshold": None}
    return {}


def supabase_media_storage_options():
    setting_names = {
        "project_ref": "SUPABASE_PROJECT_REF",
        "bucket_name": "SUPABASE_STORAGE_BUCKET",
        "access_key": "SUPABASE_S3_ACCESS_KEY_ID",
        "secret_key": "SUPABASE_S3_SECRET_ACCESS_KEY",
    }
    values = {key: os.environ.get(name, "").strip() for key, name in setting_names.items()}
    if not any(values.values()):
        return None

    missing = [setting_names[key] for key, value in values.items() if not value]
    if missing:
        raise RuntimeError(
            "Supabase media storage is partially configured; set: "
            + ", ".join(missing)
        )

    project_ref = values["project_ref"]
    bucket_name = values["bucket_name"]
    return {
        "access_key": values["access_key"],
        "secret_key": values["secret_key"],
        "bucket_name": bucket_name,
        "endpoint_url": f"https://{project_ref}.supabase.co/storage/v1/s3",
        "region_name": "us-east-1",
        "signature_version": "s3v4",
        "addressing_style": "path",
        "custom_domain": (
            f"{project_ref}.supabase.co/storage/v1/object/public/{bucket_name}"
        ),
        "querystring_auth": False,
        "default_acl": None,
        "file_overwrite": False,
    }


ALLOWED_HOSTS = configured_allowed_hosts()
configured_origins = configured_frontend_origins()
CSRF_TRUSTED_ORIGINS = list(dict.fromkeys(
    ["http://127.0.0.1:5173", "http://localhost:5173", *configured_origins]
))

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "properties",
    "corsheaders",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
WSGI_APPLICATION = "config.wsgi.application"

database_url = os.environ.get("DATABASE_URL")
if not DEBUG and not database_url:
    raise RuntimeError("Set DATABASE_URL to a persistent PostgreSQL database when DEBUG is false.")

DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}",
        conn_max_age=database_connection_max_age(),
        conn_health_checks=True,
        ssl_require=bool(database_url and not DEBUG),
    )
}
if is_vercel_environment():
    DATABASES["default"]["OPTIONS"] = database_connection_options()
    DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True

CORS_ALLOWED_ORIGINS = configured_origins
CORS_ALLOW_CREDENTIALS = True
CSRF_COOKIE_SAMESITE = "Lax" if DEBUG else "None"
CSRF_COOKIE_SECURE = not DEBUG
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "America/Los_Angeles"
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
staticfiles_backend = (
    "django.contrib.staticfiles.storage.StaticFilesStorage"
    if DEBUG
    else "whitenoise.storage.CompressedManifestStaticFilesStorage"
)
media_storage_options = supabase_media_storage_options()
STORAGES = {
    "default": (
        {
            "BACKEND": "storages.backends.s3.S3Storage",
            "OPTIONS": media_storage_options,
        }
        if media_storage_options
        else {"BACKEND": "django.core.files.storage.FileSystemStorage"}
    ),
    "staticfiles": {"BACKEND": staticfiles_backend},
}
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
