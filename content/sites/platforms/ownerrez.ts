import ahoy from 'ahoy.js';
import { SITE_CONFIGS } from '../configs/all-site-configs';

/**
 * Handle confirm page event tracking
 */
function handleConfirmPageEvent() {
  const config = SITE_CONFIGS.ownerrez;
  
  // Check if URL contains /confirm
  const urlContainsConfirm = window.location.href.includes('/confirm');
  if (!urlContainsConfirm) return;
  
  const confirmHeading = document.querySelector('h1');
  const hasConfirmHeading = confirmHeading?.textContent?.includes('Confirm & Pay');
  if (!hasConfirmHeading) return;
  
  const checkoutPattern = config.patterns.checkoutListingIdFromUrl;
  if (!checkoutPattern) return;
  
  const urlMatch = window.location.href.match(checkoutPattern);
  const listingId = urlMatch ? urlMatch[1] : 'unknown';
  
  // Track the event
  const metaInfo = {
    portal: 'stayfinder',
    flow: 'checkout_confirmation',
    action: 'page_loaded',
    location: window.location.href,
    listing_id: String(listingId),
  };
  
  ahoy.track('page_view', metaInfo);
}

export function initOwnerRez() {
  
  // Handle confirm page on load
  handleConfirmPageEvent();

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Extract listing ID from URL
    const config = SITE_CONFIGS.ownerrez;
    const urlMatch = window.location.href.match(config.patterns.listingIdFromUrl);
    const listingId = urlMatch ? urlMatch[1] : 'unknown';
    
    // Look for the booking button 
    const isBookNowButton = (
      target.classList.contains('btn') && 
      target.classList.contains('btn-default') &&
      target.textContent?.trim() === 'Book Now'
    ) || target.closest(config.selectors.bookingButton as string);
    
    if (isBookNowButton) {
      event.preventDefault();
      event.stopPropagation();
      
      const metaInfo = {
        portal: 'stayfinder',
        flow: 'listing_reservation',
        action: 'clicked',
        location: window.location.href,
        listing_id: String(listingId),
      };

      ahoy.track('click_event', metaInfo);
    }
  });
}
