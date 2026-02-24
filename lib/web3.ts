// Public contract address on Celo Mainnet. Verified on Celoscan.
// To deploy your own instance, see docs/smart-contracts.md
export const CONTRACT_ADDRESS = "0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e"

export type TokenSymbol =
  | "CELO"
  | "cUSD"
  | "cEUR"
  | "cREAL"
  | "cKES"
  | "PUSO"
  | "cCOP"
  | "cCAD"
  | "eXOF"
  | "cGHS"
  | "cJPY"
  | "cCHF"
  | "cAUD"
  | "cNGN"
  | "cZAR"
  | "cGBP"
  | "USDC"
  | "CRECY"
  | "G$"
  | "GPBRV"
  | "GPBR"

export interface TokenConfig {
  symbol: TokenSymbol
  address: string
  decimals: number
  name: string
}

export const SUPPORTED_TOKENS: Record<TokenSymbol, TokenConfig> = {
  CELO: {
    symbol: "CELO",
    address: "0x471EcE3750Da237f93B8E339c536989b8978a438",
    decimals: 18,
    name: "Celo Native Token",
  },
  cUSD: {
    symbol: "cUSD",
    address: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    decimals: 18,
    name: "Celo Dollar",
  },
  cEUR: {
    symbol: "cEUR",
    address: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
    decimals: 18,
    name: "Celo Euro",
  },
  cREAL: {
    symbol: "cREAL",
    address: "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787",
    decimals: 18,
    name: "Celo Brazilian Real",
  },
  cKES: {
    symbol: "cKES",
    address: "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0",
    decimals: 18,
    name: "Celo Kenyan Shilling",
  },
  PUSO: {
    symbol: "PUSO",
    address: "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B",
    decimals: 18,
    name: "Philippine Peso",
  },
  cCOP: {
    symbol: "cCOP",
    address: "0x8A567e2aE79CA692Bd748aB832081C45de4041eA",
    decimals: 18,
    name: "Celo Colombian Peso",
  },
  cCAD: {
    symbol: "cCAD",
    address: "0xff4Ab19391af240c311c54200a492233052B6325",
    decimals: 18,
    name: "Celo Canadian Dollar",
  },
  eXOF: {
    symbol: "eXOF",
    address: "0x73F93dcc49cB8A239e2032663e9475dd5ef29A08",
    decimals: 18,
    name: "ECO CFA Franc",
  },
  cGHS: {
    symbol: "cGHS",
    address: "0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313",
    decimals: 18,
    name: "Celo Ghanaian Cedi",
  },
  cJPY: {
    symbol: "cJPY",
    address: "0xc45eCF20f3CD864B32D9794d6f76814aE8892e20",
    decimals: 18,
    name: "Celo Japanese Yen",
  },
  cCHF: {
    symbol: "cCHF",
    address: "0xb55a79F398E759E43C95b979163f30eC87Ee131D",
    decimals: 18,
    name: "Celo Swiss Franc",
  },
  cAUD: {
    symbol: "cAUD",
    address: "0x7175504C455076F15c04A2F90a8e352281F492F9",
    decimals: 18,
    name: "Celo Australian Dollar",
  },
  cNGN: {
    symbol: "cNGN",
    address: "0xE2702Bd97ee33c88c8f6f92DA3B733608aa76F71",
    decimals: 18,
    name: "Celo Nigerian Naira",
  },
  cZAR: {
    symbol: "cZAR",
    address: "0x4c35853A3B4e647fD266f4de678dCc8fEC410BF6",
    decimals: 18,
    name: "Celo South African Rand",
  },
  cGBP: {
    symbol: "cGBP",
    address: "0xCCF663b1fF11028f0b19058d0f7B674004a40746",
    decimals: 18,
    name: "Celo British Pound",
  },
  USDC: {
    symbol: "USDC",
    address: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
    decimals: 6,
    name: "USD Coin",
  },
  CRECY: {
    symbol: "CRECY",
    address: "0x34c11a932853ae24e845ad4b633e3cef91afe583",
    decimals: 18,
    name: "CRECY",
  },
  "G$": {
    symbol: "G$",
    address: "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A",
    decimals: 18,
    name: "GoodDollar",
  },
  GPBRV: {
    symbol: "GPBRV",
    address: "0x6EC3D6e693526108990C6d5cbD2195e051321D32",
    decimals: 6,
    name: "GPBRV",
  },
  GPBR: {
    symbol: "GPBR",
    address: "0xd832B2F117db51021Ad0387c17182796DBEB69df",
    decimals: 6,
    name: "GPBR",
  },
}

export const CONTRACT_ABI = [
  "function createTask(string _taskId, address _token, uint256 _rewardPerSlot, uint256 _totalSlots, address _approver) external",
  "function claimTask(string _taskId) external",
  "function submitTask(string _taskId, string _proofHash) external",
  "function approveTask(string _taskId, address _claimant) external",
  "function claimReward(string _taskId) external",
  "function getTask(string _taskId) external view returns (tuple(string taskId, address creator, address approver, address token, uint256 rewardPerSlot, uint256 totalSlots, uint256 claimedSlots, bool active, uint256 createdAt))",
  "function getTaskSlot(string _taskId, address _claimant) external view returns (tuple(address claimant, uint256 reward, bool claimed, bool submitted, bool approved, bool withdrawn))",
  "function getAvailableSlots(string _taskId) external view returns (uint256)",
  "event TaskCreated(string indexed taskId, address indexed creator, address token, uint256 rewardPerSlot, uint256 totalSlots)",
]

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
]

export const CUSTOM_ERRORS: Record<string, string> = {
  "0xf2e16b03": "Task ID already exists or insufficient allowance",
  "0xe374566b": "No slots available - task is full or has no slots",
  "0x621a8e4d": "Task is not active",
  "0x646cf558": "You have already claimed this task",
  "0xc325ae33": "Task not found",
  "0x9fbfc589": "You have already submitted work for this task",
  "0x94eeef66": "You are not the claimant of this task",
  "0xc19f17a9": "Task submission not approved yet",
  "0x": "Unknown contract error",
}
