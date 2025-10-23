import { ButtonResponse } from '@/types/helper-types';
import type { OtaListingData, ListingPrices } from '../types/services-types';

/**
 * Calculate random savings for demo
 */
export function generateSavings(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Utility to get a consistent savings value for a given listing ID.
 */
const listingIdSavings = new Map<string, number>();

export function getSavingsForListingId(listingId: string, min: number, max: number): number {
  if (listingIdSavings.has(listingId)) {
    return listingIdSavings.get(listingId)!;
  }
  const savings = generateSavings(min, max);
  listingIdSavings.set(listingId, savings);
  return savings;
}


/**
 * Get button response based on OTA listings data and prices data
 */
export function getButtonResponse(
  otaData: OtaListingData | undefined,
  pricesData: ListingPrices | null | undefined
): ButtonResponse {
  // Case 4: No listing_id - don't show button
  if (!otaData?.listing_id) {
    return {
      shouldShow: false,
      buttonText: '',
      redirectUrl: ''
    };
  }

  // Case 1: Direct booking with price available
  if (otaData.direct_booking && otaData.price_available && pricesData) {
    const savings = Math.ceil(pricesData.direct_booking_website_discount || 0);
    return {
      shouldShow: true,
      buttonText: `Save $${savings} total`,
      redirectUrl: pricesData.book_now_url || '',
      savings: savings
    };
  }

  // Case 2: Direct booking, price not available (estimated price)
  if (otaData.direct_booking && !otaData.price_available && pricesData) {
    const estimatedSavings = Math.ceil(pricesData.estimated_direct_booking_price || 0);
    return {
      shouldShow: true,
      buttonText: 'Save up to 20%',
      redirectUrl: pricesData.book_now_url || '',
      savings: estimatedSavings
    };
  }

  // Case 3: No direct booking, price not available (static discount)
  if (!otaData.direct_booking && !otaData.price_available) {
    return {
      shouldShow: false,
      buttonText: '',
      redirectUrl: ''
    };
  }

  // Default case - don't show button
  return {
    shouldShow: false,
    buttonText: '',
    redirectUrl: ''
  };
}

/**
 * Get badge text for verified/preferred partners
 */
export function getPartnerBadgeText(otaData: OtaListingData | undefined): string {
  if (!otaData) return '';
  
  if (otaData.preferred_partner) {
    return 'Preferred';
  }
  
  if (otaData.verified_partner) {
    return 'Verified';
  }
  
  return ''; 
}

/**
 * Check if partner badge should be shown
 */
export function shouldShowPartnerBadge(otaData: OtaListingData | undefined): boolean {
  if (!otaData) return false;
  
  return Boolean(otaData.preferred_partner || otaData.verified_partner);
}

/**
 * Apply partner badge classes to an element based on OTA data
 */
export function applyPartnerBadgeClasses(element: HTMLElement, otaData: OtaListingData | undefined): void {
  if (!otaData) {
    element.classList.remove('sf-partner-status');
    return;
  }
  
  const hasPreferred = Boolean(otaData.preferred_partner);
  const hasVerified = Boolean(otaData.verified_partner);
  
  // add red background class
  if (hasPreferred || hasVerified) {
    element.classList.add('sf-partner-status');
  } else {
    element.classList.remove('sf-partner-status');
  }
}

