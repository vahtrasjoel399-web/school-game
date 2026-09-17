create table if not exists public.sport_day_state (
  class_id text primary key check (class_id in ('1a', '1b', '1h', '1el')),
  state jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now()
);

alter table public.sport_day_state enable row level security;

drop policy if exists "sport day read" on public.sport_day_state;
create policy "sport day read"
on public.sport_day_state for select
to anon, authenticated
using (true);

drop policy if exists "sport day insert" on public.sport_day_state;
create policy "sport day insert"
on public.sport_day_state for insert
to anon, authenticated
with check (class_id in ('1a', '1b', '1h', '1el'));

drop policy if exists "sport day update" on public.sport_day_state;
create policy "sport day update"
on public.sport_day_state for update
to anon, authenticated
using (class_id in ('1a', '1b', '1h', '1el'))
with check (class_id in ('1a', '1b', '1h', '1el'));

grant select, insert, update on public.sport_day_state to anon, authenticated;
