/**
 * Calculate random savings for demo
 */
export function generateSavings(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility to get a consistent savings value for a given listing ID.
 */
const listingIdSavings = new Map<string, number>();

export function getSavingsForListingId(listingId: string, min: number, max: number): number {
  if (listingIdSavings.has(listingId)) {
    return listingIdSavings.get(listingId)!;
  }
  const savings = generateSavings(min, max);
  listingIdSavings.set(listingId, savings);
  return savings;
}

