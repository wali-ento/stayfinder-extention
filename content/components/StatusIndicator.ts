import { BOOK_DIRECT_ICON } from "@/assets/svg-icons";

/**
 * Show status indicator to confirm extension is active
 */
export function showStatusIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'stayfinder-indicator';
  indicator.innerHTML = `${BOOK_DIRECT_ICON} StayFinder Active`;
  
  indicator.onclick = () => {
    console.log('📊 Extension Status:');
    console.log('- Property links:', document.querySelectorAll('a[href*="/rooms/"]').length);
    console.log('- Buttons added:', document.querySelectorAll('.stayfinder-listing-button').length);
    console.log('- Detail buttons:', document.querySelectorAll('.stayfinder-detail-button').length);
  };
  
  document.body.appendChild(indicator);
  
  // Remove after 5 seconds
  setTimeout(() => {
    indicator.style.opacity = '0';
    setTimeout(() => indicator.remove(), 500);
  }, 5000);
}

