CREATE TABLE IF NOT EXISTS public.xrpl_escrows (
  task_id TEXT PRIMARY KEY,
  condition TEXT NOT NULL,
  fulfillment TEXT NOT NULL,
  sequence INT,
  cancel_after INT NOT NULL,
  owner_account TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.xrpl_escrows ENABLE ROW LEVEL SECURITY;
CREATE POLICY xrpl_escrows_select ON public.xrpl_escrows FOR SELECT USING (true);
CREATE POLICY xrpl_escrows_insert ON public.xrpl_escrows FOR INSERT WITH CHECK (true);
CREATE POLICY xrpl_escrows_update ON public.xrpl_escrows FOR UPDATE USING (true);
