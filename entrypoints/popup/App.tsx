import { useState, useEffect } from "react";
import { StatsDashboard } from "../../components/StatsDashboard";
import { getUserStats, getSettings, updateSettings } from "../../utils/storage";
import type { UserStats, ExtensionSettings } from "../../utils/storage";
import "./App.css";

export default function App() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [settings, setSettingsState] = useState<ExtensionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    // Listen for storage changes
    const handleStorageChange = () => {
      loadData();
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
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
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    if (!settings) return;

    const newEnabled = !settings.enabled;
    await updateSettings({ enabled: newEnabled });
    setSettingsState({ ...settings, enabled: newEnabled });
  }

  async function openStayFinder() {
    await chrome.tabs.create({ url: "https://stayfinder.com" });
  }

  async function openSettings() {
    await chrome.runtime.openOptionsPage();
  }

  if (loading) {
    return (
      <div className="popup-container">
        <div className="popup-loading">Loading...</div>
      </div>
    );
  }

  if (!stats || !settings) {
    return (
      <div className="popup-container">
        <div className="popup-error">Failed to load extension data</div>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div className="popup-header-icon">🏠</div>
        <h1 className="popup-header-title">StayFinder</h1>
      </div>

      <StatsDashboard stats={stats} />

      <div className="popup-toggle">
        <span className="popup-toggle-label">Extension:</span>
        <label className="popup-switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={handleToggle}
          />
          <span className="popup-switch-slider"></span>
        </label>
        <span className="popup-toggle-status">
          {settings.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="popup-actions">
        <button
          className="popup-button popup-button-primary"
          onClick={openStayFinder}
        >
          Visit StayFinder
        </button>
        <button
          className="popup-button popup-button-secondary"
          onClick={openSettings}
        >
          Settings
        </button>
      </div>

      <div className="popup-footer">
        <p className="popup-footer-text">
          Helping travelers save money on vacation rentals
        </p>
      </div>
    </div>
  );
}

