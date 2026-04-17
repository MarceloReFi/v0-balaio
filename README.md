# Handoff: Balaio Rebrand — "Papel" Direction

## Overview
This package contains everything needed to implement the Balaio visual rebrand. The direction is called **"Papel"** — a clean, editorial aesthetic that replaces the current neo-brutalist style (heavy black borders, neon accents, offset shadows) with a refined, whitespace-first system using warm ink, sage green, and Instrument Serif as the display typeface.

The rebrand keeps the existing **Balaio logo mark** (geometric triangle/arrow SVG) completely unchanged. Only the wordmark, color system, typography, and component styling change.

---

## About the Design Files
`Balaio Rebrand Directions.html` is a **high-fidelity design prototype** — an interactive mockup showing the intended look and behavior of every screen. It is **not** production code to be copied directly. The task is to **recreate these designs in the existing Next.js / Tailwind codebase** using its established patterns and component structure.

**Fidelity: High.** Colors, typography, spacing, border radii, and interaction states shown in the prototype are final and should be matched precisely.

---

## Design System

### Colors

| Token | Hex | Usage |
|---|---|---|
| `balaio-ink` | `#16161A` | Primary text, filled buttons |
| `balaio-sage` | `#4A7B5E` | Accent, CTAs, active states, verified badge |
| `balaio-bg` | `#FFFFFF` | Page background |
| `balaio-surface` | `#F2F4F1` | Input fills, card backgrounds, secondary buttons |
| `balaio-rule` | `#E4E8E5` | Dividers, light borders |
| `balaio-muted` | `#7A8784` | Secondary text, placeholders, labels |

**Status pills:**
| State | Background | Text |
|---|---|---|
| Open | `#EAF4EE` | `#4A7B5E` |
| Pending | `#FEF9E7` | `#8A6D00` |
| Claimed / Submitted | `#F2F4F1` | `#7A8784` |
| Approved | `#EAF4EE` | `#4A7B5E` |

**Crypto token colors:**
| Token | Hex |
|---|---|
| $G (GoodDollar) | `#00B4A0` |
| CELO | `#FCFF52` |
| USDT | `#26A17B` |

### Typography
- **Display / Headlines:** `Instrument Serif` (Google Font) — use italic `<em>` for emphasis words in heroes. Weight 400.
- **Body / UI:** `DM Sans` (Google Font) — weights 300, 400, 500, 600.
- **No monospace** in the UI (remove `font-mono` from inputs and labels).
- **Section labels:** DM Sans 600, 10–11px, `letter-spacing: 0.08em`, `text-transform: uppercase`, color `balaio-muted`.

### Wordmark
The "balaio" wordmark should be rendered in **Instrument Serif italic**, not DM Sans. Update the nav and any logotype usage.

```tsx
<span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic" }}>
  balaio
</span>
```

### Spacing
Use the existing Tailwind spacing scale. Key patterns:
- Page horizontal padding: `px-[22px]` (22px)
- Section vertical padding: `py-5` (20px)
- Card internal padding: `p-4` (16px)
- Between list items: `gap-3` (12px)

### Border Radius
- Cards, inputs, modals: `rounded-xl` (12px) — keep existing
- Pills / badges: `rounded-full`
- Bottom sheet top corners: 18px

### Shadows
- Cards: `shadow-sm` or `0 2px 12px rgba(22,22,26,0.06)` — replaces all offset box-shadows
- Bottom sheet: `0 -4px 24px rgba(22,22,26,0.10)`
- **Remove all** `shadow-[2px_2px_0px_0px_...]` and `shadow-[4px_4px_0px_0px_...]` offset shadows

### Borders
- Cards: `border border-balaio-rule` (1px, light) — replaces `border-2 border-[#111111]`
- Inputs: no border, use surface background fill instead
- Dividers: `border-b border-balaio-rule`

---

## Screens

### 1. Landing Page (`components/pages/landing-page.tsx`)
**Purpose:** Pre-connect entry point for new users.

**Key changes:**
- Remove "On Celo Mainnet" badge
- Hero: Instrument Serif display headline with italic emphasis word
- Subheadline: DM Sans 13px, muted color, line-height 1.7
- Two CTA buttons stacked vertically on mobile: "Connect with MetaMask" (ink fill) + "WalletConnect" (surface fill) — full width, left-aligned text with arrow `→` on right
- "How it works" section: numbered steps (sage filled circle numbers), no cards, separated by rule lines
- Footer note: muted 11px text, no heavy elements
- Remove all neon color usage

### 2. Home Page (`components/pages/home-page.tsx`)
**Purpose:** Post-connect dashboard.

**Key changes:**
- Greeting header: uppercase label + Instrument Serif headline with italic "earn"
- Stats strip: 3-column row separated by rule lines, sage color for earned amount
- "Latest Tasks" list: uses `TaskRow` pattern (title + metadata inline, status pill right-aligned)
- "Create a task" banner: surface background, no border, sage CTA button
- Replace all emoji icons with text or omit

### 3. Tasks Page (`components/pages/tasks-page.tsx`)
**Purpose:** Browse and search all tasks.

**Key changes:**
- Search bar: surface background fill, no border, rounded-xl
- Filter tabs: pill buttons. Active = ink fill white text. Inactive = surface fill muted text. No borders.
- Task list: `TaskRow` component — flat list separated by rule lines (no cards per row)
- "12 tasks" count label in uppercase muted style
- "+ Create" button: sage fill, top right of search row

