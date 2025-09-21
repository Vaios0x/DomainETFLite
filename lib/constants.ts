// DomainETF Lite - Constants and Configuration
// Doma Protocol Integration
export const DOMA_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_DOMA_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000";
export const DOMA_FRACTIONALIZATION_ADDRESS = process.env.NEXT_PUBLIC_DOMA_FRACTIONALIZATION_ADDRESS || "0x0000000000000000000000000000000000000000";
export const DOMA_INTEGRATION_ADDRESS = process.env.NEXT_PUBLIC_DOMA_INTEGRATION_ADDRESS || "0x0000000000000000000000000000000000000000";

// Perpetual Pool Contract
export const PERP_ADDRESS = process.env.NEXT_PUBLIC_PERP_ADDRESS || "0x0000000000000000000000000000000000000000";
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "1001");
export const DOMA_RPC = process.env.NEXT_PUBLIC_DOMA_RPC || "https://rpc-testnet.doma.xyz";
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

// Re-export from centralized chain configuration
export { domaTestnet as DOMA_CHAIN } from './doma-chain';

// Base Testnet Configuration (for liquidations and vault)
export const BASE_CHAIN = {
  id: 84532,
  name: "Base Sepolia",
  network: "base-sepolia",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    public: { http: ["https://sepolia.base.org"] },
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://sepolia.basescan.org" },
  },
  testnet: true,
};

// DomainETF Lite - Complete ABI Definitions

// DomainPerpPool Contract ABI
export const PERP_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "size", "type": "uint256"},
      {"internalType": "bool", "name": "isLong", "type": "bool"},
      {"internalType": "uint256", "name": "leverage", "type": "uint256"}
    ],
    "name": "openPosition",
    "outputs": [{"internalType": "uint256", "name": "positionId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "positionId", "type": "uint256"}
    ],
    "name": "closePosition",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolMetrics",
    "outputs": [
      {"internalType": "uint256", "name": "tvl", "type": "uint256"},
      {"internalType": "uint256", "name": "openInterest", "type": "uint256"},
      {"internalType": "int256", "name": "fundingRate", "type": "int256"},
      {"internalType": "uint256", "name": "lastUpdate", "type": "uint256"},
      {"internalType": "uint256", "name": "totalPositions", "type": "uint256"},
      {"internalType": "uint256", "name": "totalVolume", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "addLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "amount", "type": "uint256"}
    ],
    "name": "removeLiquidity",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"}
    ],
    "name": "getUserPositions",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "positionId", "type": "uint256"}
    ],
    "name": "getPosition",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "user", "type": "address"},
          {"internalType": "uint256", "name": "size", "type": "uint256"},
          {"internalType": "bool", "name": "isLong", "type": "bool"},
          {"internalType": "uint256", "name": "leverage", "type": "uint256"},
          {"internalType": "uint256", "name": "entryPrice", "type": "uint256"},
          {"internalType": "uint256", "name": "margin", "type": "uint256"},
          {"internalType": "uint256", "name": "lastFundingTime", "type": "uint256"},
          {"internalType": "int256", "name": "unrealizedPnl", "type": "int256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct DomainPerpPool.Position",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentDomainIndexPrice",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Doma Integration Contract ABI
export const DOMA_INTEGRATION_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "domain", "type": "string"}
    ],
    "name": "tokenizeDomain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "domain", "type": "string"},
      {"internalType": "uint256", "name": "totalSupply", "type": "uint256"}
    ],
    "name": "fractionalizeDomain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "domain", "type": "string"},
      {"internalType": "string", "name": "tokenType", "type": "string"},
      {"internalType": "uint256", "name": "totalSupply", "type": "uint256"}
    ],
    "name": "createSyntheticToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "syntheticToken", "type": "address"},
      {"internalType": "uint256", "name": "amount", "type": "uint256"},
      {"internalType": "bool", "name": "isBuy", "type": "bool"}
    ],
    "name": "tradeSyntheticToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "domain", "type": "string"}
    ],
    "name": "getDomainAsset",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "domain", "type": "string"},
          {"internalType": "address", "name": "ownershipToken", "type": "address"},
          {"internalType": "address", "name": "syntheticToken", "type": "address"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "currentPrice", "type": "uint256"},
          {"internalType": "bool", "name": "isFractionalized", "type": "bool"},
          {"internalType": "bool", "name": "isActive", "type": "bool"},
          {"internalType": "uint256", "name": "lastPriceUpdate", "type": "uint256"}
        ],
        "internalType": "struct DomaIntegration.DomainAsset",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "syntheticToken", "type": "address"}
    ],
    "name": "getSyntheticTokenInfo",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "domain", "type": "string"},
          {"internalType": "string", "name": "tokenType", "type": "string"},
          {"internalType": "uint256", "name": "totalSupply", "type": "uint256"},
          {"internalType": "uint256", "name": "price", "type": "uint256"},
          {"internalType": "bool", "name": "isActive", "type": "bool"}
        ],
        "internalType": "struct DomaIntegration.SyntheticTokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTrackedDomains",
    "outputs": [{"internalType": "string[]", "name": "", "type": "string[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveSyntheticTokens",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// USDC Testnet Address
export const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"; // Base Sepolia USDC

// Gas Configuration
export const GAS_BUFFER = 1.25; // 25% gas buffer

// Trading Configuration
export const MAX_LEVERAGE = 10;
export const MIN_LEVERAGE = 1;
export const DEFAULT_LEVERAGE = 3;

// Price Feed Configuration
export const PRICE_UPDATE_INTERVAL = 1000; // 1 second
export const FUNDING_UPDATE_INTERVAL = 600000; // 10 minutes

// UI Configuration
export const TOAST_DURATION = 5000;
export const REFRESH_INTERVAL = 20000; // 20 seconds for leaderboard
