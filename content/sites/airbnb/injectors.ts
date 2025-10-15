import { AIRBNB_CONFIG } from './config';
import { createListingButton, createDetailButton } from '../../components/Button';
import { findCardContainer } from '../../../utils/dom';
import { getSavingsForListingId } from '../../../utils/price';
import type { ListingPrices } from '../../../types/services-types';

/**
 * Inject price buttons on listing cards
 */
export function injectListingButtons() {
  const links = document.querySelectorAll(AIRBNB_CONFIG.selectors.listingLinks);
  console.log(`Found ${links.length} property links`);
  
  if (links.length === 0) {
    console.warn('⚠️ No property links found!');
    return;
  }
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(AIRBNB_CONFIG.patterns.listingIdFromUrl);
    if (!match) return;
    
    const listingId = match[1];
    
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) {
      console.warn(`⚠️ Could not find card container for ${listingId}`);
      return;
    }
    
    // Skip if button already exists in this specific card
    if (cardContainer.querySelector('.stayfinder-listing-button')) return;
    
    const savings = getSavingsForListingId(listingId, 30, 180);    
    const button = createListingButton({ listingId, savings });
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
  
  const firstChild = detailElement.querySelector('[data-testid="book-it-default"]');
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
    onClick: bookNowUrl ? () => window.open(bookNowUrl, '_blank') : undefined
  });
  
  if (bookNowUrl) {
    button.setAttribute('data-book-url', bookNowUrl);
  }
  
  firstChild.parentNode?.insertBefore(button, firstChild.nextSibling);
  console.log('Button injected with discount:', discount);
}

