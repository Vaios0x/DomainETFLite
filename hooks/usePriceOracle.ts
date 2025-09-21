import { useState, useEffect, useCallback } from 'react';
import { formatUnits } from 'viem';

interface PriceOracleData {
  price: number;
  volume24h: number;
  change24h: number;
  timestamp: number;
  source: string;
  confidence: number;
}

interface OracleConfig {
  name: string;
  weight: number;
  endpoint: string;
  enabled: boolean;
}

// Oracle configurations for domain price feeds
const ORACLE_CONFIGS: OracleConfig[] = [
  {
    name: 'Doma Protocol Oracle',
    weight: 0.4,
    endpoint: 'https://oracle.doma.xyz/api/v1/domain-prices',
    enabled: true,
  },
  {
    name: 'Chainlink Domain Oracle',
    weight: 0.3,
    endpoint: 'https://api.chain.link/v1/domain-prices',
    enabled: true,
  },
  {
    name: 'Domain Market Oracle',
    weight: 0.2,
    endpoint: 'https://api.domainmarket.com/v1/prices',
    enabled: true,
  },
  {
    name: 'Backup Oracle',
    weight: 0.1,
    endpoint: 'https://backup-oracle.domainetf.com/v1/prices',
    enabled: true,
  },
];

export const usePriceOracle = () => {
  const [oracleData, setOracleData] = useState<PriceOracleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [oracleStatus, setOracleStatus] = useState<Record<string, boolean>>({});

  // Fetch price from individual oracle
  const fetchOraclePrice = useCallback(async (config: OracleConfig): Promise<PriceOracleData | null> => {
    try {
      const response = await fetch(config.endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'DomainETF-Lite/1.0.0',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        throw new Error(`Oracle ${config.name} returned ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize oracle response format
      return {
        price: parseFloat(data.price || data.value || data.rate || 0),
        volume24h: parseFloat(data.volume24h || data.volume || 0),
        change24h: parseFloat(data.change24h || data.change || 0),
        timestamp: data.timestamp || Date.now(),
        source: config.name,
        confidence: parseFloat(data.confidence || 0.8),
      };
    } catch (error) {
      console.error(`Oracle ${config.name} failed:`, error);
      return null;
    }
  }, []);

  // Aggregate prices from multiple oracles
  const aggregatePrices = useCallback((prices: PriceOracleData[]): PriceOracleData => {
    if (prices.length === 0) {
      throw new Error('No oracle data available');
    }

    // Filter out invalid prices
    const validPrices = prices.filter(p => 
      p.price > 0 && 
      p.confidence > 0.5 && 
      (Date.now() - p.timestamp) < 300000 // 5 minutes old max
    );

    if (validPrices.length === 0) {
      throw new Error('No valid oracle data available');
    }

    // Calculate weighted average
    let totalWeight = 0;
    let weightedPrice = 0;
    let weightedVolume = 0;
    let weightedChange = 0;
    let totalConfidence = 0;

    validPrices.forEach(price => {
      const config = ORACLE_CONFIGS.find(c => c.name === price.source);
      const weight = config?.weight || 0.1;
      
      totalWeight += weight;
      weightedPrice += price.price * weight;
      weightedVolume += price.volume24h * weight;
      weightedChange += price.change24h * weight;
      totalConfidence += price.confidence * weight;
    });

    return {
      price: weightedPrice / totalWeight,
      volume24h: weightedVolume / totalWeight,
      change24h: weightedChange / totalWeight,
      timestamp: Date.now(),
      source: 'Aggregated',
      confidence: totalConfidence / validPrices.length,
    };
  }, []);

  // Fetch prices from all oracles
  const fetchAllPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const oraclePromises = ORACLE_CONFIGS
        .filter(config => config.enabled)
        .map(config => fetchOraclePrice(config));

      const results = await Promise.allSettled(oraclePromises);
      
      const successfulPrices: PriceOracleData[] = [];
      const oracleStatusUpdate: Record<string, boolean> = {};

      results.forEach((result, index) => {
        const config = ORACLE_CONFIGS[index];
        if (result.status === 'fulfilled' && result.value) {
          successfulPrices.push(result.value);
          oracleStatusUpdate[config.name] = true;
        } else {
          oracleStatusUpdate[config.name] = false;
        }
      });

      setOracleStatus(oracleStatusUpdate);

      if (successfulPrices.length === 0) {
        throw new Error('All oracles failed to provide data');
      }

      const aggregatedData = aggregatePrices(successfulPrices);
      setOracleData(aggregatedData);

    } catch (error: any) {
      console.error('Price oracle error:', error);
      setError(error.message);
      
      // Fallback to mock data if all oracles fail
      setOracleData({
        price: 105.42,
        volume24h: 1250000,
        change24h: 2.34,
        timestamp: Date.now(),
        source: 'Fallback',
        confidence: 0.5,
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchOraclePrice, aggregatePrices]);

  // Validate oracle data
  const validateOracleData = useCallback((data: PriceOracleData): boolean => {
    return (
      data.price > 0 &&
      data.price < 10000 && // Reasonable price range
      data.volume24h >= 0 &&
      Math.abs(data.change24h) < 100 && // Reasonable change range
      data.confidence > 0 &&
      data.confidence <= 1 &&
      (Date.now() - data.timestamp) < 600000 // 10 minutes old max
    );
  }, []);

  // Get oracle health status
  const getOracleHealth = useCallback(() => {
    const totalOracles = ORACLE_CONFIGS.filter(c => c.enabled).length;
    const healthyOracles = Object.values(oracleStatus).filter(Boolean).length;
    
    return {
      total: totalOracles,
      healthy: healthyOracles,
      percentage: totalOracles > 0 ? (healthyOracles / totalOracles) * 100 : 0,
    };
  }, [oracleStatus]);

  // Manual refresh
  const refreshPrices = useCallback(() => {
    fetchAllPrices();
  }, [fetchAllPrices]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    fetchAllPrices();
    
    const interval = setInterval(fetchAllPrices, 30000);
    return () => clearInterval(interval);
  }, [fetchAllPrices]);

  // Validate data when it changes
  useEffect(() => {
    if (oracleData && !validateOracleData(oracleData)) {
      console.warn('Invalid oracle data detected, refreshing...');
      fetchAllPrices();
    }
  }, [oracleData, validateOracleData, fetchAllPrices]);

  return {
    oracleData,
    isLoading,
    error,
    oracleStatus,
    oracleHealth: getOracleHealth(),
    refreshPrices,
    validateOracleData,
  };
};
