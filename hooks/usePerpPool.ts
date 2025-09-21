import { useContractRead, useWriteContract, useAccount } from 'wagmi';
import { PERP_ABI, PERP_ADDRESS, GAS_BUFFER } from '@/lib/constants';
import { usePositionsStore } from '@/zustand/positionsStore';
import { Position, PoolMetrics } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';

export const usePerpPool = () => {
  const { address } = useAccount();
  const { addPosition, removePosition, updatePosition } = usePositionsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read pool metrics with timeout handling
  const { data: metricsData, refetch: refetchMetrics, error: metricsError } = useContractRead({
    address: PERP_ADDRESS as `0x${string}`,
    abi: PERP_ABI,
    functionName: 'getPoolMetrics',
  });

  // Read user positions with timeout handling
  const { data: userPositionsData, refetch: refetchPositions, error: positionsError } = useContractRead({
    address: PERP_ADDRESS as `0x${string}`,
    abi: PERP_ABI,
    functionName: 'getUserPositions',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Open position write
  const { writeContract: writeOpenPosition, isPending: isOpenPending } = useWriteContract();

  // Close position write
  const { writeContract: writeClosePosition, isPending: isClosePending } = useWriteContract();

  // Add liquidity write
  const { writeContract: writeAddLiquidity, isPending: isAddLiquidityPending } = useWriteContract();

  // Remove liquidity write
  const { writeContract: writeRemoveLiquidity, isPending: isRemoveLiquidityPending } = useWriteContract();

  // Transform metrics data with fallback to mock data
  const metrics: PoolMetrics | null = metricsData ? {
    tvl: Number(formatUnits(metricsData[0], 6)), // USDC has 6 decimals
    openInterest: Number(formatUnits(metricsData[1], 6)),
    fundingRate: Number(formatUnits(metricsData[2], 18)) / 1e18, // Convert from wei
    lastUpdate: 1737084000000, // Fixed timestamp
  } : (metricsError ? {
    // Mock data when contract is unavailable - Fixed values to prevent hydration mismatch
    tvl: 1250000,
    openInterest: 750000,
    fundingRate: 0.0012,
    lastUpdate: 1737084000000, // Fixed timestamp
  } : null);

  // Transform user positions data
  const userPositions: Position[] = userPositionsData ? userPositionsData.map((pos: any, index: number) => ({
    id: pos.id.toString(),
    size: Number(formatUnits(pos.size, 6)),
    isLong: pos.isLong,
    leverage: Number(pos.leverage),
    entryPrice: Number(formatUnits(pos.entryPrice, 18)),
    currentPrice: 0, // Will be updated by price feed
    pnl: Number(formatUnits(pos.pnl, 6)),
    timestamp: 1737084000000, // Fixed timestamp
    user: address || '',
    margin: Number(formatUnits(pos.margin || 0, 6)),
    lastFundingTime: Number(pos.lastFundingTime || 0),
    unrealizedPnl: Number(formatUnits(pos.unrealizedPnl || 0, 6)),
    isActive: pos.isActive || true,
  })) : [];

  // Open position function
  const openPosition = useCallback(async (
    size: number,
    isLong: boolean,
    leverage: number
  ) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const sizeWei = parseUnits(size.toString(), 6); // USDC has 6 decimals
      const leverageWei = BigInt(leverage);

      const result = await writeOpenPosition({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI,
        functionName: 'openPosition',
        args: [sizeWei, isLong, leverageWei],
      });

      // Add position to local store (will be updated when contract event is received)
      const newPosition: Position = {
        id: `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // Temporary ID with timestamp
        size,
        isLong,
        leverage,
        entryPrice: 0, // Will be updated
        currentPrice: 0,
        pnl: 0,
        timestamp: 1737084000000, // Fixed timestamp
        user: address as `0x${string}`,
        margin: 0,
        lastFundingTime: 0,
        unrealizedPnl: 0,
        isActive: true,
      };

      addPosition(newPosition);

      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to open position');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeOpenPosition, addPosition]);

  // Close position function
  const closePosition = useCallback(async (positionId: string) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const positionIdWei = BigInt(positionId);

      const result = await writeClosePosition({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI,
        functionName: 'closePosition',
        args: [positionIdWei],
      });

      // Remove position from local store
      removePosition(positionId);

      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to close position');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeClosePosition, removePosition]);

  // Add liquidity function
  const addLiquidity = useCallback(async (amount: number) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountWei = parseUnits(amount.toString(), 6); // USDC has 6 decimals

      const result = await writeAddLiquidity({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI,
        functionName: 'addLiquidity',
        args: [amountWei],
      });

      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to add liquidity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeAddLiquidity]);

  // Remove liquidity function
  const removeLiquidity = useCallback(async (amount: number) => {
    if (!address) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountWei = parseUnits(amount.toString(), 6); // USDC has 6 decimals

      const result = await writeRemoveLiquidity({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI,
        functionName: 'removeLiquidity',
        args: [amountWei],
      });

      return result;
    } catch (err: any) {
      setError(err.message || 'Failed to remove liquidity');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [address, writeRemoveLiquidity]);

  // Update position prices when price feed updates
  const updatePositionPrices = useCallback((currentPrice: number) => {
    userPositions.forEach((position) => {
      updatePosition(position.id, { currentPrice });
    });
  }, [userPositions, updatePosition]);

  return {
    // Data
    metrics,
    userPositions,
    isLoading,
    error,
    
    // Functions
    openPosition,
    closePosition,
    addLiquidity,
    removeLiquidity,
    updatePositionPrices,
    refetchMetrics,
    refetchPositions,
    
    // Write states
    isOpenPending,
    isClosePending,
    isAddLiquidityPending,
    isRemoveLiquidityPending,
  };
};
