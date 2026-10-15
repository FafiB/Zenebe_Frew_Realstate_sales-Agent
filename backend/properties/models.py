from django.core.validators import FileExtensionValidator, MinValueValidator
from django.db import models


class SiteSettings(models.Model):
    brand_name = models.CharField(max_length=120, default="Zenebe Frew Real Estate")
    logo_image = models.ImageField(
        upload_to="site-logos/",
        blank=True,
        verbose_name="logo image",
        help_text="Upload a logo image. This takes priority over the logo URL.",
    )
    logo_url = models.URLField(
        max_length=500,
        blank=True,
        verbose_name="logo URL",
        help_text="Optional public image URL; used when no uploaded logo is set.",
    )
    agent_name = models.CharField(max_length=120, default="Helen Hidbachew")
    agent_title = models.CharField(max_length=120, default="Real Estate Agent")
    agent_bio = models.TextField(
        blank=True,
        default="Buying or selling a home is a personal decision. I’m here to help you explore your options, understand the next steps, and find a home that feels right for you.",
    )
    agent_photo = models.ImageField(upload_to="agent-photos/", blank=True)
    contact_phone = models.CharField(max_length=40, blank=True)
    whatsapp_number = models.CharField(
        max_length=40,
        blank=True,
        help_text="International number, e.g. 251911123456. Enter digits only.",
    )
    tiktok_url = models.URLField(max_length=500, blank=True)
    facebook_url = models.URLField(max_length=500, blank=True)
    instagram_url = models.URLField(max_length=500, blank=True)
    telegram_url = models.URLField(max_length=500, blank=True)
    currency_code = models.CharField(max_length=3, default="ETB")
    area_unit = models.CharField(max_length=12, default="sqft")

    class Meta:
        verbose_name = "site branding"
        verbose_name_plural = "site branding"

    def __str__(self):
        return self.brand_name


class Property(models.Model):
    class PropertyType(models.TextChoices):
        HOUSE = "House", "House"
        CONDO = "Condo", "Condo"
        TOWNHOUSE = "Townhouse", "Townhouse"
        APARTMENT = "Apartment", "Apartment"
        SHOP = "Shop", "Shop"

    class ListingStatus(models.TextChoices):
        FOR_SALE = "For sale", "For sale"
        UNDER_CONTRACT = "Under contract", "Under contract"
        SOLD = "Sold", "Sold"

    title = models.CharField(max_length=120)
    location = models.CharField(max_length=180)
    price = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    beds = models.PositiveSmallIntegerField()
    baths = models.DecimalField(max_digits=3, decimal_places=1)
    area = models.PositiveIntegerField(help_text="Interior square feet")
    property_type = models.CharField(max_length=20, choices=PropertyType.choices)
    status = models.CharField(max_length=20, choices=ListingStatus.choices, default=ListingStatus.FOR_SALE)
    image_url = models.URLField(max_length=500, blank=True)
    image_file = models.ImageField(upload_to="property-images/", blank=True)
    video_file = models.FileField(
        upload_to="property-videos/",
        blank=True,
        validators=[FileExtensionValidator(["mp4", "webm", "mov", "m4v"])],
        help_text="Optional property video (MP4, WebM, MOV, or M4V).",
    )
    video_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="Optional direct URL to a video file (MP4, WebM, MOV, or M4V).",
    )
    description = models.TextField(blank=True)
    featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-featured", "-created_at"]
        verbose_name_plural = "properties"

    def __str__(self):
        return self.title


class Inquiry(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=40, blank=True)
    message = models.TextField(max_length=2000)
    property = models.ForeignKey(
        Property,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="inquiries",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    contacted = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.created_at:%Y-%m-%d}"
