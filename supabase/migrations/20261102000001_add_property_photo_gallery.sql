alter table public.properties
  add column if not exists gallery_urls text[] not null default array[]::text[];
