export function formatEuro(value: number): string {
  const rounded = Math.round(value);
  return `€${rounded.toLocaleString('en-IE')}`;
}

export function formatEuroCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    return `€${(value / 1_000_000).toFixed(1)}m`;
  }
  if (abs >= 10_000) {
    return `€${Math.round(value / 1000)}k`;
  }
  return formatEuro(value);
}

export function formatPercent(ratio: number): string {
  const value = ratio * 100;
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatGrowthRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatMonth(iso: string): string {
  const [year, month] = iso.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, 1));
  return date.toLocaleDateString('en-IE', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
