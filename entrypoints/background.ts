export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  
  // Listen for messages from content script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Received message in background:', message);
  });
});
