import { createRoot } from "react-dom/client";
import { SavingsBadge, ComparePriceBadge } from "../../components/SavingsBadge";
import { trackBadgeImpression, trackBadgeClick } from "../../utils/tracking";
import {
  extractAirbnbIdFromElement,
  extractSearchParams,
} from "../../utils/parser";
import { getSettings, incrementSavings } from "../../utils/storage";

export default defineContentScript({
  matches: ["https://www.airbnb.com/s/*", "https://www.airbnb.*/s/*"],
  main() {
    console.log("🔍 StayFinder: Airbnb search page detected!");

    init();
  },
});

async function init() {
  // Check if extension is enabled
  const settings = await getSettings();
  if (!settings.enabled || !settings.enable_search_badges) {
    console.log("⏸️ Search badges disabled");
    return;
  }

  // Track processed listings to avoid duplicates
  const processedListings = new Set<string>();

  // Extract search parameters from URL
  const searchParams = extractSearchParams(window.location.href);
  console.log("📍 Search params:", searchParams);

  // Start observing for listing cards
  observeListings(processedListings, searchParams);
}

function observeListings(
  processedListings: Set<string>,
  searchParams: ReturnType<typeof extractSearchParams>
) {
  const observer = new MutationObserver(() => {
    processListings(processedListings, searchParams);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial processing
  processListings(processedListings, searchParams);
}

async function processListings(
  processedListings: Set<string>,
  searchParams: ReturnType<typeof extractSearchParams>
) {
  // Find all listing cards
  const listings = document.querySelectorAll('[data-testid="card-container"]');

  if (listings.length === 0) {
    // Try alternative selectors
    const altListings = document.querySelectorAll(
      '[itemprop="itemListElement"]'
    );
    if (altListings.length > 0) {
      console.log(
        `📦 Found ${altListings.length} listings (alternative selector)`
      );
      await processListingElements(
        Array.from(altListings),
        processedListings,
        searchParams
      );
      return;
    }
    return;
  }

  console.log(`📦 Found ${listings.length} listings`);
  await processListingElements(
    Array.from(listings),
    processedListings,
    searchParams
  );
}

async function processListingElements(
  listings: Element[],
  processedListings: Set<string>,
  searchParams: ReturnType<typeof extractSearchParams>
) {
  // Extract all Airbnb IDs
  const listingData: Array<{ element: Element; airbnbId: string }> = [];

  for (const listing of listings) {
    const airbnbId = extractAirbnbIdFromElement(listing);
    if (!airbnbId) continue;

    // Skip if already processed
    if (processedListings.has(airbnbId)) continue;

    processedListings.add(airbnbId);
    listingData.push({ element: listing, airbnbId });
  }

  if (listingData.length === 0) return;

  console.log(`🔄 Processing ${listingData.length} new listings`);

  // Batch match properties
  try {
    const response = await chrome.runtime.sendMessage({
      type: "batch-match",
      data: {
        properties: listingData.map((ld) => ({ airbnb_id: ld.airbnbId })),
        check_in_date: searchParams.checkin,
        check_out_date: searchParams.checkout,
        adults: searchParams.adults || 2,
      },
    });

    if (response.success && response.data.matches) {
      const matches = response.data.matches;

      for (const match of matches) {
        if (!match.matched) continue;

        // Find the corresponding listing element
        const listingInfo = listingData.find(
          (ld) => ld.airbnbId === match.airbnb_id
        );
        if (!listingInfo) continue;

        // Inject badge
        await injectBadge(
          listingInfo.element,
          match.airbnb_id,
          match.savings,
          match.currency,
          match.direct_url,
          match.listing_id
        );

        // Track impression
        await trackBadgeImpression(match.airbnb_id, match.listing_id);

        // Update user stats
        await incrementSavings(match.savings);
      }

      console.log(
        `✅ Injected ${matches.filter((m: any) => m.matched).length} badges`
      );
    }
  } catch (error) {
    console.error("❌ Failed to batch match properties:", error);
  }
}

async function injectBadge(
  element: Element,
  airbnbId: string,
  savings: number,
  currency: string,
  directUrl: string,
  listingId: number
) {
  // Find the image container
  const imageContainer = element.querySelector(
    '[data-testid="image-container"]'
  );
  if (!imageContainer) {
    console.warn("⚠️ Image container not found for listing:", airbnbId);
    return;
  }

  // Check if badge already exists
  if (imageContainer.querySelector(".stayfinder-badge")) {
    return;
  }

  // Create badge container
  const badgeContainer = document.createElement("div");
  badgeContainer.style.position = "relative";
  badgeContainer.style.width = "fit-content";

  // Make parent position relative
  const parent = imageContainer.parentElement;
  if (parent) {
    const originalPosition = window.getComputedStyle(parent).position;
    if (originalPosition === "static") {
      (parent as HTMLElement).style.position = "relative";
    }
  }

  // Render React badge
  const root = createRoot(badgeContainer);

  const handleClick = async () => {
    // Track click
    await trackBadgeClick(airbnbId, listingId, directUrl);

    // Add session tracking parameters
    const url = new URL(directUrl);
    url.searchParams.set("sf_source", "extension");
    url.searchParams.set(
      "session_id",
      await (await import("../../utils/storage")).getSessionId()
    );

    // Open in new tab
    window.open(url.toString(), "_blank");
  };

  if (savings > 0) {
    root.render(
      <SavingsBadge
        savings={savings}
        currency={currency}
        onClick={handleClick}
      />
    );
  } else {
    root.render(<ComparePriceBadge onClick={handleClick} />);
  }

  imageContainer.appendChild(badgeContainer);
}
