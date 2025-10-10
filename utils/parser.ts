/**
 * Utility functions for parsing DOM elements and extracting data
 */

/**
 * Extract Airbnb listing ID from URL
 */
export function extractAirbnbIdFromUrl(url: string): string | null {
  const match = url.match(/\/rooms\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Extract Airbnb listing ID from element
 */
export function extractAirbnbIdFromElement(element: Element): string | null {
  // Try to find link with rooms URL
  const link = element.querySelector('a[href*="/rooms/"]');
  if (link) {
    const href = link.getAttribute("href");
    if (href) {
      return extractAirbnbIdFromUrl(href);
    }
  }

  // Try data attributes
  const dataId = element.getAttribute("data-listing-id");
  if (dataId) return dataId;

  return null;
}

/**
 * Extract search parameters from Airbnb search URL
 */
export function extractSearchParams(url: string): {
  location?: string;
  checkin?: string;
  checkout?: string;
  adults?: number;
  children?: number;
} {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);

  return {
    location: params.get("location") || undefined,
    checkin: params.get("checkin") || undefined,
    checkout: params.get("checkout") || undefined,
    adults: params.get("adults") ? parseInt(params.get("adults")!) : undefined,
    children: params.get("children")
      ? parseInt(params.get("children")!)
      : undefined,
  };
}

/**
 * Extract price from element
 */
export function extractPrice(element: Element): number | null {
  // Try to find price elements
  const priceSelectors = [
    '[data-testid="price"]',
    ".price",
    '[class*="price"]',
    '[class*="Price"]',
  ];

  for (const selector of priceSelectors) {
    const priceEl = element.querySelector(selector);
    if (priceEl) {
      const text = priceEl.textContent || "";
      const match = text.match(/\$?([\d,]+)/);
      if (match) {
        return parseInt(match[1].replace(/,/g, ""));
      }
    }
  }

  return null;
}

/**
 * Check if URL matches booking confirmation patterns
 */
export function isConfirmationPage(url: string): boolean {
  const patterns = [
    /\/confirmation/i,
    /\/thank-you/i,
    /\/booking-success/i,
    /\/booking-confirmed/i,
    /\/reservation-confirmed/i,
  ];

  return patterns.some((pattern) => pattern.test(url));
}

/**
 * Extract booking details from confirmation page
 */
export function extractBookingDetails(document: Document): {
  propertyName?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  totalPrice?: number;
  confirmationNumber?: string;
} | null {
  const result: any = {};

  // Extract property name
  const nameSelectors = [
    "h1",
    '[data-testid="property-name"]',
    ".property-name",
    '[class*="PropertyName"]',
  ];

  for (const selector of nameSelectors) {
    const el = document.querySelector(selector);
    if (el?.textContent) {
      result.propertyName = el.textContent.trim();
      break;
    }
  }

  // Extract confirmation number
  const confirmationText = document.body.textContent || "";
  const confirmationMatch = confirmationText.match(
    /(?:confirmation|booking|reservation)[\s#:]*([A-Z0-9-]+)/i
  );
  if (confirmationMatch) {
    result.confirmationNumber = confirmationMatch[1];
  }

  // Extract dates
  const datePatterns = [
    /check-?in:?\s*(\d{4}-\d{2}-\d{2})/i,
    /check-?out:?\s*(\d{4}-\d{2}-\d{2})/i,
  ];

  datePatterns.forEach((pattern, index) => {
    const match = confirmationText.match(pattern);
    if (match) {
      if (index === 0) result.checkIn = match[1];
      else result.checkOut = match[1];
    }
  });

  // Extract total price
  const priceMatch = confirmationText.match(
    /total:?\s*\$?([\d,]+(?:\.\d{2})?)/i
  );
  if (priceMatch) {
    result.totalPrice = parseFloat(priceMatch[1].replace(/,/g, ""));
  }

  // Extract guests
  const guestsMatch = confirmationText.match(/(\d+)\s+guests?/i);
  if (guestsMatch) {
    result.guests = parseInt(guestsMatch[1]);
  }

  // Return null if we don't have minimum required data
  if (!result.confirmationNumber && !result.propertyName) {
    return null;
  }

  return result;
}

/**
 * Detect Property Manager platform from URL
 */
export function detectPMPlatform(url: string): string {
  const platforms = {
    cloudbeds: /cloudbeds\.com/i,
    hostfully: /hostfully\.com/i,
    lodgify: /lodgify\.com/i,
    bookingpal: /bookingpal\.com/i,
    guesty: /guesty\.com/i,
    streamline: /streamline\.io/i,
    igms: /igms\.com/i,
  };

  for (const [name, pattern] of Object.entries(platforms)) {
    if (pattern.test(url)) {
      return name;
    }
  }

  return "unknown";
}

/**
 * Calculate nights between two dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Check if element is visible
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

