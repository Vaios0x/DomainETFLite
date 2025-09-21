'use client';

import React, { useState, useEffect } from 'react';
import { DomainManager } from '@/components/DomainManager';
import { DomaDomainsList } from '@/components/DomaDomainsList';
import { DomaAPIStatus } from '@/components/DomaAPIStatus';
import { DomaExplorerIntegration } from '@/components/DomaExplorerIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  Coins, 
  TrendingUp, 
  BarChart3,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function DomainFiPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'manager' | 'trading' | 'explorer'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'manager', label: 'Domain Manager', icon: Globe },
    { id: 'trading', label: 'Synthetic Trading', icon: TrendingUp },
    { id: 'explorer', label: 'Explorer Integration', icon: ExternalLink },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">DomainFi</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            The future of domain name financialization through Doma Protocol
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* DomainFi Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>What is DomainFi?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  DomainFi represents a new economic paradigm for the domain industry, addressing significant 
                  challenges in the current $340B+ domain ecosystem. Through Doma Protocol, domains become 
                  programmable, blockchain-based assets that can participate in the broader web3 financial ecosystem.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Trusted Domain Tokenization</h3>
                    <p className="text-sm text-muted-foreground">
                      Secure onramp for any Registrar or Registry to tokenize domains onto the blockchain 
                      while maintaining full compliance with ICANN regulations.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Composable Domain Rights</h3>
                    <p className="text-sm text-muted-foreground">
                      Split domains into synthetic tokens representing specific rights and permissions, 
                      enabling granular control over domain management capabilities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Doma Protocol API Status */}
            <DomaAPIStatus />

            {/* Doma Protocol Domains */}
            <DomaDomainsList />

            {/* Key Features */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Domain Tokenization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Convert traditional domains into blockchain-based assets while maintaining ICANN compliance.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('manager')}
                    className="w-full"
                  >
                    Start Tokenizing
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Coins className="h-5 w-5" />
                    <span>Domain Fractionalization</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Split domain ownership into fungible tokens, enabling partial ownership and improved liquidity.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('manager')}
                    className="w-full"
                  >
                    Fractionalize
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Synthetic Trading</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Trade synthetic tokens representing specific domain rights like DNS management or subdomain creation.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setActiveTab('trading')}
                    className="w-full"
                  >
                    Start Trading
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Doma Protocol Integration */}
            <Card>
              <CardHeader>
                <CardTitle>Doma Protocol Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-semibold mb-2">Protocol Components</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Domain Tokenization Module</li>
                      <li>• Domain Fractionalization Module</li>
                      <li>• Compliance Module</li>
                      <li>• Bridging Module</li>
                      <li>• Custodian Module</li>
                      <li>• Composer Module</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">DomainFi Applications</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Instant-settlement secondary marketplaces</li>
                      <li>• Fractional domain ownership structures</li>
                      <li>• Domain-collateralized lending platforms</li>
                      <li>• Automated domain rental and leasing</li>
                      <li>• On-chain domain parking yield generation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button asChild>
                    <Link href="/trade" className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trade Domain Perpetuals</span>
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/liquidity" className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4" />
                      <span>Provide Liquidity</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'manager' && (
          <DomainManager />
        )}

        {activeTab === 'trading' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Synthetic Token Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Trade synthetic tokens representing specific domain rights. Each token type grants different 
                  permissions and has its own market dynamics.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">DNS Management Tokens</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Control DNS settings and name server configuration.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Trade DNS Tokens
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Subdomain Creation Tokens</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Create and manage subdomains under the main domain.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Trade Subdomain Tokens
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coming Soon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced synthetic token trading features are under development. 
                  Use the Domain Manager to create and manage synthetic tokens for now.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'explorer' && (
          <DomaExplorerIntegration />
        )}

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild>
              <a
                href="https://docs.doma.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Doma Documentation</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://start.doma.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Doma Testnet</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://discord.com/invite/doma"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Doma Discord</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
