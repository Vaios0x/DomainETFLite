import { useContractRead, useWriteContract, useAccount } from 'wagmi';
import { DOMA_INTEGRATION_ADDRESS, DOMA_INTEGRATION_ABI } from '@/lib/constants';
import { DomainAsset, SyntheticTokenInfo } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

export const useDomaIntegration = () => {
  const { address } = useAccount();
  const [trackedDomains, setTrackedDomains] = useState<string[]>([]);
  const [activeSyntheticTokens, setActiveSyntheticTokens] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read tracked domains
  const { data: domainsData, refetch: refetchDomains } = useContractRead({
    address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
    abi: DOMA_INTEGRATION_ABI,
    functionName: 'getTrackedDomains',
  });

  // Read active synthetic tokens
  const { data: syntheticTokensData, refetch: refetchSyntheticTokens } = useContractRead({
    address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
    abi: DOMA_INTEGRATION_ABI,
    functionName: 'getActiveSyntheticTokens',
  });

  // Write contract hook
  const { writeContractAsync } = useWriteContract();

  // Update tracked domains
  useEffect(() => {
    if (domainsData) {
      setTrackedDomains(domainsData as string[]);
    }
  }, [domainsData]);

  // Update active synthetic tokens
  useEffect(() => {
    if (syntheticTokensData) {
      setActiveSyntheticTokens(syntheticTokensData as string[]);
    }
  }, [syntheticTokensData]);

  // Tokenize domain
  const tokenizeDomain = useCallback(async (domain: string) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await writeContractAsync({
        address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
        abi: DOMA_INTEGRATION_ABI,
        functionName: 'tokenizeDomain',
        args: [domain],
      });

      // Refresh data after successful tokenization
      await refetchDomains();
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to tokenize domain');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeContractAsync, refetchDomains]);

  // Fractionalize domain
  const fractionalizeDomain = useCallback(async (domain: string, totalSupply: number) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await writeContractAsync({
        address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
        abi: DOMA_INTEGRATION_ABI,
        functionName: 'fractionalizeDomain',
        args: [domain, BigInt(totalSupply)],
      });

      // Refresh data after successful fractionalization
      await refetchDomains();
      await refetchSyntheticTokens();
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to fractionalize domain');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeContractAsync, refetchDomains, refetchSyntheticTokens]);

  // Create synthetic token
  const createSyntheticToken = useCallback(async (
    domain: string,
    tokenType: 'DNS' | 'SUBDOMAIN' | 'TRANSFER' | 'RENEWAL',
    totalSupply: number
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await writeContractAsync({
        address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
        abi: DOMA_INTEGRATION_ABI,
        functionName: 'createSyntheticToken',
        args: [domain, tokenType, BigInt(totalSupply)],
      });

      // Refresh data after successful creation
      await refetchSyntheticTokens();
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to create synthetic token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeContractAsync, refetchSyntheticTokens]);

  // Trade synthetic token
  const tradeSyntheticToken = useCallback(async (
    syntheticToken: string,
    amount: number,
    isBuy: boolean
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const result = await writeContractAsync({
        address: DOMA_INTEGRATION_ADDRESS as `0x${string}`,
        abi: DOMA_INTEGRATION_ABI,
        functionName: 'tradeSyntheticToken',
        args: [syntheticToken as `0x${string}`, BigInt(amount), isBuy],
      });
      
      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to trade synthetic token');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeContractAsync]);

  // Get domain asset
  const getDomainAsset = useCallback(async (domain: string): Promise<DomainAsset | null> => {
    try {
      // This would be a contract read call
      // For now, return mock data
      return {
        domain,
        ownershipToken: '0x0000000000000000000000000000000000000000',
        syntheticToken: '0x0000000000000000000000000000000000000000',
        totalSupply: 0,
        currentPrice: 1e18,
        isFractionalized: false,
        isActive: false,
        lastPriceUpdate: Date.now(),
      };
    } catch (err) {
      console.error('Error fetching domain asset:', err);
      return null;
    }
  }, []);

  // Get synthetic token info
  const getSyntheticTokenInfo = useCallback(async (syntheticToken: string): Promise<SyntheticTokenInfo | null> => {
    try {
      // This would be a contract read call
      // For now, return mock data
      return {
        domain: 'example.com',
        tokenType: 'DNS',
        totalSupply: 1000000,
        price: 0.25e18,
        isActive: true,
      };
    } catch (err) {
      console.error('Error fetching synthetic token info:', err);
      return null;
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    try {
      await Promise.all([
        refetchDomains(),
        refetchSyntheticTokens(),
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  }, [refetchDomains, refetchSyntheticTokens]);

  return {
    // Data
    trackedDomains,
    activeSyntheticTokens,
    
    // Actions
    tokenizeDomain,
    fractionalizeDomain,
    createSyntheticToken,
    tradeSyntheticToken,
    getDomainAsset,
    getSyntheticTokenInfo,
    refreshData,
    
    // State
    isLoading,
    error,
  };
};
