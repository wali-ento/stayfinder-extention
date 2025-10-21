export default defineBackground(() => {
  console.log('background!', { id: browser.runtime.id });
});
