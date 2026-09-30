import type { ChartRange, PolicyValue } from '@/models';

function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shiftMonth(asOf: string, offset: number): string {
  const [year, month] = asOf.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1));
  return date.toISOString().slice(0, 10);
}

/** Deterministic monthly series ending on the current value, with the last year matching performanceYtd. */
export function buildMonthlyHistory(options: {
  asOf: string;
  months: number;
  currentValue: number;
  performanceYtd: number;
  seed: number;
}): PolicyValue[] {
  const { asOf, months, currentValue, performanceYtd, seed } = options;
  const random = mulberry32(seed);
  const values = new Array<number>(months + 1);
  const last = months;
  const startValue = currentValue / Math.pow(1.055, months / 12);

  for (let index = 0; index <= last; index += 1) {
    const progress = index / last;
    const trend = startValue * Math.pow(currentValue / startValue, progress);
    const noise = 1 + (random() - 0.5) * 0.035;
    values[index] = trend * noise;
  }

  const yearAgoIndex = Math.max(0, last - 12);
  values[yearAgoIndex] = currentValue / (1 + performanceYtd);
  values[last] = currentValue;

  for (let index = yearAgoIndex + 1; index < last; index += 1) {
    const progress = (index - yearAgoIndex) / (last - yearAgoIndex);
    const base = values[yearAgoIndex] + (currentValue - values[yearAgoIndex]) * progress;
    const ripple = Math.sin(index * 0.9 + seed) * currentValue * 0.004;
    values[index] = base + ripple;
  }

  values[last] = currentValue;

  return values.map((value, index) => ({
    date: shiftMonth(asOf, index - last),
    value: Math.max(0, Math.round(value)),
  }));
}

const RANGE_MONTHS: Record<ChartRange, number | null> = {
  '1Y': 12,
  '3Y': 36,
  '5Y': 60,
  MAX: null,
};

export function sliceHistory(history: PolicyValue[], range: ChartRange): PolicyValue[] {
  const months = RANGE_MONTHS[range];
  if (months == null || history.length <= months + 1) {
    return history;
  }
  return history.slice(-(months + 1));
}

export function seriesChange(history: PolicyValue[]): { amount: number; ratio: number } {
  if (history.length < 2) {
    return { amount: 0, ratio: 0 };
  }
  const opening = history[0].value;
  const closing = history[history.length - 1].value;
  const amount = closing - opening;
  return { amount, ratio: opening === 0 ? 0 : amount / opening };
}
