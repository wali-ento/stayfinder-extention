import { AIRBNB_CONFIG } from './config';
import { createListingButton, createDetailButton } from '../../components/Button';
import { findCardContainer } from '../../../utils/dom';

/**
 * Inject price buttons on listing cards
 */
export function injectListingButtons(processedIds: Set<string>) {
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
    
    // Skip if already processed
    if (processedIds.has(listingId)) return;
    processedIds.add(listingId);
        
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) {
      console.warn(`⚠️ Could not find card container for ${listingId}`);
      return;
    }
    
    // Create and inject button using global component at the bottom of the card
    const button = createListingButton({ listingId });
    
    // Append to the end of the card container (bottom of card)
    cardContainer.appendChild(button);
  });
}

/**
 * Inject button on detail pages
 */
export function injectDetailButton() {
  console.log('🔍 Checking for detail page elements...');
  
  // Check if button already exists
  if (document.querySelector('.stayfinder-detail-button')) {
    return;
  }
  
  const detailElement = document.querySelector(AIRBNB_CONFIG.selectors.detailPageElement);
  if (!detailElement) {
    console.log('No detail page element found');
    return;
  }
  
  const firstChild = detailElement.querySelector('[data-testid="book-it-default"]');
  if (!firstChild) {
    return;
  }
    
  // Create and inject button using global component
  const button = createDetailButton({});
  firstChild.parentNode?.insertBefore(button, firstChild.nextSibling);
}
