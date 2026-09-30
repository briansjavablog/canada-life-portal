type OpenHandler = (href: string) => void;

let openHandler: OpenHandler | null = null;

export function setWebNotificationOpenHandler(handler: OpenHandler | null) {
  openHandler = handler;
}

export function openWebNotification(href: string) {
  openHandler?.(href);
}
