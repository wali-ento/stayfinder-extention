// Simple cache to prevent duplicate API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

/**
 * Simple cache helper - returns cached data if still valid, otherwise fetches new data
 */
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>
): Promise<T | null> {
  // Check if we have cached data that's still valid
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }
  
  // Fetch new data
  try {
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  } catch (error) {
    console.error('Fetch failed:', error);
    return null;
  }
}

/**
 * Chunk an array into smaller arrays of a given size
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}