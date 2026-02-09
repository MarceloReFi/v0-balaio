ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public';

ALTER TABLE public.tasks ADD CONSTRAINT IF NOT EXISTS check_visibility
  CHECK (visibility IN ('public', 'private'));
