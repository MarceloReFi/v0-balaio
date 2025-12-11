export const CONTRACT_ADDRESS = "0xf7317849bd10a41fbebd9edcd56f05e1d0b7ab2e"

// Non-Mento tokens
export const USDC_ADDRESS = "0xcebA9300f2b948710d2653dD7B07f33A8B32118C"
export const CRECY_ADDRESS = "0x34c11a932853ae24e845ad4b633e3cef91afe583"
export const GD_ADDRESS = "0x62B8B11039FcfE5aB0C56E502b1C372A3d2a9c7A"

// Mento Stablecoins
export const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a"
export const CEUR_ADDRESS = "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73"
export const CREAL_ADDRESS = "0xe8537a3d056DA446677B9E9d6c5dB704EaAb4787"
export const EXOF_ADDRESS = "0x73f93dcc49cb8a239e2032663e9475dd5ef29a08"
export const CKES_ADDRESS = "0x456a3D042C0DbD3db53D5489e98dFb038553B0d0"
export const PUSO_ADDRESS = "0x105d4A9306D2E55a71d2Eb95B81553AE1dC20d7B"
export const CCOP_ADDRESS = "0x8A567e2aE79CA692Bd748aB832081C45de4041eA"
export const CGHS_ADDRESS = "0xfAeA5F3404bbA20D3cc2f8C4B0A888F55a3c7313"
export const CJPY_ADDRESS = "0xc45eCF20f3CD864B32D9794d6f76814aE8892e20"
export const CNGN_ADDRESS = "0xE2702Bd97ee33c88c8f6f92DA3B733608aa76F71"

export const CELO_RPC = "https://forno.celo.org"
export const CELO_CHAIN_ID = "0xa4ec"

export type TokenSymbol =
  | "cUSD"  // Mento: Celo Dollar
  | "cEUR"  // Mento: Celo Euro
  | "cREAL" // Mento: Celo Brazilian Real
  | "eXOF"  // Mento: West African CFA Franc
  | "cKES"  // Mento: Celo Kenyan Shilling
  | "PUSO"  // Mento: Philippine Peso
  | "cCOP"  // Mento: Celo Colombian Peso
  | "cGHS"  // Mento: Celo Ghanaian Cedi
  | "cJPY"  // Mento: Celo Japanese Yen
  | "cNGN"  // Mento: Celo Nigerian Naira
  | "USDC"  // Circle USD Coin
  | "cReCy" // Celo ReCy Token
  | "GD"    // Good Dollar

export interface TokenConfig {
  symbol: TokenSymbol
  address: string
  decimals: number
  name: string
}

export const SUPPORTED_TOKENS: Record<TokenSymbol, TokenConfig> = {
  // Mento Stablecoins
  cUSD: {
    symbol: "cUSD",
    address: CUSD_ADDRESS,
    decimals: 18,
    name: "Celo Dollar",
  },
  cEUR: {
    symbol: "cEUR",
    address: CEUR_ADDRESS,
    decimals: 18,
    name: "Celo Euro",
  },
  cREAL: {
    symbol: "cREAL",
    address: CREAL_ADDRESS,
    decimals: 18,
    name: "Celo Brazilian Real",
  },
  eXOF: {
    symbol: "eXOF",
    address: EXOF_ADDRESS,
    decimals: 18,
    name: "West African CFA Franc",
  },
  cKES: {
    symbol: "cKES",
    address: CKES_ADDRESS,
    decimals: 18,
    name: "Celo Kenyan Shilling",
  },
  PUSO: {
    symbol: "PUSO",
    address: PUSO_ADDRESS,
    decimals: 18,
    name: "Philippine Peso",
  },
  cCOP: {
    symbol: "cCOP",
    address: CCOP_ADDRESS,
    decimals: 18,
    name: "Celo Colombian Peso",
  },
  cGHS: {
    symbol: "cGHS",
    address: CGHS_ADDRESS,
    decimals: 18,
    name: "Celo Ghanaian Cedi",
  },
  cJPY: {
    symbol: "cJPY",
    address: CJPY_ADDRESS,
    decimals: 18,
    name: "Celo Japanese Yen",
  },
  cNGN: {
    symbol: "cNGN",
    address: CNGN_ADDRESS,
    decimals: 18,
    name: "Celo Nigerian Naira",
  },
  // Other Tokens
  USDC: {
    symbol: "USDC",
    address: USDC_ADDRESS,
    decimals: 6,
    name: "USD Coin",
  },
  cReCy: {
    symbol: "cReCy",
    address: CRECY_ADDRESS,
    decimals: 18,
    name: "Celo ReCy",
  },
  GD: {
    symbol: "GD",
    address: GD_ADDRESS,
    decimals: 18,
    name: "Good Dollar",
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
  "0x": "Unknown contract error",
}
