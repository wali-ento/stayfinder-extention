import { BOOK_DIRECT_ICON, SAVINGS_ICON } from '@/assets/svg-icons';
import { generateSavings } from '../../utils/price';

export interface ButtonConfig {
  listingId?: string;
  savings?: number;
  onClick?: () => void;
}

/**
 * Create a listing button (for listing cards)
 * Uses global CSS classes
 */
export function createListingButton(config: ButtonConfig): HTMLElement {
  const { listingId, savings = generateSavings(30, 180), onClick } = config;
  
  const button = document.createElement('div');
  button.className = 'stayfinder-button-base stayfinder-listing-button';
  if (listingId) {
    button.setAttribute('data-listing-id', listingId);
  }
  button.innerHTML = `${SAVINGS_ICON} Save $${savings}`;
  
  // Click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Button clicked!', listingId);
    
    if (onClick) {
      onClick();
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
  const { savings = generateSavings(50, 250), onClick } = config;
  
  const button = document.createElement('div');
  button.className = 'stayfinder-button-base stayfinder-detail-button';
  button.innerHTML = `${BOOK_DIRECT_ICON} Save $${savings} - Book Direct`;
  
  // Click handler
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 Detail button clicked!');
    
    if (onClick) {
      onClick();
    } else {
      window.open('https://staging-app.stayfinder.co/', '_blank');
    }
  });
  
  return button;
}
