# Color Migration Map

Find-and-replace guide for updating every component from the old palette to the new Papel tokens.

## Tailwind class replacements

| Old class | New class | Notes |
|---|---|---|
| `bg-[#111111]` | `bg-balaio-ink` | Primary dark fill |
| `text-[#111111]` | `text-balaio-ink` | Primary text |
| `border-[#111111]` | `border-balaio-rule` | Most borders → lighter rule |
| `bg-[#FF99CC]` | `bg-balaio-surface` | Neon pink → soft surface (CTAs use `bg-balaio-sage`) |
| `bg-[#99FF99]` | `bg-balaio-open-bg` | Neon green → soft open-status bg |
| `text-[#99FF99]` | `text-balaio-open-text` | |
| `bg-[#FFFF66]` | `bg-balaio-pending-bg` | Neon yellow → soft pending bg |
| `text-[#FFFF66]` | `text-balaio-pending-text` | |
| `bg-[#666666]` | `bg-balaio-muted` | Muted fills |
| `text-[#666666]` | `text-balaio-muted` | Secondary text |
| `border-2 border-[#111111]` | `border border-balaio-rule` | Drop the heavy 2px outline |
| `shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]` | `shadow-balaio-card` | Offset → soft shadow |
| `shadow-[4px_4px_0px_0px_rgba(17,17,17,1)]` | `shadow-balaio-card` | |
| `rounded-xl` | `rounded-balaio-lg` | Keep, maps to 12px |
| `font-mono` | `font-body` | Form inputs use DM Sans, not monospace |

## Hex replacements (for inline styles / non-Tailwind)

| Old hex | New hex | Token |
|---|---|---|
| `#111111` | `#16161A` | `--balaio-ink` |
| `#FF99CC` | `#4A7B5E` | `--balaio-sage` (for primary CTAs) |
| `#99FF99` | `#EAF4EE` | `--balaio-status-open` |
| `#FFFF66` | `#FEF9E7` | `--balaio-status-pending` |
| `#666666` | `#7A8784` | `--balaio-muted` |
| `#FFFF66` (highlight) | `#F2F4F1` | `--balaio-surface` |

## Button variants

### Primary (was black with heavy border)
```tsx
// Before
className="bg-[#111111] text-white px-6 py-3 font-bold border-2 border-[#111111] rounded-xl hover:shadow-[2px_2px_0px_0px_rgba(17,17,17,1)]"

// After
className="bg-balaio-ink text-white px-6 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity"
```

### Secondary (was white with border)
```tsx
// Before
className="bg-white text-[#111111] px-6 py-3 font-bold border-2 border-[#111111] rounded-xl"

// After
className="bg-balaio-surface text-balaio-ink px-6 py-3 font-semibold rounded-balaio-lg hover:bg-balaio-rule transition-colors"
```

### CTA / accent (was pink)
```tsx
// Before
className="bg-[#FF99CC] text-[#111111] px-6 py-3 font-bold border-2 border-[#111111] rounded-xl"

// After
className="bg-balaio-sage text-white px-6 py-3 font-semibold rounded-balaio-lg hover:opacity-90 transition-opacity"
```

## Status badge

```tsx
// Before (green active)
className="bg-[#99FF99] text-[#111111] px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg"

// After
className="bg-balaio-open-bg text-balaio-open-text px-3 py-1 text-xs font-semibold rounded-balaio-pill"

// Before (yellow pending)
className="bg-[#FFFF66] text-[#111111] px-2 py-0.5 text-xs font-bold border-2 border-[#111111] rounded-lg"

// After
className="bg-balaio-pending-bg text-balaio-pending-text px-3 py-1 text-xs font-semibold rounded-balaio-pill"
```
