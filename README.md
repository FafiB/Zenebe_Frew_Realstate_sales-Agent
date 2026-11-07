# Zenebe Frew Real Estate

A mobile-friendly real-estate website built with React and Vite. The live site uses Supabase for property listings, branding, customer inquiries, and authentication, with Cloudflare R2 for media storage. Deploy the site to Cloudflare Pages; manage it at `/admin`.

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
2. In the Supabase project selected for this website, open **SQL Editor**, paste the contents of [`supabase/migrations/20261027000000_initial_real_estate.sql`](./supabase/migrations/20261027000000_initial_real_estate.sql), and run it. It creates the site settings, properties, and inquiries tables and row-level security policies. If the previous Django tables are still in this same database, the SQL also copies their records. This migration also creates a legacy Supabase Storage bucket; new website uploads use R2 instead, and the unused bucket can be left in place.
3. In **Authentication → Users**, create the administrator account. Disable public signups in the Auth settings if visitors should not be able to create accounts.
4. In **SQL Editor**, grant that exact account the server-controlled admin role, replacing the email with the one you just created:

   ```sql
   update auth.users
   set raw_app_meta_data =
     coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'admin@example.com';
   ```

   Confirm the command updated exactly one account. The admin page checks `app_metadata.role`; changing user-editable metadata does not grant admin access. Sign out and back in after changing the role so the session refreshes.
5. Add the project URL and publishable/anon key to the local `.env.local` or Cloudflare Pages environment as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
6. To accept callback requests with only a name and phone number, also run [`supabase/migrations/20261102000000_make_inquiry_email_and_message_optional.sql`](./supabase/migrations/20261102000000_make_inquiry_email_and_message_optional.sql) in the Supabase SQL Editor. The public inquiry form will not submit until this schema update is applied to the connected Supabase project.
7. To manage extra property detail photos, run [`supabase/migrations/20261102000001_add_property_photo_gallery.sql`](./supabase/migrations/20261102000001_add_property_photo_gallery.sql) in the Supabase SQL Editor. The admin gallery upload and public detail gallery require this column.

The public website can read site settings and property listings and submit inquiries. Only signed-in accounts with the server-controlled admin role can change listings, branding, or inquiries. Media uploads go through a Cloudflare Pages Function, which checks the Supabase admin session before writing to R2. Never expose an R2 credential or Supabase service-role key in the frontend.

## Search engine visibility

The site includes a crawlable `robots.txt`, an XML sitemap for the public home and completed-sales pages, page titles and descriptions, canonical URLs, social sharing metadata, and LocalBusiness-compatible structured data for Addis Ababa. These help search engines understand and discover the site; they do not guarantee a particular ranking.

After deploying:

1. Verify the production domain in [Google Search Console](https://search.google.com/search-console) and submit `https://zenebe-frew-realstate-sales-agent.pages.dev/sitemap.xml`.
2. If you connect a custom domain, use it consistently as the canonical host and update the production URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml` before deploying.
3. If the business serves customers in person, create or claim its Google Business Profile and keep its business name, service area, phone, and website consistent with the site. Do not add a location or contact detail that is not accurate.
4. Replace sample listings with current, accurate property information and original photos. Keep the business profile and site updated as inventory changes.

Search position depends on Google's indexing and ranking systems, local competition, and accurate real-world business information. No website code, agency, or developer can guarantee first place.

## Admin

Sign in at `/admin` using the Supabase Auth account you created. The admin lets you:

- Add, edit, feature, and delete apartment or shop listings, including status, negotiable starting prices, full property descriptions, optional video uploads, and additional detail gallery photos.
- Edit the agent profile, business contact links, currency, and area units.
- Read customer inquiries and mark them as contacted.

Uploaded media is publicly readable from the configured R2 public URL. Only the server-side Pages Function can write to the R2 bucket, and it accepts upload requests only from users with the Supabase admin role.

## Deploy to Cloudflare Pages

Cloudflare Pages is the supported deployment target for this project. Create a Cloudflare Pages project connected to this repository with:

- **Root directory:** repository root
- **Build command:** `npm run build`
- **Build output directory:** `dist`

In the Pages project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for both Production and Preview environments. These are embedded when Vite builds the site; trigger a new deployment after changing either value. Cloudflare Pages serves the Vite single-page app, including the `/admin` route.

### Configure Cloudflare R2 media uploads

1. In Cloudflare, create an R2 bucket for site media.
2. Enable public reads for the bucket using an R2 custom domain (recommended) or the bucket's public `r2.dev` URL. Set the base URL only, without a trailing slash or object path.
3. In **Workers & Pages → your Pages project → Settings → Functions → R2 bucket bindings**, add a binding named `MEDIA_BUCKET` and select the new bucket.
4. In the Pages project **Settings → Variables and Secrets**, add these runtime variables for Production (and Preview if used):
   - `SUPABASE_URL` — the Supabase project URL.
   - `SUPABASE_PUBLISHABLE_KEY` — the same publishable/anon public key used by the frontend. It is not a service-role key.
   - `R2_PUBLIC_BASE_URL` — the public base URL for the R2 bucket, such as `https://media.example.com`.
5. Redeploy after adding the binding and variables. New admin uploads will be stored in R2, while their public URLs continue to be saved in the existing Supabase rows (`image_url`, `video_url`, `logo_url`, and `agent_photo_url`).

The Pages Function streams supported image/video uploads to R2, up to 80 MB per file. Property videos can be MP4, WebM, MOV, or M4V. It checks the Supabase session's server-controlled `app_metadata.role` before writing. Do not add R2 S3 access keys to `VITE_` variables or browser code.

Existing media URLs already saved in Supabase continue to work from their current storage provider. Moving those existing objects into R2 is a separate copy task; after copying an object, update its corresponding URL in the admin. Keep the old bucket until all its media has been copied and verified.

Supabase and Cloudflare free plans have usage and storage limits and are not an unlimited hosting guarantee. Check each provider's current quotas and pricing before relying on the free tiers for business-critical traffic.

## Listings and inquiries

The website shows listings whose status is **For sale** or **Under contract**. Set a listing to **Sold** to show it on the past-sales page. Callback requests containing the customer's name, phone number, and selected property are saved in Supabase and are visible only to admin users.

Use the currency and area-unit settings to match the listing data. Replace any sample listings with the agent's real inventory and licensed photography before sharing the public site.
