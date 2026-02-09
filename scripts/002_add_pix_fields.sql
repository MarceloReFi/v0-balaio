ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'crypto';
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS fiat_amount DECIMAL(10,2);
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS worker_pix_key TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS worker_pix_key_type TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS pix_payment_confirmed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS pix_payment_confirmed_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_payment_method_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_payment_method_check
  CHECK (payment_method IN ('crypto', 'pix'));

ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_pix_key_type_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_pix_key_type_check
  CHECK (worker_pix_key_type IS NULL OR worker_pix_key_type IN ('cpf', 'email', 'phone', 'random'));
