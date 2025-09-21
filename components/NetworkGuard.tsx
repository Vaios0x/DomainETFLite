'use client';

import React, { useEffect, useState } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DOMA_CHAIN } from '@/lib/constants';
import { AlertCircle, CheckCircle, ExternalLink, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetworkGuardProps {
  children: React.ReactNode;
}

export function NetworkGuard({ children }: NetworkGuardProps) {
  const { isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();
  const chainId = useChainId();
  const [showWarning, setShowWarning] = useState(false);

  const isDomaConnected = chainId === DOMA_CHAIN.id;
  const isWrongNetwork = isConnected && !isDomaConnected;

  useEffect(() => {
    setShowWarning(isWrongNetwork);
  }, [isWrongNetwork]);

  const handleSwitchToDoma = async () => {
    try {
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
    }
  };

  const handleDisconnect = () => {
    setShowWarning(false);
  };

  if (!isConnected) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Network Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Red Incorrecta
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">
                  <strong>Red incorrecta detectada.</strong> Esta aplicación requiere Doma Testnet para funcionar correctamente.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
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
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-destructive">!</span>
                    </div>
                    <div>
                      <p className="font-medium">Red Actual</p>
                      <p className="text-xs text-muted-foreground">
                        Chain ID: {chainId}
                      </p>
                    </div>
                  </div>
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSwitchToDoma}
                  disabled={isPending}
                  className="flex-1"
                >
                  {isPending ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Cambiar a Doma Testnet
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDisconnect}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cerrar
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                <p>¿Necesitas ayuda? Visita la documentación de Doma Protocol</p>
                <Button
                  variant="link"
                  size="sm"
                  asChild
                  className="h-auto p-0 text-xs"
                >
                  <a
                    href="https://docs.doma.xyz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Documentación
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      {children}
    </>
  );
}
