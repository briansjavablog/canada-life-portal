import type { Policy } from '@/models';

export function summarisePortfolio(policies: Policy[]) {
  const totalValue = policies.reduce((sum, policy) => sum + policy.currentValue, 0);
  const openingValue = policies.reduce(
    (sum, policy) => sum + policy.currentValue / (1 + policy.performanceYtd),
    0,
  );
  const movement = totalValue - openingValue;
  const performanceYtd = openingValue === 0 ? 0 : movement / openingValue;

  return { totalValue, movement, performanceYtd };
}
