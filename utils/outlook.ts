export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Prototype rule for the outlook label.
 * A future rules engine can replace this without changing the screen.
 */
export function describeOutlook(projectedValue: number): { label: string; onTrack: boolean } {
  if (projectedValue >= 550_000) {
    return { label: 'On track', onTrack: true };
  }
  return { label: 'Worth a review', onTrack: false };
}
