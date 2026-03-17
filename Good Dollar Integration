# GoodDollar Integration Documentation

Complete technical and user documentation for GoodWallet, GoodID, and G$ integration in Balaio.

---

## Overview

Balaio integrates three core components from the GoodDollar ecosystem:

1. **GoodID** — Identity verification system that proves human uniqueness
2. **GoodWallet** — Mobile-first Web3 wallet for the GoodDollar ecosystem
3. **G$** — GoodDollar token, available as a reward currency

This integration enables verified-human task gating and seamless wallet connectivity for GoodDollar users.

---

## GoodID Verification

### What is GoodID?

GoodID is GoodDollar's identity protocol that verifies unique human identities on-chain. Verified users gain access to exclusive tasks marked "verified_humans" in Balaio.

### Technical Implementation

**Hook: `lib/use-goodid.ts`**

```typescript
import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { IdentitySDK } from '@goodsdks/citizen-sdk'

export function useGoodID(address: string | undefined) {
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!address || !publicClient) {
      setIsVerified(false)
      setLoading(false)
      return
    }

    const checkVerification = async () => {
      try {
        const identitySDK = new IdentitySDK(publicClient, null, 'production')
        const { isWhitelisted } = await identitySDK.getWhitelistedRoot(address)
        setIsVerified(isWhitelisted)
      } catch (error) {
        console.error('GoodID verification check failed:', error)
        setIsVerified(false)
      } finally {
        setLoading(false)
      }
    }

    checkVerification()
  }, [address, publicClient])

  return { isVerified, loading }
}
```

**How It Works:**

1. Hook receives user's wallet address from Wagmi
2. Connects to GoodDollar's IdentitySDK in production mode
3. Queries `getWhitelistedRoot(address)` to check verification status
4. Returns `{ isVerified, loading }` state to consuming components

**Dependencies:**

- `@goodsdks/citizen-sdk` — GoodDollar's identity SDK
- `wagmi` — For Ethereum provider access via `usePublicClient()`

### Verification Flow

```
User connects wallet
    ↓
useGoodID hook triggers
    ↓
IdentitySDK.getWhitelistedRoot(address)
    ↓
isVerified = true/false
    ↓
UI updates based on verification status
```

### Usage in Components

**Main App (`components/the-office-app.tsx`):**

```typescript
const { isVerified } = useGoodID(account)

// Filter tasks based on verification
const loadAllTasksFromSupabase = useCallback(async () => {
  const { data } = await supabase.from("tasks").select("*")
  
  for (const row of data) {
    // Hide verified_humans tasks from non-verified users
    if (row.visibility === 'verified_humans' && !isVerified) {
      continue
    }
    loadedTasks.push(mapDatabaseRowToTask(row, mySlot))
  }
}, [isVerified])
```

**No Signup Required:**

Verification happens automatically when a wallet connects. No forms, no KYC uploads, no manual approval process. GoodID verification is on-chain and immutable.

---

## Task Visibility System

### Visibility Types

Balaio supports three task visibility modes:

| Mode | Icon | Description | Accessibility |
|------|------|-------------|---------------|
| `public` | 🌐 | Anyone can see and claim | All users |
| `verified_humans` | ✓ | GoodID-verified users only | Verified wallets only |
| `private` | 🔒 | Direct link access only | Anyone with task ID |

### Database Schema

**Migration: `scripts/008_add_verified_humans_visibility.sql`**

```sql
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS check_visibility;
ALTER TABLE public.tasks ADD CONSTRAINT check_visibility
  CHECK (visibility IN ('public', 'private', 'verified_humans'));
```

**Type Definition: `lib/types.ts`**

```typescript
export interface Task {
  // ... other fields
  visibility?: "public" | "private" | "verified_humans"
}
```

### Task Creation Flow

**Create Task Modal (`components/modals/create-task-modal.tsx`):**

