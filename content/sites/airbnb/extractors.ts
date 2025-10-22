import { ListingPricesParams } from '@/types/services-types';
import { AIRBNB_CONFIG } from './config';

/**
 * Extract all listing IDs from the current page
 */
export function extractListingIds(): string[] {
  const ids: string[] = [];
  
  // 1. Check if on detail page - extract ID from URL
  const urlMatch = window.location.href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
  if (urlMatch) {
    ids.push(urlMatch[1]);
    console.log('Detail page - ID from URL:', urlMatch[1]);
  }
  
  // 2. Extract IDs from all listing links
  const links = document.querySelectorAll(AIRBNB_CONFIG.selectors.listingLinks);
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
    if (match && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  });
  
  return ids;
}

/**
 * Check if currently on a detail page
 */
export function isDetailPage(): boolean {
  const cleanUrl = window.location.href.split(/[?#]/)[0];
  return !!cleanUrl.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
}

/**
 * Check if currently on a checkout page
 */
export function isCheckoutPage(): boolean {
  const url = window.location.href.toLowerCase();
  return url.includes('/checkout') || url.includes('/book/stays/') || url.includes('/book/') || url.includes('/reservation');
}

/**
 * Extract listing ID from checkout page
 */
export function extractCheckoutListingId(): string | null {
  // Try to extract from URL
  const urlMatch = window.location.href.match(AIRBNB_CONFIG.patterns.checkoutListingIdFromUrl);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  return null;
}

/**
 * Extract search query parameters from Airbnb page
 */
export function extractSearchParams(): ListingPricesParams | null {
  // Try to extract from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  const checkIn = urlParams.get('check_in') || urlParams.get('checkin') || '';
  const checkOut = urlParams.get('check_out') || urlParams.get('checkout') || '';
  const adults = urlParams.get('adults') || '1';
  const children = urlParams.get('children') || '0';
  const infants = urlParams.get('infants') || '0';
  const pets = urlParams.get('pets') || '0';
  
  // If we don't have dates, we can't fetch prices
  if (!checkIn || !checkOut) {
    return null;
  }
  
  return {
    check_in_date: checkIn,
    check_out_date: checkOut,
    number_of_adults: parseInt(adults),
    number_of_children: parseInt(children),
    number_of_infants: parseInt(infants),
    number_of_pets: parseInt(pets),
  };
}
