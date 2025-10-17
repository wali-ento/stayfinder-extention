import { apiFetch } from '../lib/api-client';
import type {
  ReverseSearchResponse,
  ReverseSearchError,
  ListingPricesParams,
  ListingPricesResponse,
  ListingPricesError,
} from '../types/services-types';

/**
 * Reverse search - Find listing information from a property URL
 */
export const reverseSearch = async (
  link: string,
): Promise<ReverseSearchResponse | ReverseSearchError> => {
  return apiFetch(`reverse_searches?listing_url=${link}`);
};

/**
 * Get listing prices 
 */
export const getListingPrices = async (
  id: number,
  params: ListingPricesParams,
): Promise<ListingPricesResponse | ListingPricesError> => {
  return apiFetch(`listings/${id}/prices`, { params });
};
