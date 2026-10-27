# Zenebe Frew Real Estate

A mobile-friendly real-estate website built with React and Vite. The live site uses Supabase for property listings, branding, customer inquiries, authentication, and media storage. Deploy the static frontend to Cloudflare Pages; manage the site at `/admin`.

The Django backend remains in `backend/` for the previous deployment and data reference. The Cloudflare Pages site does not run Django.

## Local development

Requirements: Node.js 20 or newer and a Supabase project.

1. In Supabase, open **Project Settings → API** and copy the project URL and publishable key (or legacy anon public key).
2. Create `.env.local` in the repository root:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```

   These browser values are public by design. Never put a database password, S3 secret, or service-role key in a `VITE_` variable.
3. Install dependencies and start Vite:

   ```bash
   npm install
   npm run dev
   ```

Open the local URL printed by Vite. The public website uses `/`, and the custom admin is at `/admin`.

## Set up Supabase

1. Back up any existing database before changing it.
2. In the Supabase project selected for this website, open **SQL Editor**, paste the contents of [`supabase/migrations/20261027000000_initial_real_estate.sql`](./supabase/migrations/20261027000000_initial_real_estate.sql), and run it. It creates the site settings, properties, and inquiries tables; row-level security policies; and the public `real-estate-media` storage bucket. If the previous Django tables are still in this same database, the SQL also copies their records. Previously uploaded files on local/Vercel storage are not copied; upload those files again through the admin.
3. Run [`supabase/migrations/20261028000000_add_amharic_content.sql`](./supabase/migrations/20261028000000_add_amharic_content.sql) as a separate query to add optional Amharic translations for listing titles, locations, descriptions, and agent profile text. If you have already applied the initial schema, run only this incremental migration; do not rerun the initial migration.
4. In **Authentication → Users**, create the administrator account. Disable public signups in the Auth settings if visitors should not be able to create accounts.
5. In **SQL Editor**, grant that exact account the server-controlled admin role, replacing the email with the one you just created:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   Confirm the command updated exactly one account. The admin page checks `app_metadata.role`; changing user-editable metadata does not grant admin access. Sign out and back in after changing the role so the session refreshes.
6. Add the project URL and publishable/anon key to the local `.env.local` or Cloudflare Pages environment as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

The public website can read site settings and property listings and submit inquiries. Only signed-in accounts with the server-controlled admin role can change listings, branding, inquiries, or upload media. Do not remove the row-level security policies or expose a service-role key.

## Admin

Sign in at `/admin` using the Supabase Auth account you created. The admin lets you:

- Add, edit, feature, and delete apartment or shop listings, including status and optional photo/video uploads.
- Add optional Amharic titles, locations, and descriptions for listings, and an Amharic agent title and biography. Fields without an Amharic translation fall back to their English value.
- Edit the agent profile, business contact links, currency, and area units.
- Read customer inquiries and mark them as contacted.

The media bucket is public for visitors to view published photos and videos; uploads and changes are restricted by storage policies to administrators.

## Deploy to Cloudflare Pages

Create a Cloudflare Pages project connected to this repository with:

- **Root directory:** repository root
- **Build command:** `npm run build`
- **Build output directory:** `dist`

In the Pages project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for both Production and Preview environments. These are embedded when Vite builds the site; trigger a new deployment after changing either value. Cloudflare Pages serves the Vite single-page app, including the `/admin` route.

Supabase and Cloudflare free plans have usage and storage limits and are not an unlimited hosting guarantee. Check each provider's current quotas and pricing before relying on the free tiers for business-critical traffic.

## Listings and inquiries

The website shows listings whose status is **For sale** or **Under contract**. Set a listing to **Sold** to show it on the past-sales page. Inquiry submissions are saved in Supabase and are visible only to admin users.

Use the currency and area-unit settings to match the listing data. Replace any sample listings with the agent's real inventory and licensed photography before sharing the public site.
