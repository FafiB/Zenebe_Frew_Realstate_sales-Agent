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

In Django Admin, open **Site branding** to change the brokerage name and logo, update Helen's profile, and upload her photo in **Helen's profile photo**. The uploaded portrait replaces the initials placeholder in the About section. Configure phone, WhatsApp, TikTok, Facebook, Instagram, Telegram, currency, and area units there as well. The header, footer, and browser title use the admin-managed brokerage name; five floating social circles appear on every page, and activate when their accounts are configured. Property listings support House, Condo, Townhouse, Apartment, and Shop types, uploaded photos, video uploads (MP4, WebM, MOV, or M4V), and direct video URLs. A video tour appears in the listing detail dialog. Featured properties populate the **Projects** section.

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

The frontend uses sample property cards when the backend is unavailable, and the seed command provides starter listings. Replace these with the agent's real listings before publishing. Inquiries require the Django backend. Past sales are managed by setting a listing's status to **Sold** in Django Admin. Uploaded media is stored under `backend/media/`; configure production media serving when deploying.

## Before deploying

Set a private `SECRET_KEY`, set `DEBUG = False`, configure `ALLOWED_HOSTS`, use a production database, and serve the built frontend and Django API through a production web server. Replace the sample listings and image URLs with the agent’s real inventory and licensed photography.
