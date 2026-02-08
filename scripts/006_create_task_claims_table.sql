-- Create task_claims table to track individual worker claims per task
-- This allows multiple workers to claim different slots on the same task

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

-- Enable Row Level Security
ALTER TABLE public.task_claims ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read claims (public task marketplace)
CREATE POLICY "Allow public read access to task_claims"
  ON public.task_claims
  FOR SELECT
  USING (true);

-- Allow anyone to insert claims
CREATE POLICY "Allow public insert access to task_claims"
  ON public.task_claims
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update claims
CREATE POLICY "Allow public update access to task_claims"
  ON public.task_claims
  FOR UPDATE
  USING (true);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_task_claims_task_id ON public.task_claims(task_id);
CREATE INDEX IF NOT EXISTS idx_task_claims_worker ON public.task_claims(worker_address);
CREATE INDEX IF NOT EXISTS idx_task_claims_task_worker ON public.task_claims(task_id, worker_address);
