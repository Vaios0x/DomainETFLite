'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDomaExplorer } from '@/hooks/useDomaExplorer';
import { DomaExplorerAdvanced } from './DomaExplorerAdvanced';
import { 
  Search, 
  ExternalLink, 
  Activity, 
  Database, 
  Network,
  TrendingUp,
  Clock,
  Hash,
  Users,
  BarChart3,
  FileText
} from 'lucide-react';

type ViewMode = 'basic' | 'advanced';

export const DomaExplorerIntegration: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('basic');

  if (viewMode === 'advanced') {
    return <DomaExplorerAdvanced />;
  }

  return (
    <div className="space-y-6">
      {/* Header con modo de vista */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Integración con Doma Explorer
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('basic')}
              >
                Básico
              </Button>
              <Button
                variant={viewMode !== 'basic' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('advanced' as ViewMode)}
              >
                Avanzado
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <div className="font-semibold">Conectado al Explorer</div>
                <div className="text-sm text-muted-foreground">
                  Acceso completo a las APIs de Blockscout del testnet
                </div>
              </div>
            </div>
            <Badge variant="default">Activo</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Información Básica */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              APIs Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant="outline">REST API</Badge>
              <Badge variant="outline">GraphQL</Badge>
              <Badge variant="outline">RPC API</Badge>
              <Badge variant="outline">ETH RPC</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>• Búsqueda de transacciones</div>
              <div>• Información de direcciones</div>
              <div>• Tracking de gas</div>
              <div>• Tokens ERC-20/721/1155</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              Enlaces Útiles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('https://explorer-testnet.doma.xyz/', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Explorer Principal
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('https://explorer-testnet.doma.xyz/api-docs', '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                API Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acción para cambiar a vista avanzada */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-lg font-semibold">¿Necesitas más funcionalidades?</h3>
              <p className="text-muted-foreground">
                Cambia a la vista avanzada para acceder a todas las APIs de Blockscout, 
                incluyendo tokens, transferencias, withdrawals, gas tracker y verificación de contratos.
              </p>
            </div>
            <Button 
              onClick={() => setViewMode('advanced' as ViewMode)}
              className="w-full md:w-auto"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Activar Vista Avanzada
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
