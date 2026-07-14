CREATE TABLE IF NOT EXISTS public.wallet_connections (
  wallet_address TEXT PRIMARY KEY,
  first_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.wallet_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY wallet_connections_select ON public.wallet_connections FOR SELECT USING (true);
CREATE POLICY wallet_connections_insert ON public.wallet_connections FOR INSERT WITH CHECK (true);
CREATE POLICY wallet_connections_update ON public.wallet_connections FOR UPDATE USING (true);

-- Backfill: carteiras que já transacionaram (criaram ou reivindicaram tarefas)
-- entram com first_connected_at = data mais antiga conhecida daquela carteira.
-- Carteiras que só conectaram sem nunca transacionar não são recuperáveis (não há registro em lugar nenhum).

INSERT INTO public.wallet_connections (wallet_address, first_connected_at, last_connected_at)
SELECT wallet_address, MIN(ts) AS first_connected_at, MIN(ts) AS last_connected_at
FROM (
  SELECT LOWER(creator_address) AS wallet_address, created_at AS ts
  FROM public.tasks
  WHERE creator_address IS NOT NULL AND TRIM(creator_address) != ''

  UNION ALL

  SELECT LOWER(worker_address) AS wallet_address, claimed_at AS ts
  FROM public.task_claims
  WHERE worker_address IS NOT NULL AND TRIM(worker_address) != ''
) addresses
GROUP BY wallet_address
ON CONFLICT (wallet_address) DO UPDATE
SET first_connected_at = LEAST(public.wallet_connections.first_connected_at, EXCLUDED.first_connected_at);
