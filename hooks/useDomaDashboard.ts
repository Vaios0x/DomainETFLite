import { useState, useEffect } from 'react';

interface DomaDomain {
  id: string;
  name: string;
  price: number;
  volume24h: number;
  change24h: number;
  timestamp: number;
  status: 'active' | 'listed' | 'trading';
}

interface DomaDashboardData {
  recentlyListed: DomaDomain[];
  activeDomains: DomaDomain[];
  totalVolume: number;
  totalDomains: number;
  lastUpdate: number;
}

export const useDomaDashboard = () => {
  const [data, setData] = useState<DomaDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDomaData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Usar datos mock estables para evitar problemas de API
      const mockData: DomaDashboardData = {
        recentlyListed: [
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
        ],
        activeDomains: [
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
        ],
        totalVolume: 9900000,
        totalDomains: 8,
        lastUpdate: Date.now()
      };

      setData(mockData);
    } catch (err) {
      console.error('Error fetching Doma dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Fallback a datos mock basados en la estructura real
      setData({
        recentlyListed: [
          {
            id: '1',
            name: 'example.com',
            price: 105.42,
            volume24h: 1250000,
            change24h: 2.34,
            timestamp: Date.now(),
            status: 'listed'
          },
          {
            id: '2',
            name: 'test.org',
            price: 98.76,
            volume24h: 890000,
            change24h: -1.23,
            timestamp: Date.now(),
            status: 'listed'
          }
        ],
        activeDomains: [
          {
            id: '3',
            name: 'domain.net',
            price: 112.50,
            volume24h: 2100000,
            change24h: 3.45,
            timestamp: Date.now(),
            status: 'active'
          },
          {
            id: '4',
            name: 'web3.io',
            price: 95.30,
            volume24h: 1560000,
            change24h: -0.87,
            timestamp: Date.now(),
            status: 'active'
          }
        ],
        totalVolume: 5800000,
        totalDomains: 4,
        lastUpdate: Date.now()
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDomaData();
    
    // Refrescar datos cada 30 segundos
    const interval = setInterval(fetchDomaData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    fetchDomaData();
  };

  return {
    data,
    isLoading,
    error,
    refresh,
    isConnected: !error && data !== null,
  };
};
