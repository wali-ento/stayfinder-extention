import './App.css';

function App() {
  return (
    <div className="stayfinder-card">
      <div className="header">
        <div className="logo-section">
          <div className="logo">
            <div className="house-icon">
              <div className="house-body"></div>
              <div className="house-roof"></div>
              <div className="house-chimney"></div>
              <div className="orange-dot"></div>
            </div>
            <span className="logo-text">StayFinder</span>
          </div>
        </div>
        <div className="status-tag">
          <span>Online</span>
        </div>
      </div>
      
      <div className="content">
        <p className="description">
          You can now use StayFinder to explore the best stays on Airbnb.
        </p>
        
        <button className="cta-button">
          Explore Stays
        </button>
        
        <p className="tagline">
          Let's explore your next ideal stay.
        </p>
      </div>
    </div>
  );
}

export default App;
