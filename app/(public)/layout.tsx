'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from '@/components/ui/button';
import { NetworkSwitcher } from '@/components/NetworkSwitcher';
import { NetworkGuard } from '@/components/NetworkGuard';
import { useAppStore } from '@/zustand/appStore';
import { useHydration } from '@/hooks/useHydration';
import { ClientOnly } from '@/components/ClientOnly';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  TrendingUp, 
  DollarSign, 
  Trophy, 
  BarChart3,
  Globe,
  ExternalLink,
  Home,
  Target,
  Gamepad2,
  Coins
} from 'lucide-react';
import { cn } from '@/lib/utils';

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Trade', href: '/trade', icon: TrendingUp },
    { name: 'DomainFi', href: '/domainfi', icon: Globe },
    { name: 'Liquidity', href: '/liquidity', icon: DollarSign },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Analytics', href: '/analytics', icon: Target },
    { name: 'Gamification', href: '/gamification', icon: Gamepad2 },
    { name: 'Faucet', href: '/faucet', icon: Coins },
  ];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useAppStore();
  const isHydrated = useHydration();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <NetworkGuard>
      <div className="min-h-screen bg-background">
        {/* Navigation */}
        <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-6">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" prefetch={false} className="flex items-center space-x-1 sm:space-x-2">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-primary flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 sm:h-5 sm:w-5 text-primary-foreground" />
                </div>
                <span className="text-sm sm:text-lg lg:text-xl font-bold gradient-text">
                  <span className="hidden sm:inline">DomainETF</span>
                  <span className="sm:hidden">DETF</span>
                  <span className="block sm:inline sm:ml-1 text-xs sm:text-sm lg:text-base">Lite</span>
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md text-xs xl:text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="h-3 w-3 xl:h-4 xl:w-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Tablet Navigation - Show only icons */}
            <div className="hidden md:flex lg:hidden md:items-center md:space-x-1">
              {navigation.slice(0, 4).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                    title={item.name}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Theme Toggle */}
              <ClientOnly fallback={
                <Button
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              }>
                <Button
                  onClick={toggleTheme}
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-transparent hover:bg-muted"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-3 w-3 sm:h-4 sm:w-4" />
                  ) : (
                    <Moon className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </ClientOnly>


              {/* Wallet Connect - Responsive */}
              <div className="hidden sm:block">
                <ConnectButton />
              </div>

              {/* Mobile menu button */}
              <Button
                className="md:hidden bg-transparent hover:bg-muted h-8 w-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-2 gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      prefetch={false}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
              
              {/* Mobile Actions */}
              <div className="pt-2 border-t border-border">
                {/* Mobile Wallet Connect */}
                <div className="px-3">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">DomainETF Lite</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                The first decentralized perpetual trading platform for domain names. 
                Trade perpetual swaps on the top 100 most traded domains in Doma Protocol.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/trade" prefetch={false} className="hover:text-foreground">Trade</Link></li>
                <li><Link href="/liquidity" prefetch={false} className="hover:text-foreground">Liquidity</Link></li>
                <li><Link href="/leaderboard" prefetch={false} className="hover:text-foreground">Leaderboard</Link></li>
                <li><Link href="/analytics" prefetch={false} className="hover:text-foreground">Analytics</Link></li>
                <li><Link href="/gamification" prefetch={false} className="hover:text-foreground">Gamification</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://docs.doma.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground flex items-center space-x-1"
                  >
                    <span>Documentation</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://start.doma.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground flex items-center space-x-1"
                  >
                    <span>Doma Testnet</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://explorer-testnet.doma.xyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground flex items-center space-x-1"
                  >
                    <span>Explorer</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Network Switcher */}
          <div className="mt-8">
            <NetworkSwitcher />
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 DomainETF Lite. Built for the Doma Protocol hackathon.</p>
          </div>
        </div>
      </footer>
      </div>
    </NetworkGuard>
  );
}
