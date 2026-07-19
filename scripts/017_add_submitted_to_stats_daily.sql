alter table public.stats_daily
  add column if not exists submitted integer not null default 0;
