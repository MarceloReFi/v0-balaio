export const CONTRACT_ADDRESS = "0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e"
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a"
export const CELO_RPC = "https://forno.celo.org"
export const CELO_CHAIN_ID = "0xa4ec"

export const CONTRACT_ABI = [
  "function createTask(string _taskId, address _token, uint256 _rewardPerSlot, uint256 _totalSlots, address _approver) external",
  "function claimTask(string _taskId) external",
  "function submitTask(string _taskId, string _proofHash) external",
  "function approveTask(string _taskId, address _claimant) external",
  "function claimReward(string _taskId) external",
  "function getTask(string _taskId) external view returns (tuple(string taskId, address creator, address approver, address token, uint256 rewardPerSlot, uint256 totalSlots, uint256 claimedSlots, bool active, uint256 createdAt))",
  "function getTaskSlot(string _taskId, address _claimant) external view returns (tuple(address claimant, uint256 reward, bool claimed, bool submitted, bool approved, bool withdrawn))",
  "function getAvailableSlots(string _taskId) external view returns (uint256)",
]

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]

export const CUSTOM_ERRORS: Record<string, string> = {
  "0xf2e16b03": "Task ID already exists or insufficient allowance",
  "0x": "Unknown contract error",
}
