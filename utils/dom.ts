/**
 * Find the card container for a listing link
 */
export function findCardContainer(link: HTMLElement): HTMLElement | null {
  return link.closest('[itemprop="itemListElement"]') ||
         link.closest('[data-testid="card-container"]') ||
         link.closest('div[role="group"]') ||
         link.parentElement?.parentElement as HTMLElement;
}

/**
 * Find the image wrapper inside a card container
 */
export function findImageWrapper(container: HTMLElement): HTMLElement | null {
  const img = container.querySelector('img');
  if (!img) return null;
  
  let wrapper = img.parentElement;
  
  while (wrapper && wrapper !== container) {
    const rect = wrapper.getBoundingClientRect();
    if (rect.width > 100 && rect.height > 100) {
      break;
    }
    wrapper = wrapper.parentElement;
  }
  
  if (wrapper) {
    wrapper.style.position = 'relative';
  }
  
  return wrapper;
}

