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
