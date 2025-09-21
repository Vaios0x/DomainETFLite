'use client';

import React, { useState, useEffect } from 'react';
import { useDomaIntegration } from '@/hooks/useDomaIntegration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Globe, 
  Plus, 
  Scissors, 
  Coins, 
  TrendingUp, 
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DomainAsset, SyntheticTokenInfo } from '@/types';

interface DomainManagerProps {
  className?: string;
}

export function DomainManager({ className }: DomainManagerProps) {
  const {
    trackedDomains,
    activeSyntheticTokens,
    tokenizeDomain,
    fractionalizeDomain,
    createSyntheticToken,
    tradeSyntheticToken,
    getDomainAsset,
    getSyntheticTokenInfo,
    refreshData,
    isLoading,
    error
  } = useDomaIntegration();

  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [domainToTokenize, setDomainToTokenize] = useState<string>('');
  const [fractionalizeSupply, setFractionalizeSupply] = useState<string>('1000000');
  const [syntheticTokenType, setSyntheticTokenType] = useState<'DNS' | 'SUBDOMAIN' | 'TRANSFER' | 'RENEWAL'>('DNS');
  const [syntheticTokenSupply, setSyntheticTokenSupply] = useState<string>('100000');
  const [domainAssets, setDomainAssets] = useState<Map<string, DomainAsset>>(new Map());
  const [syntheticTokenInfos, setSyntheticTokenInfos] = useState<Map<string, SyntheticTokenInfo>>(new Map());

  // Load domain assets
  useEffect(() => {
    const loadDomainAssets = async () => {
      const assets = new Map<string, DomainAsset>();
      for (const domain of trackedDomains) {
        const asset = await getDomainAsset(domain);
        if (asset) {
          assets.set(domain, asset);
        }
      }
      setDomainAssets(assets);
    };

    if (trackedDomains.length > 0) {
      loadDomainAssets();
    }
  }, [trackedDomains, getDomainAsset]);

  // Load synthetic token infos
  useEffect(() => {
    const loadSyntheticTokenInfos = async () => {
      const infos = new Map<string, SyntheticTokenInfo>();
      for (const token of activeSyntheticTokens) {
        const info = await getSyntheticTokenInfo(token);
        if (info) {
          infos.set(token, info);
        }
      }
      setSyntheticTokenInfos(infos);
    };

    if (activeSyntheticTokens.length > 0) {
      loadSyntheticTokenInfos();
    }
  }, [activeSyntheticTokens, getSyntheticTokenInfo]);

  const handleTokenizeDomain = async () => {
    if (!domainToTokenize.trim()) return;
    
    try {
      await tokenizeDomain(domainToTokenize.trim());
      setDomainToTokenize('');
      await refreshData();
    } catch (err) {
      console.error('Error tokenizing domain:', err);
    }
  };

  const handleFractionalizeDomain = async () => {
    if (!selectedDomain || !fractionalizeSupply) return;
    
    try {
      const supply = parseInt(fractionalizeSupply);
      await fractionalizeDomain(selectedDomain, supply);
      setFractionalizeSupply('1000000');
      await refreshData();
    } catch (err) {
      console.error('Error fractionalizing domain:', err);
    }
  };

  const handleCreateSyntheticToken = async () => {
    if (!selectedDomain || !syntheticTokenSupply) return;
    
    try {
      const supply = parseInt(syntheticTokenSupply);
      await createSyntheticToken(selectedDomain, syntheticTokenType, supply);
      setSyntheticTokenSupply('100000');
      await refreshData();
    } catch (err) {
      console.error('Error creating synthetic token:', err);
    }
  };

  const handleTradeSyntheticToken = async (token: string, amount: string, isBuy: boolean) => {
    try {
      const amountNum = parseInt(amount);
      await tradeSyntheticToken(token, amountNum, isBuy);
      await refreshData();
    } catch (err) {
      console.error('Error trading synthetic token:', err);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Domain Manager</h2>
          <p className="text-muted-foreground">
            Manage domain tokenization and fractionalization through Doma Protocol
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </div>
      )}

      {/* Tokenize Domain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Tokenize Domain</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1">
              <Label htmlFor="domain-input">Domain Name</Label>
              <Input
                id="domain-input"
                placeholder="example.com"
                value={domainToTokenize}
                onChange={(e) => setDomainToTokenize(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleTokenizeDomain}
                disabled={isLoading || !domainToTokenize.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tokenize
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracked Domains */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Tracked Domains ({trackedDomains.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trackedDomains.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No domains tracked yet. Tokenize a domain to get started.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trackedDomains.map((domain) => {
                const asset = domainAssets.get(domain);
                return (
                  <div
                    key={domain}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      selectedDomain === domain 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    )}
                    onClick={() => setSelectedDomain(domain)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{domain}</h3>
                      {asset?.isActive && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {asset && (
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Price: ${(Number(asset.currentPrice) / 1e18).toFixed(2)}</p>
                        <p>Fractionalized: {asset.isFractionalized ? 'Yes' : 'No'}</p>
                        {asset.isFractionalized && (
                          <p>Supply: {asset.totalSupply.toLocaleString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Domain Actions */}
      {selectedDomain && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Fractionalize Domain */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="h-5 w-5" />
                <span>Fractionalize Domain</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fractionalize-supply">Total Supply</Label>
                <Input
                  id="fractionalize-supply"
                  type="number"
                  placeholder="1000000"
                  value={fractionalizeSupply}
                  onChange={(e) => setFractionalizeSupply(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleFractionalizeDomain}
                disabled={isLoading || !fractionalizeSupply}
                className="w-full"
              >
                <Scissors className="h-4 w-4 mr-2" />
                Fractionalize {selectedDomain}
              </Button>
            </CardContent>
          </Card>

          {/* Create Synthetic Token */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5" />
                <span>Create Synthetic Token</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="token-type">Token Type</Label>
                <select
                  id="token-type"
                  className="w-full p-2 border rounded-md"
                  value={syntheticTokenType}
                  onChange={(e) => setSyntheticTokenType(e.target.value as any)}
                >
                  <option value="DNS">DNS Management</option>
                  <option value="SUBDOMAIN">Subdomain Creation</option>
                  <option value="TRANSFER">Domain Transfer</option>
                  <option value="RENEWAL">Domain Renewal</option>
                </select>
              </div>
              <div>
                <Label htmlFor="synthetic-supply">Supply</Label>
                <Input
                  id="synthetic-supply"
                  type="number"
                  placeholder="100000"
                  value={syntheticTokenSupply}
                  onChange={(e) => setSyntheticTokenSupply(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleCreateSyntheticToken}
                disabled={isLoading || !syntheticTokenSupply}
                className="w-full"
              >
                <Coins className="h-4 w-4 mr-2" />
                Create {syntheticTokenType} Token
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Synthetic Tokens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Coins className="h-5 w-5" />
            <span>Active Synthetic Tokens ({activeSyntheticTokens.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeSyntheticTokens.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No synthetic tokens created yet.
            </p>
          ) : (
            <div className="space-y-4">
              {activeSyntheticTokens.map((token) => {
                const info = syntheticTokenInfos.get(token);
                return (
                  <div key={token} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{info?.domain || 'Unknown Domain'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {info?.tokenType || 'Unknown Type'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${info ? (Number(info.price) / 1e18).toFixed(4) : '0.0000'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Supply: {info?.totalSupply.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Amount"
                        className="flex-1"
                        id={`trade-amount-${token}`}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const amount = (document.getElementById(`trade-amount-${token}`) as HTMLInputElement)?.value;
                          if (amount) handleTradeSyntheticToken(token, amount, true);
                        }}
                      >
                        Buy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const amount = (document.getElementById(`trade-amount-${token}`) as HTMLInputElement)?.value;
                          if (amount) handleTradeSyntheticToken(token, amount, false);
                        }}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Doma Protocol Links */}
      <Card>
        <CardHeader>
          <CardTitle>Doma Protocol Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <Button variant="outline" asChild>
              <a
                href="https://docs.doma.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Documentation</span>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
