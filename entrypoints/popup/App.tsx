import { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'stats' | 'settings'>('home');
  const [isEnabled, setIsEnabled] = useState(true);
  const [stats] = useState({
    propertiesFound: 156,
    buttonsAdded: 132,
    totalSavings: 8450,
  });

  const openAirbnb = () => {
    browser.tabs.create({ url: 'https://www.airbnb.com' });
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">💰</div>
          <div>
            <h1 className="logo-title">StayFinder</h1>
            <p className="logo-subtitle">Price Comparison</p>
          </div>
        </div>
        <div className={`status-badge ${isEnabled ? 'active' : 'inactive'}`}>
          {isEnabled ? '● Active' : '○ Inactive'}
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <button
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="nav-icon">📊</span>
          <span>Stats</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </button>
      </nav>

      {/* Content */}
      <main className="content">
        {activeTab === 'home' && (
          <div className="tab-content">
            <div className="welcome-card">
              <h2>Welcome! 👋</h2>
              <p>
                Save money by comparing Airbnb prices with direct booking sites.
                We show you the savings right on Airbnb!
              </p>
            </div>

            <div className="stats-quick">
              <div className="stat-box">
                <div className="stat-value">${stats.totalSavings}</div>
                <div className="stat-label">Total Savings</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">{stats.buttonsAdded}</div>
                <div className="stat-label">Properties Matched</div>
              </div>
            </div>

            <button className="cta-btn" onClick={openAirbnb}>
              🔍 Start Searching on Airbnb
            </button>

            <div className="info-box">
              <h3>How it works:</h3>
              <ol>
                <li>Search for properties on Airbnb</li>
                <li>See purple "Save $XX" buttons on matched listings</li>
                <li>Click to book directly and save money!</li>
              </ol>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="tab-content">
            <h2>Your Statistics 📊</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-icon">💰</div>
                <div>
                  <div className="stat-card-value">${stats.totalSavings}</div>
                  <div className="stat-card-label">Total Potential Savings</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">🏠</div>
                <div>
                  <div className="stat-card-value">{stats.propertiesFound}</div>
                  <div className="stat-card-label">Properties Found</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-card-icon">✨</div>
                <div>
                  <div className="stat-card-value">{stats.buttonsAdded}</div>
                  <div className="stat-card-label">Matches Found</div>
                </div>
              </div>
            </div>

            <div className="info-box">
              <p>Keep searching to find more savings! Every match helps you save money on your next stay.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h2>Settings ⚙️</h2>

            <div className="settings-list">
              <div className="setting-item">
                <div>
                  <h3>Extension Enabled</h3>
                  <p>Turn the extension on or off</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={(e) => setIsEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h3>Show Notifications</h3>
                  <p>Get notified about new savings</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div>
                  <h3>Auto-Compare Prices</h3>
                  <p>Automatically check for direct booking prices</p>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="info-box">
              <h3>About StayFinder</h3>
              <p>Version 1.0.0</p>
              <p>Compare Airbnb prices with direct booking sites and save money on every stay!</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>Made with ❤️ by StayFinder</p>
      </footer>
    </div>
  );
}

export default App;
