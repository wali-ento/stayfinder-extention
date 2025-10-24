import { AIRBNB_CONFIG } from './config';
import { createListingButton, createDetailButton, createSkeletonButton, createDetailSkeletonButton, createCheckoutSkeletonButton } from '../../components/Button';
import { findCardContainer } from '../../../utils/dom';
import type { ListingPrices, OtaListingData } from '../../../types/services-types';
import { getButtonResponse, getPartnerBadgeText, shouldShowPartnerBadge } from '../../../utils/price';
import { LOGO_ICON } from '@/assets/svg-icons';

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
    const priceData = allPrices[airbnbId];
    
    // Use utility function to check if button should be shown
    const buttonResponse = getButtonResponse(otaData, priceData);
    if (!buttonResponse.shouldShow) return;
    
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    // Skip if button already exists in this specific card
    if (cardContainer.querySelector('.stayfinder-listing-button')) return;

    const button = createListingButton({
      listingId: airbnbId,
      otaData: otaData,
      pricesData: priceData
    });
    cardContainer.appendChild(button);
  });
}

/**
 * Inject skeleton buttons on listing cards while waiting for API response
 */
export function injectListingSkeletonButtons() {
  const links = document.querySelectorAll(AIRBNB_CONFIG.selectors.listingLinks);
  console.log(`Injecting skeleton buttons for ${links.length} property links`);
  
  if (links.length === 0) {
    return;
  }
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
    if (!match) return;
    
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    // Skip if button already exists in this specific card
    if (cardContainer.querySelector('.stayfinder-listing-button') || cardContainer.querySelector('.sf-skeleton-button')) return;

    const skeletonButton = createSkeletonButton();
    cardContainer.appendChild(skeletonButton);
  });
}

/**
 * Remove skeleton buttons from listing cards
 */
export function removeListingSkeletonButtons() {
  const skeletonButtons = document.querySelectorAll('.sf-skeleton-listing');
  skeletonButtons.forEach(button => button.remove());
}

/**
 * Inject button on detail pages with prices data
 */
export function injectDetailButton(
  pricesData?: ListingPrices | null,
  otaData?: OtaListingData
) {
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
  
  // Use utility function to check if button should be shown
  const buttonResponse = getButtonResponse(otaData, pricesData);
  if (!buttonResponse.shouldShow) {
    console.log(`⏭️ Skipping detail button injection — ${!otaData?.listing_id ? 'no listing_id' : 'conditions not met'}`);
    return;
  }
  
  // If button exists,
  if (existingButton) {
    return;
  }
  
  // Create new button with OTA data and prices
  const button = createDetailButton({ 
    otaData: otaData,
    pricesData: pricesData,
    className: 'stayfinder-detail-button',
  });

  firstChild.parentNode?.insertBefore(button, firstChild.nextSibling);
}

/**
 * Inject skeleton button on detail pages while waiting for API response
 */
export function injectDetailSkeletonButton() {
  const existingButton = document.querySelector('.stayfinder-detail-button') as HTMLElement;
  const existingSkeleton = document.querySelector('.sf-skeleton-detail') as HTMLElement;
  
  const detailElement = document.querySelector(AIRBNB_CONFIG.selectors.detailPageElement);
  if (!detailElement) {
    return;
  }
  
  const firstChild = detailElement.querySelector(AIRBNB_CONFIG.selectors.bookingButtonContainer);
  if (!firstChild) {
    return;
  }
  
  // If button or skeleton already exists, skip
  if (existingButton || existingSkeleton) {
    return;
  }
  
  const skeletonButton = createDetailSkeletonButton();
  firstChild.parentNode?.insertBefore(skeletonButton, firstChild.nextSibling);
}

/**
 * Remove skeleton button from detail pages
 */
export function removeDetailSkeletonButton() {
  const skeletonButton = document.querySelector('.sf-skeleton-detail');
  if (skeletonButton) {
    skeletonButton.remove();
  }
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

    // Skip logo injection if both price_available and direct_booking are false
    if (!otaData.price_available && !otaData.direct_booking) return;

    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) return;
    
    // Skip if logo already exists
    if (cardContainer.querySelector('.stayfinder-logo-overlay')) return;
    
    // Find the image container
    const imgContainer = cardContainer.querySelector(AIRBNB_CONFIG.selectors.imageContainer) as HTMLElement;
    if (!imgContainer) return;
    
    // Check if partner badge should be shown
    const shouldShowBadge = shouldShowPartnerBadge(otaData);
    const badgeText = getPartnerBadgeText(otaData);
    
    // Create logo overlay with conditional badge
    const logo = document.createElement('div');
    logo.className = 'stayfinder-logo-overlay';
    
    // Only include span if there's a partner badge to show
    const badgeSpan = shouldShowBadge ? `<span>${badgeText}</span>` : '';
    
    logo.innerHTML = `
        ${badgeSpan}
        <button>
          ${LOGO_ICON}
        </button>
    `;
    
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (otaData.direct_booking && priceData?.book_now_url) {
        // Redirect to the book now URL
        window.open(priceData.book_now_url, '_blank');
      } else {
        window.open("https://stayfinder.com", '_blank');
      }
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
export function injectCheckoutButton(
  pricesData: ListingPrices | null,
  otaData: OtaListingData
) {
  // Check if button already exists
  const existingButton = document.querySelector('.sf-checkout-card') as HTMLElement;
  if (existingButton) return;
  
  // Try to find a good container for the button
  let buttonContainer = document.querySelector(AIRBNB_CONFIG.selectors.checkoutButtonContainer);
  if (!buttonContainer) return;
  
  // Use utility function to check if button should be shown
  const buttonResponse = getButtonResponse(otaData, pricesData);
  if (!buttonResponse.shouldShow) {
    console.log(`⏭️ Skipping checkout button injection — ${!otaData?.listing_id ? 'no listing_id' : 'conditions not met'}`);
    return;
  }
  
  // Create checkout card with OTA data and prices
  const checkoutCard = document.createElement('div');
  checkoutCard.className = 'sf-checkout-card';
  const cardHTML = createCheckoutCard(otaData, pricesData);
  checkoutCard.innerHTML = cardHTML;

  buttonContainer.insertBefore(checkoutCard, buttonContainer?.firstChild?.nextSibling as Node);
}

/**
 * Inject skeleton button on checkout page while waiting for API response
 */
export function injectCheckoutSkeletonButton() {
  const existingButton = document.querySelector('.sf-checkout-card') as HTMLElement;
  const existingSkeleton = document.querySelector('.sf-skeleton-checkout') as HTMLElement;
  
  // Try to find a good container for the button
  let buttonContainer = document.querySelector(AIRBNB_CONFIG.selectors.checkoutButtonContainer);
  if (!buttonContainer) return;
  
  // If button or skeleton already exists, skip
  if (existingButton || existingSkeleton) {
    return;
  }
  
  const skeletonButton = createCheckoutSkeletonButton();
  buttonContainer.insertBefore(skeletonButton, buttonContainer?.firstChild?.nextSibling as Node);
}

/**
 * Remove skeleton button from checkout pages
 */
export function removeCheckoutSkeletonButton() {
  const skeletonButton = document.querySelector('.sf-skeleton-checkout');
  if (skeletonButton) {
    skeletonButton.remove();
  }
}

