import { createRoot } from "react-dom/client";
import { CompareWidget } from "../../components/CompareWidget";
import { trackWidgetImpression, trackWidgetClick } from "../../utils/tracking";
import {
  extractAirbnbIdFromUrl,
  extractSearchParams,
} from "../../utils/parser";
import { getSettings, incrementSavings } from "../../utils/storage";

export default defineContentScript({
  matches: ["https://www.airbnb.com/rooms/*", "https://www.airbnb.*/rooms/*"],
  main() {
    console.log("🏠 StayFinder: Airbnb listing page detected!");

    init();
  },
});

async function init() {
  // Check if extension is enabled
  const settings = await getSettings();
  if (!settings.enabled || !settings.enable_listing_widget) {
    console.log("⏸️ Listing widget disabled");
    return;
  }

  // Extract listing ID from URL
  const airbnbId = extractAirbnbIdFromUrl(window.location.href);
  if (!airbnbId) {
    console.error("❌ Could not extract Airbnb listing ID");
    return;
  }

  console.log("📍 Listing ID:", airbnbId);

  // Wait for page to load
  await waitForPriceContainer();

  // Extract search parameters
  const searchParams = extractSearchParams(window.location.href);
  console.log("📍 Search params:", searchParams);

  // Match property
  await matchAndInjectWidget(airbnbId, searchParams);
}

function waitForPriceContainer(): Promise<void> {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      // Look for price container
      const priceContainer = document.querySelector(
        '[data-section-id="BOOK_IT_SIDEBAR"]'
      );
      if (priceContainer) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 500);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 10000);
  });
}

async function matchAndInjectWidget(
  airbnbId: string,
  searchParams: ReturnType<typeof extractSearchParams>
) {
  try {
    const response = await chrome.runtime.sendMessage({
      type: "match-property",
      data: {
        airbnb_id: airbnbId,
        check_in_date: searchParams.checkin,
        check_out_date: searchParams.checkout,
        adults: searchParams.adults || 2,
        children: searchParams.children || 0,
      },
    });

    if (response.success && response.data.matched) {
      const data = response.data;

      // Inject widget
      await injectWidget(airbnbId, data);

      // Track impression
      await trackWidgetImpression(airbnbId, data.listing_id);

      // Update user stats
      await incrementSavings(data.savings.amount);

      console.log("✅ Widget injected successfully");
    } else {
      console.log("ℹ️ No match found for this property");
    }
  } catch (error) {
    console.error("❌ Failed to match property:", error);
  }
}

async function injectWidget(airbnbId: string, matchData: any) {
  // Find insertion point
  const priceContainer = document.querySelector(
    '[data-section-id="BOOK_IT_SIDEBAR"]'
  );

  if (!priceContainer) {
    console.warn("⚠️ Price container not found");
    return;
  }

  // Check if widget already exists
  if (document.querySelector(".stayfinder-widget")) {
    return;
  }

  // Create widget container
  const widgetContainer = document.createElement("div");
  widgetContainer.style.marginTop = "20px";

  // Insert before price container
  priceContainer.parentElement?.insertBefore(widgetContainer, priceContainer);

  // Render React widget
  const root = createRoot(widgetContainer);

  const handleCtaClick = async () => {
    // Track click
    await trackWidgetClick(
      airbnbId,
      matchData.listing_id,
      matchData.direct_url
    );

    // Add session tracking parameters
    const url = new URL(matchData.direct_url);
    url.searchParams.set("sf_source", "extension");
    url.searchParams.set(
      "session_id",
      await (await import("../../utils/storage")).getSessionId()
    );

    // Open in new tab
    window.open(url.toString(), "_blank");
  };

  root.render(
    <CompareWidget
      savings={matchData.savings}
      prices={matchData.prices}
      company={matchData.company}
      directUrl={matchData.direct_url}
      onCtaClick={handleCtaClick}
    />
  );
}
