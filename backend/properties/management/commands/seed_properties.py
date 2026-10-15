from django.core.management.base import BaseCommand

from properties.models import Property


LISTINGS = [
    {
        "title": "The Sunday House",
        "location": "Silver Lake, Los Angeles",
        "price": 1845000,
        "beds": 3,
        "baths": "2.0",
        "area": 2180,
        "property_type": "House",
        "image_url": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=85",
        "description": "A sun-drenched California bungalow with an open, easy flow, original details, and a garden made for slow Sundays.",
        "featured": True,
    },
    {
        "title": "Olive & Oak",
        "location": "Pasadena, Los Angeles",
        "price": 1295000,
        "beds": 4,
        "baths": "3.0",
        "area": 2640,
        "property_type": "House",
        "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85",
        "description": "A graceful Spanish-style home with a welcoming courtyard, warm oak floors, and room to gather.",
        "featured": True,
    },
    {
        "title": "A Little Above It All",
        "location": "Los Feliz, Los Angeles",
        "price": 875000,
        "beds": 2,
        "baths": "2.0",
        "area": 1480,
        "property_type": "Condo",
        "image_url": "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1100&q=85",
        "description": "A light-filled hillside retreat with leafy views, a generous terrace, and a little more room to breathe.",
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
