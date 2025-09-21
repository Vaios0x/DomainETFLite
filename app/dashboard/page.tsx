'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DomaAPIStatus } from '@/components/DomaAPIStatus';
import { DomaDomainsList } from '@/components/DomaDomainsList';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Users, 
  BarChart3,
  PieChart,
  Target,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Eye,
  Settings,
  Bell,
  Zap,
  Globe,
  Coins,
  Trophy,
  Gamepad2,
  Smartphone,
  Brain,
  Network
} from 'lucide-react';
import Link from 'next/link';
import { usePerpPool } from '@/hooks/usePerpPool';
import { usePriceFeed } from '@/hooks/usePriceFeed';
import { usePositionsStore } from '@/zustand/positionsStore';

export default function DashboardPage() {
  const { metrics: poolMetrics, isLoading: poolLoading } = usePerpPool();
  const { price: currentPrice, funding: fundingRate } = usePriceFeed();
  const { positions } = usePositionsStore();

  // Calculate portfolio metrics
  const totalPositions = positions.length;
  const totalPnL = positions.reduce((sum, pos) => sum + (pos.unrealizedPnl || 0), 0);
  const winningPositions = positions.filter(pos => (pos.unrealizedPnl || 0) > 0).length;
  const winRate = totalPositions > 0 ? (winningPositions / totalPositions) * 100 : 0;

  // Mock data for additional metrics
  const mockMetrics = {
    totalVolume: 1250000,
    totalTrades: 342,
    avgTradeSize: 3655,
    maxDrawdown: -12.5,
    sharpeRatio: 1.8,
    activeUsers: 1247,
    newUsersToday: 23,
    retentionRate: 78.5
  };

  const quickActions = [
    { title: 'Open Position', description: 'Start trading domains', href: '/trade', icon: TrendingUp, color: 'from-purple-500 to-blue-500' },
    { title: 'Add Liquidity', description: 'Earn rewards', href: '/liquidity', icon: Coins, color: 'from-green-500 to-emerald-500' },
    { title: 'View Analytics', description: 'Track performance', href: '/analytics', icon: BarChart3, color: 'from-indigo-500 to-purple-500' },
    { title: 'Gamification', description: 'Level up trading', href: '/gamification', icon: Gamepad2, color: 'from-yellow-500 to-orange-500' }
  ];

  const recentActivity = [
    { type: 'trade', action: 'Opened Long Position', amount: '+$2,500', time: '2 min ago', status: 'success' },
    { type: 'liquidity', action: 'Added Liquidity', amount: '+$5,000', time: '15 min ago', status: 'success' },
    { type: 'trade', action: 'Closed Position', amount: '+$1,200', time: '1 hour ago', status: 'success' },
    { type: 'reward', action: 'Achievement Unlocked', amount: 'Trading Master', time: '2 hours ago', status: 'info' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300">Welcome back! Here's your trading overview</p>
          </div>
          <div className="flex gap-3 mt-4 lg:mt-0">
            <Button className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button className="border-white/20 text-white hover:bg-white/10 bg-transparent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Portfolio Value</p>
                  <p className="text-2xl font-bold text-white">${(poolMetrics?.tvl || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-sm text-green-400">+12.5%</span>
                <span className="text-sm text-gray-400 ml-2">24h</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Unrealized PnL</p>
                  <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${totalPnL.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                {totalPnL >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                )}
                <span className={`text-sm ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPnL >= 0 ? '+' : ''}{((totalPnL / 10000) * 100).toFixed(2)}%
                </span>
                <span className="text-sm text-gray-400 ml-2">24h</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Active Positions</p>
                  <p className="text-2xl font-bold text-white">{totalPositions}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-400">Win Rate: {winRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Current Price</p>
                  <p className="text-2xl font-bold text-white">${currentPrice?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-400">Funding: {fundingRate?.toFixed(4) || '0.0000'}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 backdrop-blur-md border-white/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{action.title}</h3>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Platform Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Volume</span>
                  <span className="text-white font-semibold">${mockMetrics.totalVolume.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Users</span>
                  <span className="text-white font-semibold">{mockMetrics.activeUsers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">New Users Today</span>
                  <span className="text-white font-semibold">{mockMetrics.newUsersToday}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Retention Rate</span>
                  <span className="text-white font-semibold">{mockMetrics.retentionRate}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doma Protocol Integration */}
          <div className="col-span-full space-y-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Doma Protocol Integration</h2>
              <p className="text-gray-300">Real-time data from the Doma Protocol ecosystem</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* API Status */}
              <DomaAPIStatus />
              
              {/* Domains List */}
              <DomaDomainsList />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 ${
                          activity.status === 'success' ? 'bg-green-500/20' :
                          activity.status === 'error' ? 'bg-red-500/20' :
                          'bg-blue-500/20'
                        }`}>
                          {activity.type === 'trade' && <TrendingUp className="w-5 h-5 text-white" />}
                          {activity.type === 'liquidity' && <Coins className="w-5 h-5 text-white" />}
                          {activity.type === 'reward' && <Trophy className="w-5 h-5 text-white" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          activity.status === 'success' ? 'text-green-400' :
                          activity.status === 'error' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          {activity.amount}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <BarChart3 className="w-8 h-8 text-purple-300" />
                    </div>
                    <p className="text-2xl font-bold text-white">{mockMetrics.totalTrades}</p>
                    <p className="text-sm text-gray-400">Total Trades</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <DollarSign className="w-8 h-8 text-green-300" />
                    </div>
                    <p className="text-2xl font-bold text-white">${mockMetrics.avgTradeSize.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Avg Trade Size</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <TrendingDown className="w-8 h-8 text-red-300" />
                    </div>
                    <p className="text-2xl font-bold text-white">{mockMetrics.maxDrawdown}%</p>
                    <p className="text-sm text-gray-400">Max Drawdown</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-8 h-8 text-yellow-300" />
                    </div>
                    <p className="text-2xl font-bold text-white">{mockMetrics.sharpeRatio}</p>
                    <p className="text-sm text-gray-400">Sharpe Ratio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
