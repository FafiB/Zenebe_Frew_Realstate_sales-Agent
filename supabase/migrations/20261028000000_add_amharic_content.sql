alter table public.properties
  add column if not exists title_am text not null default '',
  add column if not exists location_am text not null default '',
  add column if not exists description_am text not null default '';

alter table public.site_settings
  add column if not exists agent_title_am text not null default '',
  add column if not exists agent_bio_am text not null default '';
