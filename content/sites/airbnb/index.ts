import { AIRBNB_CONFIG } from './config';
import { extractListingIds } from './extractors';
import { injectListingButtons, injectDetailButton } from './injectors';

/**
 * Send listing IDs to background script
 */
function sendListingIds(ids: string[]) {
  const listingData = ids.map(id => ({ airbnb_id: id }));
  
  browser.runtime.sendMessage(listingData)
    .then(() => console.log('✅ IDs sent to background'))
    .catch((err) => console.error('❌ Error sending IDs:', err));
}

/**
 * Run the Airbnb handler - extract and inject
 */
export function runAirbnb() {
  console.log('Running Airbnb handler...');
  
  // Extract and send listing IDs
  const ids = extractListingIds();
  if (ids.length > 0) {
    console.log(`📤 Found ${ids.length} listing IDs:`, ids);
    sendListingIds(ids);
  }
  
  // Inject buttons
  injectListingButtons();
  injectDetailButton();
}

/**
 * Initialize Airbnb handler
 */
export function initAirbnb() {
  console.log(`Initializing ${AIRBNB_CONFIG.name} handler`);
  
  setTimeout(() => {
    runAirbnb();
  }, AIRBNB_CONFIG.delays.initialLoad);
}
