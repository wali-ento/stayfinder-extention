// Simple cache to prevent duplicate API calls
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute

/**
 * Send listing IDs to background script
 */
export function sendListingIds(ids: string[]) {
  const listingData = ids.map(id => ({ airbnb_id: id }));
  
  browser.runtime.sendMessage(listingData)
    .then(() => console.log('IDs sent to background'))
    .catch((err) => console.error('Error sending IDs:', err));
}

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

