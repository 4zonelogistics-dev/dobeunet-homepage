import { WifiOff, CheckCircle } from 'lucide-react';
import { useNetworkStatus } from '../hooks/use-network-status';

export default function NetworkStatus() {
  const { isOnline, wasOffline } = useNetworkStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  if (!isOnline) {
    return (
      <div
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-slide-down"
        role="alert"
        aria-live="assertive"
      >
        <WifiOff className="w-5 h-5" aria-hidden="true" />
        <span className="font-semibold">You are offline</span>
      </div>
    );
  }

  if (wasOffline) {
    return (
      <div
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-slide-down"
        role="alert"
        aria-live="polite"
      >
        <CheckCircle className="w-5 h-5" aria-hidden="true" />
        <span className="font-semibold">Back online</span>
      </div>
    );
  }

  return null;
}
