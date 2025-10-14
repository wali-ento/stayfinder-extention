/**
 * Find the card container for a listing link
 */
export function findCardContainer(link: HTMLElement): HTMLElement | null {
  return link.closest('[itemprop="itemListElement"]') ||
         link.closest('[data-testid="card-container"]') ||
         link.closest('div[role="group"]')
}

