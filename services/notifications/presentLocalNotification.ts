import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export type LocalNotificationInput = {
  title: string;
  body: string;
  href: string;
};

export type LocalNotificationResult = {
  systemDelivered: boolean;
  message: string;
};

let handlerReady = false;

function ensureHandler() {
  if (handlerReady) return;
  handlerReady = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/**
 * Local notification only. Remote push is intentionally out of scope.
 * Tapping it deep-links via the `url` field read in useNotificationObserver.
 */
export async function presentLocalNotification(input: LocalNotificationInput): Promise<LocalNotificationResult> {
  ensureHandler();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const asked = await Notifications.requestPermissionsAsync();
    status = asked.status;
  }

  if (status !== 'granted') {
    return {
      systemDelivered: false,
      message: 'Permission was not granted. The message is in the notification centre.',
    };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('demo', {
      name: 'Demo',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: input.title,
      body: input.body,
      data: { url: input.href },
    },
    trigger: null,
  });

  return {
    systemDelivered: true,
    message: 'Local notification sent. Tap it to open the linked screen.',
  };
}