### 4. Profile Page (`components/pages/profile-page.tsx`)
**Purpose:** Wallet identity, stats, activity, settings.

**Key changes:**
- Identity card: surface background (not pink), flex row with basket emoji → **replace emoji with Balaio mark SVG** at small size
- Stats grid: 3 columns, surface fill tiles, sage for earned value
- Verified badge: small sage dot + "Verified" text (shown when GoodDollar verified)
- Recent activity: flat list with `TaskRow` pattern
- Settings: flat list rows with `›` chevron right

### 5. Create Task Modal (`components/modals/create-task-modal.tsx`)
**Purpose:** Bottom sheet for creating a new task.

**Key changes:**
- Render as a **bottom sheet** (not a centered modal): `fixed bottom-0 left-0 right-0`, rounded top corners 18px, `max-h-[90vh] overflow-y-auto`
- Handle bar at top (36×4px, balaio-rule color, centered)
- Header: uppercase label + Instrument Serif headline
- All inputs: surface background, no border, rounded-xl
- Visibility selector: 3 equal pill buttons (Public / Verified / Private). Active = ink fill. No bordered segmented control.
- Category + Complexity: side-by-side surface dropdowns
- Reward + Deadline: side-by-side inputs
- Cost summary: surface background tile, right-aligns token balance
- Submit button: full-width ink fill

### 6. Task Detail Modal (`components/modals/task-detail-modal.tsx`)
**Purpose:** View task, claim, submit proof, see status.

**Key changes:**
- Also a **bottom sheet** pattern (same as Create Task)
- Header: sage uppercase status label (e.g. "Open · 2 of 3 slots") + Instrument Serif title with italic emphasis
- Description: muted 13px, line-height 1.65
- Details grid: surface background tile, flat key/value rows separated by rule lines
- Tags: surface fill pill badges, no borders
- Three interactive states (same component, state-driven):
  1. **Claim:** Full-width ink button "Claim this task →" + helper text
  2. **Submit:** Sage confirmation banner + proof URL input + sage submit button
  3. **Pending:** Yellow-tint info tile with hourglass message
- Creator actions panel (if `isCreator`): surface background, approve input + sage approve button

---

## Crypto Token Display

Replace all token symbol text rendering with a `TokenBadge` component:

```tsx
// New component to create: components/ui/token-badge.tsx
const TOKEN_CONFIG = {
  'G$':   { label: '$G',   color: '#00B4A0', textColor: '#fff' },
  'cUSD': { label: 'cUSD', color: '#F2F4F1', textColor: '#7A8784' },  // keep for existing tasks
  'CELO': { label: 'CELO', color: '#FCFF52', textColor: '#16161A' },
  'USDT': { label: 'USDT', color: '#26A17B', textColor: '#fff' },
}

export function TokenBadge({ symbol }: { symbol: string }) {
  const cfg = TOKEN_CONFIG[symbol] ?? { label: symbol, color: '#F2F4F1', textColor: '#7A8784' }
  return (
    <span style={{ background: cfg.color, color: cfg.textColor }}
      className="px-2 py-0.5 rounded-full text-xs font-semibold">
      {cfg.label}
    </span>
  )
}
```

---

## Bottom Sheet Pattern

Replace the current centered modal pattern with a bottom sheet for both modals:

```tsx
// Overlay
<div className="fixed inset-0 bg-balaio-ink/40 z-50" onClick={onClose} />

// Sheet
<div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[18px]
                max-h-[90vh] overflow-y-auto shadow-[0_-4px_24px_rgba(22,22,26,0.10)]">
  {/* Handle */}
  <div className="flex justify-center pt-3 pb-1">
    <div className="w-9 h-1 rounded-full bg-balaio-rule" />
  </div>
  {/* Content */}
  {children}
</div>
```

---

## Bottom Navigation
Add a persistent bottom nav to `components/the-office-app.tsx`:

```tsx
// Three tabs: Home (⌂), Tasks (✓), Profile (○)
// Active tab: sage color text
// Inactive tab: muted color, 0.35 opacity icon
// Border top: 1px balaio-rule
// Background: white
// Height: ~56px
```

---

## What NOT to Change
- Balaio logo mark SVG (the geometric triangle/arrow in `public/placeholder-logo.svg`)
- Smart contract logic, web3.ts, supabase clients
- i18n system (`lib/translations.ts`) — copy stays the same
- GoodDollar verification logic

---

## Files in This Package

| File | Purpose |
|---|---|
| `tokens.css` | CSS custom properties — drop into `app/globals.css` |
| `tailwind.config.patch.js` | Tailwind color/font/radius/shadow extensions |
| `color-migration-map.md` | Find-and-replace guide, old → new class names |
| `Balaio Rebrand Directions.html` | Full hi-fi prototype — reference for all screens |
| `CLAUDE_CODE_PROMPT.md` | Ready-to-use prompt for Claude Code |

---

## Suggested Implementation Order

1. `tailwind.config.js` — add tokens
2. `app/globals.css` — add CSS vars + font imports
3. `app/layout.tsx` — add Google Font imports (`Instrument Serif`, `DM Sans`)
4. Create `components/ui/token-badge.tsx`
5. Create `components/ui/bottom-sheet.tsx`
6. `components/pages/landing-page.tsx`
7. `components/pages/tasks-page.tsx`
8. `components/the-office-app.tsx` (nav + bottom nav)
9. `components/pages/home-page.tsx`
10. `components/pages/profile-page.tsx`
11. `components/modals/create-task-modal.tsx`
12. `components/modals/task-detail-modal.tsx`
