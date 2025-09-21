'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Algo salió mal
              </h1>
              
              <p className="text-muted-foreground mb-6">
                La aplicación encontró un error inesperado. Esto puede ser temporal.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 p-4 bg-muted rounded-lg">
                  <summary className="cursor-pointer font-medium mb-2">
                    Detalles del error (desarrollo)
                  </summary>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}

              <div className="space-y-3">
                <Button onClick={this.handleRetry} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()} 
                  className="w-full"
                >
                  Recargar página
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para manejar errores de timeout
export const useTimeoutError = (timeout: number = 10000) => {
  const [hasTimeout, setHasTimeout] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimeout(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const resetTimeout = React.useCallback(() => {
    setHasTimeout(false);
  }, []);

  return { hasTimeout, resetTimeout };
};

// Componente para mostrar loading con timeout
export const LoadingWithTimeout: React.FC<{
  timeout?: number;
  children: ReactNode;
  fallback?: ReactNode;
}> = ({ timeout = 10000, children, fallback }) => {
  const { hasTimeout } = useTimeoutError(timeout);

  if (hasTimeout) {
    return fallback || (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Cargando... Esto puede tomar un momento.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
