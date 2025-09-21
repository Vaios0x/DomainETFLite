'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TradeFormData } from '@/types';
import { formatCurrency, getEstimatedFillPrice, validateLeverage, validateSize } from '@/lib/utils';
import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface TradeFormProps {
  onSubmit: (data: TradeFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
  currentPrice: number;
  className?: string;
}

export const TradeForm: React.FC<TradeFormProps> = ({
  onSubmit,
  isLoading = false,
  disabled = false,
  currentPrice,
  className = '',
}) => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState<TradeFormData>({
    size: 100,
    leverage: 3,
    isLong: true,
  });
  const [estimatedFill, setEstimatedFill] = useState<number>(0);

  // Calculate estimated fill price when form data changes
  useEffect(() => {
    if (currentPrice > 0 && formData.size > 0) {
      const estimated = getEstimatedFillPrice(
        formData.size,
        formData.isLong,
        currentPrice,
        formData.leverage
      );
      setEstimatedFill(estimated);
    }
  }, [formData, currentPrice]);

  const handleInputChange = (field: keyof TradeFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!validateSize(formData.size)) {
      alert('Invalid size. Please enter a value between 1 and 1,000,000 USDC');
      return;
    }

    if (!validateLeverage(formData.leverage)) {
      alert('Invalid leverage. Please enter a value between 1 and 10x');
      return;
    }

    onSubmit(formData);
  };

  const isFormValid = isConnected && 
    validateSize(formData.size) && 
    validateLeverage(formData.leverage) && 
    !isLoading;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Open Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Position Direction */}
          <div className="space-y-2">
            <Label>Direction</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={formData.isLong ? "default" : "outline"}
                onClick={() => handleInputChange('isLong', true)}
                className="flex items-center gap-2"
                disabled={disabled}
              >
                <TrendingUp className="h-4 w-4" />
                Long
              </Button>
              <Button
                type="button"
                variant={!formData.isLong ? "default" : "outline"}
                onClick={() => handleInputChange('isLong', false)}
                className="flex items-center gap-2"
                disabled={disabled}
              >
                <TrendingDown className="h-4 w-4" />
                Short
              </Button>
            </div>
          </div>

          {/* Size Input */}
          <div className="space-y-2">
            <Label htmlFor="size">Size (USDC)</Label>
            <Input
              id="size"
              type="number"
              value={formData.size}
              onChange={(e) => handleInputChange('size', parseFloat(e.target.value) || 0)}
              placeholder="Enter position size"
              min="1"
              max="1000000"
              step="1"
              disabled={disabled}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground">
              Min: 1 USDC, Max: 1,000,000 USDC
            </p>
          </div>

          {/* Leverage Slider */}
          <div className="space-y-2">
            <Label htmlFor="leverage">
              Leverage: {formData.leverage}x
            </Label>
            <input
              id="leverage"
              type="range"
              min="1"
              max="10"
              value={formData.leverage}
              onChange={(e) => handleInputChange('leverage', parseInt(e.target.value))}
              disabled={disabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1x</span>
              <span>10x</span>
            </div>
          </div>

          {/* Position Summary */}
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Current Price:</span>
              <span className="font-medium">{formatCurrency(currentPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Est. Fill Price:</span>
              <span className="font-medium">{formatCurrency(estimatedFill)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Position Value:</span>
              <span className="font-medium">
                {formatCurrency(formData.size * formData.leverage)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Margin Required:</span>
              <span className="font-medium">{formatCurrency(formData.size)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || disabled}
            size="lg"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Opening Position...
              </div>
            ) : (
              `Open ${formData.isLong ? 'Long' : 'Short'} Position`
            )}
          </Button>

          {!isConnected && (
            <p className="text-sm text-center text-muted-foreground">
              Connect your wallet to start trading
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
