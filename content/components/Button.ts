import { ListingPrices, OtaListingData } from '@/types/services-types';
import { getButtonResponse, applyPartnerBadgeClasses } from '../../utils/price';
import { LOGO_ICON } from '@/assets/svg-icons';

export interface ButtonConfig {
  listingId?: string;
  savings?: number;
  onClick?: () => void;
  className?: string;
  otaData?: OtaListingData;
  pricesData?: ListingPrices | null;
}

/**
 * Create a listing button (for listing cards)
 * Uses global CSS classes
 */
export function createListingButton(config: ButtonConfig): HTMLElement {
  const { listingId, onClick, otaData, pricesData } = config;

  // Use utility function to get button response
  const buttonResponse = getButtonResponse(otaData, pricesData);
  
  // Don't create button if it shouldn't be shown
  if (!buttonResponse.shouldShow) {
    return document.createElement('div'); // Return empty div
  }
  
  const button = document.createElement('div');
  button.className = 'stayfinder-button-base stayfinder-listing-button';
  if (listingId) {
    button.setAttribute('data-listing-id', listingId);
  }
  button.innerHTML = `${LOGO_ICON} ${buttonResponse.buttonText}`;
  
  // Apply partner badge classes
  applyPartnerBadgeClasses(button, otaData);

  // Click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Button clicked!', listingId);
    
    if (onClick) {
      onClick();
    } else if (buttonResponse.redirectUrl) {
      window.open(buttonResponse.redirectUrl, '_blank');
    } else {
      window.open('https://www.google.com/search?q=book+vacation+rental+direct', '_blank');
    }
  });
  
  return button;
}

/**
 * Create a detail page button
 * Uses global CSS classes
 */
export function createDetailButton(config: ButtonConfig): HTMLElement {
  const { savings, onClick, className, otaData, pricesData } = config;
  
  // Use utility function to get button response
  const buttonResponse = getButtonResponse(otaData, pricesData);
  
  const button = document.createElement('div');
  button.className = `stayfinder-button-base ${className || ''}`;
  
  // Use button response if available, otherwise fallback to savings
  if (buttonResponse.shouldShow) {
    button.innerHTML = `${LOGO_ICON} ${buttonResponse.buttonText}`;
  }
  
  // Apply partner badge classes
  applyPartnerBadgeClasses(button, otaData);
  
  // Click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Detail button clicked!');
    
    if (onClick) {
      onClick();
    } else if (buttonResponse.redirectUrl) {
      window.open(buttonResponse.redirectUrl, '_blank');
    } else {
      window.open('https://staging-app.stayfinder.co/', '_blank');
    }
  });
  
  return button;
}
