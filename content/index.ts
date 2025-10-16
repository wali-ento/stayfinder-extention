import { injectGlobalStyles } from '../styles';
import { initAirbnb } from './sites/airbnb';
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
  
  // Step 3: Show status indicator
  showStatusIndicator();
}
