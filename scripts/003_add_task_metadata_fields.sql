ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS complexity TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS validation_method TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS deadline TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_complexity_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_complexity_check
  CHECK (complexity IS NULL OR complexity IN ('easy', 'medium', 'hard'));
