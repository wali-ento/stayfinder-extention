// Chrome Storage API wrapper with type safety

export interface UserStats {
  total_savings: number;
  properties_compared: number;
  bookings_completed: number;
  session_id: string;
}

export interface CachedMatch {
  data: any;
  timestamp: number;
  expires_at: number;
}

export interface ExtensionSettings {
  enabled: boolean;
  enable_search_badges: boolean;
  enable_listing_widget: boolean;
  enable_tracking: boolean;
}

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  enable_search_badges: true,
  enable_listing_widget: true,
  enable_tracking: true,
};

const DEFAULT_STATS: UserStats = {
  total_savings: 0,
  properties_compared: 0,
  bookings_completed: 0,
  session_id: generateSessionId(),
};

function generateSessionId(): string {
  return `sf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Cache management
export async function getCachedMatch(airbnbId: string): Promise<any | null> {
  const key = `cache_match_${airbnbId}`;
  const result = await chrome.storage.local.get(key);

  if (!result[key]) return null;

  const cached: CachedMatch = result[key];

  // Check if expired (1 hour TTL)
  if (Date.now() > cached.expires_at) {
    await chrome.storage.local.remove(key);
    return null;
  }

  return cached.data;
}

export async function setCachedMatch(
  airbnbId: string,
  data: any
): Promise<void> {
  const key = `cache_match_${airbnbId}`;
  const cached: CachedMatch = {
    data,
    timestamp: Date.now(),
    expires_at: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  await chrome.storage.local.set({ [key]: cached });
}

export async function clearCache(): Promise<void> {
  const all = await chrome.storage.local.get(null);
  const cacheKeys = Object.keys(all).filter((key) => key.startsWith("cache_"));
  await chrome.storage.local.remove(cacheKeys);
}

// User stats management
export async function getUserStats(): Promise<UserStats> {
  const result = await chrome.storage.local.get("user_stats");

  if (!result.user_stats) {
    await setUserStats(DEFAULT_STATS);
    return DEFAULT_STATS;
  }

  return result.user_stats;
}

export async function setUserStats(stats: UserStats): Promise<void> {
  await chrome.storage.local.set({ user_stats: stats });
}

export async function updateUserStats(
  updates: Partial<UserStats>
): Promise<UserStats> {
  const current = await getUserStats();
  const updated = { ...current, ...updates };
  await setUserStats(updated);
  return updated;
}

export async function incrementSavings(amount: number): Promise<void> {
  const stats = await getUserStats();
  await setUserStats({
    ...stats,
    total_savings: stats.total_savings + amount,
    properties_compared: stats.properties_compared + 1,
  });
}

export async function incrementBookings(): Promise<void> {
  const stats = await getUserStats();
  await setUserStats({
    ...stats,
    bookings_completed: stats.bookings_completed + 1,
  });
}

// Settings management
export async function getSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get("settings");

  if (!result.settings) {
    await setSettings(DEFAULT_SETTINGS);
    return DEFAULT_SETTINGS;
  }

  return result.settings;
}

export async function setSettings(settings: ExtensionSettings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

export async function updateSettings(
  updates: Partial<ExtensionSettings>
): Promise<ExtensionSettings> {
  const current = await getSettings();
  const updated = { ...current, ...updates };
  await setSettings(updated);
  return updated;
}

// Session ID
export async function getSessionId(): Promise<string> {
  const stats = await getUserStats();
  return stats.session_id;
}

// Retry queue for failed API calls
export interface QueuedEvent {
  id: string;
  type: string;
  data: any;
  attempts: number;
  created_at: number;
}

export async function addToRetryQueue(type: string, data: any): Promise<void> {
  const result = await chrome.storage.local.get("retry_queue");
  const queue: QueuedEvent[] = result.retry_queue || [];

  const event: QueuedEvent = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    attempts: 0,
    created_at: Date.now(),
  };

  queue.push(event);
  await chrome.storage.local.set({ retry_queue: queue });
}

export async function getRetryQueue(): Promise<QueuedEvent[]> {
  const result = await chrome.storage.local.get("retry_queue");
  return result.retry_queue || [];
}

export async function removeFromRetryQueue(id: string): Promise<void> {
  const queue = await getRetryQueue();
  const filtered = queue.filter((event) => event.id !== id);
  await chrome.storage.local.set({ retry_queue: filtered });
}

export async function clearRetryQueue(): Promise<void> {
  await chrome.storage.local.set({ retry_queue: [] });
}

// Processed items tracking (to avoid duplicates)
export async function isProcessed(id: string): Promise<boolean> {
  const key = `processed_${id}`;
  const result = await chrome.storage.local.get(key);
  return !!result[key];
}

export async function markAsProcessed(id: string): Promise<void> {
  const key = `processed_${id}`;
  await chrome.storage.local.set({ [key]: true });
}

