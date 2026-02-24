# Architecture

## Overview

Balaio is a Next.js app that reads and writes state to both Celo Mainnet (via ethers.js) and Supabase (for off-chain metadata).
```
User Browser
    │
    ├── Next.js Frontend (Vercel)
    │       ├── lib/web3.ts         → contract interaction
    │       ├── lib/supabase/       → off-chain metadata
    │       ├── lib/translations.ts → i18n (en, pt-BR)
    │       └── components/
    │           ├── pages/          → full-page views
    │           └── modals/         → task create/detail overlays
    │
    ├── Celo Mainnet (onchain state)
    │       └── BalaioTasks contract → tasks, slots, rewards, approvals
    │
    └── Supabase (off-chain metadata)
            └── tasks table → title, description, tags, deadline, category
```

## Data flow

**Creating a task:**
1. User fills form → modal calls `createTask()` on contract (escrows tokens)
2. On tx success → metadata saved to Supabase with the same `taskId`

**Claiming a task:**
1. User calls `claimTask(taskId)` → slot reserved on-chain
2. Claim record inserted in Supabase (`task_claims` table)

**Approving and paying:**
1. Creator calls `approveTask(taskId, claimantAddress)` → on-chain approval
2. Worker calls `claimReward(taskId)` → tokens released from escrow to wallet

## Key files

| File | Responsibility |
|---|---|
| `lib/web3.ts` | Contract ABI, address, token addresses |
| `lib/config.ts` | RPC URL, chain ID, wallet deep links |
| `lib/types.ts` | Shared TypeScript interfaces |
| `lib/translations.ts` | All UI strings in EN and PT-BR |
| `components/the-office-app.tsx` | Root app state, wallet connection, page routing |
| `components/pages/` | One file per page (home, tasks, profile, landing) |
| `components/modals/` | Create task modal, task detail modal |

## Multi-language

All strings live in `lib/translations.ts` as a single object with `en` and `pt-BR` keys. The `useTranslations(language)` hook returns the correct set. No external i18n library is used.

## Wallet support

- **Desktop:** MetaMask
- **Mobile:** Valora (deep link fallback), MiniPay
- Chain switching to Celo Mainnet is handled automatically on connect
