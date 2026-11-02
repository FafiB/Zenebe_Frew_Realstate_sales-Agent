alter table public.inquiries
  alter column email drop not null,
  alter column message drop not null;

drop policy if exists "Public can submit inquiries" on public.inquiries;
create policy "Public can submit inquiries"
  on public.inquiries for insert to anon, authenticated
  with check (
    char_length(btrim(name)) between 1 and 120
    and char_length(btrim(phone)) between 1 and 40
    and (email is null or char_length(email) between 3 and 254)
    and (message is null or char_length(btrim(message)) between 1 and 2000)
  );
