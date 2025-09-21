// DomainETF Lite - Type Definitions

// ============ Doma Protocol Types ============

export interface DomainAsset {
  domain: string;
  ownershipToken: string;
  syntheticToken: string;
  totalSupply: number;
  currentPrice: number;
  isFractionalized: boolean;
  isActive: boolean;
  lastPriceUpdate: number;
}

export interface SyntheticTokenInfo {
  domain: string;
  tokenType: 'OWNERSHIP' | 'DNS' | 'SUBDOMAIN' | 'TRANSFER' | 'RENEWAL';
  totalSupply: number;
  price: number;
  isActive: boolean;
}

export interface DomainOwnershipToken {
  id: string;
  domain: string;
  owner: string;
  tokenizedAt: number;
  isActive: boolean;
}

export interface DomainFractionalization {
  domain: string;
  totalSupply: number;
  syntheticTokens: SyntheticTokenInfo[];
  fractionalizedAt: number;
}

// ============ Trading Types ============

export interface Position {
  id: string;
  size: number;
  isLong: boolean;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  timestamp: number;
  user: string;
  margin: number;
  lastFundingTime: number;
  unrealizedPnl: number;
  isActive: boolean;
}

export interface PoolMetrics {
  tvl: number;
  openInterest: number;
  fundingRate: number;
  lastUpdate: number;
}

export interface PriceData {
  price: number;
  timestamp: number;
  volume24h: number;
  change24h: number;
}

export interface FundingData {
  rate: number;
  timestamp: number;
  nextUpdate: number;
}

export interface TradeFormData {
  size: number;
  leverage: number;
  isLong: boolean;
}

export interface LiquidityFormData {
  amount: number;
  action: 'add' | 'remove';
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  ensName?: string;
  pnl24h: number;
  pnl24hPercent: number;
  tradesCount: number;
  totalVolume: number;
}

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  txHash?: string;
  duration?: number;
}

export interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  lastUpdate: number;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: number;
  chainId: number;
}

export interface AppState {
  theme: 'light' | 'dark';
  language: 'en' | 'es';
  isLoading: boolean;
  error: string | null;
}

export interface SocketMessage {
  type: 'price' | 'funding' | 'trade' | 'liquidity';
  data: any;
  timestamp: number;
}

export interface ContractError {
  code: number;
  message: string;
  data?: any;
}

export interface GasEstimate {
  gasLimit: bigint;
  gasPrice: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface TransactionState {
  hash: string | null;
  status: 'idle' | 'pending' | 'success' | 'error';
  error: string | null;
  receipt: any;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

export interface PriceFeedResponse {
  price: number;
  funding: number;
  volume24h: number;
  change24h: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalCount: number;
  lastUpdate: number;
}

// Component Props Types
export interface ChartProps {
  data: ChartData[];
  height?: number;
  showFunding?: boolean;
  className?: string;
}

export interface TradeFormProps {
  onSubmit: (data: TradeFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
  currentPrice: number;
}

export interface PositionTableProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
  isLoading?: boolean;
}

export interface LiquidityFormProps {
  onSubmit: (data: LiquidityFormData) => void;
  isLoading?: boolean;
  disabled?: boolean;
  tvl: number;
  userShare: number;
}

// Hook Return Types
export interface UsePerpPoolReturn {
  openPosition: any;
  closePosition: any;
  addLiquidity: any;
  removeLiquidity: any;
  metrics: PoolMetrics | null;
  userPositions: Position[];
  isLoading: boolean;
  error: string | null;
}

export interface UsePriceFeedReturn {
  price: number;
  funding: number;
  volume24h: number;
  change24h: number;
  isConnected: boolean;
  error: string | null;
}

export interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  switchChain: (chainId: number) => void;
  balance: number;
  isLoading: boolean;
  error: string | null;
}

// Store Types
export interface PositionsStore {
  positions: Position[];
  addPosition: (position: Position) => void;
  removePosition: (id: string) => void;
  updatePosition: (id: string, updates: Partial<Position>) => void;
  clearPositions: () => void;
  getPositionById: (id: string) => Position | undefined;
}

export interface AppStore {
  theme: 'light' | 'dark';
  language: 'en' | 'es';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'es') => void;
  toggleTheme: () => void;
}

export interface ToastStore {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

// Environment Variables
export interface EnvConfig {
  NEXT_PUBLIC_DOMA_RPC: string;
  NEXT_PUBLIC_PERP_ADDRESS: string;
  NEXT_PUBLIC_CHAIN_ID: string;
  NEXT_PUBLIC_SOCKET_URL: string;
  NEXT_PUBLIC_BASE_RPC?: string;
  NEXT_PUBLIC_USDC_ADDRESS?: string;
}
