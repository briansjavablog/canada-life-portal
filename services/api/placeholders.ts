/**
 * Placeholder paths only.
 * These are NOT Canada Life API contracts. Replace each one when an
 * internal contract is agreed, and keep DATA_SOURCE=mock until then.
 */
export const placeholderPaths = {
  currentCustomer: '/placeholder/customer',
  policies: '/placeholder/policies',
  policy: (id: string) => `/placeholder/policies/${encodeURIComponent(id)}`,
  policyHistory: (id: string) => `/placeholder/policies/${encodeURIComponent(id)}/history`,
  projection: '/placeholder/projection',
  notifications: '/placeholder/notifications',
  nextBestActions: '/placeholder/next-best-actions',
} as const;
