'use client';

import React, { useState } from 'react';
import { usePerpPool } from '@/hooks/usePerpPool';
import { usePriceFeed } from '@/hooks/usePriceFeed';
import { useToastStore } from '@/zustand/toastStore';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Info,
  RefreshCw,
  Plus,
  Minus
} from 'lucide-react';

export default function LiquidityPage() {
  const { 
    addLiquidity, 
    removeLiquidity, 
    metrics, 
    isLoading: poolLoading,
    error: poolError 
  } = usePerpPool();
  const { funding } = usePriceFeed();
  const { addToast } = useToastStore();
  
  const [addAmount, setAddAmount] = useState<string>('');
  const [removeAmount, setRemoveAmount] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Mock user liquidity share (in production this would come from the contract)
  const userLiquidityShare = 0.05; // 5%
  const userLiquidityAmount = metrics?.tvl ? metrics.tvl * userLiquidityShare : 0;

  const handleAddLiquidity = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
      });
      return;
    }

    setIsAdding(true);
    try {
      await addLiquidity(amount);

      addToast({
        type: 'success',
        title: 'Liquidity Added',
        description: `Successfully added ${formatCurrency(amount)} to the pool`,
      });

      setAddAmount('');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Transaction Failed',
        description: error.message || 'Failed to add liquidity',
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveLiquidity = async () => {
    const amount = parseFloat(removeAmount);
    if (!amount || amount <= 0) {
      addToast({
        type: 'error',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount',
      });
      return;
    }

    if (amount > userLiquidityAmount) {
      addToast({
        type: 'error',
        title: 'Insufficient Liquidity',
        description: 'You cannot remove more than your available liquidity',
      });
      return;
    }

    setIsRemoving(true);
    try {
      await removeLiquidity(amount);

      addToast({
        type: 'success',
        title: 'Liquidity Removed',
        description: `Successfully removed ${formatCurrency(amount)} from the pool`,
      });

      setRemoveAmount('');
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Transaction Failed',
        description: error.message || 'Failed to remove liquidity',
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Calculate projected APR (simplified calculation)
  const projectedAPR = funding ? Math.abs(funding) * 365 * 24 * 100 : 0; // Convert to annual percentage

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Liquidity
          </h1>
          <p className="text-muted-foreground">
            Provide liquidity to earn fees from perpetual trading
          </p>
        </div>
        <Button
          {...({
            variant: "outline",
            size: "sm",
            onClick: () => window.location.reload(),
            disabled: poolLoading
          } as ButtonProps)}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${poolLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {poolError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Error: {poolError}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pool Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value Locked</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.tvl ? formatCurrency(metrics.tvl) : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              USDC in the pool
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Share</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(userLiquidityShare)}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(userLiquidityAmount)} USDC
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected APR</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(projectedAPR / 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current funding
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Liquidity Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Liquidity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Add Liquidity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="add-amount">Amount (USDC)</Label>
              <Input
                id="add-amount"
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Enter amount to add"
                min="1"
                step="0.01"
              />
            </div>

            {addAmount && parseFloat(addAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your new share:</span>
                  <span className="font-medium">
                    {formatPercentage(
                      (userLiquidityAmount + parseFloat(addAmount)) / 
                      ((metrics?.tvl || 0) + parseFloat(addAmount))
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total position:</span>
                  <span className="font-medium">
                    {formatCurrency(userLiquidityAmount + parseFloat(addAmount))}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleAddLiquidity}
              disabled={!addAmount || parseFloat(addAmount) <= 0 || isAdding || poolLoading}
              className="w-full"
            >
              {isAdding ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding Liquidity...
                </div>
              ) : (
                'Add Liquidity'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Remove Liquidity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-red-600" />
              Remove Liquidity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="remove-amount">Amount (USDC)</Label>
              <Input
                id="remove-amount"
                type="number"
                value={removeAmount}
                onChange={(e) => setRemoveAmount(e.target.value)}
                placeholder="Enter amount to remove"
                min="1"
                max={userLiquidityAmount}
                step="0.01"
              />
            </div>

            {removeAmount && parseFloat(removeAmount) > 0 && (
              <div className="p-3 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Your new share:</span>
                  <span className="font-medium">
                    {formatPercentage(
                      (userLiquidityAmount - parseFloat(removeAmount)) / 
                      ((metrics?.tvl || 0) - parseFloat(removeAmount))
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Remaining position:</span>
                  <span className="font-medium">
                    {formatCurrency(userLiquidityAmount - parseFloat(removeAmount))}
                  </span>
                </div>
              </div>
            )}

            <Button
              {...({
                onClick: handleRemoveLiquidity,
                disabled: !removeAmount || parseFloat(removeAmount) <= 0 || isRemoving || poolLoading,
                variant: "destructive",
                className: "w-full"
              } as ButtonProps)}
            >
              {isRemoving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Removing Liquidity...
                </div>
              ) : (
                'Remove Liquidity'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* APR Warning */}
      {projectedAPR < 1 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Low APR Warning
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Current projected APR is below 1%. Consider the risks before providing liquidity.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              How Liquidity Works
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">Earn Trading Fees</h4>
              <p className="text-muted-foreground">
                Receive a portion of trading fees generated by perpetual swaps
              </p>
            </div>
            <div>
              <h4 className="font-medium">Funding Rate Revenue</h4>
              <p className="text-muted-foreground">
                Earn from funding rate payments between long and short positions
              </p>
            </div>
            <div>
              <h4 className="font-medium">Proportional Rewards</h4>
              <p className="text-muted-foreground">
                Your rewards are proportional to your share of the total liquidity
              </p>
            </div>
            <div>
              <h4 className="font-medium">Flexible Withdrawal</h4>
              <p className="text-muted-foreground">
                Withdraw your liquidity at any time (subject to available balance)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risks & Considerations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">Impermanent Loss</h4>
              <p className="text-muted-foreground">
                Price volatility may affect your liquidity value
              </p>
            </div>
            <div>
              <h4 className="font-medium">Smart Contract Risk</h4>
              <p className="text-muted-foreground">
                Your funds are subject to smart contract risks
              </p>
            </div>
            <div>
              <h4 className="font-medium">Market Risk</h4>
              <p className="text-muted-foreground">
                Low trading activity may result in lower returns
              </p>
            </div>
            <div>
              <h4 className="font-medium">Regulatory Risk</h4>
              <p className="text-muted-foreground">
                Regulatory changes may affect the platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
