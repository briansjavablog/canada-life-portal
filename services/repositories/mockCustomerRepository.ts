import { demoLogin, mockCustomer } from '@/data/mockCustomer';
import type { Customer } from '@/models';
import type { CustomerRepository } from '@/services/repositories/types';

export class MockCustomerRepository implements CustomerRepository {
  async getCurrentCustomer(): Promise<Customer> {
    return { ...mockCustomer, email: demoLogin.email };
  }
}
