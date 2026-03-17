# Balaio

Task coordination on Celo. Create tasks with escrowed rewards, claim them, submit proof, get paid onchain.

Live at [usebalaio.com](https://www.usebalaio.com)

## What it does

- Task creators post work with token rewards locked in a smart contract
- Workers claim tasks, submit proof links, and receive payment on approval
- Supports multiple workers per task (slot-based)
- Off-chain metadata stored in Supabase; on-chain state lives on Celo Mainnet

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React, TypeScript, Tailwind |
| Blockchain | Celo Mainnet, ethers.js |
| Off-chain storage | Supabase (Postgres) |
| Wallets | MetaMask, Valora, MiniPay |
| Deploy | Vercel |

## Getting started
```bash
git clone https://github.com/your-org/balaio
cd balaio
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

No private keys are needed to run the frontend. The contract address is public and can be found in `lib/web3.ts`.

For Good Dollar Wallet users:

### GoodWallet Integration

**Connect & Verify**

Balaio integrates with GoodDollar's verification system. When you connect your wallet, the platform automatically checks if you're a verified human via GoodID. 

**Verified-Only Tasks**

Task creators can set visibility to "Verified Humans" — these tasks are only visible to wallets verified through GoodDollar's identity protocol. Non-verified users see public and private tasks only.

**How It Works**

1. Connect any Celo wallet (Valora, MetaMask, MiniPay)
2. Platform queries GoodDollar's IdentitySDK to check verification status
3. If verified, you gain access to exclusive "verified_humans" tasks
4. Verification status persists while wallet is connected

No additional signup needed — verification happens on-chain, automatically.

## Docs

- [Architecture](https://github.com/MarceloReFi/v0-balaio/blob/main/architecture.md)
- [Smart Contracts](https://github.com/MarceloReFi/v0-balaio/blob/main/smart-contracts.md)
- [Contributing](https://github.com/MarceloReFi/v0-balaio/blob/main/contributing.md)

## License

MIT
