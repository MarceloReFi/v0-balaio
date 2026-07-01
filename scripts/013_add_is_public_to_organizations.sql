ALTER TABLE public.organizations ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_organizations_is_public ON public.organizations(is_public);
