import { mockPolicies } from '@/data/mockPolicies';
import type { Policy } from '@/models';
import { NotFoundError } from '@/services/errors';
import type { PolicyRepository } from '@/services/repositories/types';

function copyPolicy(policy: Policy): Policy {
  return {
    ...policy,
    history: policy.history.map((point) => ({ ...point })),
    contributions: policy.contributions.map((entry) => ({ ...entry })),
    documents: policy.documents.map((document) => ({ ...document })),
    allocation: policy.allocation.map((item) => ({ ...item })),
  };
}

export class MockPolicyRepository implements PolicyRepository {
  async listPolicies(customerId: string): Promise<Policy[]> {
    return mockPolicies.filter((policy) => policy.customerId === customerId).map(copyPolicy);
  }

  async getPolicy(id: string): Promise<Policy> {
    const policy = mockPolicies.find((item) => item.id === id);
    if (!policy) {
      throw new NotFoundError('That policy could not be found.');
    }
    return copyPolicy(policy);
  }
}
