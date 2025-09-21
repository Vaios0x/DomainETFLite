'use client';

import React from 'react';
import { USDCFaucet } from '@/components/USDCFaucet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, ExternalLink, Info } from 'lucide-react';

export default function FaucetPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center justify-center gap-2">
          <Coins className="h-8 w-8" />
          Faucet USDC
        </h1>
        <p className="text-muted-foreground">
          Obtén USDC de prueba para el hackathon de Doma Protocol
        </p>
      </div>

      {/* Main Faucet Component */}
      <div className="flex justify-center">
        <USDCFaucet />
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Cómo usar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Cómo usar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Conecta tu wallet a Doma Testnet</li>
              <li>Haz clic en "Solicitar 100 USDC"</li>
              <li>Confirma la transacción</li>
              <li>Espera la confirmación</li>
              <li>¡Listo para tradear!</li>
            </ol>
          </CardContent>
        </Card>

        {/* Información importante */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Información Importante
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm space-y-1">
              <p><strong>Red:</strong> Doma Testnet</p>
              <p><strong>Token:</strong> USDC de prueba</p>
              <p><strong>Límite:</strong> 100 USDC por solicitud</p>
              <p><strong>Cooldown:</strong> 24 horas</p>
              <p><strong>Propósito:</strong> Solo para desarrollo y pruebas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enlaces útiles */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Enlaces Útiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://omnihub.xyz/faucet/doma-testnet"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <div>
                <p className="font-medium">Faucet Oficial</p>
                <p className="text-sm text-muted-foreground">OmniHub Faucet</p>
              </div>
            </a>

            <a
              href="https://docs.doma.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <div>
                <p className="font-medium">Documentación</p>
                <p className="text-sm text-muted-foreground">Doma Protocol Docs</p>
              </div>
            </a>

            <a
              href="https://explorer-testnet.doma.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-muted transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <div>
                <p className="font-medium">Explorer</p>
                <p className="text-sm text-muted-foreground">Doma Testnet Explorer</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
