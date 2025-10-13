import { AIRBNB_CONFIG } from './config';
import { createListingButton, createDetailButton } from '../../components/Button';
import { findCardContainer, findImageWrapper } from '../../../utils/dom';

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
    
    console.log(`✨ Processing listing ${listingId}`);
    
    const cardContainer = findCardContainer(link as HTMLElement);
    if (!cardContainer) {
      console.warn(`⚠️ Could not find card container for ${listingId}`);
      return;
    }
    
    const imageWrapper = findImageWrapper(cardContainer);
    if (!imageWrapper) {
      console.warn(`⚠️ No image wrapper found for ${listingId}`);
      return;
    }
    
    // Create and inject button using global component
    const button = createListingButton({ listingId });
    imageWrapper.appendChild(button);
    console.log(`✅ Button injected for ${listingId}`);
  });
}

/**
 * Inject button on detail pages
 */
export function injectDetailButton() {
  console.log('🔍 Checking for detail page elements...');
  
  // Check if button already exists
  if (document.querySelector('.stayfinder-detail-button')) {
    console.log('Detail button already exists, skipping...');
    return;
  }
  
  const detailElement = document.querySelector(AIRBNB_CONFIG.selectors.detailPageElement);
  if (!detailElement) {
    console.log('No detail page element found');
    return;
  }
  
  console.log('✨ Adding detail button');
  
  // Create and inject button using global component
  const button = createDetailButton({});
  (detailElement as HTMLElement).appendChild(button);
  console.log('✅ Detail button added');
}
