import { setupObserver } from '@/content/core/observer';
import { detectCurrentSite } from './site-detector';
import { 
  extractListingIds, 
  isCheckoutPage, 
  extractCheckoutListingId,
  extractSearchParams 
} from './generic-extractors';
import { injectListingButtons } from './generic-injectors';
import { getCached, chunkArray } from '../../../utils/helper';
import { getListingPrices, lookupOtaListings } from '../../../services/api-service';
import type { ListingPricesParams, ListingPrices, OtaListingData } from '../../../types/services-types';

const RUN_COOLDOWN_MS = 1500;
let runGenericInFlight: Promise<void> | null = null;
let lastRunFinishedAt = 0;

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
  if (!listing_id) return null;

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
      const prices = await fetchListingPrice(listing_id);
      results[airbnb_listing_id] = prices;
    } else {
      results[airbnb_listing_id] = null;
    }
  }

  return results;
}

/**
 * Run the generic site handler
 */
export async function runGenericHandler() {
  const siteInfo = detectCurrentSite();
  if (!siteInfo) {
    return; // Not a supported site
  }

  const { config } = siteInfo;
  const now = Date.now();
  
  if (now - lastRunFinishedAt < RUN_COOLDOWN_MS) {
    return;
  }

  if (runGenericInFlight) {
    return runGenericInFlight;
  }

  runGenericInFlight = (async () => {
    // Extract listing IDs
    let ids: string[] = [];
    if (isCheckoutPage(config)) {
      const checkoutId = extractCheckoutListingId(config);
      if (checkoutId) ids.push(checkoutId);
    } else {
      ids = extractListingIds(config);
    }

    if (ids.length === 0) {
      console.log(`No listing IDs found for ${config.name}`);
      return;
    }

    console.log(`Found ${ids.length} listing IDs for ${config.name}:`, ids);

    // Fetch OTA data and prices
    const otaListings = await fetchOtaListingsLookup(ids);
    if (!otaListings) {
      console.warn(`⚠️ No OTA listings found for ${config.name}`);
      return;
    }

    const allPrices = await fetchPricesForOtaListings(otaListings);

    // Inject buttons
    injectListingButtons(config, allPrices, otaListings);
  })();

  try {
    await runGenericInFlight;
  } finally {
    lastRunFinishedAt = Date.now();
    runGenericInFlight = null;
  }
}

/**
 * Initialize generic site handler
 */
export function initGenericHandler() {
  const siteInfo = detectCurrentSite();
  if (!siteInfo) return;

  const { config } = siteInfo;

  setTimeout(() => {
    runGenericHandler().catch(err => console.error('Error in generic handler:', err));
  }, config.delays.initialLoad);

  // Setup observer for dynamic content injection
  setupObserver(() => {
    runGenericHandler().catch(err => console.error('Error in generic handler:', err));
  });
}

