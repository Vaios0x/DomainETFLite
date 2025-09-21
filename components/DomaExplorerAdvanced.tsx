'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDomaExplorer } from '@/hooks/useDomaExplorer';
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
  Coins,
  Zap,
  FileText,
  Eye,
  ArrowUpDown,
  Wallet,
  Shield,
  Layers
} from 'lucide-react';

export const DomaExplorerAdvanced: React.FC = () => {
  const { 
    config, 
    isConnected, 
    error, 
    checkConnection,
    getRecentTransactions,
    getAddressInfo,
    getRecentBlocks,
    getTransactionByHash,
    getNetworkStats,
    getDomainTradingData,
    getTokens,
    getTokenTransfers,
    getWithdrawals,
    getGasTracker,
    getEthBalance,
    getContractInfo,
    getEventLogs,
    getDetailedStats
  } = useDomaExplorer();

  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'transfers' | 'withdrawals' | 'gas' | 'contracts'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [recentData, setRecentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos recientes al montar
  useEffect(() => {
    if (isConnected) {
      loadRecentData();
    }
  }, [isConnected]);

  const loadRecentData = async () => {
    try {
      setIsLoading(true);
      const [transactions, blocks, stats, tokens, withdrawals, gas] = await Promise.all([
        getRecentTransactions(5),
        getRecentBlocks(5),
        getDetailedStats(),
        getTokens(1, 5),
        getWithdrawals(1, 5),
        getGasTracker()
      ]);
      
      setRecentData({ transactions, blocks, stats, tokens, withdrawals, gas });
    } catch (err) {
      console.error('Error loading recent data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      
      // Intentar diferentes tipos de búsqueda
      if (searchQuery.startsWith('0x') && searchQuery.length === 66) {
        // Es un hash de transacción
        const transaction = await getTransactionByHash(searchQuery);
        setSearchResults({ type: 'transaction', data: transaction });
      } else if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
        // Es una dirección
        const [address, contractInfo, ethBalance] = await Promise.all([
          getAddressInfo(searchQuery),
          getContractInfo(searchQuery),
          getEthBalance(searchQuery)
        ]);
        setSearchResults({ 
          type: 'address', 
          data: { ...address, contractInfo, ethBalance } 
        });
      } else if (!isNaN(Number(searchQuery))) {
        // Es un número de bloque
        const block = await getRecentBlocks(1);
        setSearchResults({ type: 'block', data: block[0] });
      } else {
        // Buscar como dominio
        const domain = await getDomainTradingData(searchQuery);
        setSearchResults({ type: 'domain', data: domain });
      }
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults({ type: 'error', data: err });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'tokens', label: 'Tokens', icon: Coins },
    { id: 'transfers', label: 'Transfers', icon: ArrowUpDown },
    { id: 'withdrawals', label: 'Withdrawals', icon: Wallet },
    { id: 'gas', label: 'Gas Tracker', icon: Zap },
    { id: 'contracts', label: 'Contracts', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-6 w-6" />
            Doma Explorer Avanzado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {isConnected ? (
                <Activity className="h-5 w-5 text-green-500" />
              ) : (
                <Activity className="h-5 w-5 text-red-500" />
              )}
              <div>
                <div className="font-semibold">
                  {isConnected ? 'Conectado al Explorer' : 'Desconectado'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isConnected ? 'Acceso completo a todas las APIs de Blockscout' : 'No se pudo conectar'}
                </div>
              </div>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Activo" : "Inactivo"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Búsqueda Avanzada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda Avanzada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Hash, dirección, bloque, dominio o contrato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchQuery.trim() || isLoading}
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>

          {/* Resultados de búsqueda */}
          {searchResults && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{searchResults.type}</Badge>
                <span className="text-sm text-muted-foreground">
                  {searchResults.type === 'address' && 'Información de dirección'}
                  {searchResults.type === 'transaction' && 'Detalles de transacción'}
                  {searchResults.type === 'block' && 'Información de bloque'}
                  {searchResults.type === 'domain' && 'Datos de dominio'}
                  {searchResults.type === 'error' && 'Error en búsqueda'}
                </span>
              </div>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(searchResults.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && recentData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Estadísticas de Red */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas de Red
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Supply Total</span>
                  <span className="font-mono text-sm">{recentData.stats?.network?.EthSupply || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Precio ETH</span>
                  <span className="font-mono text-sm">${recentData.stats?.price?.ethusd || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="font-mono text-sm">${recentData.stats?.network?.EthUsd || 'N/A'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gas Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Gas Tracker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Badge variant="outline">Slow</Badge>
                  <span className="font-mono text-sm">{recentData.gas?.slow || 'N/A'} Gwei</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="outline">Standard</Badge>
                  <span className="font-mono text-sm">{recentData.gas?.standard || 'N/A'} Gwei</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="outline">Fast</Badge>
                  <span className="font-mono text-sm">{recentData.gas?.fast || 'N/A'} Gwei</span>
                </div>
                <div className="flex justify-between">
                  <Badge variant="outline">Instant</Badge>
                  <span className="font-mono text-sm">{recentData.gas?.instant || 'N/A'} Gwei</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tokens Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Tokens Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentData.tokens?.slice(0, 3).map((token: any, index: number) => (
                  <div key={index} className="p-2 border rounded text-sm">
                    <div className="font-semibold">{token.name || token.symbol}</div>
                    <div className="text-muted-foreground">
                      {token.symbol} • {token.type}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'tokens' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Tokens ERC-20/721/1155
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={() => loadRecentData()} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cargar Tokens
              </Button>
              <div className="grid gap-4 md:grid-cols-2">
                {recentData?.tokens?.map((token: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{token.name || 'Unknown'}</h3>
                      <Badge variant="outline">{token.type}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Symbol: {token.symbol}</div>
                      <div>Decimals: {token.decimals}</div>
                      <div>Holders: {token.holders}</div>
                      <div>Transfers: {token.transfers}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'transfers' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5" />
              Transferencias de Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button onClick={async () => {
                try {
                  const transfers = await getTokenTransfers();
                  setRecentData({ ...recentData, tokenTransfers: transfers });
                } catch (err) {
                  console.error('Error loading token transfers:', err);
                }
              }} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cargar Transferencias
              </Button>
              <div className="space-y-2">
                {recentData?.tokenTransfers?.slice(0, 10).map((transfer: any, index: number) => (
                  <div key={index} className="p-3 border rounded text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{transfer.tokenName} ({transfer.tokenSymbol})</div>
                        <div className="text-muted-foreground">
                          From: {transfer.from.substring(0, 20)}... → To: {transfer.to.substring(0, 20)}...
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono">{transfer.value}</div>
                        <div className="text-muted-foreground">Block: {transfer.blockNumber}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'withdrawals' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Withdrawals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentData?.withdrawals?.map((withdrawal: any, index: number) => (
                <div key={index} className="p-3 border rounded text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-mono text-xs">{withdrawal.hash.substring(0, 20)}...</div>
                      <div className="text-muted-foreground">
                        From: {withdrawal.from.substring(0, 20)}... → To: {withdrawal.to.substring(0, 20)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={withdrawal.status === 'completed' ? 'default' : 'secondary'}>
                        {withdrawal.status}
                      </Badge>
                      <div className="font-mono text-sm mt-1">{withdrawal.value} ETH</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'gas' && recentData?.gas && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Gas Tracker en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-red-500">{recentData.gas.slow}</div>
                <div className="text-sm text-muted-foreground">Slow</div>
                <div className="text-xs text-muted-foreground">Gwei</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-yellow-500">{recentData.gas.standard}</div>
                <div className="text-sm text-muted-foreground">Standard</div>
                <div className="text-xs text-muted-foreground">Gwei</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-green-500">{recentData.gas.fast}</div>
                <div className="text-sm text-muted-foreground">Fast</div>
                <div className="text-xs text-muted-foreground">Gwei</div>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-2xl font-bold text-blue-500">{recentData.gas.instant}</div>
                <div className="text-sm text-muted-foreground">Instant</div>
                <div className="text-xs text-muted-foreground">Gwei</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'contracts' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Verificación de Contratos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Verificar Contrato</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ingresa la dirección de un contrato para obtener información detallada y verificar su código fuente.
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={async () => {
                    if (searchQuery.startsWith('0x') && searchQuery.length === 42) {
                      try {
                        const contractInfo = await getContractInfo(searchQuery);
                        setSearchResults({ type: 'contract', data: contractInfo });
                      } catch (err) {
                        console.error('Error fetching contract info:', err);
                      }
                    }
                  }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Verificar
                  </Button>
                </div>
              </div>
              
              {searchResults?.type === 'contract' && (
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Información del Contrato</h4>
                  <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(searchResults.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={checkConnection} 
          variant="outline" 
          disabled={isLoading}
        >
          <Activity className="h-4 w-4 mr-2" />
          Verificar Conexión
        </Button>
        
        <Button 
          onClick={loadRecentData} 
          variant="outline" 
          disabled={!isConnected || isLoading}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Actualizar Datos
        </Button>
        
        <Button 
          onClick={() => window.open('https://explorer-testnet.doma.xyz/', '_blank')}
          variant="outline"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir Explorer
        </Button>

        <Button 
          onClick={() => window.open('https://explorer-testnet.doma.xyz/api-docs', '_blank')}
          variant="outline"
        >
          <FileText className="h-4 w-4 mr-2" />
          API Docs
        </Button>

        <Button 
          onClick={() => window.open('https://explorer-testnet.doma.xyz/graphiql', '_blank')}
          variant="outline"
        >
          <Database className="h-4 w-4 mr-2" />
          GraphiQL
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 border border-red-200 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="text-red-600 dark:text-red-400">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}
    </div>
  );
};
