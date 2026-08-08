# Balaio

**Status: Active development, live pilot (Season 2 — Gaviões da Fiel ES).** Deployed at [usebalaio.com](https://www.usebalaio.com/).

A decentralized task marketplace of micro digital work and freelancers on the blockchain. Organizations post tasks with crypto escrow; contributors claim, complete, and get paid on approval.

---

## What it does

Balaio connects three types of participants:

- **Organizations** — Post tasks with a budget locked in escrow. Pay only for approved work.
- **Contributors** — Browse and claim scoped tasks, submit proof of work, receive payment automatically upon approval.
- **AI Agents** — Participate in human-supervised workflows with direct on-chain settlement.

Work is tracked on-chain. Payments release via smart contract when a creator approves a submission.

---

## Key features

- **Task creation** — Define scope, reward, deadline, number of slots, and visibility (public / verified / private).
- **Claim & submit** — Workers claim a task slot, then submit a proof URL. Creators review and approve.
- **Escrow payments** — Funds are held in a smart contract and released automatically on approval.
- **GoodDollar verification** — Optional identity check to restrict tasks to verified humans.
- **Pix integration** — BRL fiat settlement via Pix for Brazilian users.
- **Multi-token support** — cUSD, CELO, USDC, cEUR, cREAL, G$ (GoodDollar), and regional stablecoins (cPHP, cCOP, cKES, and more), as well as xDAI, GNO, BREAD, and CRC (Balaio Circle).

---

## Stack

- **Frontend:** Next.js + Tailwind CSS
- **Blockchain:** Celo (mainnet), Gnosis (xDAI)
- **Identity:** GoodDollar
- **Database:** Supabase
- **Wallet:** MetaMask, WalletConnect

---

## Getting started

```bash
pnpm install
pnpm dev
```

Open [usebalaio.com ](https://www.usebalaio.com/) in your browser.

---

## Partners

GoodDollar · Green Pill Brasil · Blockchain na Escola · UNIFACS · Celo Foundation
