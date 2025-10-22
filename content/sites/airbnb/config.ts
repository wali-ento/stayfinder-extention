// Airbnb site configuration
export const AIRBNB_CONFIG = {
  name: 'Airbnb',
  
  selectors: {
    listingLinks: 'a[href*="/rooms/"]',
    detailPageElement: '._1xm48ww',
    imageContainer: '.awuxh4x',
    bookingButtonContainer: '[data-testid="book-it-default"]',
    checkoutButtonContainer: '.s19yufy1',
    checkoutSummaryContainer: '[data-testid="booking-details"] ._1e0z1o7, .booking-summary',
  },
  
  patterns: {
    listingIdFromUrl: /\/rooms\/(\d+)/,
    checkoutListingIdFromUrl: /\/book\/stays\/(\d+)/,
  },
  
  delays: {
    initialLoad: 300,
  },
};

