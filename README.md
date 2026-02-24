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

## Docs

- [Architecture](https://github.com/MarceloReFi/v0-balaio/blob/main/architecture.md)
- [Smart Contracts](https://github.com/MarceloReFi/v0-balaio/blob/main/smart-contracts.md)
- [Contributing](https://github.com/MarceloReFi/v0-balaio/blob/main/contributing.md)

## License

MIT
