import { AIRBNB_CONFIG } from './config';
import { extractListingIds, extractSearchParams, isDetailPage, isCheckoutPage, extractCheckoutListingId } from './extractors';
import { injectDetailButton, injectListingButtons, injectLogoOnImages, injectCheckoutButton } from './injectors';
import { getCached, chunkArray } from '../../../utils/helper';
import { getListingPrices, lookupOtaListings } from '../../../services/api-service';
import type { ListingPricesParams, ListingPrices, OtaListingData } from '../../../types/services-types';
import { setupObserver } from '@/content/core/observer';

/**
 * Fetch OTA listings lookup to get StayFinder listing IDs
*/
const fetchOtaListingsLookup = async (listingIds: string[]): Promise<OtaListingData[] | null> => {
  if (!listingIds || listingIds.length === 0) return null;

  const chunkSize = 18;
  const chunks = chunkArray(listingIds, chunkSize);
  const allResults: OtaListingData[] = [];

  for (const chunk of chunks) {
    try {
      const response = await lookupOtaListings({ listing_ids: chunk });
      if ('data' in response) {
        allResults.push(...response.data);
      }
    } catch (error) {
      console.error('Error fetching OTA listings lookup:', error);
    }
  }

  return allResults;
};

/**
 * Fetch listing prices if listing_id is available
 */
async function fetchListingPrice(listing_id: number): Promise<ListingPrices | null> {
  if (!listing_id) return null; // skip if no listing_id

  // Extract query params from the page
  const params: ListingPricesParams | null = extractSearchParams();
  if (!params) {
    console.warn(`⚠️ No check-in/check-out found, skipping price fetch for listing ${listing_id}`);
    return null;
  }

  const cacheKey = `price_${listing_id}_${params.check_in_date}_${params.check_out_date}`;

  try {
    const response = await getCached(cacheKey, async () => {
      return await getListingPrices(listing_id, params);
    });

    if (!response) return null;
    if ('error' in response) {
      console.error(`❌ Prices API Error for ${listing_id}:`, response.error);
      return null;
    }

    return response.data || null;
  } catch (error) {
    console.error(`❌ Failed to fetch prices for ${listing_id}:`, error);
    return null;
  }
}

/**
 * For all OTA lookup results, call prices API where listing_id exists
 */
async function fetchPricesForOtaListings(otaListings: OtaListingData[]): Promise<
  Record<string, ListingPrices | null>
> {
  const results: Record<string, ListingPrices | null> = {};

  for (const item of otaListings) {
    const { airbnb_listing_id, listing_id } = item;

    if (listing_id) {
      console.log(`💰 Fetching price for StayFinder listing: ${listing_id}`);
      const prices = await fetchListingPrice(listing_id);
      results[airbnb_listing_id] = prices;
    } else {
      console.log(`⏭️ Skipping ${airbnb_listing_id} (no listing_id)`);
      results[airbnb_listing_id] = null;
    }
  }

  return results;
}

/**
 * Run the Airbnb handler - extract and inject
 */
export async function runAirbnb() {
  // Extract and send listing IDs
  let ids: string[] = [];

  if (isCheckoutPage()) {
    const checkoutId = extractCheckoutListingId();
    if (checkoutId) ids.push(checkoutId);
  } else {
    ids = extractListingIds();
  }

  if (ids.length > 0) {
    console.log(`Found ${ids.length} listing IDs:`, ids);
  }

  const otaListings = await fetchOtaListingsLookup(ids);
    if (!otaListings) {
      console.warn('⚠️ No OTA listings found');
      return;
    }

    const allPrices = await fetchPricesForOtaListings(otaListings as OtaListingData[]);
    console.log('💹 All prices data: ', allPrices);
  
  //  Inject detail button only if we have prices data
  
  if (isDetailPage()) {
    const currentId = ids[0]; // extractListingIds() gives the single one on detail page
    const matchedOta = otaListings?.find(o => o.airbnb_listing_id === currentId);

    if (matchedOta && matchedOta.listing_id) {
        if (allPrices[currentId]) {
          injectDetailButton(allPrices[currentId] as ListingPrices);
        }
    }
  }

  //  Inject checkout button only if we have prices data
  if (isCheckoutPage()) {
    const checkoutListingId = ids[0];
    const matchedOta = otaListings.find(o => o.airbnb_listing_id === checkoutListingId);

    if (matchedOta?.listing_id) {
      const checkoutPrices = allPrices[checkoutListingId];
      if (checkoutPrices) {
        console.log('🛒 Injecting checkout button with price data');
        injectCheckoutButton(checkoutPrices);
      } else {
        console.log(`🛒 No price data available for checkout listing ${checkoutListingId}`);
      }
    } else {
      console.log(`🛒 No matching OTA data found for checkout listing ${checkoutListingId}`);
    }
  }

  if (!isDetailPage() && !isCheckoutPage()) {
    injectListingButtons(allPrices);
    injectLogoOnImages(allPrices);
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
