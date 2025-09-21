'use client';

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastStore } from '@/zustand/toastStore';
import { Coins, ExternalLink, Copy, Check } from 'lucide-react';

// Contrato del faucet de USDC en Doma Testnet
const USDC_FAUCET_CONTRACT = {
  address: '0x...' as `0x${string}`, // Dirección del contrato faucet
  abi: [
    {
      "name": "requestTokens",
      "type": "function",
      "stateMutability": "nonpayable",
      "inputs": [],
      "outputs": []
    },
    {
      "name": "getUserBalance",
      "type": "function",
      "stateMutability": "view",
      "inputs": [{"name": "user", "type": "address"}],
      "outputs": [{"name": "", "type": "uint256"}]
    }
  ] as const
};

export const USDCFaucet: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { addToast } = useToastStore();
  const [isRequesting, setIsRequesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleRequestTokens = async () => {
    if (!isConnected) {
      addToast({
        type: 'error',
        title: 'Wallet no conectada',
        description: 'Conecta tu wallet para solicitar USDC de prueba'
      });
      return;
    }

    try {
      setIsRequesting(true);
      
      await writeContract({
        ...USDC_FAUCET_CONTRACT,
        functionName: 'requestTokens',
      });

      addToast({
        type: 'success',
        title: 'Solicitud enviada',
        description: 'Transacción enviada al faucet de USDC'
      });
    } catch (err) {
      console.error('Error requesting tokens:', err);
      addToast({
        type: 'error',
        title: 'Error',
        description: 'No se pudo solicitar USDC de prueba'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToast({
        type: 'success',
        title: 'Dirección copiada',
        description: 'Dirección de wallet copiada al portapapeles'
      });
    }
  };

  const openFaucetWebsite = () => {
    window.open('https://omnihub.xyz/faucet/doma-testnet', '_blank');
  };

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Faucet USDC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Conecta tu wallet para obtener USDC de prueba
          </p>
          <Button className="w-full" disabled>
            Conectar Wallet Primero
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Faucet USDC
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dirección del usuario */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tu dirección:</label>
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            <code className="text-xs flex-1 truncate">
              {address}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-6 w-6 p-0"
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Botón para solicitar tokens */}
        <Button
          onClick={handleRequestTokens}
          disabled={isPending || isConfirming || isRequesting}
          className="w-full"
        >
          {isPending || isConfirming ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Procesando...
            </>
          ) : (
            <>
              <Coins className="h-4 w-4 mr-2" />
              Solicitar 100 USDC
            </>
          )}
        </Button>

        {/* Estado de la transacción */}
        {isSuccess && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ USDC recibido exitosamente
            </p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">
              ❌ Error: {error.message}
            </p>
          </div>
        )}

        {/* Enlace al faucet web */}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            También puedes usar el faucet web oficial:
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={openFaucetWebsite}
            className="w-full"
          >
            <ExternalLink className="h-3 w-3 mr-2" />
            Abrir Faucet Web
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Límite: 100 USDC por solicitud</p>
          <p>• Cooldown: 24 horas</p>
          <p>• Solo para Doma Testnet</p>
        </div>
      </CardContent>
    </Card>
  );
};
