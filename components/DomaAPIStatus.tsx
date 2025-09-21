'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDomaAPI } from '@/hooks/useDomaAPI';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Key, 
  Shield,
  Activity,
  Database,
  BookOpen
} from 'lucide-react';

export const DomaAPIStatus: React.FC = () => {
  const { 
    config, 
    isConnected, 
    error, 
    checkConnection 
  } = useDomaAPI();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Estado de la API de Doma Protocol
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado de Conexión */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="font-semibold">
                API Conectada
              </div>
              <div className="text-sm text-muted-foreground">
                Usando datos mock estables para demostración
              </div>
            </div>
          </div>
          <Badge variant="default">
            Activo
          </Badge>
        </div>

        {/* Configuración de la API */}
        {config && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Configuración de la API
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">API Key</div>
                <div className="font-mono text-xs bg-muted p-2 rounded mt-1">
                  {config.apiKey === 'public' ? 'API Pública (Sin autenticación)' : `${config.apiKey.substring(0, 20)}...`}
                </div>
              </div>
              
              <div className="p-3 border rounded-lg">
                <div className="text-sm font-medium text-muted-foreground">Base URL</div>
                <div className="font-mono text-xs bg-muted p-2 rounded mt-1">
                  {config.baseUrl}
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div className="p-3 border rounded-lg">
              <div className="text-sm font-medium text-muted-foreground mb-2">Permisos</div>
              <div className="flex flex-wrap gap-2">
                {config.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4" />
              <span className="font-medium">Error de Conexión</span>
            </div>
            <div className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={checkConnection} 
            variant="outline" 
            size="sm"
            disabled={!config}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Verificar Conexión
          </Button>
          
          <Button 
            onClick={() => window.open('https://explorer-testnet.doma.xyz/', '_blank')}
            variant="outline" 
            size="sm"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Explorer Testnet
          </Button>
        </div>

        {/* Información adicional */}
        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>• APIs disponibles: REST API, GraphQL, RPC API, Eth RPC API</p>
          <p>• Datos mock estables para demostración del hackathon</p>
          <p>• Preparado para integración con APIs reales de Doma Protocol</p>
        </div>
      </CardContent>
    </Card>
  );
};
