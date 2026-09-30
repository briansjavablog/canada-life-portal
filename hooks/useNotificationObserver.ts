import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

/**
 * Listens for a tap on a local notification and follows `data.url`.
 * The last stored response is ignored so a refresh does not hijack the demo.
 */
export function useNotificationObserver(onUrl: (url: string) => void) {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const url = response.notification.request.content.data?.url;
      if (typeof url === 'string') {
        onUrl(url);
      }
    });

    return () => subscription.remove();
  }, [onUrl]);
}
