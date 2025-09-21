'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { USDCFaucet } from '@/components/USDCFaucet';
import { 
  ArrowRight, 
  Zap, 
  Shield, 
  Globe, 
  TrendingUp, 
  Users, 
  Lock, 
  Star,
  ChevronRight,
  Play,
  CheckCircle,
  Sparkles,
  Brain,
  Network,
  Coins,
  BarChart3,
  Target,
  Gamepad2,
  Smartphone,
  Bell,
  Download,
  Trophy,
  Award,
  Crown,
  Medal,
  Gift,
  RefreshCw,
  Wifi,
  WifiOff,
  HelpCircle,
  Settings,
  Activity,
  PieChart,
  TrendingDown,
  DollarSign,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Neural Network Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-40 w-3 h-3 bg-cyan-400 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-3000"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Next-Generation Domain Trading Platform
              </Badge>
              
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent leading-tight">
                DomainETF
                <span className="block text-4xl md:text-6xl text-purple-300">Lite</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                The first decentralized perpetual trading platform for domain names with PWA support, 
                advanced analytics, gamification, and real-time trading. Trade, tokenize, and fractionalize 
                domains with up to 50x leverage on the Doma Protocol.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/trade">
                <Button  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Start Trading
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/domainfi">
                <Button   className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                  <Globe className="w-5 h-5 mr-2" />
                  Explore DomainFi
                </Button>
              </Link>

              <Link href="/analytics">
                <Button   className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* USDC Faucet Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get Started with USDC
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Need USDC to start trading? Get test tokens from our faucet to try out the platform
            </p>
          </div>
          <div className="flex justify-center">
            <USDCFaucet />
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Revolutionary Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Built on cutting-edge blockchain technology with advanced trading capabilities, PWA support, 
              real-time analytics, and gamification features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Perpetual Trading */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Perpetual Trading</h3>
                <p className="text-gray-300 leading-relaxed">
                  Trade domain names with up to 50x leverage. Long or short positions with advanced risk management and automated liquidations.
                </p>
              </CardContent>
            </Card>

            {/* DomainFi Integration */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">DomainFi Integration</h3>
                <p className="text-gray-300 leading-relaxed">
                  Tokenize, fractionalize, and trade specific domain rights. Create synthetic tokens for DNS, subdomain, transfer, and renewal rights.
                </p>
              </CardContent>
            </Card>

            {/* Cross-Chain Support */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Cross-Chain Support</h3>
                <p className="text-gray-300 leading-relaxed">
                  Built on Doma Testnet with seamless integration to major Web3 ecosystems. Access 400M+ crypto wallet users.
                </p>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Real-time price feeds, funding rates, and market analytics. Track your portfolio performance with detailed insights.
                </p>
              </CardContent>
            </Card>

            {/* Liquidity Mining */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Liquidity Mining</h3>
                <p className="text-gray-300 leading-relaxed">
                  Earn rewards by providing liquidity to the trading pool. Competitive APY with automated yield optimization.
                </p>
              </CardContent>
            </Card>

            {/* Security First */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Security First</h3>
                <p className="text-gray-300 leading-relaxed">
                  Audited smart contracts with multi-signature security. Non-custodial trading with full user control over assets.
                </p>
              </CardContent>
            </Card>

            {/* PWA Support */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">PWA Support</h3>
                <p className="text-gray-300 leading-relaxed">
                  Progressive Web App with offline functionality, push notifications, and native app-like experience on mobile devices.
                </p>
              </CardContent>
            </Card>

            {/* Advanced Analytics */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Comprehensive trading analytics with performance insights, risk analysis, and behavioral metrics for informed decision making.
                </p>
              </CardContent>
            </Card>

            {/* Gamification */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Gamification</h3>
                <p className="text-gray-300 leading-relaxed">
                  Level up your trading skills with achievements, quests, leaderboards, and rewards. Make trading fun and engaging.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Advanced Features Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Cutting-edge features that set DomainETF Lite apart from traditional trading platforms
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* PWA Features */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Progressive Web App</h3>
                    <p className="text-gray-300">Native app experience on any device</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Install on home screen</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Offline functionality</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Push notifications</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-green-400" />
                    <span className="text-gray-300">Auto-updates</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analytics Features */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Advanced Analytics</h3>
                    <p className="text-gray-300">Comprehensive trading insights</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Performance metrics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Risk analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PieChart className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Behavioral insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    <span className="text-gray-300">Real-time monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gamification Features */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                    <Gamepad2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Gamification</h3>
                    <p className="text-gray-300">Make trading fun and engaging</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Achievement system</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Daily quests</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Leaderboards</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-300">Rewards & badges</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tutorial System */}
            <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <HelpCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Interactive Tutorial</h3>
                    <p className="text-gray-300">Learn trading step by step</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Guided walkthrough</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Visual highlights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Customizable pace</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built on Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Leveraging the latest Web3 innovations, PWA technologies, and advanced analytics for optimal performance and security
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'Doma Protocol', icon: Brain, color: 'from-purple-500 to-blue-500' },
              { name: 'Next.js 15', icon: Zap, color: 'from-blue-500 to-cyan-500' },
              { name: 'Wagmi & Viem', icon: Network, color: 'from-green-500 to-blue-500' },
              { name: 'Tailwind CSS', icon: Sparkles, color: 'from-pink-500 to-purple-500' },
              { name: 'PWA', icon: Smartphone, color: 'from-emerald-500 to-teal-500' },
              { name: 'Socket.io', icon: Wifi, color: 'from-orange-500 to-red-500' }
            ].map((tech, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tech.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{tech.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Max Leverage', value: '50x', icon: TrendingUp },
              { label: 'Supported Domains', value: '362M+', icon: Globe },
              { label: 'PWA Features', value: '100%', icon: Smartphone },
              { label: 'Analytics Coverage', value: 'Real-time', icon: Target },
              { label: 'Gamification Levels', value: '6 Levels', icon: Trophy },
              { label: 'Security Score', value: 'A+', icon: Shield },
              { label: 'Uptime', value: '99.9%', icon: Activity },
              { label: 'Mobile Support', value: 'Full PWA', icon: Download }
            ].map((stat, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-md border-white/10 text-center group hover:bg-white/10 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-300">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Trade Domains?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the future of domain trading with PWA support, advanced analytics, and gamification. 
                Start with demo mode or connect your wallet to begin trading with real assets.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/trade">
                  <Button  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
                    <Play className="w-5 h-5 mr-2" />
                    Start Trading Now
                  </Button>
                </Link>
                
                <Link href="/liquidity">
                  <Button   className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                    <Coins className="w-5 h-5 mr-2" />
                    Provide Liquidity
                  </Button>
                </Link>

                <Link href="/analytics">
                  <Button   className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    View Analytics
                  </Button>
                </Link>

                <Link href="/gamification">
                  <Button   className="border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300">
                    <Gamepad2 className="w-5 h-5 mr-2" />
                    Start Gaming
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12 border-t border-white/10">
          <div className="text-center text-gray-400">
            <p className="mb-4">
              Built with ❤️ for the decentralized future of domain trading
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="https://start.doma.xyz" className="hover:text-purple-300 transition-colors">
                Doma Protocol
              </Link>
              <Link href="https://explorer-testnet.doma.xyz" className="hover:text-purple-300 transition-colors">
                Explorer
              </Link>
              <Link href="/leaderboard" className="hover:text-purple-300 transition-colors">
                Leaderboard
              </Link>
              <Link href="/analytics" className="hover:text-cyan-300 transition-colors">
                Analytics
              </Link>
              <Link href="/gamification" className="hover:text-yellow-300 transition-colors">
                Gamification
              </Link>
            </div>
            <div className="mt-6 text-sm text-gray-500">
              <p>PWA Ready • Real-time Analytics • Gamified Trading • Advanced Security</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
