import type { Projection, ProjectionPoint, ProjectionRequest } from '@/models';

/**
 * Illustrative annual growth chosen so Alex's current €500 plan
 * lands on €612,000 at age 65. This is a prototype assumption,
 * not a Canada Life pricing or projection basis.
 */
export const BALANCED_ANNUAL_GROWTH = 0.041836497148109775;

export function futureValue(request: ProjectionRequest, years: number): number {
  if (years <= 0) {
    return request.currentValue;
  }

  const months = Math.round(years * 12);
  const monthlyRate = request.annualGrowthRate / 12;

  if (monthlyRate === 0) {
    return request.currentValue + request.monthlyContribution * months;
  }

  const growth = Math.pow(1 + monthlyRate, months);
  const pot = request.currentValue * growth;
  const contributions = request.monthlyContribution * ((growth - 1) / monthlyRate);
  return pot + contributions;
}

export function buildProjection(request: ProjectionRequest): Projection {
  const years = Math.max(0, request.retirementAge - request.currentAge);
  const points: ProjectionPoint[] = [];

  for (let year = 0; year <= years; year += 1) {
    points.push({
      age: request.currentAge + year,
      value: futureValue(request, year),
    });
  }

  const projectedValue = points[points.length - 1]?.value ?? request.currentValue;

  return {
    request,
    projectedValue,
    points,
    illustrative: true,
  };
}
