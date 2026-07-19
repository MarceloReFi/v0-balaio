alter table public.stats_daily
  add column if not exists created integer not null default 0,
  add column if not exists claimed integer not null default 0,
  add column if not exists approved integer not null default 0,
  add column if not exists reward_claimed integer not null default 0;
