import ahoy from 'ahoy.js';
import { SITE_CONFIGS } from '../configs/all-site-configs';

export function initHostfully() {
  
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Extract listing ID from URL
    const config = SITE_CONFIGS.hostfully;
    const urlMatch = window.location.href.match(config.patterns.listingIdFromUrl);
    const listingId = urlMatch ? urlMatch[1] : 'unknown';
    
    // Look for the booking button using .btn class
    const isBookingButton = (
      target.classList.contains('btn') || 
      target.closest('.btn')
    ) || target.closest(config.selectors.bookingButton as string);
    
    if (isBookingButton) {
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
