import { useState, useEffect, useCallback } from 'react';
import { useAccount, useContractRead, useWriteContract } from 'wagmi';
import { PERP_ABI, PERP_ADDRESS } from '@/lib/constants';
import { Position } from '@/types';
import { formatUnits, parseUnits } from 'viem';

interface LiquidationData {
  positionId: string;
  user: string;
  currentPrice: number;
  liquidationPrice: number;
  marginRatio: number;
  isLiquidatable: boolean;
  liquidationFee: number;
  timestamp: number;
}

interface LiquidationEngineState {
  liquidatablePositions: LiquidationData[];
  isMonitoring: boolean;
  lastCheck: number;
  totalLiquidations: number;
  totalFees: number;
}

const LIQUIDATION_THRESHOLD = 0.8; // 80% margin ratio threshold
const LIQUIDATION_FEE_RATE = 0.05; // 5% liquidation fee
const MONITORING_INTERVAL = 10000; // Check every 10 seconds

export const useLiquidationEngine = () => {
  const { address } = useAccount();
  const [engineState, setEngineState] = useState<LiquidationEngineState>({
    liquidatablePositions: [],
    isMonitoring: false,
    lastCheck: 0,
    totalLiquidations: 0,
    totalFees: 0,
  });

  // Read all positions for liquidation monitoring
  // Note: getAllPositions doesn't exist in the ABI, using getUserPositions instead
  const { data: allPositions, refetch: refetchPositions } = useContractRead({
    address: PERP_ADDRESS as `0x${string}`,
    abi: PERP_ABI,
    functionName: 'getUserPositions',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Liquidation write function
  const { writeContract: writeLiquidation, isPending: isLiquidationPending } = useWriteContract();

  // Calculate liquidation price for a position
  const calculateLiquidationPrice = useCallback((
    position: Position,
    currentPrice: number
  ): number => {
    const { isLong, leverage, entryPrice, margin } = position;
    
    // Calculate the price at which the position would be liquidated
    // Liquidation occurs when unrealized loss equals the margin
    const liquidationThreshold = margin / (position.size * leverage);
    
    if (isLong) {
      // For long positions, liquidation price is below entry price
      return entryPrice * (1 - liquidationThreshold);
    } else {
      // For short positions, liquidation price is above entry price
      return entryPrice * (1 + liquidationThreshold);
    }
  }, []);

  // Calculate margin ratio
  const calculateMarginRatio = useCallback((
    position: Position,
    currentPrice: number
  ): number => {
    const { isLong, leverage, entryPrice, margin } = position;
    
    // Calculate unrealized PnL
    const priceChange = isLong 
      ? (currentPrice - entryPrice) / entryPrice
      : (entryPrice - currentPrice) / entryPrice;
    
    const unrealizedPnL = priceChange * position.size * leverage;
    const remainingMargin = margin + unrealizedPnL;
    
    return remainingMargin / margin;
  }, []);

  // Check if position is liquidatable
  const isPositionLiquidatable = useCallback((
    position: Position,
    currentPrice: number
  ): boolean => {
    const marginRatio = calculateMarginRatio(position, currentPrice);
    return marginRatio <= LIQUIDATION_THRESHOLD;
  }, [calculateMarginRatio]);

  // Calculate liquidation fee
  const calculateLiquidationFee = useCallback((
    position: Position,
    currentPrice: number
  ): number => {
    const liquidationPrice = calculateLiquidationPrice(position, currentPrice);
    return position.size * LIQUIDATION_FEE_RATE;
  }, [calculateLiquidationPrice]);

  // Scan for liquidatable positions
  const scanLiquidatablePositions = useCallback(async (currentPrice: number) => {
    if (!allPositions || !Array.isArray(allPositions)) return;

    const liquidatablePositions: LiquidationData[] = [];

    for (const positionData of allPositions) {
      const position: Position = {
        id: positionData.id.toString(),
        size: Number(formatUnits(positionData.size, 6)),
        isLong: positionData.isLong,
        leverage: Number(positionData.leverage),
        entryPrice: Number(formatUnits(positionData.entryPrice, 18)),
        currentPrice: 0,
        pnl: Number(formatUnits(positionData.unrealizedPnl, 6)),
        timestamp: Number(positionData.lastFundingTime),
        user: positionData.user as `0x${string}`,
        margin: Number(formatUnits(positionData.margin, 6)),
        lastFundingTime: Number(positionData.lastFundingTime),
        unrealizedPnl: Number(formatUnits(positionData.unrealizedPnl, 6)),
        isActive: positionData.isActive,
      };

      if (!position.isActive) continue;

      const liquidationPrice = calculateLiquidationPrice(position, currentPrice);
      const marginRatio = calculateMarginRatio(position, currentPrice);
      const isLiquidatable = isPositionLiquidatable(position, currentPrice);
      const liquidationFee = calculateLiquidationFee(position, currentPrice);

      if (isLiquidatable) {
        liquidatablePositions.push({
          positionId: position.id,
          user: position.user,
          currentPrice,
          liquidationPrice,
          marginRatio,
          isLiquidatable,
          liquidationFee,
          timestamp: Date.now(),
        });
      }
    }

    setEngineState(prev => ({
      ...prev,
      liquidatablePositions,
      lastCheck: Date.now(),
    }));
  }, [allPositions, calculateLiquidationPrice, calculateMarginRatio, isPositionLiquidatable, calculateLiquidationFee]);

  // Execute liquidation
  const executeLiquidation = useCallback(async (positionId: string) => {
    try {
      const result = await writeLiquidation({
        address: PERP_ADDRESS as `0x${string}`,
        abi: PERP_ABI,
        functionName: 'closePosition', // Using closePosition since liquidatePosition doesn't exist in ABI
        args: [BigInt(positionId)],
      });

      // Update state
      setEngineState(prev => ({
        ...prev,
        totalLiquidations: prev.totalLiquidations + 1,
        liquidatablePositions: prev.liquidatablePositions.filter(
          pos => pos.positionId !== positionId
        ),
      }));

      return result;
    } catch (error) {
      console.error('Liquidation failed:', error);
      throw error;
    }
  }, [writeLiquidation]);

  // Auto-liquidate positions
  const autoLiquidate = useCallback(async () => {
    const { liquidatablePositions } = engineState;
    
    for (const position of liquidatablePositions) {
      try {
        await executeLiquidation(position.positionId);
        console.log(`Auto-liquidated position ${position.positionId}`);
      } catch (error) {
        console.error(`Failed to liquidate position ${position.positionId}:`, error);
      }
    }
  }, [engineState.liquidatablePositions, executeLiquidation]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    setEngineState(prev => ({ ...prev, isMonitoring: true }));
  }, []);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setEngineState(prev => ({ ...prev, isMonitoring: false }));
  }, []);

  // Manual liquidation check
  const checkLiquidations = useCallback(async (currentPrice: number) => {
    await scanLiquidatablePositions(currentPrice);
  }, [scanLiquidatablePositions]);

  // Monitoring loop
  useEffect(() => {
    if (!engineState.isMonitoring) return;

    const interval = setInterval(async () => {
      // Get current price from price feed
      // This would typically come from the price oracle
      const currentPrice = 105.42; // Mock price - replace with real price feed
      
      await scanLiquidatablePositions(currentPrice);
      
      // Auto-liquidate if enabled
      if (engineState.liquidatablePositions.length > 0) {
        await autoLiquidate();
      }
    }, MONITORING_INTERVAL);

    return () => clearInterval(interval);
  }, [engineState.isMonitoring, engineState.liquidatablePositions.length, scanLiquidatablePositions, autoLiquidate]);

  // Get liquidation statistics
  const getLiquidationStats = useCallback(() => {
    const { liquidatablePositions, totalLiquidations, totalFees } = engineState;
    
    return {
      liquidatableCount: liquidatablePositions.length,
      totalLiquidations,
      totalFees,
      averageLiquidationFee: totalLiquidations > 0 ? totalFees / totalLiquidations : 0,
      lastCheck: engineState.lastCheck,
    };
  }, [engineState]);

  // Get user's liquidatable positions
  const getUserLiquidatablePositions = useCallback((userAddress: string) => {
    return engineState.liquidatablePositions.filter(
      pos => pos.user.toLowerCase() === userAddress.toLowerCase()
    );
  }, [engineState.liquidatablePositions]);

  return {
    // State
    liquidatablePositions: engineState.liquidatablePositions,
    isMonitoring: engineState.isMonitoring,
    liquidationStats: getLiquidationStats(),
    
    // Actions
    startMonitoring,
    stopMonitoring,
    checkLiquidations,
    executeLiquidation,
    autoLiquidate,
    getUserLiquidatablePositions,
    
    // Utilities
    calculateLiquidationPrice,
    calculateMarginRatio,
    isPositionLiquidatable,
    calculateLiquidationFee,
  };
};
