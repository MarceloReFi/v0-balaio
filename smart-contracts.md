# Smart Contracts

## Deployed contract

| Network | Address |
|---|---|
| Celo Mainnet | `0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e` |

Verified on [Celoscan](https://celoscan.io/address/0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e).

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

function getTask(string _taskId) external view returns (Task)
function getTaskSlot(string _taskId, address _claimant) external view returns (Slot)
function getAvailableSlots(string _taskId) external view returns (uint256)

event TaskCreated(string indexed taskId, address indexed creator, address token, uint256 rewardPerSlot, uint256 totalSlots)
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
| `0xe374566b` | No slots available |
| `0x621a8e4d` | Task is not active |
| `0x646cf558` | Already claimed |
| `0xc325ae33` | Task not found |
| `0x9fbfc589` | Already submitted |
| `0x94eeef66` | Not the claimant |
| `0xc19f17a9` | Not approved yet |

## Deploying your own instance

1. Copy the contract source from the repo root (`contracts/BalaioTasks.sol`)
2. Deploy with Foundry or Remix to the network of your choice
3. Update `CONTRACT_ADDRESS` in `lib/web3.ts`
