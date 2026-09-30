import type { Customer } from '@/models';

export const mockCustomer: Customer = {
  id: 'cust-alex-morgan',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  age: 45,
  retirementAge: 65,
  customerNumber: 'CL-EU-104582',
};

export const demoLogin = {
  email: mockCustomer.email,
  password: 'demo',
};
