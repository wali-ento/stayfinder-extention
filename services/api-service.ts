import { apiFetch } from '../lib/api-client';
import type {
  ListingPricesParams,
  ListingPricesResponse,
  ListingPricesError,
  OtaListingLookupParams,
  OtaListingsLookupResponse,
  OtaListingsLookupError,
} from '../types/services-types';

/**
 * Get listing prices for given dates and guest configuration
 */
export const getListingPrices = async (
  id: number,
  params: ListingPricesParams,
): Promise<ListingPricesResponse | ListingPricesError> => {
  return apiFetch(`listings/${id}/prices`, { params });
};

/**
 * Lookup OTA listings to get StayFinder listing IDs and availability information
 */
export const lookupOtaListings = async (
  params: OtaListingLookupParams,
): Promise<OtaListingsLookupResponse | OtaListingsLookupError> => {
  return apiFetch('ota_listings_lookups', { params });
};
