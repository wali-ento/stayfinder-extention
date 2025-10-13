/**
 * Setup MutationObserver to watch for DOM changes
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
      console.log('DOM changed, checking for new listings...');
      runFunction();
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
  
  console.log('✅ MutationObserver activated');
}
