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
  button.innerHTML = `💰 Save $${savings}`;
  
  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px) scale(1.05)';
    button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.8)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.6)';
  });
  
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
  button.innerHTML = `💰 Save $${savings} - Book Direct`;
  
  // Hover effects
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-2px) scale(1.05)';
    button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.8)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.6)';
  });
  
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
