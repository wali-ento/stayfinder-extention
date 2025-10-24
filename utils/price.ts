import { ButtonResponse } from '@/types/helper-types';
import type { OtaListingData, ListingPrices } from '../types/services-types';

/**
 * Get button response based on OTA listings data and prices data
 */
export function getButtonResponse(
  otaData: OtaListingData | undefined,
  pricesData: ListingPrices | null | undefined
): ButtonResponse {
  // No listing_id - don't show button
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

