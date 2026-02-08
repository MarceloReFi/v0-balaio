-- Backfill task_claims from existing tasks.worker_address data
-- This recovers claims made before the task_claims table was introduced.
-- For each task that has a worker_address set, insert a claim row.
-- Uses ON CONFLICT to avoid duplicates if the claim already exists.

INSERT INTO public.task_claims (task_id, worker_address, claimed_at, submitted_at, approved_at, submission_link)
SELECT
  t.id,
  LOWER(t.worker_address),
  COALESCE(t.claimed_at, t.updated_at, t.created_at),
  t.submitted_at,
  t.approved_at,
  t.submission_link
FROM public.tasks t
WHERE t.worker_address IS NOT NULL
  AND TRIM(t.worker_address) != ''
ON CONFLICT (task_id, worker_address) DO NOTHING;
