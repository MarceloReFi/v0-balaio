-- Add task metadata fields to tasks table
-- This migration adds category, complexity, validation method, deadline, and tags

-- Task category (e.g., 'design', 'development', 'writing', 'research', etc.)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category TEXT;

-- Task complexity ('easy', 'medium', 'hard')
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS complexity TEXT;

-- Validation method for task completion
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS validation_method TEXT;

-- Task deadline
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;

-- Task tags as array
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Add check constraint for complexity values
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_complexity_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_complexity_check
  CHECK (complexity IS NULL OR complexity IN ('easy', 'medium', 'hard'));

-- Add index for category queries
CREATE INDEX IF NOT EXISTS idx_tasks_category ON public.tasks(category);

-- Add index for deadline queries
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON public.tasks(deadline);
