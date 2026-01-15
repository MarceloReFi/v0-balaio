-- Migration: Add visibility column to tasks table
-- This allows tasks to be marked as public (visible to everyone) or private (only accessible via direct link)

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

-- Add check constraint to ensure valid values
ALTER TABLE public.tasks ADD CONSTRAINT IF NOT EXISTS check_visibility
  CHECK (visibility IN ('public', 'private'));

-- Create index for filtering by visibility
CREATE INDEX IF NOT EXISTS idx_tasks_visibility ON public.tasks(visibility);

-- Comment on column
COMMENT ON COLUMN public.tasks.visibility IS 'Task visibility: public (listed) or private (direct link only)';
