import type { ProjectionScenario } from '@/models';
import { BALANCED_ANNUAL_GROWTH } from '@/utils/projectionMath';

export const projectionScenarios: ProjectionScenario[] = [
  {
    id: 'cautious',
    label: 'Cautious',
    description: 'Lower assumed growth',
    annualGrowthRate: 0.03,
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Default illustrative assumption',
    annualGrowthRate: BALANCED_ANNUAL_GROWTH,
  },
  {
    id: 'growth',
    label: 'Growth',
    description: 'Higher assumed growth',
    annualGrowthRate: 0.06,
  },
];

export function findScenario(id: string): ProjectionScenario {
  const scenario = projectionScenarios.find((item) => item.id === id);
  if (!scenario) {
    throw new Error(`Unknown projection scenario: ${id}`);
  }
  return scenario;
}
