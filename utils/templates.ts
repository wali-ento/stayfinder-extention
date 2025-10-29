// StayFinder HTML Templates

import { LOGO_ICON } from "@/assets/svg-icons";
import { ListingPrices, OtaListingData } from "@/types/services-types";

/**
 * StayFinder card HTML for checkout pages
 */
export function createCheckoutCard(
    otaData: OtaListingData,
    pricesData: ListingPrices | null,
): string {
  const savings = otaData.price_available && pricesData ? 
    Math.ceil((pricesData.total_price || 0) * 0.2) : 0; // Mock 20% savings
 console.log(otaData);
 const isBlueBG = otaData.preferred_partner || otaData.verified_partner;
  return `
      <div class="sf-header">
        <div class="sf-logo">
          ${LOGO_ICON}
          <span>Stay<em>Finder</em></span>
        </div>
      </div>
      
      ${otaData.price_available ? `
        <div class="sf-price-section">
          <div class="sf-price-row">
            <span class="sf-price-label">Total price on StayFinder</span>
            <span class="sf-price-value">$${Math.ceil(pricesData?.total_price || 0).toFixed(2)}</span>
          </div>
        </div>
        ` : ''}

      <p class="sf-best-price-message">
        We found you the best available price.
      </p>

      <button class="sf-save-button" style="background: ${!isBlueBG ? '' : 'transparent'} !important; color: ${!isBlueBG ? '#FFFFFF' : '#585858'} !important; border-color: ${!isBlueBG ? 'transparent' : 'rgba(88, 88, 88, 0.20)'} !important; ">
          ${LOGO_ICON}
        <span>Save <em>$${savings}</em>
        </span>
      </button>
  `;
}
