-- Organizations feature: org profiles, membership, projects (off-chain only, zero contract changes)

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_address TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  nature TEXT,
  niches TEXT[] NOT NULL DEFAULT '{}',
  region TEXT,
  contact_email TEXT,
  social_links JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, wallet_address)
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goals TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY organizations_select ON public.organizations FOR SELECT USING (true);
CREATE POLICY organizations_insert ON public.organizations FOR INSERT WITH CHECK (true);
CREATE POLICY organizations_update ON public.organizations FOR UPDATE USING (true);
CREATE POLICY organizations_delete ON public.organizations FOR DELETE USING (true);

CREATE POLICY organization_members_select ON public.organization_members FOR SELECT USING (true);
CREATE POLICY organization_members_insert ON public.organization_members FOR INSERT WITH CHECK (true);
CREATE POLICY organization_members_update ON public.organization_members FOR UPDATE USING (true);
CREATE POLICY organization_members_delete ON public.organization_members FOR DELETE USING (true);

CREATE POLICY projects_select ON public.projects FOR SELECT USING (true);
CREATE POLICY projects_insert ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY projects_update ON public.projects FOR UPDATE USING (true);
CREATE POLICY projects_delete ON public.projects FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_organizations_owner ON public.organizations(owner_address);
CREATE INDEX IF NOT EXISTS idx_org_members_org ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_org_members_wallet ON public.organization_members(wallet_address);
CREATE INDEX IF NOT EXISTS idx_projects_org ON public.projects(organization_id);
