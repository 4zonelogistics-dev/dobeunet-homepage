import { useState, useEffect } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  wasOffline: boolean;
  downlink?: number;
  effectiveType?: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState<boolean>(false);
  const [connectionInfo, setConnectionInfo] = useState<{
    downlink?: number;
    effectiveType?: string;
  }>({});

  useEffect(() => {
    const handleOnline = (): void => {
      setIsOnline(true);
      setWasOffline(true);
      setTimeout(() => setWasOffline(false), 5000);
    };

    const handleOffline = (): void => {
      setIsOnline(false);
    };

    const updateConnectionInfo = (): void => {
      const connection = (navigator as Navigator & {
        connection?: {
          downlink?: number;
          effectiveType?: string;
        };
      }).connection;

      if (connection) {
        setConnectionInfo({
          downlink: connection.downlink,
          effectiveType: connection.effectiveType,
        });
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as Navigator & {
      connection?: {
        addEventListener?: (event: string, handler: () => void) => void;
      };
    }).connection;

    if (connection && connection.addEventListener) {
      connection.addEventListener('change', updateConnectionInfo);
    }

    updateConnectionInfo();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    isOnline,
    wasOffline,
    ...connectionInfo,
  };
}
