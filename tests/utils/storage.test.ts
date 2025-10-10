import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getUserStats,
  setUserStats,
  updateUserStats,
  incrementSavings,
  incrementBookings,
  getSettings,
  setSettings,
  updateSettings,
  getCachedMatch,
  setCachedMatch,
  addToRetryQueue,
  getRetryQueue,
  isProcessed,
  markAsProcessed,
} from "../../utils/storage";

describe("Storage Utils", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Default mock implementation
    (chrome.storage.local.get as any).mockResolvedValue({});
    (chrome.storage.local.set as any).mockResolvedValue(undefined);
  });

  describe("User Stats", () => {
    it("should get default user stats when none exist", async () => {
      const stats = await getUserStats();

      expect(stats).toBeDefined();
      expect(stats.total_savings).toBe(0);
      expect(stats.properties_compared).toBe(0);
      expect(stats.bookings_completed).toBe(0);
      expect(stats.session_id).toBeDefined();
    });

    it("should get existing user stats", async () => {
      const mockStats = {
        total_savings: 450,
        properties_compared: 23,
        bookings_completed: 3,
        session_id: "test_session",
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        user_stats: mockStats,
      });

      const stats = await getUserStats();
      expect(stats).toEqual(mockStats);
    });

    it("should update user stats", async () => {
      const initialStats = {
        total_savings: 100,
        properties_compared: 5,
        bookings_completed: 1,
        session_id: "test_session",
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        user_stats: initialStats,
      });

      const updated = await updateUserStats({ total_savings: 250 });

      expect(updated.total_savings).toBe(250);
      expect(updated.properties_compared).toBe(5);
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it("should increment savings", async () => {
      const initialStats = {
        total_savings: 100,
        properties_compared: 5,
        bookings_completed: 1,
        session_id: "test_session",
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        user_stats: initialStats,
      });

      await incrementSavings(50);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        user_stats: expect.objectContaining({
          total_savings: 150,
          properties_compared: 6,
        }),
      });
    });

    it("should increment bookings", async () => {
      const initialStats = {
        total_savings: 100,
        properties_compared: 5,
        bookings_completed: 1,
        session_id: "test_session",
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        user_stats: initialStats,
      });

      await incrementBookings();

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        user_stats: expect.objectContaining({
          bookings_completed: 2,
        }),
      });
    });
  });

  describe("Settings", () => {
    it("should get default settings when none exist", async () => {
      const settings = await getSettings();

      expect(settings).toBeDefined();
      expect(settings.enabled).toBe(true);
      expect(settings.enable_search_badges).toBe(true);
      expect(settings.enable_listing_widget).toBe(true);
      expect(settings.enable_tracking).toBe(true);
    });

    it("should get existing settings", async () => {
      const mockSettings = {
        enabled: false,
        enable_search_badges: false,
        enable_listing_widget: true,
        enable_tracking: true,
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        settings: mockSettings,
      });

      const settings = await getSettings();
      expect(settings).toEqual(mockSettings);
    });

    it("should update settings", async () => {
      const initialSettings = {
        enabled: true,
        enable_search_badges: true,
        enable_listing_widget: true,
        enable_tracking: true,
      };

      (chrome.storage.local.get as any).mockResolvedValue({
        settings: initialSettings,
      });

      const updated = await updateSettings({ enabled: false });

      expect(updated.enabled).toBe(false);
      expect(updated.enable_search_badges).toBe(true);
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });
  });

  describe("Cache", () => {
    it("should return null for non-existent cache", async () => {
      const cached = await getCachedMatch("12345");
      expect(cached).toBeNull();
    });

    it("should return null for expired cache", async () => {
      const expiredCache = {
        cache_match_12345: {
          data: { matched: true },
          timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          expires_at: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago (expired)
        },
      };

      (chrome.storage.local.get as any).mockResolvedValue(expiredCache);

      const cached = await getCachedMatch("12345");
      expect(cached).toBeNull();
      expect(chrome.storage.local.remove).toHaveBeenCalledWith(
        "cache_match_12345"
      );
    });

    it("should return valid cached data", async () => {
      const mockData = { matched: true, savings: 150 };
      const validCache = {
        cache_match_12345: {
          data: mockData,
          timestamp: Date.now(),
          expires_at: Date.now() + 60 * 60 * 1000, // 1 hour from now
        },
      };

      (chrome.storage.local.get as any).mockResolvedValue(validCache);

      const cached = await getCachedMatch("12345");
      expect(cached).toEqual(mockData);
    });

    it("should set cached match", async () => {
      const mockData = { matched: true, savings: 150 };

      await setCachedMatch("12345", mockData);

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        cache_match_12345: expect.objectContaining({
          data: mockData,
        }),
      });
    });
  });

  describe("Retry Queue", () => {
    it("should add events to retry queue", async () => {
      (chrome.storage.local.get as any).mockResolvedValue({ retry_queue: [] });

      await addToRetryQueue("track_event", { event_type: "badge_click" });

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        retry_queue: expect.arrayContaining([
          expect.objectContaining({
            type: "track_event",
            data: { event_type: "badge_click" },
            attempts: 0,
          }),
        ]),
      });
    });

    it("should get retry queue", async () => {
      const mockQueue = [
        {
          id: "1",
          type: "track_event",
          data: {},
          attempts: 0,
          created_at: Date.now(),
        },
      ];

      (chrome.storage.local.get as any).mockResolvedValue({
        retry_queue: mockQueue,
      });

      const queue = await getRetryQueue();
      expect(queue).toEqual(mockQueue);
    });

    it("should return empty array when queue doesnt exist", async () => {
      const queue = await getRetryQueue();
      expect(queue).toEqual([]);
    });
  });

  describe("Processed Items", () => {
    it("should check if item is processed", async () => {
      (chrome.storage.local.get as any).mockResolvedValue({
        processed_test123: true,
      });

      const processed = await isProcessed("test123");
      expect(processed).toBe(true);
    });

    it("should return false for unprocessed items", async () => {
      const processed = await isProcessed("test123");
      expect(processed).toBe(false);
    });

    it("should mark item as processed", async () => {
      await markAsProcessed("test123");

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        processed_test123: true,
      });
    });
  });
});

