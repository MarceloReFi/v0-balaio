ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS chain_id INTEGER NOT NULL DEFAULT 42220;
CREATE INDEX IF NOT EXISTS idx_tasks_chain_id ON public.tasks(chain_id);
