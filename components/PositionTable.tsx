'use client';

import React from 'react';
import { Position } from '@/types';
import { formatCurrency, formatPercentage, getPnLColor, formatAddress } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, X, Clock } from 'lucide-react';

interface PositionTableProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const PositionTable: React.FC<PositionTableProps> = ({
  positions,
  onClosePosition,
  isLoading = false,
  className = '',
}) => {
  if (positions.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No open positions</p>
            <p className="text-sm text-muted-foreground">
              Open a position to start trading
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Open Positions ({positions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position.id}
              className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {position.isLong ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium">
                    {position.isLong ? 'Long' : 'Short'} {position.leverage}x
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onClosePosition(position.id)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-1" />
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Size</p>
                  <p className="font-medium">{formatCurrency(position.size)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entry Price</p>
                  <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Price</p>
                  <p className="font-medium">{formatCurrency(position.currentPrice)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">PnL</p>
                  <p className={`font-medium ${getPnLColor(position.pnl)}`}>
                    {formatCurrency(Math.abs(position.pnl))}
                    {position.pnl > 0 ? ' +' : position.pnl < 0 ? ' -' : ''}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    Opened {new Date(position.timestamp).toLocaleString()}
                  </span>
                </div>
                <div>
                  ID: {formatAddress(position.id, 8)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
