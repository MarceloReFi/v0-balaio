CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reward TEXT NOT NULL,
  token TEXT NOT NULL DEFAULT 'cUSD',
  token_address TEXT NOT NULL,
  creator_address TEXT NOT NULL,
  worker_address TEXT,
  status INTEGER NOT NULL DEFAULT 0,
  slots INTEGER NOT NULL DEFAULT 1,
  claimed_slots INTEGER NOT NULL DEFAULT 0,
  submission_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY tasks_select ON public.tasks FOR SELECT USING (true);
CREATE POLICY tasks_insert ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY tasks_update ON public.tasks FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_tasks_creator ON public.tasks(creator_address);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
