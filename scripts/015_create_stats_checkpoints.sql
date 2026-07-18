create table if not exists stats_sync_state (
  source text primary key,
  last_synced_block bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists stats_daily (
  date date primary key,
  interactions integer not null default 0,
  updated_at timestamptz not null default now()
);

ALTER TABLE public.stats_sync_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY stats_sync_state_select ON public.stats_sync_state FOR SELECT USING (true);
CREATE POLICY stats_sync_state_insert ON public.stats_sync_state FOR INSERT WITH CHECK (true);
CREATE POLICY stats_sync_state_update ON public.stats_sync_state FOR UPDATE USING (true);

ALTER TABLE public.stats_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY stats_daily_select ON public.stats_daily FOR SELECT USING (true);
CREATE POLICY stats_daily_insert ON public.stats_daily FOR INSERT WITH CHECK (true);
CREATE POLICY stats_daily_update ON public.stats_daily FOR UPDATE USING (true);
