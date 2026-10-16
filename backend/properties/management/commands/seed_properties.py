from django.core.management.base import BaseCommand

from properties.models import Property


LISTINGS = [
    {
        "title": "The Morning Light",
        "location": "Bole, Addis Ababa",
        "price": 18500000,
        "beds": 3,
        "baths": "2.0",
        "area": 168,
        "property_type": Property.PropertyType.APARTMENT,
        "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90",
        "description": "A sunlit, beautifully finished apartment with generous living spaces and room to settle in.",
        "featured": True,
    },
    {
        "title": "Bole Avenue Retail",
        "location": "Bole, Addis Ababa",
        "price": 24000000,
        "beds": 0,
        "baths": "1.0",
        "area": 112,
        "property_type": Property.PropertyType.SHOP,
        "image_url": "https://images.unsplash.com/photo-1604328698692-f76ea9498e76?auto=format&fit=crop&w=1600&q=90",
        "description": "A bright, flexible retail space in a lively neighborhood, ready for your next business idea.",
        "featured": True,
    },
    {
        "title": "City View Residence",
        "location": "Kazanchis, Addis Ababa",
        "price": 14800000,
        "beds": 2,
        "baths": "2.0",
        "area": 124,
        "property_type": Property.PropertyType.APARTMENT,
        "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
        "description": "A calm, contemporary city home with open views, thoughtful details, and an easy everyday feel.",
        "featured": True,
    },
]


class Command(BaseCommand):
    help = "Create or update the three sample property listings."

    def handle(self, *args, **options):
        for listing in LISTINGS:
            title = listing["title"]
            Property.objects.update_or_create(title=title, defaults=listing)
            self.stdout.write(f"Loaded: {title}")
