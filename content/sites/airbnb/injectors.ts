import { AIRBNB_CONFIG } from './config';
import { createListingButton, createDetailButton } from '../../components/Button';
import { findCardContainer } from '../../../utils/dom';
import type { ListingPrices, OtaListingData } from '../../../types/services-types';
import { BOOK_DIRECT_ICON } from '@/assets/svg-icons';

/**
 * Inject price buttons on listing cards
 */
export function injectListingButtons(
  allPrices: Record<string, ListingPrices | null>,
  otaListings: OtaListingData[]
  ) {
  const links = document.querySelectorAll(AIRBNB_CONFIG.selectors.listingLinks);
  console.log(`Found ${links.length} property links`);
  
  if (links.length === 0) {
    return;
  }
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
    if (!match) return;
    
    const airbnbId = match[1];

    const otaData = otaListings.find(o => o.airbnb_listing_id === airbnbId);
    if (!otaData?.listing_id) {
      return;
    }

    const priceData = allPrices[airbnbId];
    if (!priceData) {
      console.log(`⏭️ Skipping injection for ${airbnbId} — no price data`);
      return;
    }
    
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    
    // Skip if button already exists in this specific card
    if (cardContainer.querySelector('.stayfinder-listing-button')) return;

    const savings = priceData.direct_booking_website_discount || 0;
    const button = createListingButton({
      listingId: airbnbId,
      savings,
    });
    cardContainer.appendChild(button);
  });
}

/**
 * Inject button on detail pages with prices data
 */
export function injectDetailButton(pricesData?: ListingPrices | null) {
  if (!pricesData) {
    return;
  }
  
  // Check if button already exists
  const existingButton = document.querySelector('.stayfinder-detail-button') as HTMLElement;
  
  const detailElement = document.querySelector(AIRBNB_CONFIG.selectors.detailPageElement);
  if (!detailElement) {
    return;
  }
  
  const firstChild = detailElement.querySelector(AIRBNB_CONFIG.selectors.bookingButtonContainer);
  if (!firstChild) {
    return;
  }
  
  // Calculate discount from prices data
  const discount = pricesData.direct_booking_website_discount || 0;
  const bookNowUrl = pricesData.book_now_url;
  
  // If button exists,
  if (existingButton) {
    return;
  }
  
  // Create new button with discount
  const button = createDetailButton({ 
    savings: discount ? discount : undefined,
    onClick: bookNowUrl ? () => window.open(bookNowUrl, '_blank') : undefined,
    className: 'stayfinder-detail-button'
  });

  firstChild.parentNode?.insertBefore(button, firstChild.nextSibling);
}

/**
 * Inject logo overlay on listing images
 */
export function injectLogoOnImages(
  allPrices: Record<string, ListingPrices | null>,
  otaListings: OtaListingData[]
  ) {
  const links = document.querySelectorAll(AIRBNB_CONFIG.selectors.listingLinks);
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
    if (!match) return;
    
    const airbnbId = match[1];
    const otaData = otaListings.find(ota => ota.airbnb_listing_id === airbnbId);
    
    if (!otaData?.listing_id) return;

    const priceData = allPrices[airbnbId];
    if (!priceData) {
      console.log(`⏭️ Skipping injection for ${airbnbId} — no price data`);
      return;
    }

    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    // Skip if logo already exists
    if (cardContainer.querySelector('.stayfinder-logo-overlay')) return;
    
    // Find the image container
    const imgContainer = cardContainer.querySelector(AIRBNB_CONFIG.selectors.imageContainer) as HTMLElement;
    if (!imgContainer) return;
    
    // Create logo overlay
    const logo = document.createElement('div');
    logo.className = 'stayfinder-logo-overlay';
    logo.innerHTML = `
        <span>
          Verified
        </span>
        <button>
          ${BOOK_DIRECT_ICON}
        </button>
    `;
    
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open("https://stayfinder.co", '_blank');
    });
    
    // Position parent relatively
    if (imgContainer.style.position !== 'absolute') {
      imgContainer.style.position = 'relative';
    }
    
    imgContainer.appendChild(logo);
  });
}

/**
 * Inject button on checkout page with prices data
 */
export function injectCheckoutButton(pricesData?: ListingPrices | null) {
  if (!pricesData) {
    return;
  }
  
  // Check if button already exists
  const existingButton = document.querySelector('.stayfinder-checkout-button') as HTMLElement;
  if (existingButton) return;
  
  // Try to find a good container for the button
  let buttonContainer = document.querySelector(AIRBNB_CONFIG.selectors.checkoutButtonContainer);
  if (!buttonContainer) return;
  
  // Calculate discount from prices data
  const discount = pricesData.direct_booking_website_discount || 0;
  const bookNowUrl = pricesData.book_now_url;
  
  // Create checkout button with discount
  const button = createDetailButton({ 
    savings: discount ? discount : undefined,
    onClick: bookNowUrl ? () => window.open(bookNowUrl, '_blank') : undefined,
    className: 'stayfinder-checkout-button'
  });

  buttonContainer.insertBefore(button, buttonContainer?.firstChild?.nextSibling as Node);
}

