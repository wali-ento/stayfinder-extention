import { initContentScript } from '../content';

export default defineContentScript({
  matches: ['*://*.airbnb.com/*', '*://*.airbnb.ca/*', '*://*.airbnb.co.uk/*'],
  
  main() {
    initContentScript();
  }
});
