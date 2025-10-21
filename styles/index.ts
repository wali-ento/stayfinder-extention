import buttonCSS from './stayfinder-global.css?raw';

/**
 * Inject global styles into the page
 */
export function injectGlobalStyles() {
  if (document.getElementById('stayfinder-global-styles')) {
    return;
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'stayfinder-global-styles';
  styleElement.textContent = buttonCSS;
  
  document.head.appendChild(styleElement);
}

