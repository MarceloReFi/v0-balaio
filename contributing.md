# Contributing

## Setup
```bash
git clone https://github.com/your-org/balaio
cd balaio
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables needed
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

You can create a free Supabase project and use those credentials locally.

## Project structure
```
app/              → Next.js app router
components/
  pages/          → one file per page view
  modals/         → overlays (create task, task detail)
  ui/             → reusable primitives (toast, button...)
lib/
  web3.ts         → contract ABI and token config
  config.ts       → network config
  supabase/       → Supabase client
  translations.ts → all UI strings (EN + PT-BR)
  types.ts        → shared types
```

## Guidelines

- Follow the existing file structure — features grouped by page, not by layer
- No code duplication — extract shared logic to `lib/` or a shared component
- Keep components focused — UI in components, data fetching in `the-office-app.tsx` or lib functions
- Add translations for any new string in both `en` and `pt-BR` in `lib/translations.ts`
- Test wallet flows with MetaMask on Celo Mainnet before submitting a PR

## Pull requests

- One feature or fix per PR
- Describe what changed and why in the PR description
- If you touched the contract, update `docs/smart-contracts.md`

## Issues

Use GitHub Issues for bugs and feature requests. Include steps to reproduce for bugs.
