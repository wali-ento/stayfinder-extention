// Airbnb site configuration
export const AIRBNB_CONFIG = {
  name: 'Airbnb',
  
  selectors: {
    listingLinks: 'a[href*="/rooms/"]',
    detailPageElement: '._1xm48ww',
    imageContainer: '.awuxh4x',
    bookingButtonContainer: '[data-testid="book-it-default"]',
  },
  
  patterns: {
    listingIdFromUrl: /\/rooms\/(\d+)/,
  },
  
  delays: {
    initialLoad: 300,
  },
};

