import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency values
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Format percentage values
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// Format large numbers with K, M, B suffixes
export function formatLargeNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

// Calculate slippage for vAMM (k = xy formula)
export function calcSlippage(size: number, currentPrice: number, k: number = 1000000): number {
  // Simplified vAMM slippage calculation
  // In a real implementation, this would use the actual AMM curve
  const priceImpact = (size / k) * 0.01; // 1% impact per 1% of k
  return currentPrice * (1 + priceImpact);
}

// Calculate estimated fill price with slippage
export function getEstimatedFillPrice(
  size: number,
  isLong: boolean,
  currentPrice: number,
  leverage: number
): number {
  const slippage = calcSlippage(size, currentPrice);
  return isLong ? slippage : currentPrice - (slippage - currentPrice);
}

// Calculate PnL for a position
export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  isLong: boolean,
  leverage: number
): number {
  const priceDiff = isLong 
    ? currentPrice - entryPrice 
    : entryPrice - currentPrice;
  
  return (priceDiff / entryPrice) * size * leverage;
}

// Format address for display
export function formatAddress(address: string, length: number = 6): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

// Convert wei to ether
export function weiToEther(wei: bigint): number {
  return Number(wei) / 1e18;
}

// Convert ether to wei
export function etherToWei(ether: number): bigint {
  return BigInt(Math.floor(ether * 1e18));
}

// Generate random position ID (for demo purposes)
export function generatePositionId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Validate leverage input
export function validateLeverage(leverage: number): boolean {
  const MIN_LEVERAGE = 1;
  const MAX_LEVERAGE = 50;
  return leverage >= MIN_LEVERAGE && leverage <= MAX_LEVERAGE;
}

// Validate size input
export function validateSize(size: number): boolean {
  return size > 0 && size <= 1000000; // Max 1M USDC
}

// Get color class for PnL
export function getPnLColor(pnl: number): string {
  if (pnl > 0) return 'text-green-500';
  if (pnl < 0) return 'text-red-500';
  return 'text-gray-500';
}

// Get color class for funding rate
export function getFundingColor(funding: number): string {
  if (funding > 0) return 'text-red-500';
  if (funding < 0) return 'text-green-500';
  return 'text-gray-500';
}

// Sleep utility for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
