import { injectGlobalStyles } from '../styles';
import { initAirbnb, runAirbnb } from './sites/airbnb';
import { setupObserver } from './core/observer';
import { showStatusIndicator } from './components/StatusIndicator';

/**
 * Main content script entry point
 */
export function initContentScript() {
  console.log('Current URL:', window.location.href);
  
  // Step 1: Inject global styles (once for all sites)
  injectGlobalStyles();
  
  // Step 2: Initialize Airbnb handler
  initAirbnb();
  
  // Step 3: Setup observer for dynamic content
  setupObserver(() => {
    runAirbnb().catch(err => console.error('Error in runAirbnb:', err));
  });
  
  // Step 4: Show status indicator
  showStatusIndicator();
}
