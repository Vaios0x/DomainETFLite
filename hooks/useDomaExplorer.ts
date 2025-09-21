import { useState, useEffect } from 'react';

interface DomaExplorerConfig {
  restApiUrl: string;
  graphqlUrl: string;
  rpcUrl: string;
  ethRpcUrl: string;
  blockscoutApiUrl: string;
  gasTrackerUrl: string;
  contractVerificationUrl: string;
}

interface DomaTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: number;
  blockNumber: number;
  status: 'success' | 'failed' | 'pending';
}

interface DomaBlock {
  number: number;
  hash: string;
  timestamp: number;
  gasUsed: string;
  gasLimit: string;
  transactionCount: number;
}

interface DomaAddress {
  address: string;
  balance: string;
  transactionCount: number;
  isContract: boolean;
  contractInfo?: {
    name?: string;
    symbol?: string;
    decimals?: number;
  };
}

interface DomaToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  holders: number;
  transfers: number;
  type: 'ERC-20' | 'ERC-721' | 'ERC-1155';
}

interface DomaTokenTransfer {
  transactionHash: string;
  from: string;
  to: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  value: string;
  timestamp: number;
  blockNumber: number;
}

interface DomaWithdrawal {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  blockNumber: number;
  status: 'pending' | 'completed' | 'failed';
}

interface DomaGasTracker {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
  timestamp: number;
}

