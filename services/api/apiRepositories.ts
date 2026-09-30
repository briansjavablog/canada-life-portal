import type {
  ChartRange,
  Customer,
  NextBestAction,
  Notification,
  Policy,
  PolicyValue,
  Projection,
  ProjectionRequest,
  ProjectionScenario,
  ProjectionScenarioId,
} from '@/models';
import { findScenario, projectionScenarios } from '@/data/scenarios';
import { ApiClient } from '@/services/api/apiClient';
import { placeholderPaths } from '@/services/api/placeholders';
import { ApiError } from '@/services/errors';
import { sliceHistory } from '@/utils/history';
import type {
  CustomerRepository,
  NextBestActionRepository,
  NotificationRepository,
  PolicyRepository,
  ProjectionRepository,
} from '@/services/repositories/types';

function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== 'object') {
    throw new ApiError(`${label} response did not match the app model. See services/api/placeholders.ts.`);
  }
}

export class ApiCustomerRepository implements CustomerRepository {
  constructor(private readonly client: ApiClient) {}

  async getCurrentCustomer(): Promise<Customer> {
    const data = await this.client.get<Customer>(placeholderPaths.currentCustomer);
    assertRecord(data, 'Customer');
    if (typeof data.id !== 'string' || typeof data.firstName !== 'string') {
      throw new ApiError('Customer response did not match the app model. See services/api/placeholders.ts.');
    }
    return data;
  }
}

export class ApiPolicyRepository implements PolicyRepository {
  constructor(private readonly client: ApiClient) {}

  async listPolicies(): Promise<Policy[]> {
    const data = await this.client.get<Policy[]>(placeholderPaths.policies);
    if (!Array.isArray(data)) {
      throw new ApiError('Policy response did not match the app model. See services/api/placeholders.ts.');
    }
    return data;
  }

  async getPolicy(id: string): Promise<Policy> {
    const data = await this.client.get<Policy>(placeholderPaths.policy(id));
    assertRecord(data, 'Policy');
    if (data.id !== id && typeof data.id !== 'string') {
      throw new ApiError('Policy response did not match the app model. See services/api/placeholders.ts.');
    }
    return data;
  }

  /** Optional later call. Mock mode slices history locally instead. */
  async getHistory(id: string, range: ChartRange): Promise<PolicyValue[]> {
    const data = await this.client.get<PolicyValue[]>(placeholderPaths.policyHistory(id));
    if (!Array.isArray(data)) {
      throw new ApiError('History response did not match the app model. See services/api/placeholders.ts.');
    }
    return sliceHistory(data, range);
  }
}

export class ApiProjectionRepository implements ProjectionRepository {
  constructor(private readonly client: ApiClient) {}

  /**
   * Scenarios are prototype assumptions, kept on the client until an
   * internal service owns them. project() is the call that hits the API.
   */
  async listScenarios(): Promise<ProjectionScenario[]> {
    return projectionScenarios.map((scenario) => ({ ...scenario }));
  }

  async getScenario(id: ProjectionScenarioId): Promise<ProjectionScenario> {
    return { ...findScenario(id) };
  }

  async project(request: ProjectionRequest): Promise<Projection> {
    const data = await this.client.post<Projection>(placeholderPaths.projection, request);
    if (!data || typeof data.projectedValue !== 'number' || !Array.isArray(data.points)) {
      throw new ApiError('Projection response did not match the app model. See services/api/placeholders.ts.');
    }
    return { ...data, illustrative: true };
  }
}

export class ApiNotificationRepository implements NotificationRepository {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<Notification[]> {
    const data = await this.client.get<Notification[]>(placeholderPaths.notifications);
    if (!Array.isArray(data)) {
      throw new ApiError('Notification response did not match the app model. See services/api/placeholders.ts.');
    }
    return data;
  }
}

export class ApiNextBestActionRepository implements NextBestActionRepository {
  constructor(private readonly client: ApiClient) {}

  async list(): Promise<NextBestAction[]> {
    const data = await this.client.get<NextBestAction[]>(placeholderPaths.nextBestActions);
    if (!Array.isArray(data)) {
      throw new ApiError('Recommendation response did not match the app model. See services/api/placeholders.ts.');
    }
    return data.map((item) => ({ ...item, surface: item.surface ?? 'guidance' }));
  }
}
