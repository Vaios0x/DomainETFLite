import { useState, useEffect } from 'react';

interface DomaAPIConfig {
  apiKey: string;
  baseUrl: string;
  permissions: string[];
}

interface DomaDomain {
  id: string;
  name: string;
  price: number;
  volume24h: number;
  change24h: number;
  timestamp: number;
  status: 'active' | 'listed' | 'trading';
  metadata?: {
    registrar?: string;
    expiration?: string;
    owner?: string;
  };
}

interface DomaOrderbook {
  domainId: string;
  bids: Array<{
    price: number;
    amount: number;
    timestamp: number;
  }>;
  asks: Array<{
    price: number;
    amount: number;
    timestamp: number;
  }>;
}

interface DomaEvent {
  id: string;
  type: 'listing' | 'trade' | 'transfer' | 'expiration';
  domainId: string;
  data: any;
  timestamp: number;
  blockNumber: number;
}

export const useDomaAPI = () => {
  const [config, setConfig] = useState<DomaAPIConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configurar la API
  useEffect(() => {
    // No necesitamos API key para el explorador público de Blockscout
    setConfig({
      apiKey: 'public', // API pública sin autenticación
      baseUrl: 'https://explorer-testnet.doma.xyz/api',
      permissions: ['REST_API', 'GRAPHQL', 'RPC_API', 'ETH_RPC']
    });
  }, []);

  // Función para hacer llamadas a la API
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    if (!config) {
      throw new Error('API not configured');
    }

    const url = `${config.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  };

  // Obtener dominios activos (con datos mock estables)
  const getActiveDomains = async (): Promise<DomaDomain[]> => {
    // Retornar datos mock estables para evitar problemas de API
    return [
      {
        id: '1',
        name: 'example.com',
        price: 105.42,
        volume24h: 1250000,
        change24h: 2.34,
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: '2',
        name: 'test.org',
        price: 98.76,
        volume24h: 890000,
        change24h: -1.23,
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: '3',
        name: 'web3.io',
        price: 95.30,
        volume24h: 1560000,
        change24h: -0.87,
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: '4',
        name: 'crypto.xyz',
        price: 128.90,
        volume24h: 3200000,
        change24h: 4.56,
        timestamp: Date.now(),
        status: 'active'
      },
      {
        id: '5',
        name: 'nft.com',
        price: 87.45,
        volume24h: 980000,
        change24h: -2.12,
        timestamp: Date.now(),
        status: 'active'
      }
    ];
  };

  // Obtener dominios recién listados (con datos mock estables)
  const getRecentlyListed = async (): Promise<DomaDomain[]> => {
    // Retornar datos mock estables para evitar problemas de API
    return [
      {
        id: '6',
        name: 'new-domain.net',
        price: 112.50,
        volume24h: 2100000,
        change24h: 3.45,
        timestamp: Date.now(),
        status: 'listed'
      },
      {
        id: '7',
        name: 'blockchain.dev',
        price: 89.20,
        volume24h: 1800000,
        change24h: -1.80,
        timestamp: Date.now(),
        status: 'listed'
      },
      {
        id: '8',
        name: 'defi.app',
        price: 156.75,
        volume24h: 3500000,
        change24h: 5.20,
        timestamp: Date.now(),
        status: 'listed'
      }
    ];
  };

  // Obtener orderbook de un dominio (simulado)
  const getOrderbook = async (domainId: string): Promise<DomaOrderbook> => {
    try {
      // Simular orderbook con datos mock
      return {
        domainId,
        bids: [
          { price: 100, amount: 10, timestamp: Date.now() },
          { price: 99, amount: 15, timestamp: Date.now() }
        ],
        asks: [
          { price: 101, amount: 8, timestamp: Date.now() },
          { price: 102, amount: 12, timestamp: Date.now() }
        ]
      };
    } catch (err) {
      console.error('Error fetching orderbook:', err);
      throw err;
    }
  };

  // Obtener eventos recientes (transacciones)
  const getRecentEvents = async (limit: number = 50): Promise<DomaEvent[]> => {
    try {
      const data = await apiCall(`?module=account&action=txlist&address=0x0000000000000000000000000000000000000000&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc`);
      return (data.result || []).map((tx: any) => ({
        id: tx.hash,
        type: 'trade' as const,
        domainId: tx.to,
        data: tx,
        timestamp: parseInt(tx.timeStamp) * 1000,
        blockNumber: parseInt(tx.blockNumber)
      }));
    } catch (err) {
      console.error('Error fetching events:', err);
      return [];
    }
  };

  // Obtener estadísticas del mercado (con datos mock estables)
  const getMarketStats = async () => {
    // Retornar datos mock estables para evitar problemas de API
    return {
      totalVolume: 9900000,
      totalDomains: 8,
      lastUpdate: Date.now(),
      ethSupply: "1000000000000000000000000"
    };
  };

  // Verificar conexión
  const checkConnection = async () => {
    try {
      // Usar un endpoint simple para verificar la conexión
      const response = await fetch('https://explorer-testnet.doma.xyz/api?module=stats&action=ethsupply');
      if (response.ok) {
        setIsConnected(true);
        setError(null);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
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
    getActiveDomains,
    getRecentlyListed,
    getOrderbook,
    getRecentEvents,
    getMarketStats,
  };
};
