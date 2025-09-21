'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useDomaDashboard } from '@/hooks/useDomaDashboard';
import { useDomaAPI } from '@/hooks/useDomaAPI';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  ExternalLink,
  Activity,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export const DomaDomainsList: React.FC = () => {
  const { data, isLoading, error, refresh, isConnected } = useDomaDashboard();
  const { isConnected: apiConnected, error: apiError, config } = useDomaAPI();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Dominios de Doma Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Cargando dominios...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Dominios de Doma Protocol
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error al cargar datos: {error}</p>
            <Button onClick={refresh} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Dominios de Doma Protocol
              <Badge variant={apiConnected ? "default" : "secondary"}>
                {apiConnected ? "API Conectada" : "API Desconectada"}
              </Badge>
              {config && (
                <Badge variant="outline" className="text-xs">
                  {config.permissions.join(', ')}
                </Badge>
              )}
            </CardTitle>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {data.totalDomains}
              </div>
              <div className="text-sm text-muted-foreground">Dominios Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.totalVolume)}
              </div>
              <div className="text-sm text-muted-foreground">Volumen Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {data.recentlyListed.length}
              </div>
              <div className="text-sm text-muted-foreground">Recién Listados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dominios Recién Listados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recién Listados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentlyListed.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{domain.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Volumen 24h: {formatCurrency(domain.volume24h)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(domain.price)}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${
                    domain.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {domain.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(domain.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dominios Activos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Dominios Activos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.activeDomains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{domain.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Volumen 24h: {formatCurrency(domain.volume24h)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(domain.price)}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${
                    domain.change24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {domain.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(domain.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enlace al Dashboard Oficial */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              Ver más dominios en el Dashboard Oficial
            </h3>
            <p className="text-muted-foreground mb-4">
              Explora todos los dominios disponibles en Doma Protocol
            </p>
            <Button
              onClick={() => window.open('https://dashboard-testnet.doma.xyz/', '_blank')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Abrir Dashboard de Doma
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
