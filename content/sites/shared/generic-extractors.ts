import type { SiteConfig } from '../configs/all-site-configs';
import { ListingPricesParams } from '@/types/services-types';

/**
 * Extract listing IDs from current page using site-specific patterns
 */
export function extractListingIds(config: SiteConfig): string[] {
  const ids: string[] = [];
  
  // 1. Check if on detail page - extract ID from URL
  const urlMatch = window.location.href.match(config.patterns.listingIdFromUrl);
  if (urlMatch) {
    ids.push(urlMatch[1]);
    console.log(`Detail page - ID from URL:`, urlMatch[1]);
  }
  
  // 2. Extract IDs from all listing links
  const links = document.querySelectorAll(config.selectors.listingLinks);
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(config.patterns.listingIdFromUrl);
    if (match && match[1] && !ids.includes(match[1])) {
      ids.push(match[1]);
    }
  });
  
  console.log(`Found ${ids.length} listing IDs:`, ids);
  return ids;
}

/**
 * Check if currently on a detail page
 */
export function isDetailPage(config: SiteConfig): boolean {
  const cleanUrl = window.location.href.split(/[?#]/)[0];
  return !!cleanUrl.match(config.patterns.listingIdFromUrl);
}

/**
 * Check if currently on a checkout page
 */
export function isCheckoutPage(config: SiteConfig): boolean {
  const url = window.location.href.toLowerCase();
  return url.includes('/checkout') || 
         url.includes('/book/') || 
         url.includes('/reservation') ||
         url.includes('/booking') ||
         url.includes('/cart');
}

/**
 * Extract listing ID from checkout page
 */
export function extractCheckoutListingId(config: SiteConfig): string | null {
  // Try to extract from URL
  if (config.patterns.checkoutListingIdFromUrl) {
    const urlMatch = window.location.href.match(config.patterns.checkoutListingIdFromUrl);
    if (urlMatch) {
      return urlMatch[1];
    }
  }
  
  // Fallback to regular listing ID pattern
  const urlMatch = window.location.href.match(config.patterns.listingIdFromUrl);
  if (urlMatch) {
    return urlMatch[1];
  }
  
  return null;
}

/**
 * Extract search query parameters from page
 */
export function extractSearchParams(): ListingPricesParams | null {
  // Try to extract from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  const checkIn = urlParams.get('check_in') || 
                  urlParams.get('checkin') || 
                  urlParams.get('check-in') ||
                  urlParams.get('arrival') ||
                  urlParams.get('from') ||
                  '';
  
  const checkOut = urlParams.get('check_out') || 
                   urlParams.get('checkout') || 
                   urlParams.get('check-out') ||
                   urlParams.get('departure') ||
                   urlParams.get('to') ||
                   '';
  
  const adults = urlParams.get('adults') || 
                 urlParams.get('adult') ||
                 urlParams.get('guests') || 
                 '1';
  
  const children = urlParams.get('children') || 
                  urlParams.get('child') ||
                  '0';
  
  const infants = urlParams.get('infants') || 
                  urlParams.get('infant') ||
                  '0';
  
  const pets = urlParams.get('pets') || 
               urlParams.get('pet') ||
               '0';
  
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

