'use client';

import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types';
import { formatCurrency, formatPercentage, formatAddress } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Medal, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Users,
  Award,
  Target
} from 'lucide-react';

// Mock leaderboard data
const generateMockLeaderboard = (): LeaderboardEntry[] => {
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 0; i < 20; i++) {
    const pnl = (Math.random() - 0.3) * 10000; // Bias towards positive PnL
    const pnlPercent = (Math.random() - 0.2) * 200; // Bias towards positive %
    const tradesCount = Math.floor(Math.random() * 100) + 1;
    const totalVolume = Math.random() * 1000000;
    
    entries.push({
      rank: i + 1,
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      ensName: Math.random() > 0.7 ? `trader${i + 1}.doma` : undefined,
      pnl24h: pnl,
      pnl24hPercent: pnlPercent,
      tradesCount,
      totalVolume,
    });
  }
  
  // Sort by PnL
  return entries.sort((a, b) => b.pnl24h - a.pnl24h).map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = generateMockLeaderboard();
      setLeaderboard(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
    
    // Auto-refresh every 20 seconds
    const interval = setInterval(loadLeaderboard, 20000);
    return () => clearInterval(interval);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          rank === 1 ? 'bg-yellow-100 text-yellow-600' :
          rank === 2 ? 'bg-gray-100 text-gray-600' :
          'bg-amber-100 text-amber-600'
        }`}>
          {getRankIcon(rank)}
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
        {getRankIcon(rank)}
      </div>
    );
  };

  const topTrader = leaderboard[0];
  const totalTraders = leaderboard.length;
  const totalVolume = leaderboard.reduce((sum, entry) => sum + entry.totalVolume, 0);
  const avgPnL = leaderboard.reduce((sum, entry) => sum + entry.pnl24h, 0) / totalTraders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top traders by 24h PnL performance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadLeaderboard}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Trader</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topTrader ? formatCurrency(topTrader.pnl24h) : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">
              {topTrader?.ensName || formatAddress(topTrader?.address || '', 8)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Traders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTraders}</div>
            <p className="text-xs text-muted-foreground">
              Active in last 24h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalVolume)}
            </div>
            <p className="text-xs text-muted-foreground">
              24h trading volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average PnL</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgPnL)}
            </div>
            <p className="text-xs text-muted-foreground">
              Mean 24h performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top 20 Traders</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-4">
                  <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                  </div>
                  <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div
                  key={entry.address}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {/* Rank */}
                  {getRankBadge(entry.rank)}

                  {/* Trader Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium truncate">
                        {entry.ensName || formatAddress(entry.address, 8)}
                      </p>
                      {entry.ensName && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          ENS
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {entry.tradesCount} trades • {formatCurrency(entry.totalVolume)} volume
                    </p>
                  </div>

                  {/* PnL */}
                  <div className="text-right">
                    <div className={`font-medium ${
                      entry.pnl24h > 0 ? 'text-green-600' : 
                      entry.pnl24h < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {entry.pnl24h > 0 ? '+' : ''}{formatCurrency(entry.pnl24h)}
                    </div>
                    <div className={`text-sm ${
                      entry.pnl24hPercent > 0 ? 'text-green-600' : 
                      entry.pnl24hPercent < 0 ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {entry.pnl24hPercent > 0 ? '+' : ''}{formatPercentage(entry.pnl24hPercent / 100)}
                    </div>
                  </div>

                  {/* Trend Icon */}
                  <div className="flex-shrink-0">
                    {entry.pnl24h > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : entry.pnl24h < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>How Rankings Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">24h PnL</h4>
              <p className="text-muted-foreground">
                Rankings are based on realized and unrealized PnL over the last 24 hours
              </p>
            </div>
            <div>
              <h4 className="font-medium">Trading Activity</h4>
              <p className="text-muted-foreground">
                Only traders with at least one trade in the last 24h are included
              </p>
            </div>
            <div>
              <h4 className="font-medium">Real-time Updates</h4>
              <p className="text-muted-foreground">
                Rankings update automatically every 20 seconds
              </p>
            </div>
            <div>
              <h4 className="font-medium">ENS Support</h4>
              <p className="text-muted-foreground">
                Traders with ENS names are displayed with their domain names
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rewards & Recognition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium">Top 3 Badges</h4>
              <p className="text-muted-foreground">
                Special badges for the top 3 traders each day
              </p>
            </div>
            <div>
              <h4 className="font-medium">Trading Fees</h4>
              <p className="text-muted-foreground">
                All traders pay standard trading fees regardless of ranking
              </p>
            </div>
            <div>
              <h4 className="font-medium">Community Recognition</h4>
              <p className="text-muted-foreground">
                Top traders gain recognition in the DomainETF community
              </p>
            </div>
            <div>
              <h4 className="font-medium">Historical Performance</h4>
              <p className="text-muted-foreground">
                Track your performance over time and improve your ranking
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
