export type ProductType = 'retirement' | 'investment' | 'protection';

export type ChartRange = '1Y' | '3Y' | '5Y' | 'MAX';

export type PolicyValue = {
  date: string;
  value: number;
};

export type ContributionEntry = {
  id: string;
  date: string;
  amount: number;
  label: string;
};

export type PolicyDocument = {
  id: string;
  title: string;
  date: string;
  detail: string;
};

export type FundAllocation = {
  name: string;
  weight: number;
};

export type Policy = {
  id: string;
  customerId: string;
  productName: string;
  productType: ProductType;
  policyNumber: string;
  currentValue: number;
  currency: 'EUR';
  monthlyContribution: number | null;
  performanceYtd: number;
  openedOn: string;
  status: 'Active';
  fundName: string;
  annualManagementCharge: number;
  summary: string;
  contributionNote: string | null;
  supportsProjection: boolean;
  history: PolicyValue[];
  contributions: ContributionEntry[];
  documents: PolicyDocument[];
  allocation: FundAllocation[];
};
