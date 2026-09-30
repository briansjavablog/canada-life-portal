import type {
  Customer,
  NextBestAction,
  Notification,
  Policy,
  Projection,
  ProjectionRequest,
  ProjectionScenario,
  ProjectionScenarioId,
} from '@/models';

export interface CustomerRepository {
  getCurrentCustomer(): Promise<Customer>;
}

export interface PolicyRepository {
  listPolicies(customerId: string): Promise<Policy[]>;
  getPolicy(id: string): Promise<Policy>;
}

export interface ProjectionRepository {
  listScenarios(): Promise<ProjectionScenario[]>;
  getScenario(id: ProjectionScenarioId): Promise<ProjectionScenario>;
  project(request: ProjectionRequest): Promise<Projection>;
}

export interface NotificationRepository {
  list(customerId: string): Promise<Notification[]>;
}

export interface NextBestActionRepository {
  list(customerId: string, scenario: ProjectionScenario): Promise<NextBestAction[]>;
}

export type Repositories = {
  customers: CustomerRepository;
  policies: PolicyRepository;
  projections: ProjectionRepository;
  notifications: NotificationRepository;
  actions: NextBestActionRepository;
};
