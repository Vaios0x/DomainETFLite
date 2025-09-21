import { defineChain } from 'viem';

// Doma Testnet Chain Configuration - Official from docs.doma.xyz
// This ensures proper chain recognition and prevents conflicts with other chains
export const domaTestnet = defineChain({
  id: 1001,
  name: 'Doma Testnet',
  network: 'doma-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Doma',
    symbol: 'DOMA',
  },
  rpcUrls: {
    public: { 
      http: [
        'https://rpc-testnet.doma.xyz',
        'https://rpc.testnet.doma.xyz'
      ] 
    },
    default: { 
      http: [
        'https://rpc-testnet.doma.xyz'
      ] 
    },
  },
  blockExplorers: {
    default: { 
      name: 'Doma Explorer', 
      url: 'https://explorer-testnet.doma.xyz' 
    },
  },
  testnet: true,
  // Essential contracts for proper functionality
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1,
    },
  },
  // Additional metadata to ensure proper recognition
  metadata: {
    description: 'Doma Protocol Testnet - Official testnet for domain name financialization',
    website: 'https://docs.doma.xyz',
    explorer: 'https://explorer-testnet.doma.xyz',
    faucet: 'https://faucet.doma.xyz',
  },
});

// Export chain ID for easy access
export const DOMA_CHAIN_ID = domaTestnet.id;

// Export RPC URLs for direct access
export const DOMA_RPC_URLS = domaTestnet.rpcUrls.default.http;

// Export explorer URL
export const DOMA_EXPLORER_URL = domaTestnet.blockExplorers.default.url;
