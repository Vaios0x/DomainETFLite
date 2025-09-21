import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isInstalled: boolean;
  isInstallable: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: any;
  registration: ServiceWorkerRegistration | null;
}

interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isInstallable: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
    registration: null,
  });

  // Check if app is installed
  const checkInstallStatus = useCallback(() => {
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');
    
    setPwaState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Handle install prompt
  const handleInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setPwaState(prev => ({
      ...prev,
      installPrompt: e,
      isInstallable: true,
    }));
  }, []);

  // Install PWA
  const installPWA = useCallback(async () => {
    if (!pwaState.installPrompt) return false;

    try {
      await (pwaState.installPrompt as PWAInstallPromptEvent).prompt();
      const choiceResult = await (pwaState.installPrompt as PWAInstallPromptEvent).userChoice;
      
      setPwaState(prev => ({
        ...prev,
        installPrompt: null,
        isInstallable: false,
        isInstalled: choiceResult.outcome === 'accepted',
      }));

      return choiceResult.outcome === 'accepted';
    } catch (error) {
      console.error('Failed to install PWA:', error);
      return false;
    }
  }, [pwaState.installPrompt]);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setPwaState(prev => ({ ...prev, registration }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

        console.log('Service Worker registered successfully');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }, []);

  // Update service worker
  const updateServiceWorker = useCallback(() => {
    if (pwaState.registration?.waiting) {
      pwaState.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }, [pwaState.registration]);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Send notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      });
    }
  }, []);

  // Handle online/offline status
  const handleOnlineStatus = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Initialize PWA
  useEffect(() => {
    checkInstallStatus();
    registerServiceWorker();

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // Listen for online/offline status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setPwaState(prev => ({ ...prev, isInstalled: true, isInstallable: false }));
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [checkInstallStatus, registerServiceWorker, handleInstallPrompt, handleOnlineStatus]);

  return {
    ...pwaState,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification,
  };
};
