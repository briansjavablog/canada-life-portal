import type { ContributionEntry, Policy } from '@/models';
import { mockCustomer } from '@/data/mockCustomer';
import { buildMonthlyHistory } from '@/utils/history';

const AS_OF = '2026-09-30';

function monthlyContributions(amount: number, months: number, label: string): ContributionEntry[] {
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(Date.UTC(2026, 8 - index, 1));
    return {
      id: `contrib-${amount}-${index}`,
      date: date.toISOString().slice(0, 10),
      amount,
      label,
    };
  });
}

const retirementHistory = buildMonthlyHistory({
  asOf: AS_OF,
  months: 126,
  currentValue: 184_250,
  performanceYtd: 0.062,
  seed: 45,
});

const bondHistory = buildMonthlyHistory({
  asOf: AS_OF,
  months: 87,
  currentValue: 143_200,
  performanceYtd: 0.048,
  seed: 19,
});

export const mockPolicies: Policy[] = [
  {
    id: 'retirement-plan',
    customerId: mockCustomer.id,
    productName: 'Retirement Plan',
    productType: 'retirement',
    policyNumber: 'RP-204518',
    currentValue: 184_250,
    currency: 'EUR',
    monthlyContribution: 500,
    performanceYtd: 0.062,
    openedOn: '2016-03-15',
    status: 'Active',
    fundName: 'Balanced Growth fund',
    annualManagementCharge: 0.0075,
    summary: 'A regular-contribution pension plan building a pot for retirement at 65.',
    contributionNote: 'Your monthly contribution increased from €350 to €500 in March 2024.',
    supportsProjection: true,
    history: retirementHistory,
    contributions: [
      ...monthlyContributions(500, 6, 'Monthly contribution'),
      {
        id: 'contrib-older',
        date: '2024-02-01',
        amount: 350,
        label: 'Monthly contribution',
      },
    ],
    documents: [
      {
        id: 'rp-statement-2025',
        title: 'Annual statement 2025',
        date: '2026-03-18',
        detail:
          'Summarises contributions, charges and the change in policy value for 2025. Preview is not connected in this prototype.',
      },
      {
        id: 'rp-schedule',
        title: 'Policy schedule',
        date: '2016-03-15',
        detail: 'Confirms the plan start date, contribution and selected retirement age. Preview is not connected in this prototype.',
      },
      {
        id: 'rp-illustration',
        title: 'Illustration',
        date: '2026-09-01',
        detail: 'An illustrative view of the plan to age 65. The in-app projection is separate and also illustrative.',
      },
    ],
    allocation: [
      { name: 'Global equities', weight: 0.46 },
      { name: 'Corporate bonds', weight: 0.24 },
      { name: 'Government bonds', weight: 0.12 },
      { name: 'Property', weight: 0.08 },
      { name: 'Diversified alternatives', weight: 0.06 },
      { name: 'Cash', weight: 0.04 },
    ],
  },
  {
    id: 'investment-bond',
    customerId: mockCustomer.id,
    productName: 'Investment Bond',
    productType: 'investment',
    policyNumber: 'IB-883421',
    currentValue: 143_200,
    currency: 'EUR',
    monthlyContribution: null,
    performanceYtd: 0.048,
    openedOn: '2019-06-12',
    status: 'Active',
    fundName: 'Managed fund',
    annualManagementCharge: 0.009,
    summary: 'A lump-sum investment bond. There is no regular contribution on this policy.',
    contributionNote: null,
    supportsProjection: false,
    history: bondHistory,
    contributions: [
      {
        id: 'bond-premium',
        date: '2019-06-12',
        amount: 100_000,
        label: 'Initial premium',
      },
    ],
    documents: [
      {
        id: 'ib-statement-2025',
        title: 'Bond statement 2025',
        date: '2026-02-20',
        detail: 'Shows the bond value and fund movement for 2025. Preview is not connected in this prototype.',
      },
      {
        id: 'ib-features',
        title: 'Key features',
        date: '2019-06-12',
        detail: 'Describes the bond structure, charges and how withdrawals would work. Preview is not connected in this prototype.',
      },
    ],
    allocation: [
      { name: 'Global equities', weight: 0.38 },
      { name: 'Corporate bonds', weight: 0.32 },
      { name: 'Government bonds', weight: 0.18 },
      { name: 'Property', weight: 0.07 },
      { name: 'Cash', weight: 0.05 },
    ],
  },
];
