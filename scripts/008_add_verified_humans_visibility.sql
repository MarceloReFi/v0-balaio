ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS check_visibility;
ALTER TABLE public.tasks ADD CONSTRAINT check_visibility
  CHECK (visibility IN ('public', 'private', 'verified_humans'));