export const useDomaExplorer = () => {
  const [config, setConfig] = useState<DomaExplorerConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar las APIs del explorador
  useEffect(() => {
    setConfig({
      restApiUrl: 'https://explorer-testnet.doma.xyz/api/v1',
      graphqlUrl: 'https://explorer-testnet.doma.xyz/graphql',
      rpcUrl: 'https://explorer-testnet.doma.xyz/rpc',
      ethRpcUrl: 'https://explorer-testnet.doma.xyz/api/eth-rpc',
      blockscoutApiUrl: 'https://explorer-testnet.doma.xyz/api',
      gasTrackerUrl: 'https://explorer-testnet.doma.xyz/gas-tracker',
      contractVerificationUrl: 'https://explorer-testnet.doma.xyz/contract-verification'
    });
  }, []);

  // Función para llamadas REST API
  const restApiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!config) {
      throw new Error('Explorer API not configured');
    }

    const url = `${config.restApiUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`REST API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // Función para llamadas GraphQL
  const graphqlCall = async (query: string, variables: any = {}) => {
    if (!config) {
      throw new Error('Explorer API not configured');
    }

    const response = await fetch(config.graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.errors) {
      throw new Error(`GraphQL Errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    return data.data;
  };

  // Función para llamadas RPC
  const rpcCall = async (method: string, params: any[] = []) => {
    if (!config) {
      throw new Error('Explorer API not configured');
    }

    const response = await fetch(config.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`RPC Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`RPC Error: ${data.error.message}`);
    }

    return data.result;
  };

  // Función para llamadas Blockscout API
  const blockscoutApiCall = async (module: string, action: string, params: Record<string, any> = {}) => {
    if (!config) {
      throw new Error('Explorer API not configured');
    }

    const searchParams = new URLSearchParams({
      module,
      action,
      ...params
    });

    const url = `${config.blockscoutApiUrl}?${searchParams}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Blockscout API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === '0' && data.message !== 'OK') {
      throw new Error(`Blockscout API Error: ${data.message}`);
    }

    return data;
  };

  // Obtener transacciones recientes
  const getRecentTransactions = async (limit: number = 20): Promise<DomaTransaction[]> => {
    try {
      const data = await restApiCall(`/transactions?limit=${limit}&sort=timestamp&order=desc`);
      return data.transactions || [];
    } catch (err) {
      console.error('Error fetching recent transactions:', err);
      throw err;
    }
  };

  // Obtener información de una dirección
  const getAddressInfo = async (address: string): Promise<DomaAddress> => {
    try {
      const data = await restApiCall(`/address/${address}`);
      return data;
    } catch (err) {
      console.error('Error fetching address info:', err);
      throw err;
    }
  };

  // Obtener bloques recientes
  const getRecentBlocks = async (limit: number = 10): Promise<DomaBlock[]> => {
    try {
      const data = await restApiCall(`/blocks?limit=${limit}&sort=number&order=desc`);
      return data.blocks || [];
    } catch (err) {
      console.error('Error fetching recent blocks:', err);
      throw err;
    }
  };

  // Buscar transacciones por hash
  const getTransactionByHash = async (hash: string): Promise<DomaTransaction> => {
    try {
      const data = await restApiCall(`/transaction/${hash}`);
      return data;
    } catch (err) {
      console.error('Error fetching transaction:', err);
      throw err;
    }
  };

  // Obtener estadísticas de la red
  const getNetworkStats = async () => {
    try {
      const data = await restApiCall('/stats/network');
      return data;
    } catch (err) {
      console.error('Error fetching network stats:', err);
      throw err;
    }
  };

  // Consulta GraphQL para datos complejos
  const getDomainTradingData = async (domainId: string) => {
    const query = `
      query GetDomainTradingData($domainId: String!) {
        domain(id: $domainId) {
          id
          name
          price
          volume24h
          change24h
          trades {
            id
            price
            amount
            timestamp
            buyer
            seller
          }
          orderbook {
            bids {
              price
              amount
            }
            asks {
              price
              amount
            }
          }
        }
      }
    `;

    try {
      const data = await graphqlCall(query, { domainId });
      return data.domain;
    } catch (err) {
      console.error('Error fetching domain trading data:', err);
      throw err;
    }
  };

  // Obtener tokens ERC-20/721/1155
  const getTokens = async (page: number = 1, limit: number = 20): Promise<DomaToken[]> => {
    try {
      const data = await blockscoutApiCall('token', 'list', {
        page: page.toString(),
        offset: limit.toString()
      });
      return data.result || [];
    } catch (err) {
      console.error('Error fetching tokens:', err);
      throw err;
    }
  };

  // Obtener transferencias de tokens
  const getTokenTransfers = async (tokenAddress?: string, page: number = 1, limit: number = 20): Promise<DomaTokenTransfer[]> => {
    try {
      const params: Record<string, any> = {
        page: page.toString(),
        offset: limit.toString()
      };
      
      if (tokenAddress) {
        params.contractaddress = tokenAddress;
      }

      const data = await blockscoutApiCall('account', 'tokentx', params);
      return data.result || [];
    } catch (err) {
      console.error('Error fetching token transfers:', err);
      throw err;
    }
  };

  // Obtener withdrawals
  const getWithdrawals = async (page: number = 1, limit: number = 20): Promise<DomaWithdrawal[]> => {
    try {
      const data = await restApiCall(`/withdrawals?page=${page}&limit=${limit}`);
      return data.withdrawals || [];
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      throw err;
    }
  };

  // Obtener gas tracker
  const getGasTracker = async (): Promise<DomaGasTracker> => {
    try {
      const data = await restApiCall('/gas-tracker');
      return data;
    } catch (err) {
      console.error('Error fetching gas tracker:', err);
      throw err;
    }
  };

  // Obtener balance de ETH usando ETH RPC
  const getEthBalance = async (address: string): Promise<string> => {
    try {
      const balance = await rpcCall('eth_getBalance', [address, 'latest']);
      return balance;
    } catch (err) {
      console.error('Error fetching ETH balance:', err);
      throw err;
    }
  };

  // Obtener información de contrato
  const getContractInfo = async (address: string) => {
    try {
      const data = await blockscoutApiCall('contract', 'getsourcecode', {
        address
      });
      return data.result?.[0] || null;
    } catch (err) {
      console.error('Error fetching contract info:', err);
      throw err;
    }
  };

  // Obtener logs de eventos
  const getEventLogs = async (address: string, fromBlock?: string, toBlock?: string) => {
    try {
      const params: any = { address };
      if (fromBlock) params.fromBlock = fromBlock;
      if (toBlock) params.toBlock = toBlock;
      
      const logs = await rpcCall('eth_getLogs', [params]);
      return logs;
    } catch (err) {
      console.error('Error fetching event logs:', err);
      throw err;
    }
  };

  // Obtener estadísticas detalladas
  const getDetailedStats = async () => {
    try {
      const [networkStats, tokenStats, blockStats] = await Promise.all([
        blockscoutApiCall('stats', 'ethsupply'),
        blockscoutApiCall('stats', 'tokensupply'),
        blockscoutApiCall('stats', 'ethprice')
      ]);
      
      return {
        network: networkStats.result,
        tokens: tokenStats.result,
        price: blockStats.result
      };
    } catch (err) {
      console.error('Error fetching detailed stats:', err);
      throw err;
    }
  };

  // Verificar conexión
  const checkConnection = async () => {
    try {
      await restApiCall('/health');
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  // Verificar conexión al montar
  useEffect(() => {
    if (config) {
      checkConnection();
    }
  }, [config]);

  return {
    config,
    isConnected,
    error,
    checkConnection,
    // REST API methods
    getRecentTransactions,
    getAddressInfo,
    getRecentBlocks,
    getTransactionByHash,
    getNetworkStats,
    // GraphQL methods
    getDomainTradingData,
    // RPC methods
    rpcCall,
    // Blockscout API methods
    getTokens,
    getTokenTransfers,
    getWithdrawals,
    getGasTracker,
    getEthBalance,
    getContractInfo,
    getEventLogs,
    getDetailedStats,
  };
};
