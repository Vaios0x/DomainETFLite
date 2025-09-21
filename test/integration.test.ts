import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { rainbowKitConfig } from '@/lib/rainbowkit';
import { usePWA } from '@/hooks/usePWA';
import { usePriceOracle } from '@/hooks/usePriceOracle';
import { useLiquidationEngine } from '@/hooks/useLiquidationEngine';
import { useAnalytics } from '@/hooks/useAnalytics';

// Mock Web3 providers
const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={mockQueryClient}>
    <WagmiProvider config={config}>
      <RainbowKitProvider config={rainbowKitConfig}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  </QueryClientProvider>
);

describe('Integration Tests', () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => null),
        setItem: vi.fn(() => null),
        removeItem: vi.fn(() => null),
        clear: vi.fn(() => null),
      },
      writable: true,
    });

    // Mock navigator
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: true,
    });

    // Mock service worker
    Object.defineProperty(navigator, 'serviceWorker', {
      value: {
        register: vi.fn(() => Promise.resolve({
          installing: null,
          waiting: null,
          active: null,
          addEventListener: vi.fn(),
        })),
      },
      writable: true,
    });

    // Mock notifications
    Object.defineProperty(window, 'Notification', {
      value: {
        requestPermission: vi.fn(() => Promise.resolve('granted')),
        permission: 'granted',
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('PWA Functionality', () => {
    it('should register service worker on mount', async () => {
      const { result } = renderHook(() => usePWA(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js');
      });
    });

    it('should handle install prompt', async () => {
      const mockPrompt = vi.fn(() => Promise.resolve());
      const mockUserChoice = Promise.resolve({ outcome: 'accepted' });

      const installPromptEvent = new Event('beforeinstallprompt');
      (installPromptEvent as any).prompt = mockPrompt;
      (installPromptEvent as any).userChoice = mockUserChoice;

      const { result } = renderHook(() => usePWA(), {
        wrapper: TestWrapper,
      });

      window.dispatchEvent(installPromptEvent);

      await waitFor(() => {
        expect(result.current.isInstallable).toBe(true);
      });
    });

    it('should handle online/offline status', async () => {
      const { result } = renderHook(() => usePWA(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isOnline).toBe(true);

      // Simulate going offline
      Object.defineProperty(navigator, 'onLine', {
        value: false,
      });
      window.dispatchEvent(new Event('offline'));

      await waitFor(() => {
        expect(result.current.isOnline).toBe(false);
      });
    });
  });

  describe('Price Oracle Integration', () => {
    it('should fetch prices from multiple oracles', async () => {
      // Mock fetch responses
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            price: 105.42,
            volume24h: 1250000,
            change24h: 2.34,
            confidence: 0.9,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({
            price: 105.38,
            volume24h: 1200000,
            change24h: 2.28,
            confidence: 0.85,
          }),
        });

      const { result } = renderHook(() => usePriceOracle(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.oracleData).toBeDefined();
        expect(result.current.oracleData?.price).toBeCloseTo(105.4, 1);
      });
    });

    it('should handle oracle failures gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePriceOracle(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.oracleData?.source).toBe('Fallback');
      });
    });

    it('should validate oracle data', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          price: -100, // Invalid negative price
          volume24h: 1250000,
          change24h: 2.34,
          confidence: 0.9,
        }),
      });

      const { result } = renderHook(() => usePriceOracle(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.oracleData?.source).toBe('Fallback');
      });
    });
  });

  describe('Liquidation Engine', () => {
    it('should detect liquidatable positions', async () => {
      const mockPositions = [
        {
          id: '1',
          user: '0x123',
          size: 1000,
          isLong: true,
          leverage: 10,
          entryPrice: 100,
          margin: 100,
          isActive: true,
        },
      ];

      // Mock contract read
      vi.mocked(useContractRead).mockReturnValue({
        data: mockPositions,
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useLiquidationEngine(), {
        wrapper: TestWrapper,
      });

      await result.current.checkLiquidations(90); // Price dropped below liquidation

      await waitFor(() => {
        expect(result.current.liquidatablePositions.length).toBeGreaterThan(0);
      });
    });

    it('should calculate liquidation price correctly', () => {
      const { result } = renderHook(() => useLiquidationEngine(), {
        wrapper: TestWrapper,
      });

      const position = {
        id: '1',
        size: 1000,
        isLong: true,
        leverage: 10,
        entryPrice: 100,
        margin: 100,
        isActive: true,
      } as any;

      const liquidationPrice = result.current.calculateLiquidationPrice(position, 100);
      expect(liquidationPrice).toBeLessThan(100); // Should be below entry price for long
    });

    it('should calculate margin ratio correctly', () => {
      const { result } = renderHook(() => useLiquidationEngine(), {
        wrapper: TestWrapper,
      });

      const position = {
        id: '1',
        size: 1000,
        isLong: true,
        leverage: 10,
        entryPrice: 100,
        margin: 100,
        isActive: true,
      } as any;

      const marginRatio = result.current.calculateMarginRatio(position, 90);
      expect(marginRatio).toBeLessThan(1); // Should be less than 1 when price drops
    });
  });

  describe('Analytics Integration', () => {
    it('should calculate Sharpe ratio correctly', () => {
      const { result } = renderHook(() => useAnalytics(), {
        wrapper: TestWrapper,
      });

      const returns = [0.1, 0.05, -0.02, 0.08, 0.03];
      const sharpeRatio = result.current.calculateSharpeRatio(returns, 0.02);
      expect(sharpeRatio).toBeGreaterThan(0);
    });

    it('should calculate maximum drawdown correctly', () => {
      const { result } = renderHook(() => useAnalytics(), {
        wrapper: TestWrapper,
      });

      const equityCurve = [1000, 1100, 1050, 1200, 1000, 1300];
      const maxDrawdown = result.current.calculateMaxDrawdown(equityCurve);
      expect(maxDrawdown).toBeGreaterThan(0);
      expect(maxDrawdown).toBeLessThan(1);
    });

    it('should calculate profit factor correctly', () => {
      const { result } = renderHook(() => useAnalytics(), {
        wrapper: TestWrapper,
      });

      const trades = [100, -50, 200, -75, 150, -25];
      const profitFactor = result.current.calculateProfitFactor(trades);
      expect(profitFactor).toBeGreaterThan(1); // Should be profitable
    });

    it('should calculate diversification score correctly', () => {
      const { result } = renderHook(() => useAnalytics(), {
        wrapper: TestWrapper,
      });

      const positions = [
        { size: 1000 },
        { size: 2000 },
        { size: 1500 },
        { size: 3000 },
      ];

      const diversificationScore = result.current.calculateDiversificationScore(positions);
      expect(diversificationScore).toBeGreaterThan(0);
      expect(diversificationScore).toBeLessThanOrEqual(100);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => usePriceOracle(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.error).toBeDefined();
        expect(result.current.oracleData).toBeDefined(); // Should fallback to mock data
      });
    });

    it('should handle invalid contract responses', async () => {
      vi.mocked(useContractRead).mockReturnValue({
        data: null,
        error: new Error('Contract error'),
        refetch: vi.fn(),
      } as any);

      const { result } = renderHook(() => useLiquidationEngine(), {
        wrapper: TestWrapper,
      });

      await waitFor(() => {
        expect(result.current.liquidatablePositions).toEqual([]);
      });
    });
  });

  describe('Performance', () => {
    it('should not cause memory leaks', async () => {
      const { unmount } = renderHook(() => usePWA(), {
        wrapper: TestWrapper,
      });

      // Simulate component unmount
      unmount();

      // Wait for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));

      // Check that intervals are cleared
      expect(vi.getTimerCount()).toBe(0);
    });

    it('should debounce rapid updates', async () => {
      const { result } = renderHook(() => usePriceOracle(), {
        wrapper: TestWrapper,
      });

      // Trigger multiple rapid updates
      for (let i = 0; i < 10; i++) {
        result.current.refreshPrices();
      }

      // Should only make one actual request
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
  });
});
