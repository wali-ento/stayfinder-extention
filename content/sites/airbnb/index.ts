import { AIRBNB_CONFIG } from './config';
import { extractListingIds, isDetailPage } from './extractors';
import { injectListingButtons, injectDetailButton } from './injectors';
import { sendListingIds, getCached } from '../../../utils/helper';
import { reverseSearch, getListingPrices } from '../../../services/api-service';
import type { ListingPricesParams, ReverseSearchResponse, ListingPrices } from '../../../types/services-types';
import { setupObserver } from '@/content/core/observer';

/**
 * Fetch reverse search data for the current Airbnb page
 */
async function fetchReverseSearch(): Promise<ReverseSearchResponse | null> {
  if (!isDetailPage()) {
    return null;
  }
  
  const currentUrl = window.location.href;
  
  // Use cache for the API call
  const response = await getCached(currentUrl, async () => {
    return await reverseSearch(encodeURIComponent(currentUrl));
  });
  
  if (response) {
    // Check if it's an error response
    if ('error' in response && 'message' in response) {
      console.error(' Reverse Search Error:', (response as any).message);
      return null;
    }
  }
  return response as ReverseSearchResponse | null;
}

/**
 * Fetch listing prices if listing_id is available
 */
async function fetchListingPrices(reverseSearchData: ReverseSearchResponse): Promise<ListingPrices | null> {
  const { listing_id, query_params } = reverseSearchData;
  
  if (!listing_id) {
    return null;
  }
  
  // Build params for prices API
  const params: ListingPricesParams = {
    check_in_date: query_params.check_in_date || '',
    check_out_date: query_params.check_out_date || '',
    number_of_adults: parseInt(query_params.number_of_adults || '1'),
    number_of_children: parseInt(query_params.number_of_children || '0'),
    number_of_infants: parseInt(query_params.number_of_infants || '0'),
    number_of_pets: parseInt(query_params.number_of_pets || '0'),
  };
    
  // Use cache for prices API
  const cacheKey = `prices_${listing_id}_${params.check_in_date}_${params.check_out_date}`;
  const response = await getCached(cacheKey, async () => {
    return await getListingPrices(listing_id, params);
  });
  
  if (response) {
    // Check if it's an error response
    if ('error' in response) {
      console.error('Listing Prices Error:', response.error);
      return null;
    }
    return response.data;
  }
  
  return null;
}

/**
 * Run the Airbnb handler - extract and inject
 */
export async function runAirbnb() {
  const reverseSearchData = await fetchReverseSearch();
  
  let pricesData: ListingPrices | null = null;
  if (reverseSearchData && reverseSearchData.listing_id) {
    pricesData = await fetchListingPrices(reverseSearchData);
  }
  
  // Extract and send listing IDs
  const ids = extractListingIds();
  if (ids.length > 0) {
    console.log(`Found ${ids.length} listing IDs:`, ids);
    sendListingIds(ids);
  }
  
  // Inject buttons
  injectListingButtons();
  
  // Step 3: Inject detail button only if we have prices data
  if (isDetailPage()) {
    if (pricesData) {
      injectDetailButton(pricesData);
    } else {
      console.log('No prices data, skipping button injection');
    }
  }
}

/**
 * Initialize Airbnb handler
 */
export function initAirbnb() {  
  setTimeout(() => {
    runAirbnb().catch(err => console.error('Error in runAirbnb:', err));
  }, AIRBNB_CONFIG.delays.initialLoad);

  // Setup observer for dynamic content injection
  setupObserver(() => {
    runAirbnb().catch(err => console.error('Error in runAirbnb:', err));
  });
}
