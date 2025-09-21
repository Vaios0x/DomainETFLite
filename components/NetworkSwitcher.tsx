'use client';

import React, { useState } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DOMA_CHAIN } from '@/lib/constants';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkSwitcherProps {
  className?: string;
}

export function NetworkSwitcher({ className }: NetworkSwitcherProps) {
  const { isConnected } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  const chainId = useChainId();
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  const handleSwitchToDoma = async () => {
    try {
      setIsAddingNetwork(true);
      await switchChain({ chainId: DOMA_CHAIN.id });
    } catch (err) {
      console.error('Error switching to Doma Testnet:', err);
      // If the network is not added, try to add it
      if (window.ethereum) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${DOMA_CHAIN.id.toString(16)}`,
              chainName: DOMA_CHAIN.name,
              nativeCurrency: DOMA_CHAIN.nativeCurrency,
              rpcUrls: DOMA_CHAIN.rpcUrls.default.http,
              blockExplorerUrls: [DOMA_CHAIN.blockExplorers.default.url],
            }],
          });
        } catch (addError) {
          console.error('Error adding Doma Testnet:', addError);
        }
      }
    } finally {
      setIsAddingNetwork(false);
    }
  };

  const isDomaConnected = chainId === DOMA_CHAIN.id;

  if (!isConnected) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <span>Conectar Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Conecta tu wallet para cambiar de red
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <RefreshCw className="h-5 w-5 text-muted-foreground" />
          <span>Cambiar Red</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Doma Testnet */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-bold text-primary">D</span>
            </div>
            <div>
              <p className="font-medium">{DOMA_CHAIN.name}</p>
              <p className="text-xs text-muted-foreground">
                Chain ID: {DOMA_CHAIN.id}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isDomaConnected && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            <Button
              onClick={handleSwitchToDoma}
              disabled={isPending || isAddingNetwork}
              className={isDomaConnected ? "bg-secondary text-secondary-foreground" : ""}
            >
              {isPending || isAddingNetwork ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : isDomaConnected ? (
                "Conectado"
              ) : (
                "Conectar"
              )}
            </Button>
          </div>
        </div>


        {/* Error Display */}
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                Error al cambiar de red: {error.message}
              </p>
            </div>
          </div>
        )}

        {/* Network Info */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">
            <strong>Red actual:</strong> {isDomaConnected ? DOMA_CHAIN.name : 'Desconocida'}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Chain ID:</strong> {chainId}
          </p>
        </div>

        {/* Help Links */}
        <div className="flex space-x-2">
          <Button
            asChild
            className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <a
              href="https://start.doma.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Doma Testnet</span>
            </a>
          </Button>
          <Button
            asChild
            className="flex-1 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            <a
              href="https://explorer-testnet.doma.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>Explorador</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
