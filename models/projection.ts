export type ProjectionScenarioId = 'cautious' | 'balanced' | 'growth';

export type ProjectionScenario = {
  id: ProjectionScenarioId;
  label: string;
  description: string;
  annualGrowthRate: number;
};

export type ProjectionRequest = {
  currentValue: number;
  monthlyContribution: number;
  currentAge: number;
  retirementAge: number;
  annualGrowthRate: number;
};

export type ProjectionPoint = {
  age: number;
  value: number;
};

export type Projection = {
  request: ProjectionRequest;
  projectedValue: number;
  points: ProjectionPoint[];
  /** Always true in this prototype. A live engine would own this flag. */
  illustrative: true;
};
