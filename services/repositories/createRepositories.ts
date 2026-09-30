import type { DataSource } from '@/services/config';
import { config } from '@/services/config';
import { ApiClient } from '@/services/api/apiClient';
import {
  ApiCustomerRepository,
  ApiNextBestActionRepository,
  ApiNotificationRepository,
  ApiPolicyRepository,
  ApiProjectionRepository,
} from '@/services/api/apiRepositories';
import { MockCustomerRepository } from '@/services/repositories/mockCustomerRepository';
import { MockNextBestActionRepository } from '@/services/repositories/mockNextBestActionRepository';
import { MockNotificationRepository } from '@/services/repositories/mockNotificationRepository';
import { MockPolicyRepository } from '@/services/repositories/mockPolicyRepository';
import { MockProjectionRepository } from '@/services/repositories/mockProjectionRepository';
import type { Repositories } from '@/services/repositories/types';

export function createRepositories(source: DataSource = config.dataSource): Repositories {
  if (source === 'api') {
    const client = new ApiClient(config.apiBaseUrl, config.apiTimeoutMs);
    return {
      customers: new ApiCustomerRepository(client),
      policies: new ApiPolicyRepository(client),
      projections: new ApiProjectionRepository(client),
      notifications: new ApiNotificationRepository(client),
      actions: new ApiNextBestActionRepository(client),
    };
  }

  const customers = new MockCustomerRepository();
  const policies = new MockPolicyRepository();
  const projections = new MockProjectionRepository();
  return {
    customers,
    policies,
    projections,
    notifications: new MockNotificationRepository(),
    actions: new MockNextBestActionRepository(customers, policies, projections),
  };
}
