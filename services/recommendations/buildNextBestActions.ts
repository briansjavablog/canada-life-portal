import type { Customer, NextBestAction, Policy, Projection, ProjectionScenario } from '@/models';
import type { ProjectionRepository } from '@/services/repositories/types';
import { formatEuro } from '@/utils/format';

type Input = {
  customer: Customer;
  policies: Policy[];
  scenario: ProjectionScenario;
  projections: ProjectionRepository;
};

/**
 * Turns customer and policy data into guidance prompts.
 * The UI only renders NextBestAction objects — it does not decide them.
 * A rules engine or model can replace this function later.
 */
export async function buildNextBestActions(input: Input): Promise<NextBestAction[]> {
  const retirement = input.policies.find((policy) => policy.supportsProjection && policy.monthlyContribution != null);
  const actions: NextBestAction[] = [];

  if (retirement && retirement.monthlyContribution != null) {
    const baseRequest = {
      currentValue: retirement.currentValue,
      monthlyContribution: retirement.monthlyContribution,
      currentAge: input.customer.age,
      retirementAge: input.customer.retirementAge,
      annualGrowthRate: input.scenario.annualGrowthRate,
    };
    const baseline: Projection = await input.projections.project(baseRequest);
    const increased = await input.projections.project({
      ...baseRequest,
      monthlyContribution: retirement.monthlyContribution + 100,
    });
    const extra = increased.projectedValue - baseline.projectedValue;

    actions.push({
      id: 'home-contribution',
      eyebrow: 'For you',
      title: 'Could a little extra today make a big difference tomorrow?',
      message: 'See how changing your pension contribution could affect your retirement outcome.',
      ctaLabel: 'Explore',
      href: '/projection',
      category: 'retirement',
      surface: 'home',
    });

    actions.push({
      id: 'boost-retirement',
      eyebrow: 'Retirement',
      title: 'Boost your retirement outlook',
      message: `Increasing your monthly pension contribution could improve your projected retirement outcome. An extra €100 a month is illustrated at about ${formatEuro(extra)} more by age ${input.customer.retirementAge}.`,
      ctaLabel: 'Explore contribution options',
      href: '/projection?monthly=600',
      category: 'retirement',
      surface: 'guidance',
    });
  }

  actions.push({
    id: 'protect-family',
    eyebrow: 'Protection',
    title: 'Protect what matters',
    message:
      'You already save for your future with Canada Life. Explore protection options that could help protect your family’s financial future.',
    ctaLabel: 'Explore protection',
    href: '/protection',
    category: 'protection',
    surface: 'guidance',
  });

  return actions;
}
