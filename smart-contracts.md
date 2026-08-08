# Smart Contracts

## Deployed contracts

| Network | Version | Address | Status |
|---|---|---|---|
| Celo Mainnet | V2 | `0xe60aa33E8Dee3Bb1B2218bF025AcB624312D519E` | Active — all new tasks |
| Celo Mainnet | V1 | `0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e` | Legacy — read + claim/submit/approve/claimReward only, no new task creation |
| Gnosis Chain | — | `0x7Ac98D973C45E84780e314Ef745f11db85ad8cf2` | Active |

V2 verified on [Celoscan](https://celoscan.io/address/0xe60aa33E8Dee3Bb1B2218bF025AcB624312D519E). Gnosis verified on [Blockscout](https://gnosis.blockscout.com/address/0x7Ac98D973C45E84780e314Ef745f11db85ad8cf2).

This ABI reflects V2, which added `cancelTask` and `rejectSubmission` on top of V1. Kept in sync with `lib/web3.ts`'s `CONTRACT_ABI` — treat that file as the source of truth if they ever drift.

## ABI summary
```solidity
function createTask(
  string _taskId,
  address _token,
  uint256 _rewardPerSlot,
  uint256 _totalSlots,
  address _approver
) external

function claimTask(string _taskId) external
function submitTask(string _taskId, string _proofHash) external
function approveTask(string _taskId, address _claimant) external
function claimReward(string _taskId) external
function cancelTask(string _taskId) external
function rejectSubmission(string _taskId, address _claimant) external

function getTask(string _taskId) external view returns (Task)
function getTaskSlot(string _taskId, address _claimant) external view returns (Slot)
function getAvailableSlots(string _taskId) external view returns (uint256)

event TaskCreated(string indexed taskId, address indexed creator, address token, uint256 rewardPerSlot, uint256 totalSlots)
event TaskClaimed(string indexed taskId, address indexed claimant)
event TaskSubmitted(string indexed taskId, address indexed claimant, string proofHash)
event TaskApproved(string indexed taskId, address indexed claimant, uint256 reward)
event RewardClaimed(string indexed taskId, address indexed claimant, uint256 amount)
```

## Task lifecycle
```
createTask → [slot available]
    └── claimTask → [slot claimed]
            └── submitTask → [proof submitted]
                    └── approveTask (by approver) → [approved]
                            └── claimReward (by worker) → [paid]
```

## Token support

The contract accepts any ERC-20 token. The frontend exposes the tokens configured in `lib/web3.ts`. The reward is escrowed at creation time (`rewardPerSlot × totalSlots` transferred from creator to contract).

## Custom errors

| Selector | Meaning |
|---|---|
| `0xf2e16b03` | Task ID already exists or insufficient allowance |
| `0xe374566b` | No slots available — task is full or has no slots |
| `0x621a8e4d` | Task is not active |
| `0x646cf558` | Already claimed |
| `0xc325ae33` | Task not found |
| `0x9fbfc589` | Already submitted |
| `0x94eeef66` | Not the claimant |
| `0xc19f17a9` | Submission not approved yet |
| `0x376b98cf` | Can only cancel a task before anyone claims it |
| `0x82b42900` | Not authorized — only the task creator can do this |
| `0x448ad723` | No submission to reject yet |
| `0x101f817a` | Submission was already approved |
| `0xb72a2522` | This slot hasn't been claimed |
