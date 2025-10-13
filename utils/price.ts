/**
 * Calculate random savings for demo
 */
export function generateSavings(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

