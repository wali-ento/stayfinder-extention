// StayFinder HTML Templates

import { LOGO_ICON } from "@/assets/svg-icons";
import { ListingPrices, OtaListingData } from "@/types/services-types";

/**
 * StayFinder card HTML for checkout pages
 */
export function createCheckoutCard(
    otaData: OtaListingData,
    pricesData: ListingPrices | null,
    onClick?: () => void,
): string {
  return `
      <div class="sf-header">
        <div class="sf-logo">
          ${LOGO_ICON}
          <span>StayFinder</span>
        </div>
      </div>

      <div class="sf-price-info">
        <p>Total price on StayFinder</p>
        <p class="sf-price">$${Math.ceil(pricesData?.total_price || 0).toFixed(2)}</p>
      </div>

      <p class="sf-savings-message">
        A total of <strong>20%</strong> you can save on this reservation,
        giving you the best available rate.
      </p>

      <p class="sf-best-price-message">
        We found you the best available price.
      </p>

      <button class="sf-save-button" ${onClick ? `onclick="${onClick}"` : ''}>
        ${LOGO_ICON}
        <span>Save $${Math.ceil(pricesData?.direct_booking_website_discount || 0)} total</span>
      </button>
  `;
}
