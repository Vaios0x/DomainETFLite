'use client';

import React, { useEffect, useState } from 'react';
import { usePerpPool } from '@/hooks/usePerpPool';
import { usePriceFeed } from '@/hooks/usePriceFeed';
import { useToastStore } from '@/zustand/toastStore';
import { TradeForm } from '@/components/TradeForm';
import { PositionTable } from '@/components/PositionTable';
import { ChartPrice } from '@/components/ChartPrice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradeFormData, ChartData, FundingData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';

// Mock data for demo
const generateMockChartData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = Date.now();
  const basePrice = 100;
  
  for (let i = 60; i >= 0; i--) {
    const timestamp = now - (i * 60 * 1000); // 1 minute intervals
    const priceVariation = (Math.random() - 0.5) * 2; // ±1 price variation
    const price = basePrice + priceVariation;
    
    data.push({
      timestamp,
      open: price - (Math.random() - 0.5) * 0.5,
      high: price + Math.random() * 1,
      low: price - Math.random() * 1,
      close: price,
      volume: Math.random() * 10000,
    });
  }
  
  return data;
};

const generateMockFundingData = (): FundingData[] => {
  const data: FundingData[] = [];
  const now = Date.now();
  
  for (let i = 60; i >= 0; i--) {
    const timestamp = now - (i * 60 * 1000);
    const rate = (Math.random() - 0.5) * 0.001; // ±0.1% funding rate
    
    data.push({
      rate,
      timestamp,
      nextUpdate: timestamp + 600000, // 10 minutes
    });
  }
  
  return data;
};

export default function TradePage() {
  const { 
    openPosition, 
    closePosition, 
    userPositions, 
    isLoading: poolLoading,
    error: poolError 
  } = usePerpPool();
  const { price, funding, isLive } = usePriceFeed();
  const { addToast } = useToastStore();
  
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [fundingData, setFundingData] = useState<FundingData[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate mock data on mount
  useEffect(() => {
    setChartData(generateMockChartData());
    setFundingData(generateMockFundingData());
  }, []);

  // Update chart data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev];
        const lastCandle = newData[newData.length - 1];
        const newPrice = lastCandle.close + (Math.random() - 0.5) * 0.5;
        
        newData.push({
          timestamp: Date.now(),
          open: lastCandle.close,
          high: Math.max(lastCandle.close, newPrice) + Math.random() * 0.5,
          low: Math.min(lastCandle.close, newPrice) - Math.random() * 0.5,
          close: newPrice,
          volume: Math.random() * 1000,
        });
        
        // Keep only last 60 minutes
        return newData.slice(-61);
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleTradeSubmit = async (formData: TradeFormData) => {
    setIsSubmitting(true);
    
    try {
      await openPosition(
        formData.size,
        formData.isLong,
        formData.leverage
      );

      addToast({
        type: 'success',
        title: 'Position Opened',
        description: `Successfully opened ${formData.isLong ? 'long' : 'short'} position`,
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Transaction Failed',
        description: error.message || 'Failed to open position',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClosePosition = async (positionId: string) => {
    try {
      await closePosition(positionId);

      addToast({
        type: 'success',
        title: 'Position Closed',
        description: 'Successfully closed position',
      });
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Transaction Failed',
        description: error.message || 'Failed to close position',
      });
    }
  };

  const handleRefresh = () => {
    setChartData(generateMockChartData());
    setFundingData(generateMockFundingData());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <TrendingUp className="h-8 w-8" />
            Trade
          </h1>
          <p className="text-muted-foreground">
            Trade perpetual swaps on DomainETF
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 text-sm ${
            isLive ? 'text-green-600' : 'text-red-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isLive ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>{isLive ? 'Live' : 'Disconnected'}</span>
          </div>
          <Button
            {...({
              variant: "outline",
              size: "sm",
              onClick: handleRefresh,
              disabled: poolLoading
            } as ButtonProps)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${poolLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {poolError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Error: {poolError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Price Display */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">DomainETF Price</h3>
              <p className="text-3xl font-bold">
                {price > 0 ? formatCurrency(price) : 'Loading...'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Funding Rate</p>
              <p className={`text-lg font-semibold ${
                funding > 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {funding ? `${(funding * 100).toFixed(4)}%` : 'Loading...'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Price Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartPrice
                data={chartData}
                fundingData={fundingData}
                height={400}
                showFunding={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Trading Form */}
        <div>
          <TradeForm
            onSubmit={handleTradeSubmit}
            isLoading={isSubmitting}
            currentPrice={price}
          />
        </div>
      </div>

      {/* Positions Table */}
      <PositionTable
        positions={userPositions}
        onClosePosition={handleClosePosition}
        isLoading={poolLoading}
      />

      {/* Trading Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Trade</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">1. Connect Wallet</h4>
              <p className="text-muted-foreground">
                Connect your wallet to start trading
              </p>
            </div>
            <div>
              <h4 className="font-medium">2. Choose Direction</h4>
              <p className="text-muted-foreground">
                Select Long (bullish) or Short (bearish) on domain prices
              </p>
            </div>
            <div>
              <h4 className="font-medium">3. Set Position Size</h4>
              <p className="text-muted-foreground">
                Enter the amount of USDC you want to trade
              </p>
            </div>
            <div>
              <h4 className="font-medium">4. Choose Leverage</h4>
              <p className="text-muted-foreground">
                Select leverage from 1x to 10x to amplify your position
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">Liquidation Risk</h4>
              <p className="text-muted-foreground">
                Higher leverage increases liquidation risk
              </p>
            </div>
            <div>
              <h4 className="font-medium">Funding Costs</h4>
              <p className="text-muted-foreground">
                Pay funding fees every 8 hours based on market conditions
              </p>
            </div>
            <div>
              <h4 className="font-medium">Slippage</h4>
              <p className="text-muted-foreground">
                Large positions may experience price slippage
              </p>
            </div>
            <div>
              <h4 className="font-medium">Market Hours</h4>
              <p className="text-muted-foreground">
                Trading is available 24/7 on Doma Protocol
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
