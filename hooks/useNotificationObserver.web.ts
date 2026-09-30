import { useEffect } from 'react';
import { setWebNotificationOpenHandler } from '@/services/notifications/webNotificationBridge';

export function useNotificationObserver(onUrl: (url: string) => void) {
  useEffect(() => {
    setWebNotificationOpenHandler(onUrl);
    return () => setWebNotificationOpenHandler(null);
  }, [onUrl]);
}
