from django.contrib import admin

from .models import Inquiry, Property, SiteSettings


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Brokerage", {"fields": ("brand_name", "logo_image", "logo_url")}),
        ("Agent profile", {"fields": ("agent_name", "agent_title", "agent_bio", "agent_photo")}),
        ("Social accounts", {"fields": ("whatsapp_number", "tiktok_url", "facebook_url", "instagram_url", "telegram_url")}),
        ("Other contact options", {"fields": ("contact_phone",)}),
        ("Listing display", {"fields": ("currency_code", "area_unit")}),
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == "agent_photo":
            kwargs["label"] = "Helen's profile photo"
            kwargs["help_text"] = "Upload Helen's photo here. It replaces the initials placeholder in the About section."
        return super().formfield_for_dbfield(db_field, request, **kwargs)

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        obj.pk = 1
        super().save_model(request, obj, form, change)


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ("title", "location", "price", "property_type", "status", "featured", "has_video", "updated_at")
    list_filter = ("status", "property_type", "featured")
    search_fields = ("title", "location", "description")
    ordering = ("-featured", "-updated_at")
    list_editable = ("status", "featured")

    @admin.display(boolean=True, description="Video")
    def has_video(self, obj):
        return bool(obj.video_file or obj.video_url)


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "phone", "property", "contacted", "created_at")
    list_filter = ("contacted", "created_at")
    search_fields = ("name", "email", "message", "property__title")
    readonly_fields = ("created_at",)
    list_editable = ("contacted",)
