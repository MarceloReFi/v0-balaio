const TOKEN_CONFIG: Record<string, { label: string; color: string; textColor: string }> = {
  'G$':   { label: '$G',   color: '#00B4A0', textColor: '#fff' },
  'cUSD': { label: 'cUSD', color: '#F2F4F1', textColor: '#7A8784' },
  'CELO': { label: 'CELO', color: '#FCFF52', textColor: '#16161A' },
  'USDT': { label: 'USDT', color: '#26A17B', textColor: '#fff' },
}

export function TokenBadge({ symbol }: { symbol: string }) {
  const cfg = TOKEN_CONFIG[symbol] ?? { label: symbol, color: '#F2F4F1', textColor: '#7A8784' }
  return (
    <span
      style={{ background: cfg.color, color: cfg.textColor }}
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
    >
      {cfg.label}
    </span>
  )
}
