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
  return `
      <div class="sf-header">
        <div class="sf-logo">
          ${LOGO_ICON}
          <span>StayFinder</span>
        </div>
      </div>
      ${otaData.price_available ? `
        <div class="sf-price-info">
          <p>Total price on StayFinder</p>
          <p class="sf-price">$${Math.ceil(pricesData?.total_price || 0).toFixed(2)}</p>
        </div>    
        ` : ''}

      <p class="sf-best-price-message">
        We found you the best available price.
      </p>

      <button>
        ${LOGO_ICON}
        <span>${getButtonResponse(otaData, pricesData).buttonText.replace('total', '')}</span>
      </button>
  `;
}
