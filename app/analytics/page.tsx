'use client';

import React, { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAccount } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Info,
  RefreshCw,
  Download,
  Share2,
  Settings
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function AnalyticsPage() {
  const { address, isConnected } = useAccount();
  const {
    userAnalytics,
    marketMetrics,
    isLoading,
    error,
    performanceInsights,
    riskRecommendations,
    refreshAnalytics,
  } = useAnalytics();

  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'risk' | 'market'>('overview');

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Connect your wallet to view your trading analytics and performance metrics.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Analytics</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'risk', label: 'Risk Analysis', icon: Target },
    { id: 'market', label: 'Market Data', icon: TrendingDown },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Advanced trading analytics and performance insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={refreshAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.tradingMetrics.totalVolume 
                    ? formatCurrency(userAnalytics.tradingMetrics.totalVolume)
                    : '$0'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time trading volume
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.tradingMetrics.winRate 
                    ? formatPercentage(userAnalytics.tradingMetrics.winRate / 100)
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Successful trades
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.tradingMetrics.sharpeRatio 
                    ? userAnalytics.tradingMetrics.sharpeRatio.toFixed(2)
                    : '0.00'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Risk-adjusted returns
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userAnalytics?.tradingMetrics.maxDrawdown 
                    ? formatPercentage(userAnalytics.tradingMetrics.maxDrawdown)
                    : '0%'
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Largest peak-to-trough decline
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceInsights.length > 0 ? (
                  performanceInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        insight.type === 'success' 
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                          : insight.type === 'warning'
                          ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                          : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {insight.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
                        {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />}
                        {insight.type === 'info' && <Info className="h-4 w-4 text-blue-500 mt-0.5" />}
                        <div>
                          <h4 className="font-medium">{insight.title}</h4>
                          <p className="text-sm text-muted-foreground">{insight.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No insights available yet. Start trading to see your performance insights!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && userAnalytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trading Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Trading Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Trades</span>
                  <span className="font-medium">{userAnalytics.tradingMetrics.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average PnL</span>
                  <span className={`font-medium ${
                    userAnalytics.tradingMetrics.averagePnL > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(userAnalytics.tradingMetrics.averagePnL)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Best Trade</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(userAnalytics.tradingMetrics.bestTrade)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Worst Trade</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(userAnalytics.tradingMetrics.worstTrade)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Profit Factor</span>
                  <span className="font-medium">
                    {userAnalytics.tradingMetrics.profitFactor.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Max Leverage Used</span>
                  <span className="font-medium">{userAnalytics.riskMetrics.maxLeverageUsed}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average Position Size</span>
                  <span className="font-medium">{formatCurrency(userAnalytics.riskMetrics.averagePositionSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Diversification Score</span>
                  <span className="font-medium">{userAnalytics.riskMetrics.diversificationScore.toFixed(0)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Risk Score</span>
                  <span className={`font-medium ${
                    userAnalytics.riskMetrics.riskScore > 70 ? 'text-red-600' :
                    userAnalytics.riskMetrics.riskScore > 50 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {userAnalytics.riskMetrics.riskScore.toFixed(0)}/100
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Behavior Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Behavior</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{userAnalytics.behaviorMetrics.averageSessionDuration}</div>
                  <div className="text-sm text-muted-foreground">Avg Session (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userAnalytics.behaviorMetrics.tradesPerSession.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">Trades/Session</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{userAnalytics.behaviorMetrics.mostActiveDay}</div>
                  <div className="text-sm text-muted-foreground">Most Active Day</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {userAnalytics.behaviorMetrics.preferredTradingHours.join(', ')}
                  </div>
                  <div className="text-sm text-muted-foreground">Peak Hours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Analysis Tab */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          {/* Risk Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Risk Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskRecommendations.length > 0 ? (
                  riskRecommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        recommendation.priority === 'high'
                          ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                          : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                          recommendation.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{recommendation.title}</h4>
                            <Badge variant="outline" className={
                              recommendation.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                            }>
                              {recommendation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No risk recommendations at this time. Keep up the good work!</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Market Data Tab */}
      {activeTab === 'market' && marketMetrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total TVL</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(marketMetrics.totalTvl)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total value locked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Interest</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(marketMetrics.totalOpenInterest)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active positions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(marketMetrics.volume24h)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Trading volume
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Leverage</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketMetrics.averageLeverage.toFixed(1)}x
                </div>
                <p className="text-xs text-muted-foreground">
                  Market average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Traders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketMetrics.activeTraders.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Liquidations</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {marketMetrics.liquidations24h}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last 24 hours
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
