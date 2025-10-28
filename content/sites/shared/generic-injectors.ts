import type { SiteConfig } from '../configs/all-site-configs';
import { createListingButton } from '../../components/Button';
import { findCardContainer } from '../../../utils/dom';
import type { ListingPrices, OtaListingData } from '../../../types/services-types';
import { getButtonResponse } from '../../../utils/price';

/**
 * Inject buttons on listing cards
 */
export function injectListingButtons(
  config: SiteConfig,
  allPrices: Record<string, ListingPrices | null>,
  otaListings: OtaListingData[]
) {
  const links = document.querySelectorAll(config.selectors.listingLinks);
  console.log(`Found ${links.length} property links for ${config.name}`);
  
  if (links.length === 0) {
    return;
  }
  
  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const match = href.match(config.patterns.listingIdFromUrl);
    if (!match || !match[1]) return;
    
    const listingId = match[1];
    const otaData = otaListings.find(o => o.airbnb_listing_id === listingId);
    const priceData = allPrices[listingId];
    
    // Use utility function to check if button should be shown
    const buttonResponse = getButtonResponse(otaData, priceData);
    if (!buttonResponse.shouldShow) return;
    
    // Try multiple methods to find card container
    let cardContainer = findCardContainer(link as HTMLElement);
    
    // If no container found, try site-specific selector
    if (!cardContainer && config.selectors.cardContainer) {
      cardContainer = link.closest(config.selectors.cardContainer) as HTMLElement;
    }
    
    // If still no container, use parent of link
    if (!cardContainer) {
      cardContainer = link.parentElement as HTMLElement;
    }
    
    if (!cardContainer) return;
    
    // Skip if button already exists
    if (cardContainer.querySelector('.stayfinder-listing-button')) return;
    
    const button = createListingButton({
      listingId: listingId,
      otaData: otaData,
      pricesData: priceData
    });
    
    cardContainer.appendChild(button);
  });
}

