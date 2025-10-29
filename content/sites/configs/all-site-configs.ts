// Site configuration for all booking platforms
export interface SiteConfig {
  name: string;
  platform: string; // Platform name (Guesty, Hostfully, etc.)
  domains: string[]; // Domain patterns to match
  patterns: {
    listingIdFromUrl: RegExp; // Regex to extract listing ID from URL
    checkoutListingIdFromUrl?: RegExp;
  };
  selectors: {
    listingLinks: string; // CSS selector for listing card links
    detailPageElement?: string; // Selector for detail page container
    imageContainer?: string; // Selector for image container
    bookingButton?: string; // Where to inject booking button
    checkoutButtonContainer?: string;
    cardContainer?: string; // Alternative card container selector
  };
  delays: {
    initialLoad: number; // Delay before initial run
  };
}

export const SITE_CONFIGS: Record<string, SiteConfig> = {
  // ===== GUESTY =====
  guesty: {
    name: 'Guesty',
    platform: 'guesty',
    domains: ['guestybookings.com'],
    patterns: {
      listingIdFromUrl: /\/properties\/([a-f0-9]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/properties/"]',
      bookingButton: 'a.btn[href*="/checkout"]',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== OWNERREZ =====
  ownerrez: {
    name: 'OwnerRez',
    platform: 'ownerrez',
    domains: [
      'wishlistnc.com',
      'yourcoastalproperties.com',
      'rockhillstays.com',
      'restashoarcottages.com',
      'thehainsley.com',
      'homebaserentals.com',
      'jaxsieproperties.com',
      'en.ragq.com',
      'sierrablancacabins.net',
      'pineriverranch.com',
      'booking.ownerrez.com',
    ],
    patterns: {
      listingIdFromUrl: /\/([^\/]+orp[a-z0-9]+)(?:\/|$|\?|#)/,
      checkoutListingIdFromUrl: /\/([a-f0-9-]+)\/confirm/,
    },
    selectors: {
      listingLinks: 'a[href*="/orp"]',
      bookingButton: '.btn.btn-default',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== HOSTFULLY =====
  hostfully: {
    name: 'Hostfully',
    platform: 'hostfully',
    domains: ['book.hostfully.com', 'stay.bespokepropertiesidaho.com'],
    patterns: {
      listingIdFromUrl: /\/property-details\/([a-f0-9-]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/property-details/"], a[href*="/vacation-rental-property"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-gallery',
      bookingButton: '.booking-widget',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== HOSPITABLE =====
  hospitable: {
    name: 'Hospitable',
    platform: 'hospitable',
    domains: [
      'grandeflats.com',
      'bolivarbeachandbay.com',
      'themadisonlivcollection.com',
      'aprilholiday.com.au',
      'peace-mgmt.com',
      'staywichita.com',
      'strpropertymgmt.com',
      'lakesammamishgetaway.com',
      'hospitable.rentals',
      'kollersignaturestays.com',
    ],
    patterns: {
      listingIdFromUrl: /\/property\/([a-zA-Z0-9-_]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/property/"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-photos',
      bookingButton: '.booking-section',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== LODGIFY =====
  lodgify: {
    name: 'Lodgify',
    platform: 'lodgify',
    domains: [
      'sandcastleguest.com',
      'smartsuites.com.au',
      'caribbeandreamdr.com',
      'malagapremiumsuites.com',
      'lodgify.com',
      'mammothmountainretreat.com',
      'radioguesthouse.com',
      'staysoulful.com',
    ],
    patterns: {
      listingIdFromUrl: /\/en\/([^\/]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/en/"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-photos',
      bookingButton: '.booking-form',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== HOSTAWAY =====
  hostaway: {
    name: 'Hostaway',
    platform: 'hostaway',
    domains: [
      'dndstays.com',
      'airinn.au',
      'ohanainns.com',
      'iugo.co',
      'roarentals.ro',
      'book.conranproperties.com',
      'book.airluxemanagement.com',
      'bookusastay.com',
      'casadecooper.com',
      'book.staylagom.com',
    ],
    patterns: {
      listingIdFromUrl: /\/listings\/(\d+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/listings/"]',
      detailPageElement: '.listing-details',
      imageContainer: '.listing-photos',
      bookingButton: '.booking-form',
      cardContainer: '.listing-card, .property-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== BOOSTLY =====
  boostly: {
    name: 'Boostly',
    platform: 'boostly',
    domains: [
      'peachhausfurnishedrentals.com',
      'bosssa.co.uk',
      'sojourney.co',
      'craftycohost.com',
      'nestawaits.com',
      'stanleystays.com',
      'theairbnfree.com',
      'stayhellosunshine.com',
      'glasswingstays.co.uk',
      'koshproperty.com',
    ],
    patterns: {
      listingIdFromUrl: /\/listing\/([^\/]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/listing/"]',
      detailPageElement: '.listing-details',
      imageContainer: '.listing-photos',
      bookingButton: '.booking-widget',
      cardContainer: '.listing-card, .property-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== HUDSON CREATIVE STUDIO =====
  hudson: {
    name: 'Hudson Creative Studio',
    platform: 'hudson',
    domains: [
      'tinstarco.com',
      'josephellenproperties.com',
      'agapevacationrentals.com',
      'heartofcapecod.com',
      'luxuryvacationstays.com',
      'flyingsquirrelcottages.com',
      'micasaaustralia.com.au',
      'yourdevonescape.co.uk',
    ],
    patterns: {
      listingIdFromUrl: /\/(cabin|property)\/([^\/]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/cabin/"], a[href*="/property/"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-gallery',
      bookingButton: '.booking-section',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== ICND =====
  icnd: {
    name: 'ICND',
    platform: 'icnd',
    domains: [
      'realjoy.com',
      'shorepro.com',
      'rentvail.com',
      'beachretreatsbyvillage.com',
      'upstay.com',
      'compassresorts.com',
      'resortrentals.us',
      'beverlyserral.com',
      'visitmbr.com',
    ],
    patterns: {
      listingIdFromUrl: /\/(beach-rentals|booking|rentals|outer-banks-hotel-rooms)\/([^\/]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/beach-rentals/"], a[href*="/booking/"], a[href*="/rentals/"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-photos',
      bookingButton: '.booking-form',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== REALTECH MASTERS =====
  realtech: {
    name: 'Realtech Masters',
    platform: 'realtech',
    domains: [
      'raveisfloridarentals.com',
      'roserentaldept.com',
      'islander-resort.com',
      'beachblueproperties.com',
      'knvinc.com',
      'madeirabayresort.com',
      'parker-kaufman.com',
      'tripowervacationrentals.com',
      'oceansluxuryvacations.com',
    ],
    patterns: {
      listingIdFromUrl: /\/rental\/([^\/]+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/rental/"]',
      detailPageElement: '.property-details',
      imageContainer: '.property-photos',
      bookingButton: '.booking-section',
      cardContainer: '.property-card, .listing-card',
    },
    delays: {
      initialLoad: 300,
    },
  },

  // ===== AIRBNB =====
  airbnb: {
    name: 'Airbnb',
    platform: 'airbnb',
    domains: ['airbnb.com', 'airbnb.co.uk', 'airbnb.ca'],
    patterns: {
      listingIdFromUrl: /\/rooms\/(\d+)/,
      checkoutListingIdFromUrl: /\/book\/stays\/(\d+)/,
    },
    selectors: {
      listingLinks: 'a[href*="/rooms/"]',
      detailPageElement: '._1xm48ww',
      imageContainer: '.awuxh4x',
      bookingButton: '[data-testid="book-it-default"]',
      checkoutButtonContainer: '.s19yufy1',
    },
    delays: {
      initialLoad: 300,
    },
  },
};

