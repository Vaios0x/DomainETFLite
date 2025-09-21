'use client';

import React, { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Download, 
  X, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Bell,
  BellOff,
  RefreshCw
} from 'lucide-react';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const {
    isInstalled,
    isInstallable,
    isOnline,
    isUpdateAvailable,
    installPWA,
    updateServiceWorker,
    requestNotificationPermission,
    sendNotification,
  } = usePWA();

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Show install prompt after delay
  useEffect(() => {
    if (isInstallable && !isInstalled && !showInstallPrompt) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, showInstallPrompt]);

  // Show update prompt
  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  const handleInstall = async () => {
    const success = await installPWA();
    if (success) {
      setShowInstallPrompt(false);
      sendNotification('DomainETF Lite Installed!', {
        body: 'You can now access the app from your home screen.',
      });
    }
  };

  const handleUpdate = () => {
    updateServiceWorker();
    setShowUpdatePrompt(false);
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      sendNotification('Notifications Enabled!', {
        body: 'You will now receive trading alerts and updates.',
      });
    } else {
      setNotificationPermission('denied');
    }
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  const dismissUpdatePrompt = () => {
    setShowUpdatePrompt(false);
  };

  // Don't show if already dismissed in this session
  if (showInstallPrompt && sessionStorage.getItem('pwa-install-dismissed')) {
    setShowInstallPrompt(false);
  }

  return (
    <div className={className}>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <Card className="fixed bottom-4 left-4 right-4 z-50 bg-background/95 backdrop-blur-sm border-2 border-primary/20 shadow-lg animate-in slide-in-from-bottom-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Install DomainETF Lite
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissInstallPrompt}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              Install the app for a better trading experience with offline access and push notifications.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleInstall} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
              <Button variant="outline" onClick={dismissInstallPrompt}>
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <Card className="fixed top-4 left-4 right-4 z-50 bg-background/95 backdrop-blur-sm border-2 border-green-500/20 shadow-lg animate-in slide-in-from-top-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-green-500" />
                Update Available
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissUpdatePrompt}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground mb-4">
              A new version of DomainETF Lite is available with improved features and bug fixes.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleUpdate} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Now
              </Button>
              <Button variant="outline" onClick={dismissUpdatePrompt}>
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status - Hidden for now, can be added to navbar if needed */}
      {/* <div className="fixed top-4 right-4 z-40">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
        }`}>
          {isOnline ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4" />
          )}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>
      </div> */}

      {/* Notification Permission Prompt */}
      {notificationPermission === 'default' && (
        <Card className="fixed bottom-20 left-4 right-4 z-40 bg-background/95 backdrop-blur-sm border-2 border-blue-500/20 shadow-lg">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Enable Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    Get alerts for price movements and trading opportunities
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={handleRequestNotifications}
                className="ml-2"
              >
                Enable
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
