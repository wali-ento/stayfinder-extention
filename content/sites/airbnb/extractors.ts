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
    console.log('📍 Detail page - ID from URL:', urlMatch[1]);
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
  return !!window.location.href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
}

