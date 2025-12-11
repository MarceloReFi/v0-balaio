-- Create tasks table for Balaio
-- This table stores task metadata synced from the blockchain

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

-- Enable Row Level Security
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tasks (public task marketplace)
CREATE POLICY "Allow public read access to tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (true);

-- Allow anyone to insert tasks (task creators don't need auth)
CREATE POLICY "Allow public insert access to tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to update tasks (for claiming, submitting, etc.)
CREATE POLICY "Allow public update access to tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_creator ON public.tasks(creator_address);
CREATE INDEX IF NOT EXISTS idx_tasks_worker ON public.tasks(worker_address);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);
