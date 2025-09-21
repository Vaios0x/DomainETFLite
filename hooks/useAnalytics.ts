import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface TradingMetrics {
  totalVolume: number;
  totalTrades: number;
  winRate: number;
  averagePnL: number;
  bestTrade: number;
  worstTrade: number;
  sharpeRatio: number;
  maxDrawdown: number;
  profitFactor: number;
}

interface MarketMetrics {
  totalTvl: number;
  totalOpenInterest: number;
  averageLeverage: number;
  fundingRate: number;
  volume24h: number;
  activeTraders: number;
  liquidations24h: number;
}

interface UserAnalytics {
  tradingMetrics: TradingMetrics;
  riskMetrics: {
    maxLeverageUsed: number;
    averagePositionSize: number;
    diversificationScore: number;
    riskScore: number;
  };
  behaviorMetrics: {
    averageSessionDuration: number;
    tradesPerSession: number;
    preferredTradingHours: number[];
    mostActiveDay: string;
  };
}

interface AnalyticsState {
  userAnalytics: UserAnalytics | null;
  marketMetrics: MarketMetrics | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
}

export const useAnalytics = () => {
  const { address } = useAccount();
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    userAnalytics: null,
    marketMetrics: null,
    isLoading: false,
    error: null,
    lastUpdate: 0,
  });

  // Calculate Sharpe ratio
  const calculateSharpeRatio = useCallback((returns: number[], riskFreeRate: number = 0.02): number => {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev === 0) return 0;
    
    return (avgReturn - riskFreeRate) / stdDev;
  }, []);

  // Calculate maximum drawdown
  const calculateMaxDrawdown = useCallback((equityCurve: number[]): number => {
    if (equityCurve.length === 0) return 0;
    
    let maxDrawdown = 0;
    let peak = equityCurve[0];
    
    for (let i = 1; i < equityCurve.length; i++) {
      if (equityCurve[i] > peak) {
        peak = equityCurve[i];
      } else {
        const drawdown = (peak - equityCurve[i]) / peak;
        maxDrawdown = Math.max(maxDrawdown, drawdown);
      }
    }
    
    return maxDrawdown;
  }, []);

  // Calculate profit factor
  const calculateProfitFactor = useCallback((trades: number[]): number => {
    const profits = trades.filter(trade => trade > 0);
    const losses = trades.filter(trade => trade < 0);
    
    const totalProfit = profits.reduce((sum, profit) => sum + profit, 0);
    const totalLoss = Math.abs(losses.reduce((sum, loss) => sum + loss, 0));
    
    if (totalLoss === 0) return totalProfit > 0 ? Infinity : 0;
    
    return totalProfit / totalLoss;
  }, []);

  // Calculate diversification score
  const calculateDiversificationScore = useCallback((positions: any[]): number => {
    if (positions.length === 0) return 0;
    
    // Calculate Herfindahl-Hirschman Index (HHI)
    const totalValue = positions.reduce((sum, pos) => sum + pos.size, 0);
    const hhi = positions.reduce((sum, pos) => {
      const share = pos.size / totalValue;
      return sum + Math.pow(share, 2);
    }, 0);
    
    // Convert HHI to diversification score (0-100)
    return Math.max(0, 100 - (hhi * 100));
  }, []);

  // Calculate risk score
  const calculateRiskScore = useCallback((
    leverage: number,
    positionSize: number,
    diversification: number,
    volatility: number
  ): number => {
    // Risk factors (0-100 scale)
    const leverageRisk = Math.min(100, leverage * 10);
    const sizeRisk = Math.min(100, (positionSize / 10000) * 50);
    const diversificationRisk = 100 - diversification;
    const volatilityRisk = Math.min(100, volatility * 100);
    
    // Weighted average
    return (leverageRisk * 0.3 + sizeRisk * 0.2 + diversificationRisk * 0.2 + volatilityRisk * 0.3);
  }, []);

  // Fetch user analytics
  const fetchUserAnalytics = useCallback(async (userAddress: string) => {
    try {
      // Mock data - in production, this would fetch from API/database
      const mockTrades = [
        150, -75, 200, -50, 300, -100, 125, -25, 400, -150,
        75, -30, 250, -80, 180, -60, 320, -120, 90, -40
      ];
      
      const mockEquityCurve = [1000, 1150, 1075, 1275, 1225, 1525, 1425, 1550, 1525, 1925, 1775, 1850, 1820, 2070, 1990, 2170, 2110, 2430, 2310, 2400, 2360];
      
      const mockPositions = [
        { size: 1000, leverage: 3 },
        { size: 2000, leverage: 5 },
        { size: 1500, leverage: 2 },
        { size: 3000, leverage: 4 },
      ];

      const tradingMetrics: TradingMetrics = {
        totalVolume: mockTrades.reduce((sum, trade) => sum + Math.abs(trade), 0),
        totalTrades: mockTrades.length,
        winRate: (mockTrades.filter(trade => trade > 0).length / mockTrades.length) * 100,
        averagePnL: mockTrades.reduce((sum, trade) => sum + trade, 0) / mockTrades.length,
        bestTrade: Math.max(...mockTrades),
        worstTrade: Math.min(...mockTrades),
        sharpeRatio: calculateSharpeRatio(mockTrades),
        maxDrawdown: calculateMaxDrawdown(mockEquityCurve),
        profitFactor: calculateProfitFactor(mockTrades),
      };

      const riskMetrics = {
        maxLeverageUsed: Math.max(...mockPositions.map(p => p.leverage)),
        averagePositionSize: mockPositions.reduce((sum, p) => sum + p.size, 0) / mockPositions.length,
        diversificationScore: calculateDiversificationScore(mockPositions),
        riskScore: calculateRiskScore(5, 2000, 75, 0.15),
      };

      const behaviorMetrics = {
        averageSessionDuration: 45, // minutes
        tradesPerSession: 3.2,
        preferredTradingHours: [9, 10, 11, 14, 15, 16], // 24-hour format
        mostActiveDay: 'Tuesday',
      };

      return {
        tradingMetrics,
        riskMetrics,
        behaviorMetrics,
      };
    } catch (error) {
      console.error('Failed to fetch user analytics:', error);
      throw error;
    }
  }, [calculateSharpeRatio, calculateMaxDrawdown, calculateProfitFactor, calculateDiversificationScore, calculateRiskScore]);

  // Fetch market metrics
  const fetchMarketMetrics = useCallback(async () => {
    try {
      // Mock data - in production, this would fetch from API
      return {
        totalTvl: 2500000,
        totalOpenInterest: 1500000,
        averageLeverage: 3.2,
        fundingRate: 0.0012,
        volume24h: 5000000,
        activeTraders: 1250,
        liquidations24h: 45,
      };
    } catch (error) {
      console.error('Failed to fetch market metrics:', error);
      throw error;
    }
  }, []);

  // Load analytics data
  const loadAnalytics = useCallback(async () => {
    if (!address) return;

    setAnalyticsState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [userAnalytics, marketMetrics] = await Promise.all([
        fetchUserAnalytics(address),
        fetchMarketMetrics(),
      ]);

      setAnalyticsState(prev => ({
        ...prev,
        userAnalytics,
        marketMetrics,
        isLoading: false,
        lastUpdate: Date.now(),
      }));
    } catch (error: any) {
      setAnalyticsState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [address, fetchUserAnalytics, fetchMarketMetrics]);

  // Get performance insights
  const getPerformanceInsights = useCallback(() => {
    const { userAnalytics } = analyticsState;
    if (!userAnalytics) return [];

    const insights = [];
    const { tradingMetrics, riskMetrics } = userAnalytics;

    // Trading performance insights
    if (tradingMetrics.winRate > 60) {
      insights.push({
        type: 'success',
        title: 'High Win Rate',
        message: `Your win rate of ${tradingMetrics.winRate.toFixed(1)}% is excellent!`,
      });
    } else if (tradingMetrics.winRate < 40) {
      insights.push({
        type: 'warning',
        title: 'Low Win Rate',
        message: `Consider improving your strategy. Current win rate: ${tradingMetrics.winRate.toFixed(1)}%`,
      });
    }

    // Risk management insights
    if (riskMetrics.riskScore > 70) {
      insights.push({
        type: 'warning',
        title: 'High Risk Score',
        message: 'Consider reducing leverage or position sizes to lower risk.',
      });
    }

    if (riskMetrics.diversificationScore < 50) {
      insights.push({
        type: 'info',
        title: 'Low Diversification',
        message: 'Consider diversifying your positions across different assets.',
      });
    }

    // Sharpe ratio insights
    if (tradingMetrics.sharpeRatio > 1.5) {
      insights.push({
        type: 'success',
        title: 'Excellent Risk-Adjusted Returns',
        message: `Sharpe ratio of ${tradingMetrics.sharpeRatio.toFixed(2)} indicates strong performance.`,
      });
    }

    return insights;
  }, [analyticsState]);

  // Get risk recommendations
  const getRiskRecommendations = useCallback(() => {
    const { userAnalytics } = analyticsState;
    if (!userAnalytics) return [];

    const recommendations = [];
    const { riskMetrics } = userAnalytics;

    if (riskMetrics.maxLeverageUsed > 10) {
      recommendations.push({
        priority: 'high',
        title: 'Reduce Maximum Leverage',
        description: 'Consider limiting leverage to 10x or less to reduce liquidation risk.',
      });
    }

    if (riskMetrics.averagePositionSize > 5000) {
      recommendations.push({
        priority: 'medium',
        title: 'Optimize Position Sizing',
        description: 'Consider using smaller position sizes to improve risk management.',
      });
    }

    if (riskMetrics.diversificationScore < 60) {
      recommendations.push({
        priority: 'medium',
        title: 'Improve Diversification',
        description: 'Spread your positions across different assets to reduce concentration risk.',
      });
    }

    return recommendations;
  }, [analyticsState]);

  // Auto-refresh analytics
  useEffect(() => {
    if (address) {
      loadAnalytics();
      
      // Refresh every 5 minutes
      const interval = setInterval(loadAnalytics, 300000);
      return () => clearInterval(interval);
    }
  }, [address, loadAnalytics]);

  return {
    // State
    userAnalytics: analyticsState.userAnalytics,
    marketMetrics: analyticsState.marketMetrics,
    isLoading: analyticsState.isLoading,
    error: analyticsState.error,
    lastUpdate: analyticsState.lastUpdate,
    
    // Actions
    loadAnalytics,
    refreshAnalytics: loadAnalytics,
    
    // Insights
    performanceInsights: getPerformanceInsights(),
    riskRecommendations: getRiskRecommendations(),
    
    // Utilities
    calculateSharpeRatio,
    calculateMaxDrawdown,
    calculateProfitFactor,
    calculateDiversificationScore,
    calculateRiskScore,
  };
};
