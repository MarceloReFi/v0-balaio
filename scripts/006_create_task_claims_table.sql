CREATE TABLE IF NOT EXISTS public.task_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES public.tasks(id),
  worker_address TEXT NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  submission_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(task_id, worker_address)
);

ALTER TABLE public.task_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY task_claims_select ON public.task_claims FOR SELECT USING (true);
CREATE POLICY task_claims_insert ON public.task_claims FOR INSERT WITH CHECK (true);
CREATE POLICY task_claims_update ON public.task_claims FOR UPDATE USING (true);

CREATE INDEX IF NOT EXISTS idx_task_claims_task_id ON public.task_claims(task_id);
CREATE INDEX IF NOT EXISTS idx_task_claims_worker ON public.task_claims(worker_address);
