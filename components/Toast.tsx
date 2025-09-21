'use client';

import React, { useEffect } from 'react';
import { useToastStore } from '@/zustand/toastStore';
import { ToastData } from '@/types';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToastProps {
  toast: ToastData;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToastStore();

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const getExplorerUrl = (txHash: string) => {
    // This would be dynamic based on the chain
    return `https://explorer.doma.testnet/tx/${txHash}`;
  };

  return (
    <div
      className={`
        relative flex items-start gap-3 p-4 bg-background border border-border rounded-lg shadow-lg
        border-l-4 ${getBorderColor()}
        animate-in slide-in-from-right-full duration-300
      `}
    >
      <div className="flex-shrink-0">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground">
          {toast.title}
        </h4>
        {toast.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {toast.description}
          </p>
        )}
        {toast.txHash && (
          <div className="mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(getExplorerUrl(toast.txHash!), '_blank')}
              className="text-xs"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Transaction
            </Button>
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeToast(toast.id)}
        className="flex-shrink-0 h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
