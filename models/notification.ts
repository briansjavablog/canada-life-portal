export type NotificationKind = 'review' | 'contribution' | 'document' | 'protection';

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  /** Expo Router path, for example `/projection`. */
  href: string;
  kind: NotificationKind;
};