```typescript
<div className="grid grid-cols-3 gap-0 border-2 border-[#111111] rounded-xl">
  <button
    onClick={() => setVisibility("public")}
    className={visibility === "public" ? "bg-[#99FF99]" : "bg-white"}
  >
    🌐 {language === "en" ? "Public" : "Publica"}
  </button>
  
  <button
    onClick={() => setVisibility("verified_humans")}
    className={visibility === "verified_humans" ? "bg-[#FFFF66]" : "bg-white"}
  >
    ✓ {language === "en" ? "Verified" : "Verificado"}
  </button>
  
  <button
    onClick={() => setVisibility("private")}
    className={visibility === "private" ? "bg-[#FF99CC]" : "bg-white"}
  >
    🔒 {language === "en" ? "Private" : "Privada"}
  </button>
</div>

<p className="text-xs text-[#666666] mt-1">
  {visibility === "verified_humans"
    ? "Only GoodDollar verified humans can see and claim"
    : "..."}
</p>
```

**Color Coding:**

- Green (#99FF99) = Public
- Yellow (#FFFF66) = Verified Humans
- Pink (#FF99CC) = Private

### Task Filtering Logic

When loading tasks from Supabase, the app filters based on verification status:

```typescript
for (const row of data) {
  // Skip verified_humans tasks if user is not verified
  if (row.visibility === 'verified_humans' && !isVerified) {
    continue
  }
  
  loadedTasks.push(mapDatabaseRowToTask(row, mySlot))
}
```

**Result:**

- Non-verified users see only `public` and `private` tasks
- Verified users see all tasks including `verified_humans`
- Task creators can gate access to verified communities

---

## GoodWallet Support

### Mobile Wallet Integration

Balaio supports GoodWallet alongside Valora, MetaMask, and MiniPay through Reown AppKit (formerly WalletConnect).

**Configuration (`lib/config.ts`):**

```typescript
export const WALLET_CONNECT_PROJECT_ID = "your_project_id"

// Mobile wallet deep links
export const VALORA_DEEP_LINK = "celo://wallet/wc"
export const MINIPAY_DEEP_LINK = "minipay://wallet/wc"
```

**Detection Logic:**

```typescript
function hasEthereumProvider() {
  if (typeof window === "undefined") return false
  return !!window.ethereum
}

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const isGoodWalletLike = () => {
  const { ethereum } = window
  return ethereum?.isValora || ethereum?.isMiniPay || ethereum?.isCelo
}
```

### Connection Flow

```
User clicks "Connect Wallet"
    ↓
Reown AppKit modal opens
    ↓
User selects GoodWallet (or compatible wallet)
    ↓
Deep link triggers wallet app
    ↓
User approves connection
    ↓
Address returned to Balaio
    ↓
useGoodID hook checks verification
    ↓
UI updates based on isVerified status
```

### Mobile-First Design

GoodWallet users typically access Balaio via mobile. The platform is optimized for:

- Touch-friendly UI (large tap targets)
- Single-handed operation
- Minimal data usage
- Works on 2G/3G networks
- Low-power mode compatibility

---

## G$ Token Integration

### Token Configuration

**Token Registry (`lib/web3.ts`):**

```typescript
export const SUPPORTED_TOKENS: Record<TokenSymbol, TokenConfig> = {
  // ... other tokens
  "G$": {
    symbol: "G$",
    address: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
    decimals: 18,
    name: "GoodDollar",
  },
}
```

**Contract Details:**

- **Network:** Celo Mainnet
- **Address:** `0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A`
- **Decimals:** 18
- **Standard:** ERC-20

### Task Creation with G$

Task creators can select G$ as the reward token in the Create Task modal:

```typescript
<select value={selectedToken}>
  <option value="cUSD">cUSD</option>
  <option value="USDC">USDC</option>
  <option value="G$">G$ (GoodDollar)</option>
  {/* ... other tokens */}
</select>
```

**Token Balance Display:**

```typescript
<span className="text-[#666666] text-sm">
  (Balance: {tokenBalances["G$"]} G$)
</span>
```

### Payment Flow with G$

Same as any ERC-20 token on Balaio:

1. **Task Creation:**
   - Creator selects G$ as reward token
   - Approves G$ spending to contract
   - Contract escrows `reward × slots` in G$

2. **Task Completion:**
   - Worker submits proof
   - Creator approves work
   - Worker calls `claimReward()`
   - G$ released from escrow to worker's wallet

### G$ Economics in Balaio

**Why G$ works well as a task reward:**

- Low transaction costs on Celo
- Accessible to underbanked communities
- Native to the GoodDollar ecosystem
- Aligned with public goods funding model

**Typical G$ task rewards:**

- Micro-tasks: 10-100 G$
- Community contributions: 100-1000 G$
- Educational tasks: 50-500 G$

---

## User Experience

### For Non-Verified Users

1. Connect any Celo wallet
2. See all `public` and `private` tasks
3. Cannot see `verified_humans` tasks
4. Can use G$ like any other token

### For Verified Users

1. Connect GoodWallet (or verified wallet)
2. Automatic verification check on connection
3. See all tasks including `verified_humans` exclusives
4. Yellow "✓ Verified" badge appears on exclusive tasks
5. Full access to G$ rewards and verified-only opportunities

### For Task Creators

1. Select visibility when creating task
2. Choose `verified_humans` to gate access
3. Select G$ as reward token if desired
4. Task only appears to verified wallets
5. Ensures human-verified workforce

---

## Technical Architecture

### Component Hierarchy

```
TheOfficeApp
├── useGoodID(account) → { isVerified, loading }
├── TasksPage
│   └── loadAllTasksFromSupabase()
│       └── Filters by isVerified status
├── CreateTaskModal
│   └── Visibility selector (public/verified/private)
└── TaskDetailModal
    └── Shows task to verified users only (if gated)
```

### Data Flow

```
Wallet Connection
    ↓
account address extracted
    ↓
useGoodID hook queries IdentitySDK
    ↓
isVerified state updated
    ↓
Task list re-filtered
    ↓
Verified-only tasks shown/hidden
```

### State Management

**Global State:**

```typescript
const [account, setAccount] = useState<string>("")
const { isVerified } = useGoodID(account)
const [tasks, setTasks] = useState<Task[]>([])
```

**Derived State:**

```typescript
// Filtered task list based on verification
const visibleTasks = tasks.filter(task => {
  if (task.visibility === 'verified_humans' && !isVerified) {
    return false
  }
  return true
})
```

---

## API Reference

### useGoodID Hook

**Import:**

```typescript
import { useGoodID } from '@/lib/use-goodid'
```

**Usage:**

```typescript
const { isVerified, loading } = useGoodID(address)
```

**Parameters:**

- `address: string | undefined` — Wallet address to verify

**Returns:**

- `isVerified: boolean` — True if address is GoodID verified
- `loading: boolean` — True while verification check is in progress

### IdentitySDK Methods

**Initialization:**

```typescript
import { IdentitySDK } from '@goodsdks/citizen-sdk'

const identitySDK = new IdentitySDK(publicClient, null, 'production')
```

**Check Verification:**

```typescript
const { isWhitelisted } = await identitySDK.getWhitelistedRoot(address)
```

---

## Configuration

### Required Environment Variables

None. GoodID integration uses public blockchain data and requires no API keys.

### Required Dependencies

**package.json:**

```json
{
  "dependencies": {
    "@goodsdks/citizen-sdk": "latest",
    "wagmi": "^3.x",
    "viem": "^2.x"
  }
}
```

### Network Requirements

- **Chain ID:** 42220 (Celo Mainnet)
- **RPC:** `https://forno.celo.org` or Celo RPC endpoint
- **GoodID Contract:** Deployed on Celo Mainnet (queried via SDK)

---

## Security Considerations

### Verification Trust Model

- Verification state is queried on-chain, not stored locally
- Cannot be spoofed or faked client-side
- Re-checked on every wallet connection
- No server-side authentication required

### Privacy

- No personal data stored
- Only wallet address queried
- Verification is binary (yes/no), no identity details exposed
- Task visibility filtering happens client-side

### Attack Vectors

**Sybil Resistance:**

GoodID prevents one person from creating multiple verified identities through its face verification system. This makes `verified_humans` tasks resistant to bot farms and multi-accounting.

**Front-Running:**

Task visibility filtering happens in the browser, so technically anyone with the task ID could interact with the contract directly. However:

- Private tasks require knowing the task ID
- Verified tasks can be claimed by anyone on-chain
- The verification check is advisory (enforced in UI, not contract)

**Future Enhancement:**

For stronger enforcement, the smart contract could verify GoodID on-chain during `claimTask()`. Currently, enforcement is UI-level only.

---

## Troubleshooting

### "Verification check failed"

**Cause:** RPC connection issue or IdentitySDK error

**Solution:**

```typescript
try {
  const identitySDK = new IdentitySDK(publicClient, null, 'production')
  const { isWhitelisted } = await identitySDK.getWhitelistedRoot(address)
  setIsVerified(isWhitelisted)
} catch (error) {
  console.error('GoodID verification check failed:', error)
  setIsVerified(false) // Fail open, not closed
}
```

### "Verified tasks not showing"

**Check:**

1. Is wallet connected?
2. Is `isVerified` true in dev tools?
3. Are there any `verified_humans` tasks in database?
4. Check console for filtering logic errors

### "G$ balance showing as 0.00"

**Cause:** Token contract initialization or RPC issue

**Check:**

```typescript
const tokenContract = tokenContracts["G$"]
const balance = await tokenContract.balanceOf(account)
const formatted = ethers.formatUnits(balance, 18) // G$ uses 18 decimals
```

---

## Future Enhancements

### On-Chain Verification Enforcement

```solidity
// Proposed enhancement to BalaioTasks.sol
function claimTask(string _taskId) external {
    require(task.active, "Task not active");
    require(availableSlots > 0, "No slots available");
    
    // NEW: Check GoodID verification on-chain
    if (task.verifiedOnly) {
        require(
            goodIDRegistry.isVerified(msg.sender),
            "Must be GoodID verified"
        );
    }
    
    // ... rest of claim logic
}
```

### GoodCollective Integration

Connect tasks to GoodCollective funding pools, enabling:

- Community-funded task pools
- Retroactive rewards for completed work
- Collective ownership of task outcomes

### Verification Badge Display

Add visual indicators to verified user profiles:

```typescript
{isVerified && (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#FFFF66] border border-[#111111] rounded text-xs font-bold">
    ✓ Verified Human
  </span>
)}
```

---

## Resources

### Documentation

- [GoodDollar Docs](https://docs.gooddollar.org/)
- [GoodID SDK Reference](https://github.com/GoodDollar/GoodSDK)
- [Balaio Architecture](./architecture.md)

### Contract Addresses

| Asset | Address | Network |
|-------|---------|---------|
| G$ Token | `0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A` | Celo Mainnet |
| Balaio Tasks | `0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e` | Celo Mainnet |

### Community

- [GoodDollar Discord](https://discord.gg/gooddollar)
- [Balaio GitHub](https://github.com/MarceloReFi/v0-balaio)
- [Celo Forum](https://forum.celo.org/)

---

## Contributing

To improve GoodDollar integration:

1. Test verification flow with multiple wallets
2. Report verification edge cases
3. Suggest UI improvements for verified badge visibility
4. Propose on-chain enforcement mechanisms

See [CONTRIBUTING.md](./contributing.md) for guidelines.

---

## License

MIT

---

**Last Updated:** March 2026  
**Integration Version:** v1.0  
**SDK Version:** `@goodsdks/citizen-sdk@latest`
