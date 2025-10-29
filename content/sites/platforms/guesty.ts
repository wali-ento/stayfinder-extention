import ahoy from 'ahoy.js';
import { SITE_CONFIGS } from '../configs/all-site-configs';

export function initGuesty() {

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;

    // Extract listing ID from URL
    const config = SITE_CONFIGS.guesty;
    const urlMatch = window.location.href.match(config.patterns.listingIdFromUrl);
    const listingId = urlMatch ? urlMatch[1] : 'unknown';
    
    // look for the booking button
    const isBookNowButton = (
      (target.tagName === 'A' && 
       target.classList.contains('btn') && 
       target.getAttribute('href')?.includes('/checkout')
    ) || target.closest(config.selectors?.bookingButton as string));
    
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

