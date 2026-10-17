# Zenebe Frew Real Estate

A responsive real-estate agent website for Helen Hidbachew, styled in blue and white and built with React and Vite, backed by Django and SQLite. The Django admin manages brokerage branding, agent details and contact options, property listings, and inquiries.

## Requirements

- Node.js 20 or newer
- Python 3.10 or newer

## Start the Django backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_properties
python manage.py createsuperuser
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/api/`. The admin is at `http://127.0.0.1:8000/admin/`.

In Django Admin, open **Site branding** to change the brokerage name and logo, update Helen's profile, and upload her photo in **Helen's profile photo**. The uploaded portrait replaces the initials placeholder in the About section. Configure phone, WhatsApp, TikTok, Facebook, Instagram, Telegram, currency, and area units there as well. The header, footer, and browser title use the admin-managed brokerage name; five floating social circles appear on every page, and activate when their accounts are configured. Property listings support Apartment and Shop types, uploaded photos, video uploads (MP4, WebM, MOV, or M4V), and direct video URLs. A video tour appears in the listing detail dialog. Featured properties populate the **Projects** section.

## Start the React frontend

In a second terminal, from the project root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Its development server proxies `/api` requests to Django.

Property currency defaults to Ethiopian Birr (ETB); currency and area units are configurable in **Site branding**. The sample records are layout placeholders; add the agency's actual inventory before sharing the website publicly.

## API

- `GET /api/properties/` — returns active listings; accepts optional `location` and `type` filters. Use `status=sold` for past sales.
- `GET /api/site-settings/` — returns public branding, agent-profile, contact, currency, and area-unit settings.
- `POST /api/inquiries/` — creates an inquiry. Required JSON fields: `name`, `email`, and `message`; `phone` and `property` are optional.

The frontend uses sample property cards when the backend is unavailable, and the seed command provides starter listings. Replace these with the agent's real listings before publishing. Inquiries require the Django backend. Past sales are managed by setting a listing's status to **Sold** in Django Admin. Uploaded media is stored locally during development and in Supabase Storage in production.

## Deploy the frontend and backend on Vercel

Deploy the repository root to Vercel. The root `vercel.json` configures Vite for the frontend and Django for the backend, routing `/api/`, `/admin/`, and `/static/` requests to Django. The frontend uses same-origin API requests, so leave `VITE_API_BASE_URL` unset unless deploying the frontend on a separate domain.

Configure these backend environment variables:

- `DEBUG=false`
- `SECRET_KEY` — a strong, private random value
- `ALLOWED_HOSTS` — the backend host name only, without scheme or path (for example `your-api.koyeb.app`). This is the hostname users access for the Django API, not the Vercel frontend domain.
- On Vercel, production and preview deployments default to `DEBUG=false`; Django also trusts the exact deployment and production hostnames provided by Vercel's `VERCEL_URL` and `VERCEL_PROJECT_PRODUCTION_URL` environment variables. Set a private `SECRET_KEY` in Vercel before deploying because production mode rejects the development fallback key.
- `FRONTEND_URL` — the exact frontend origin, including scheme (for example `https://your-site.vercel.app`). This is automatically added to both CORS and trusted CSRF origins. Separate multiple origins with commas if you use more than one frontend domain.
- `CORS_ALLOWED_ORIGINS` — optional additional frontend origins, including scheme; separate multiple origins with commas.
- `DATABASE_URL` — a persistent PostgreSQL connection URL

The configured frontend origins are also trusted for Django CSRF checks, and secure cross-site CSRF cookies are enabled when `DEBUG=false`. For example, set `ALLOWED_HOSTS` to the Koyeb backend hostname and `FRONTEND_URL` to the Vercel frontend origin. Create a Django administrator on the hosted service using its shell: `python manage.py createsuperuser`.

For Vercel deployments, connect a persistent PostgreSQL database, then make sure its full PostgreSQL connection URI is available as `DATABASE_URL` to the backend service in Production (and Preview, if used). Production now fails clearly at startup if `DATABASE_URL` is missing instead of silently using SQLite, which is not persistent or reliable for serverless deployments. Vercel uses short-lived database connections, disables prepared statements, and disables server-side cursors for compatibility with transaction poolers such as Supabase's. In Supabase, choose **Connect → Transaction pooler** for the Vercel runtime. Before signing into Django Admin, run `python manage.py migrate` and `python manage.py createsuperuser` against that same production database from a trusted environment with the backend dependencies and production `DATABASE_URL` configured. For migrations, Supabase recommends a direct connection; if your local network cannot connect directly, use its session pooler. Migrations must be applied before admin login because Django authentication and sessions require their database tables. Never commit or share the database URL.

### Configure Supabase Storage for uploads

Create a bucket in Supabase Storage (for example, `real-estate-media`) and make it **public**, because listing photos, agent photos, and videos are served to website visitors. In the Supabase Storage settings, enable the S3 protocol and create an S3 access key and secret. Add these Vercel environment variables to the Django service for Production (and Preview if used):

- `SUPABASE_PROJECT_REF` — project reference from the Supabase project URL
- `SUPABASE_STORAGE_BUCKET` — the public bucket name
- `SUPABASE_S3_ACCESS_KEY_ID` — the S3 access key generated in Supabase Storage settings
- `SUPABASE_S3_SECRET_ACCESS_KEY` — its matching secret; store it only in Vercel, never in the repository or frontend

The backend uploads through Supabase's S3-compatible endpoint and generates public object URLs for the React site. Keep the Supabase S3 secret server-side; do not use a service-role or database password as the S3 credential. Redeploy after adding the variables. Existing uploads on Vercel's temporary filesystem are not persistent; upload them again after storage is configured. Local development continues to use `backend/media/` when these Supabase variables are not set.

## Before deploying

Set a private `SECRET_KEY`, set `DEBUG = False`, configure `ALLOWED_HOSTS`, use a production database, and serve the built frontend and Django API through a production web server. Replace the sample listings and image URLs with the agent’s real inventory and licensed photography.
