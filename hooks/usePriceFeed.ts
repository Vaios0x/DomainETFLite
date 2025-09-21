import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/constants';
import { PriceData, FundingData, SocketMessage } from '@/types';

// Mock data generator for offline mode - Fixed values to prevent hydration mismatch
const generateMockPriceData = (): PriceData => ({
  price: 105.42,
  volume24h: 1250000,
  change24h: 2.34,
  timestamp: 1737084000000, // Fixed timestamp
});

const generateMockFundingData = (): FundingData => ({
  rate: 0.0012,
  timestamp: 1737084000000, // Fixed timestamp
  nextUpdate: 1737084600000, // 10 minutes later
});

export const usePriceFeed = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [price, setPrice] = useState<number>(105.42);
  const [funding, setFunding] = useState<number>(0.0012);
  const [volume24h, setVolume24h] = useState<number>(1250000);
  const [change24h, setChange24h] = useState<number>(2.34);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(1737084000000);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(true); // Mock data is considered "live"

  // Initialize mock data updates and optional socket connection
  useEffect(() => {
    let mockUpdateInterval: NodeJS.Timeout;
    let connectionTimeout: NodeJS.Timeout;

    // Start mock data updates immediately
    const startMockUpdates = () => {
      let counter = 0;
      mockUpdateInterval = setInterval(() => {
        counter++;
        // Use predictable variations based on counter to avoid hydration mismatch
        const variation = Math.sin(counter * 0.1) * 0.5;
        
        setPrice(prev => Math.max(100, Math.min(110, prev + variation)));
        setVolume24h(prev => Math.max(1000000, Math.min(1500000, prev + variation * 10000)));
        setChange24h(prev => Math.max(-5, Math.min(5, prev + variation * 0.1)));
        setFunding(prev => Math.max(-0.01, Math.min(0.01, prev + variation * 0.0001)));
        setLastUpdate(Date.now());
      }, 5000); // Update every 5 seconds
    };

    // Try to connect to WebSocket (optional)
    const tryConnectSocket = () => {
      try {
        const newSocket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          timeout: 5000, // Short timeout
          forceNew: true,
          reconnection: false, // Disable auto-reconnection
        });

        connectionTimeout = setTimeout(() => {
          if (!newSocket.connected) {
            console.log('WebSocket not available, using mock data');
            newSocket.disconnect();
            setIsOfflineMode(true);
            setError('WebSocket unavailable - using mock data');
          }
        }, 3000);

        newSocket.on('connect', () => {
          console.log('Connected to price feed');
          clearTimeout(connectionTimeout);
          setIsConnected(true);
          setIsOfflineMode(false);
          setIsLive(true);
          setError(null);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from price feed');
          clearTimeout(connectionTimeout);
          setIsConnected(false);
          setIsOfflineMode(true);
          setIsLive(true); // Mock data is still live
        });

        newSocket.on('connect_error', (err) => {
          console.log('WebSocket connection failed, using mock data:', err.message);
          clearTimeout(connectionTimeout);
          setIsConnected(false);
          setIsOfflineMode(true);
          setIsLive(true); // Mock data is still live
          setError('WebSocket unavailable - using mock data');
        });

        // Listen for price updates
        newSocket.on('priceUpdate', (data: PriceData) => {
          setPrice(data.price);
          setVolume24h(data.volume24h);
          setChange24h(data.change24h);
          setLastUpdate(data.timestamp);
        });

        // Listen for funding updates
        newSocket.on('fundingUpdate', (data: FundingData) => {
          setFunding(data.rate);
        });

        // Listen for general messages
        newSocket.on('message', (message: SocketMessage) => {
          switch (message.type) {
            case 'price':
              setPrice(message.data.price);
              setVolume24h(message.data.volume24h);
              setChange24h(message.data.change24h);
              break;
            case 'funding':
              setFunding(message.data.rate);
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
          setLastUpdate(message.timestamp);
        });

        setSocket(newSocket);
        return newSocket;
      } catch (err) {
        console.log('WebSocket initialization failed, using mock data:', err);
        setIsOfflineMode(true);
        setError('WebSocket unavailable - using mock data');
        return null;
      }
    };

    // Start mock updates immediately
    startMockUpdates();

    // Try to connect to WebSocket (non-blocking)
    const socketInstance = tryConnectSocket();

    return () => {
      clearTimeout(connectionTimeout);
      clearInterval(mockUpdateInterval);
      if (socketInstance) {
        socketInstance.close();
      }
    };
  }, []);

  // Manual price update function
  const updatePrice = useCallback((newPrice: number) => {
    setPrice(newPrice);
    setLastUpdate(Date.now());
  }, []);

  // Manual funding update function
  const updateFunding = useCallback((newFunding: number) => {
    setFunding(newFunding);
  }, []);

  // Reconnect function
  const reconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket.connect();
    }
  }, [socket]);

  // Get current price data
  const getPriceData = useCallback((): PriceData => ({
    price,
    timestamp: lastUpdate,
    volume24h,
    change24h,
  }), [price, lastUpdate, volume24h, change24h]);

  // Get current funding data
  const getFundingData = useCallback((): FundingData => ({
    rate: funding,
    timestamp: lastUpdate,
    nextUpdate: lastUpdate + 600000, // 10 minutes from last update
  }), [funding, lastUpdate]);

  return {
    // Current values
    price,
    funding,
    volume24h,
    change24h,
    isConnected,
    isOfflineMode,
    isLive,
    error,
    lastUpdate,
    
    // Functions
    updatePrice,
    updateFunding,
    reconnect,
    getPriceData,
    getFundingData,
    
    // Socket instance (for advanced usage)
    socket,
  };
};
