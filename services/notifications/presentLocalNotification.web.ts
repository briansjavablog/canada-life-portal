import { openWebNotification } from '@/services/notifications/webNotificationBridge';

export type LocalNotificationInput = {
  title: string;
  body: string;
  href: string;
};

export type LocalNotificationResult = {
  systemDelivered: boolean;
  message: string;
};

/** Browser notification for the laptop demo. Remote push is not used. */
export async function presentLocalNotification(input: LocalNotificationInput): Promise<LocalNotificationResult> {
  if (typeof window === 'undefined' || typeof Notification === 'undefined') {
    return {
      systemDelivered: false,
      message: 'This browser cannot show system notifications. Use the in-app notification centre.',
    };
  }

  let permission = Notification.permission;
  if (permission === 'default') {
    permission = await Notification.requestPermission();
  }

  if (permission !== 'granted') {
    return {
      systemDelivered: false,
      message: 'Browser notifications are blocked. The message is in the notification centre — tap it to continue.',
    };
  }

  const notification = new Notification(input.title, { body: input.body });
  notification.onclick = () => {
    window.focus();
    openWebNotification(input.href);
    notification.close();
  };

  return {
    systemDelivered: true,
    message: 'Browser notification sent. Tap it to open the linked screen.',
  };
}
