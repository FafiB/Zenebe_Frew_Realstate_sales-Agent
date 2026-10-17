import json
import tempfile
from io import BytesIO
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import override_settings
from django.test import TestCase
from PIL import Image

from config.settings import (
    configured_allowed_hosts,
    configured_frontend_origins,
    database_connection_max_age,
)
from .models import Inquiry, Property, SiteSettings


class PropertyApiTests(TestCase):
    @patch.dict(
        "os.environ",
        {
            "ALLOWED_HOSTS": "api.example.com",
            "VERCEL_URL": "deployment.vercel.app",
            "VERCEL_PROJECT_PRODUCTION_URL": "www.example.com",
        },
        clear=True,
    )
    def test_vercel_hostnames_are_added_to_allowed_hosts(self):
        self.assertEqual(
            configured_allowed_hosts(),
            ["api.example.com", "deployment.vercel.app", "www.example.com"],
        )

    @patch.dict(
        "os.environ",
        {
            "CORS_ALLOWED_ORIGINS": " https://extra.example.com,https://site.example.com/ ",
            "FRONTEND_URL": "https://site.example.com/",
        },
    )
    def test_frontend_url_is_normalized_and_added_to_cors_origins(self):
        self.assertEqual(
            configured_frontend_origins(),
            ["https://extra.example.com", "https://site.example.com"],
        )

    @patch.dict("os.environ", {"VERCEL_ENV": "production"}, clear=True)
    def test_vercel_uses_short_lived_database_connections(self):
        self.assertEqual(database_connection_max_age(), 0)

    @patch.dict("os.environ", {}, clear=True)
    def test_non_vercel_deployments_keep_database_connection_reuse(self):
        self.assertEqual(database_connection_max_age(), 600)

    def setUp(self):
        self.home = Property.objects.create(
            title="The Garden Apartment",
            location="Silver Lake, Los Angeles",
            price=1200000,
            beds=3,
            baths="2.0",
            area=1800,
            property_type=Property.PropertyType.APARTMENT,
            status="For sale",
            image_url="https://example.com/home.jpg",
        )

    def test_lists_active_properties(self):
        Property.objects.create(
            title="Sold Home",
            location="Pasadena",
            price=900000,
            beds=2,
            baths="1.0",
            area=1200,
            property_type=Property.PropertyType.SHOP,
            status="Sold",
            image_url="https://example.com/sold.jpg",
        )
        Property.objects.create(
            title="Legacy House Listing",
            location="Addis Ababa",
            price=900000,
            beds=2,
            baths="1.0",
            area=1200,
            property_type="House",
        )
        response = self.client.get("/api/properties/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["title"] for item in response.json()], ["The Garden Apartment"])

    def test_filters_by_location_and_type(self):
        response = self.client.get("/api/properties/?location=Silver&type=Apartment")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]["id"], self.home.id)

    def test_filters_by_apartment_and_shop_types(self):
        for property_type in (Property.PropertyType.APARTMENT, Property.PropertyType.SHOP):
            Property.objects.create(
                title=f"Sample {property_type}",
                location="Addis Ababa",
                price=1000000,
                beds=1,
                baths="1.0",
                area=900,
                property_type=property_type,
            )

            response = self.client.get(
                f"/api/properties/?location=Addis%20Ababa&type={property_type}"
            )
            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                [item["property_type"] for item in response.json()],
                [property_type],
            )

    def test_site_settings_returns_branding_for_frontend(self):
        settings = SiteSettings.objects.get(pk=1)
        settings.brand_name = "HIDBACHEW REALTY"
        settings.logo_url = "https://example.com/logo.svg"
        settings.contact_phone = "+251 911 123 456"
        settings.whatsapp_number = "251911123456"
        settings.tiktok_url = "https://www.tiktok.com/@helen"
        settings.facebook_url = "https://www.facebook.com/helen"
        settings.instagram_url = "https://www.instagram.com/helen"
        settings.telegram_url = "https://t.me/helen"
        settings.save()
        response = self.client.get("/api/site-settings/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "brand_name": "HIDBACHEW REALTY",
            "logo_url": "https://example.com/logo.svg",
            "agent_name": "Helen Hidbachew",
            "agent_title": "Real Estate Agent",
            "agent_bio": "Buying or selling a home is a personal decision. I’m here to help you explore your options, understand the next steps, and find a home that feels right for you.",
            "agent_photo_url": "",
            "contact_phone": "+251 911 123 456",
            "whatsapp_number": "251911123456",
            "tiktok_url": "https://www.tiktok.com/@helen",
            "facebook_url": "https://www.facebook.com/helen",
            "instagram_url": "https://www.instagram.com/helen",
            "telegram_url": "https://t.me/helen",
            "tiktok_url": "https://www.tiktok.com/@helen",
            "facebook_url": "https://www.facebook.com/helen",
            "instagram_url": "https://www.instagram.com/helen",
            "currency_code": "ETB",
            "area_unit": "sqft",
        })

    def test_uploaded_logo_is_returned_to_frontend(self):
        image_bytes = BytesIO()
        Image.new("RGB", (1, 1), color="white").save(image_bytes, format="PNG")
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                settings = SiteSettings.objects.get(pk=1)
                settings.logo_image.save(
                    "brokerage-logo.png",
                    SimpleUploadedFile("brokerage-logo.png", image_bytes.getvalue(), content_type="image/png"),
                    save=True,
                )
                response = self.client.get("/api/site-settings/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["logo_url"], "/media/site-logos/brokerage-logo.png")

    def test_admin_can_edit_site_branding(self):
        user_model = get_user_model()
        user_model.objects.create_superuser(
            username="branding-admin",
            email="admin@example.com",
            password="test-password-123",
        )
        self.client.login(username="branding-admin", password="test-password-123")
        response = self.client.get("/admin/properties/sitesettings/1/change/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "brand_name")
        self.assertContains(response, "logo_image")
        self.assertContains(response, "contact_phone")
        self.assertContains(response, "whatsapp_number")
        self.assertContains(response, "tiktok_url")
        self.assertContains(response, "facebook_url")
        self.assertContains(response, "instagram_url")
        self.assertContains(response, "tiktok_url")
        self.assertContains(response, "facebook_url")
        self.assertContains(response, "instagram_url")

    def test_admin_listing_form_supports_uploaded_photos_and_videos(self):
        user_model = get_user_model()
        user_model.objects.create_superuser(
            username="listing-admin",
            email="listings@example.com",
            password="test-password-123",
        )
        self.client.login(username="listing-admin", password="test-password-123")
        response = self.client.get(f"/admin/properties/property/{self.home.id}/change/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "image_file")
        self.assertContains(response, "video_file")
        self.assertContains(response, "video_url")
        self.assertContains(response, "Apartment")
        self.assertContains(response, "Shop")
        self.assertNotContains(response, ">House<")

    def test_sold_listings_are_available_for_past_sales_page(self):
        sold_home = Property.objects.create(
            title="Sold Garden Apartment",
            location="Pasadena",
            price=900000,
            beds=2,
            baths="1.0",
            area=1200,
            property_type=Property.PropertyType.APARTMENT,
            status=Property.ListingStatus.SOLD,
            image_url="https://example.com/sold.jpg",
        )
        response = self.client.get("/api/properties/?status=sold")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.json()], [sold_home.id])

    def test_unknown_status_does_not_expose_sold_listings(self):
        Property.objects.create(
            title="Sold Garden Apartment",
            location="Pasadena",
            price=900000,
            beds=2,
            baths="1.0",
            area=1200,
            property_type=Property.PropertyType.APARTMENT,
            status=Property.ListingStatus.SOLD,
            image_url="https://example.com/sold.jpg",
        )
        response = self.client.get("/api/properties/?status=unknown")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["title"] for item in response.json()], ["The Garden Apartment"])

    def test_property_video_url_is_included_in_listing_api(self):
        self.home.video_url = "https://example.com/tour.mp4"
        self.home.save()
        response = self.client.get("/api/properties/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["video_url"], "https://example.com/tour.mp4")

    def test_uploaded_property_video_is_included_in_listing_api(self):
        with tempfile.TemporaryDirectory() as media_root:
            with override_settings(MEDIA_ROOT=media_root):
                self.home.video_file.save(
                    "home-tour.mp4",
                    SimpleUploadedFile("home-tour.mp4", b"demo video"),
                    save=True,
                )
                response = self.client.get("/api/properties/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()[0]["video_url"], "/media/property-videos/home-tour.mp4")

    def test_property_video_rejects_unsupported_extensions(self):
        self.home.video_file = SimpleUploadedFile("home-tour.exe", b"not a video")
        with self.assertRaises(ValidationError):
            self.home.full_clean()

    def test_video_only_property_can_be_created(self):
        home = Property.objects.create(
            title="Video Tour Listing",
            location="Addis Ababa",
            price=12000000,
            beds=2,
            baths="2.0",
            area=120,
            property_type=Property.PropertyType.APARTMENT,
            video_url="https://example.com/tour.mp4",
        )
        self.assertEqual(home.image_url, "")

    def test_valid_inquiry_is_saved(self):
        client = self.client_class(enforce_csrf_checks=True)
        csrf_response = client.get("/api/csrf/")
        response = client.post(
            "/api/inquiries/",
            data=json.dumps({
                "name": "Taylor Example",
                "email": "taylor@example.com",
                "phone": "",
                "message": "Could I see this home?",
                "property": self.home.id,
            }),
            content_type="application/json",
            HTTP_ORIGIN="http://127.0.0.1:5173",
            HTTP_HOST="127.0.0.1:8000",
            HTTP_X_CSRFTOKEN=csrf_response.json()["csrfToken"],
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Inquiry.objects.get().property, self.home)

    @override_settings(
        CORS_ALLOWED_ORIGINS=["https://front.example.com"],
        CORS_ALLOW_CREDENTIALS=True,
        CSRF_TRUSTED_ORIGINS=["https://front.example.com"],
        CSRF_COOKIE_SAMESITE="None",
        CSRF_COOKIE_SECURE=True,
    )
    def test_cross_origin_inquiry_uses_cors_and_csrf(self):
        client = self.client_class(enforce_csrf_checks=True)
        origin = "https://front.example.com"
        csrf_response = client.get("/api/csrf/", HTTP_ORIGIN=origin)
        self.assertEqual(csrf_response["Access-Control-Allow-Origin"], origin)
        self.assertEqual(csrf_response["Access-Control-Allow-Credentials"], "true")
        self.assertEqual(csrf_response.cookies["csrftoken"]["samesite"], "None")
        self.assertTrue(csrf_response.cookies["csrftoken"]["secure"])

        response = client.post(
            "/api/inquiries/",
            data=json.dumps({
                "name": "Taylor Example",
                "email": "taylor@example.com",
                "phone": "",
                "message": "Could I see this home?",
                "property": self.home.id,
            }),
            content_type="application/json",
            HTTP_ORIGIN=origin,
            HTTP_X_CSRFTOKEN=csrf_response.json()["csrfToken"],
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response["Access-Control-Allow-Origin"], origin)
        self.assertEqual(Inquiry.objects.count(), 1)

    def test_inquiry_requires_csrf_token(self):
        client = self.client_class(enforce_csrf_checks=True)
        response = client.post(
            "/api/inquiries/",
            data=json.dumps({
                "name": "Taylor Example",
                "email": "taylor@example.com",
                "message": "Hello",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(Inquiry.objects.count(), 0)

    def test_invalid_email_is_rejected(self):
        response = self.client.post(
            "/api/inquiries/",
            data=json.dumps({
                "name": "Taylor Example",
                "email": "not-an-email",
                "phone": "",
                "message": "Hello",
            }),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Inquiry.objects.count(), 0)
