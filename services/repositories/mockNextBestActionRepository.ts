import type { NextBestAction, ProjectionScenario } from '@/models';
import { buildNextBestActions } from '@/services/recommendations/buildNextBestActions';
import type {
  CustomerRepository,
  NextBestActionRepository,
  PolicyRepository,
  ProjectionRepository,
} from '@/services/repositories/types';

export class MockNextBestActionRepository implements NextBestActionRepository {
  constructor(
    private readonly customers: CustomerRepository,
    private readonly policies: PolicyRepository,
    private readonly projections: ProjectionRepository,
  ) {}

  async list(customerId: string, scenario: ProjectionScenario): Promise<NextBestAction[]> {
    const customer = await this.customers.getCurrentCustomer();
    const policies = await this.policies.listPolicies(customerId);
    return buildNextBestActions({
      customer,
      policies,
      scenario,
      projections: this.projections,
    });
  }
}
