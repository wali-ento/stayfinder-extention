import {
  isConfirmationPage,
  extractBookingDetails,
  detectPMPlatform,
  calculateNights,
} from "../utils/parser";
import { trackBookingCompleted } from "../utils/tracking";
import {
  getSettings,
  incrementBookings,
  isProcessed,
  markAsProcessed,
} from "../utils/storage";

export default defineContentScript({
  matches: [
    "https://*.cloudbeds.com/*",
    "https://*.hostfully.com/*",
    "https://*.lodgify.com/*",
    "https://*.bookingpal.com/*",
    "https://*.guesty.com/*",
    "https://*.streamline.io/*",
    "https://*.igms.com/*",
  ],
  main() {
    console.log("🏢 StayFinder: Property Manager website detected!");

    init();
  },
});

async function init() {
  // Check if extension is enabled
  const settings = await getSettings();
  if (!settings.enabled || !settings.enable_tracking) {
    console.log("⏸️ Tracking disabled");
    return;
  }

  // Check if this is a referral from StayFinder
  if (!isStayFinderReferral()) {
    console.log("ℹ️ Not a StayFinder referral");
    return;
  }

  console.log("✅ StayFinder referral detected");

  // Create tracking session
  const sessionId = getOrCreateTrackingSession();
  console.log("📍 Session ID:", sessionId);

  // Monitor for booking confirmation
  monitorForConfirmation();
}

function isStayFinderReferral(): boolean {
  // Method 1: Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("sf_source") === "extension") {
    return true;
  }

  // Method 2: Check document referrer
  if (
    document.referrer.includes("stayfinder.com") ||
    document.referrer.includes("airbnb.com")
  ) {
    return true;
  }

  // Method 3: Check sessionStorage
  if (sessionStorage.getItem("sf_referral")) {
    return true;
  }

  return false;
}

function getOrCreateTrackingSession(): string {
  let sessionId = sessionStorage.getItem("sf_session_id");

  if (!sessionId) {
    sessionId = `sf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("sf_session_id", sessionId);
    sessionStorage.setItem("sf_referral", "1");
  }

  return sessionId;
}

function monitorForConfirmation() {
  // Method 1: URL-based detection
  if (isConfirmationPage(window.location.href)) {
    console.log("✅ Confirmation page detected (URL)");
    handleConfirmation();
    return;
  }

  // Method 2: MutationObserver for dynamic content
  const observer = new MutationObserver(() => {
    if (isConfirmationPage(window.location.href)) {
      console.log("✅ Confirmation page detected (URL change)");
      observer.disconnect();
      handleConfirmation();
      return;
    }

    // Check for confirmation elements
    if (detectConfirmationElements()) {
      console.log("✅ Confirmation detected (DOM)");
      observer.disconnect();
      handleConfirmation();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  if (detectConfirmationElements()) {
    console.log("✅ Confirmation detected (initial)");
    observer.disconnect();
    handleConfirmation();
  }
}

function detectConfirmationElements(): boolean {
  // Check for confirmation-specific elements
  const confirmationSelectors = [
    '[data-testid="confirmation"]',
    '[data-testid="booking-confirmed"]',
    ".confirmation",
    ".booking-confirmed",
    '[class*="confirmation"]',
    '[class*="Confirmation"]',
  ];

  for (const selector of confirmationSelectors) {
    if (document.querySelector(selector)) {
      return true;
    }
  }

  // Check for confirmation text
  const bodyText = document.body.textContent?.toLowerCase() || "";
  const confirmationKeywords = [
    "booking confirmed",
    "reservation confirmed",
    "confirmation number",
    "booking complete",
    "thank you for your booking",
  ];

  return confirmationKeywords.some((keyword) => bodyText.includes(keyword));
}

async function handleConfirmation() {
  try {
    // Extract booking details
    const bookingDetails = extractBookingDetails(document);

    if (!bookingDetails || !bookingDetails.confirmationNumber) {
      console.error("❌ Could not extract booking details");
      return;
    }

    console.log("📦 Booking details:", bookingDetails);

    // Check if already processed (prevent duplicates)
    const confirmationId = `booking_${bookingDetails.confirmationNumber}`;
    if (await isProcessed(confirmationId)) {
      console.log("ℹ️ Booking already processed");
      return;
    }

    // Mark as processed
    await markAsProcessed(confirmationId);

    // Calculate nights if dates available
    let nights = 0;
    if (bookingDetails.checkIn && bookingDetails.checkOut) {
      nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
    }

    // Detect PM platform
    const pmPlatform = detectPMPlatform(window.location.href);

    // Get stored data from session
    const sessionId = sessionStorage.getItem("sf_session_id") || "";
    const listingId = parseInt(sessionStorage.getItem("sf_listing_id") || "0");
    const airbnbId = sessionStorage.getItem("sf_airbnb_id") || "";

    // Track booking completion
    await trackBookingCompleted({
      listingId,
      airbnbId,
      propertyName: bookingDetails.propertyName || "Unknown Property",
      checkIn: bookingDetails.checkIn || "",
      checkOut: bookingDetails.checkOut || "",
      nights,
      guests: bookingDetails.guests || 2,
      totalPrice: bookingDetails.totalPrice || 0,
      currency: "USD",
      confirmationNumber: bookingDetails.confirmationNumber,
      pmPlatform,
    });

    // Update stats
    await incrementBookings();

    // Show thank you message
    showThankYouMessage();

    console.log("✅ Booking tracked successfully");
  } catch (error) {
    console.error("❌ Failed to handle confirmation:", error);
  }
}

function showThankYouMessage() {
  // Create thank you banner
  const banner = document.createElement("div");
  banner.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 20px 24px;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 320px;
    animation: slideIn 0.3s ease-out;
  `;

  banner.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="font-size: 24px;">🎉</div>
      <div>
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
          Thank you for booking!
        </div>
        <div style="font-size: 14px; opacity: 0.9;">
          Your booking helps support StayFinder and property managers.
        </div>
      </div>
    </div>
  `;

  // Add animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);

  // Insert banner
  document.body.appendChild(banner);

  // Auto-dismiss after 6 seconds
  setTimeout(() => {
    banner.style.animation = "slideIn 0.3s ease-out reverse";
    setTimeout(() => {
      banner.remove();
      style.remove();
    }, 300);
  }, 6000);
}
