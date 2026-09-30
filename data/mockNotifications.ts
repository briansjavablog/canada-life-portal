import type { Notification } from '@/models';

export const mockNotifications: Notification[] = [
  {
    id: 'annual-review',
    title: 'Your annual retirement review is ready',
    body: 'See where your Retirement Plan stands and what age 65 could look like on your current contribution.',
    createdAt: '2026-09-28T09:00:00.000Z',
    read: false,
    href: '/projection',
    kind: 'review',
  },
  {
    id: 'extra-contribution',
    title: 'A small increase, illustrated',
    body: 'See how an extra €100 per month could affect your retirement.',
    createdAt: '2026-09-20T09:00:00.000Z',
    read: false,
    href: '/projection?monthly=600',
    kind: 'contribution',
  },
  {
    id: 'policy-statement',
    title: 'Your latest policy statement is available',
    body: 'The September statement for your Retirement Plan is ready to view.',
    createdAt: '2026-09-12T09:00:00.000Z',
    read: true,
    href: '/policy/retirement-plan',
    kind: 'document',
  },
];
