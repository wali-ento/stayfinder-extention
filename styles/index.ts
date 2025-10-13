import buttonCSS from './button.css?raw';

/**
 * Inject global styles into the page - runs once for all sites
 */
export function injectGlobalStyles() {
  if (document.getElementById('stayfinder-global-styles')) {
    return;
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'stayfinder-global-styles';
  styleElement.textContent = buttonCSS;
  
  document.head.appendChild(styleElement);
  console.log('✅ Global styles injected');
}

