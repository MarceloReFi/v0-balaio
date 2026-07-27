ALTER TABLE public.wallet_connections
  ADD COLUMN IF NOT EXISTS is_goodid_verified BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS goodid_verified_at TIMESTAMP WITH TIME ZONE;

CREATE INDEX IF NOT EXISTS idx_wallet_connections_goodid_verified
  ON public.wallet_connections (is_goodid_verified)
  WHERE is_goodid_verified = true;
