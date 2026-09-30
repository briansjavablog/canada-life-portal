export type NextBestActionCategory = 'retirement' | 'protection';

export type NextBestAction = {
  id: string;
  eyebrow: string;
  title: string;
  message: string;
  ctaLabel: string;
  href: string;
  category: NextBestActionCategory;
  /** Where the portal should surface this prompt. */
  surface: 'home' | 'guidance';
};
