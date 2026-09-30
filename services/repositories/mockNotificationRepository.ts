import { mockNotifications } from '@/data/mockNotifications';
import type { Notification } from '@/models';
import type { NotificationRepository } from '@/services/repositories/types';

export class MockNotificationRepository implements NotificationRepository {
  async list(_customerId: string): Promise<Notification[]> {
    return mockNotifications.map((item) => ({ ...item }));
  }
}
