// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 300; // 300ms

/**
 * Setup MutationObserver to watch for DOM changes (with debouncing)
 */
export function setupObserver(runFunction: () => void) {
  const observer = new MutationObserver((mutations) => {
    let shouldUpdate = false;
    
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldUpdate = true;
        break;
      }
    }
    
    if (shouldUpdate) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      
      // Set new timer - only run after DOM changes have settled
      debounceTimer = setTimeout(() => {
        runFunction();
        debounceTimer = null;
      }, DEBOUNCE_DELAY);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
}
