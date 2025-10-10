export default defineBackground(() => {
  console.log("🚀 StayFinder Background Script Loaded");

  // Handle messages from content scripts
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Message received:", message.type);

    // Handle async responses
    (async () => {
      try {
        if (message.type === "match-property") {
          const { apiClient } = await import("../utils/api-client");
          const result = await apiClient.matchProperty(message.data);
          sendResponse({ success: true, data: result });
        } else if (message.type === "batch-match") {
          const { apiClient } = await import("../utils/api-client");
          const result = await apiClient.batchMatch(message.data);
          sendResponse({ success: true, data: result });
        } else if (message.type === "track-event") {
          const { apiClient } = await import("../utils/api-client");
          const result = await apiClient.trackEvent(message.data);
          sendResponse({ success: true, data: result });
        } else if (message.type === "track-booking") {
          const { apiClient } = await import("../utils/api-client");
          const result = await apiClient.trackBookingCompleted(message.data);
          sendResponse({ success: true, data: result });
        } else {
          sendResponse({ success: false, error: "Unknown message type" });
        }
      } catch (error) {
        console.error("❌ Background script error:", error);
        sendResponse({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })();

    // Return true to indicate async response
    return true;
  });

  // Process retry queue on startup
  (async () => {
    const { getRetryQueue, removeFromRetryQueue } = await import(
      "../utils/storage"
    );
    const { apiClient } = await import("../utils/api-client");

    const queue = await getRetryQueue();
    console.log(`📦 Processing ${queue.length} queued events`);

    for (const event of queue) {
      try {
        if (event.type === "track_event") {
          await apiClient.trackEvent(event.data);
        } else if (event.type === "track_booking") {
          await apiClient.trackBookingCompleted(event.data);
        }

        await removeFromRetryQueue(event.id);
        console.log("✅ Queued event processed:", event.id);
      } catch (error) {
        console.error("❌ Failed to process queued event:", error);
      }
    }
  })();

  // Listen for extension install/update
  chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
      console.log("🎉 Extension installed!");

      // Initialize default settings
      const { setSettings, setUserStats } = await import("../utils/storage");
      await setSettings({
        enabled: true,
        enable_search_badges: true,
        enable_listing_widget: true,
        enable_tracking: true,
      });

      await setUserStats({
        total_savings: 0,
        properties_compared: 0,
        bookings_completed: 0,
        session_id: `sf_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      });

      // Open welcome page
      chrome.tabs.create({
        url: "https://stayfinder.com/extension/welcome",
      });
    } else if (details.reason === "update") {
      console.log("🔄 Extension updated!");
    }
  });

  // Periodic cleanup of expired cache (every hour)
  const CACHE_CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

  setInterval(async () => {
    console.log("🧹 Running cache cleanup...");
    const { clearCache } = await import("../utils/storage");
    // Note: clearCache removes all expired items automatically
    const all = await chrome.storage.local.get(null);
    const cacheKeys = Object.keys(all).filter((key) =>
      key.startsWith("cache_")
    );

    for (const key of cacheKeys) {
      const cached = all[key];
      if (cached.expires_at && Date.now() > cached.expires_at) {
        await chrome.storage.local.remove(key);
      }
    }

    console.log("✅ Cache cleanup complete");
  }, CACHE_CLEANUP_INTERVAL);
});

