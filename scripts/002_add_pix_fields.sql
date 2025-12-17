-- Add Pix payment fields to tasks table
-- This migration adds support for Pix (Brazilian instant payment) as an alternative payment method

-- Payment method: 'crypto' (default) or 'pix'
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'crypto';

-- Fiat amount in BRL for Pix payments
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS fiat_amount DECIMAL(10,2);

-- Worker's Pix key (CPF, email, phone, or random key)
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS worker_pix_key TEXT;

-- Pix key type: 'cpf', 'email', 'phone', 'random'
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS worker_pix_key_type TEXT;

-- Whether the Pix payment has been confirmed by the worker
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS pix_payment_confirmed BOOLEAN DEFAULT FALSE;

-- Timestamp when Pix payment was confirmed
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS pix_payment_confirmed_at TIMESTAMP WITH TIME ZONE;

-- Add index for payment method queries
CREATE INDEX IF NOT EXISTS idx_tasks_payment_method ON public.tasks(payment_method);

-- Add check constraint for payment_method values
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_payment_method_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_payment_method_check
  CHECK (payment_method IN ('crypto', 'pix'));

-- Add check constraint for pix_key_type values
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_pix_key_type_check;
ALTER TABLE public.tasks ADD CONSTRAINT tasks_pix_key_type_check
  CHECK (worker_pix_key_type IS NULL OR worker_pix_key_type IN ('cpf', 'email', 'phone', 'random'));
