import { useState, useEffect } from "react";
import {
  getUserStats,
  getSettings,
  updateSettings,
  clearCache,
  clearRetryQueue,
} from "../../utils/storage";
import type { UserStats, ExtensionSettings } from "../../utils/storage";
import "./App.css";

export default function App() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [settings, setSettingsState] = useState<ExtensionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsData, settingsData] = await Promise.all([
        getUserStats(),
        getSettings(),
      ]);
      setStats(statsData);
      setSettingsState(settingsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      showMessage("error", "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleSettingChange(
    key: keyof ExtensionSettings,
    value: boolean
  ) {
    if (!settings) return;

    const updated = { ...settings, [key]: value };
    setSettingsState(updated);

    try {
      await updateSettings({ [key]: value });
      showMessage("success", "Settings saved");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showMessage("error", "Failed to save settings");
    }
  }

  async function handleClearCache() {
    setSaving(true);
    try {
      await clearCache();
      showMessage("success", "Cache cleared successfully");
    } catch (error) {
      console.error("Failed to clear cache:", error);
      showMessage("error", "Failed to clear cache");
    } finally {
      setSaving(false);
    }
  }

  async function handleClearQueue() {
    setSaving(true);
    try {
      await clearRetryQueue();
      showMessage("success", "Retry queue cleared successfully");
    } catch (error) {
      console.error("Failed to clear queue:", error);
      showMessage("error", "Failed to clear queue");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetStats() {
    if (
      !confirm(
        "Are you sure you want to reset all statistics? This cannot be undone."
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      const { setUserStats } = await import("../../utils/storage");
      await setUserStats({
        total_savings: 0,
        properties_compared: 0,
        bookings_completed: 0,
        session_id: stats?.session_id || `sf_${Date.now()}`,
      });
      await loadData();
      showMessage("success", "Statistics reset successfully");
    } catch (error) {
      console.error("Failed to reset stats:", error);
      showMessage("error", "Failed to reset statistics");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="options-container">
        <div className="options-loading">Loading settings...</div>
      </div>
    );
  }

  if (!stats || !settings) {
    return (
      <div className="options-container">
        <div className="options-error">Failed to load extension data</div>
      </div>
    );
  }

  return (
    <div className="options-container">
      <div className="options-header">
        <div className="options-header-icon">⚙️</div>
        <h1 className="options-header-title">StayFinder Extension Settings</h1>
      </div>

      {message && (
        <div className={`options-message options-message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="options-section">
        <h2 className="options-section-title">Features</h2>
        <div className="options-section-content">
          <div className="options-setting">
            <div className="options-setting-info">
              <div className="options-setting-label">Enable Extension</div>
              <div className="options-setting-description">
                Turn the extension on or off globally
              </div>
            </div>
            <label className="options-switch">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) =>
                  handleSettingChange("enabled", e.target.checked)
                }
              />
              <span className="options-switch-slider"></span>
            </label>
          </div>

          <div className="options-setting">
            <div className="options-setting-info">
              <div className="options-setting-label">Search Results Badges</div>
              <div className="options-setting-description">
                Show savings badges on Airbnb search results
              </div>
            </div>
            <label className="options-switch">
              <input
                type="checkbox"
                checked={settings.enable_search_badges}
                onChange={(e) =>
                  handleSettingChange("enable_search_badges", e.target.checked)
                }
                disabled={!settings.enabled}
              />
              <span className="options-switch-slider"></span>
            </label>
          </div>

          <div className="options-setting">
            <div className="options-setting-info">
              <div className="options-setting-label">Listing Page Widget</div>
              <div className="options-setting-description">
                Show price comparison widget on Airbnb listing pages
              </div>
            </div>
            <label className="options-switch">
              <input
                type="checkbox"
                checked={settings.enable_listing_widget}
                onChange={(e) =>
                  handleSettingChange("enable_listing_widget", e.target.checked)
                }
                disabled={!settings.enabled}
              />
              <span className="options-switch-slider"></span>
            </label>
          </div>

          <div className="options-setting">
            <div className="options-setting-info">
              <div className="options-setting-label">Booking Tracking</div>
              <div className="options-setting-description">
                Track bookings completed on property manager websites
              </div>
            </div>
            <label className="options-switch">
              <input
                type="checkbox"
                checked={settings.enable_tracking}
                onChange={(e) =>
                  handleSettingChange("enable_tracking", e.target.checked)
                }
                disabled={!settings.enabled}
              />
              <span className="options-switch-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="options-section">
        <h2 className="options-section-title">Your Statistics</h2>
        <div className="options-section-content">
          <div className="options-stats-grid">
            <div className="options-stat-card">
              <div className="options-stat-value">
                ${stats.total_savings.toFixed(2)}
              </div>
              <div className="options-stat-label">Total Savings</div>
            </div>
            <div className="options-stat-card">
              <div className="options-stat-value">
                {stats.properties_compared}
              </div>
              <div className="options-stat-label">Properties Compared</div>
            </div>
            <div className="options-stat-card">
              <div className="options-stat-value">
                {stats.bookings_completed}
              </div>
              <div className="options-stat-label">Bookings Completed</div>
            </div>
          </div>
        </div>
      </div>

      <div className="options-section">
        <h2 className="options-section-title">Data Management</h2>
        <div className="options-section-content">
          <div className="options-actions">
            <button
              className="options-button options-button-secondary"
              onClick={handleClearCache}
              disabled={saving}
            >
              Clear Cache
            </button>
            <button
              className="options-button options-button-secondary"
              onClick={handleClearQueue}
              disabled={saving}
            >
              Clear Retry Queue
            </button>
            <button
              className="options-button options-button-danger"
              onClick={handleResetStats}
              disabled={saving}
            >
              Reset Statistics
            </button>
          </div>
        </div>
      </div>

      <div className="options-section">
        <h2 className="options-section-title">About</h2>
        <div className="options-section-content">
          <div className="options-about">
            <p>
              <strong>StayFinder Extension</strong> helps you save money by
              finding direct booking options for vacation rentals listed on
              Airbnb.
            </p>
            <p>Version: 1.0.0</p>
            <p>
              <a
                href="https://stayfinder.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="options-link"
              >
                Privacy Policy
              </a>
              {" | "}
              <a
                href="https://stayfinder.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="options-link"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

