import json

from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.http import require_http_methods

from .models import Inquiry, Property, SiteSettings


@require_http_methods(["GET"])
def csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})


@require_http_methods(["GET"])
def site_settings(request):
    settings = SiteSettings.objects.first()
    if settings is None:
        return JsonResponse({
            "brand_name": "Zenebe Frew Real Estate",
            "logo_url": "",
            "agent_name": "Helen Hidbachew",
            "agent_title": "Real Estate Agent",
            "agent_bio": "",
            "agent_photo_url": "",
            "contact_phone": "",
            "whatsapp_number": "",
            "tiktok_url": "",
            "facebook_url": "",
            "instagram_url": "",
            "telegram_url": "",
            "currency_code": "ETB",
            "area_unit": "sqft",
        })
    logo_url = settings.logo_image.url if settings.logo_image else settings.logo_url
    return JsonResponse({
        "brand_name": settings.brand_name,
        "logo_url": logo_url,
        "agent_name": settings.agent_name,
        "agent_title": settings.agent_title,
        "agent_bio": settings.agent_bio,
        "agent_photo_url": settings.agent_photo.url if settings.agent_photo else "",
        "contact_phone": settings.contact_phone,
        "whatsapp_number": settings.whatsapp_number,
        "tiktok_url": settings.tiktok_url,
        "facebook_url": settings.facebook_url,
        "instagram_url": settings.instagram_url,
        "telegram_url": settings.telegram_url,
        "currency_code": settings.currency_code,
        "area_unit": settings.area_unit,
    })


def serialize_property(property_):
    return {
        "id": property_.id,
        "title": property_.title,
        "location": property_.location,
        "price": property_.price,
        "beds": property_.beds,
        "baths": float(property_.baths),
        "area": property_.area,
        "property_type": property_.property_type,
        "status": property_.status,
        "image_url": property_.image_file.url if property_.image_file else property_.image_url,
        "video_url": property_.video_url or (property_.video_file.url if property_.video_file else ""),
        "description": property_.description,
        "featured": property_.featured,
    }


@require_http_methods(["GET"])
def properties(request):
    requested_status = request.GET.get("status", "").strip().casefold()
    status = next(
        (
            choice
            for choice in Property.ListingStatus.values
            if choice.casefold() == requested_status
        ),
        Property.ListingStatus.FOR_SALE,
    )
    listings = Property.objects.filter(status=status)
    location = request.GET.get("location", "").strip()
    property_type = request.GET.get("type", "").strip()
    if location:
        listings = listings.filter(location__icontains=location)
    if property_type in Property.PropertyType.values:
        listings = listings.filter(property_type=property_type)
    return JsonResponse([serialize_property(item) for item in listings], safe=False)


@require_http_methods(["POST"])
def inquiries(request):
    try:
        payload = json.loads(request.body)
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"detail": "Request body must be valid JSON."}, status=400)

    if not isinstance(payload, dict):
        return JsonResponse({"detail": "Request body must be a JSON object."}, status=400)

    name = payload.get("name", "")
    email = payload.get("email", "")
    phone = payload.get("phone", "")
    message = payload.get("message", "")
    property_id = payload.get("property")

    if not all(isinstance(value, str) for value in (name, email, phone, message)):
        return JsonResponse({"detail": "Name, email, phone, and message must be text."}, status=400)
    name, email, phone, message = (value.strip() for value in (name, email, phone, message))
    if not name or len(name) > 120:
        return JsonResponse({"detail": "Please provide a name of 1 to 120 characters."}, status=400)
    if not email or len(email) > 254:
        return JsonResponse({"detail": "Please provide a valid email address."}, status=400)
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"detail": "Please provide a valid email address."}, status=400)
    if len(phone) > 40:
        return JsonResponse({"detail": "Phone number must be 40 characters or fewer."}, status=400)
    if not message or len(message) > 2000:
        return JsonResponse({"detail": "Please provide a message of 1 to 2000 characters."}, status=400)

    property_ = None
    if property_id is not None:
        try:
            property_ = Property.objects.get(pk=property_id)
        except (Property.DoesNotExist, ValueError, TypeError):
            return JsonResponse({"detail": "The selected property does not exist."}, status=400)

    inquiry = Inquiry.objects.create(
        name=name,
        email=email,
        phone=phone,
        message=message,
        property=property_,
    )
    return JsonResponse({"id": inquiry.id, "detail": "Your note has been received."}, status=201)
