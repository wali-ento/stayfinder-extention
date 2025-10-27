import { LOGO_ICON } from '@/assets/svg-icons';
import './App.css';
import { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
function App() {
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      if (tabs[0]?.url) {
        const url = tabs[0].url;
        const isAirbnb = url.includes('airbnb.com');
        setIsSupported(isAirbnb);
      }
    });
  }, []);

  const handleButtonClick = () => {
    if (!isSupported) {
      browser.tabs.create({ url: 'https://www.airbnb.com' });
    } else {
      window.close();
    }
  };
  return (
    <div className="stayfinder-card">
      <div className="header">
        <div className="logo-section">
          <div className="logo">
            <div className="house-icon" dangerouslySetInnerHTML={{ __html: LOGO_ICON }}>
            </div>
            <span className="logo-text">Stay<em>Finder</em></span>
          </div>
        </div>
        <div className={`status-tag ${isSupported ? 'active' : 'not-supported'}`}>
          <span>{isSupported ? 'Active' : 'Not Supported'}</span>
        </div>
      </div>
      <div className="content">
        <p className={`description ${isSupported ? 'active-state' : 'not-supported-state'}`}>
          {isSupported 
            ? 'You can now use StayFinder to explore the best stays on Airbnb.'
            : 'StayFinder is currently not supported on this site.'
          }
        </p>
        {!isSupported && (
          <>
            <button className="cta-button" onClick={handleButtonClick}>
              Go to Airbnb
            </button>
            <p className="tagline">
              Let's explore your next ideal stay.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
