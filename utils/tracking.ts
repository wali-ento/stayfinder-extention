import { apiClient } from "./api-client";
import { getSessionId, addToRetryQueue } from "./storage";

export type EventType =
  | "badge_impression"
  | "badge_click"
  | "widget_impression"
  | "widget_click";

export interface TrackingEvent {
  event_type: EventType;
  listing_id?: number;
  metadata?: Record<string, any>;
}

/**
 * Track user interaction events
 */
export async function trackEvent(event: TrackingEvent): Promise<void> {
  try {
    const sessionId = await getSessionId();

    await apiClient.trackEvent({
      session_id: sessionId,
      event_type: event.event_type,
      timestamp: new Date().toISOString(),
      listing_id: event.listing_id,
      metadata: event.metadata,
    });

    console.log("✅ Event tracked:", event.event_type);
  } catch (error) {
    console.error("❌ Failed to track event:", error);

    // Add to retry queue
    await addToRetryQueue("track_event", {
      session_id: await getSessionId(),
      event_type: event.event_type,
      timestamp: new Date().toISOString(),
      listing_id: event.listing_id,
      metadata: event.metadata,
    });
  }
}

/**
 * Track badge impression
 */
export async function trackBadgeImpression(
  airbnbId: string,
  listingId?: number
): Promise<void> {
  await trackEvent({
    event_type: "badge_impression",
    listing_id: listingId,
    metadata: {
      airbnb_id: airbnbId,
      source: "extension",
      page: "search",
    },
  });
}

/**
 * Track badge click
 */
export async function trackBadgeClick(
  airbnbId: string,
  listingId: number,
  directUrl: string
): Promise<void> {
  await trackEvent({
    event_type: "badge_click",
    listing_id: listingId,
    metadata: {
      airbnb_id: airbnbId,
      source: "extension",
      page: "search",
      direct_url: directUrl,
      url: window.location.href,
    },
  });
}

/**
 * Track widget impression
 */
export async function trackWidgetImpression(
  airbnbId: string,
  listingId: number
): Promise<void> {
  await trackEvent({
    event_type: "widget_impression",
    listing_id: listingId,
    metadata: {
      airbnb_id: airbnbId,
      source: "extension",
      page: "listing",
    },
  });
}

/**
 * Track widget click
 */
export async function trackWidgetClick(
  airbnbId: string,
  listingId: number,
  directUrl: string
): Promise<void> {
  await trackEvent({
    event_type: "widget_click",
    listing_id: listingId,
    metadata: {
      airbnb_id: airbnbId,
      source: "extension",
      page: "listing",
      direct_url: directUrl,
      url: window.location.href,
    },
  });
}

/**
 * Track booking completion
 */
export async function trackBookingCompleted(bookingData: {
  listingId: number;
  airbnbId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  totalPrice: number;
  currency: string;
  confirmationNumber: string;
  pmPlatform: string;
}): Promise<void> {
  try {
    const sessionId = await getSessionId();

    await apiClient.trackBookingCompleted({
      session_id: sessionId,
      timestamp: new Date().toISOString(),
      listing_id: bookingData.listingId,
      airbnb_id: bookingData.airbnbId,
      booking_details: {
        property_name: bookingData.propertyName,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        nights: bookingData.nights,
        guests: bookingData.guests,
        total_price: bookingData.totalPrice,
        currency: bookingData.currency,
        confirmation_number: bookingData.confirmationNumber,
        pm_platform: bookingData.pmPlatform,
      },
      source: "extension",
    });

    console.log("✅ Booking tracked:", bookingData.confirmationNumber);
  } catch (error) {
    console.error("❌ Failed to track booking:", error);

    // Add to retry queue
    await addToRetryQueue("track_booking", {
      session_id: await getSessionId(),
      timestamp: new Date().toISOString(),
      listing_id: bookingData.listingId,
      airbnb_id: bookingData.airbnbId,
      booking_details: {
        property_name: bookingData.propertyName,
        check_in_date: bookingData.checkIn,
        check_out_date: bookingData.checkOut,
        nights: bookingData.nights,
        guests: bookingData.guests,
        total_price: bookingData.totalPrice,
        currency: bookingData.currency,
        confirmation_number: bookingData.confirmationNumber,
        pm_platform: bookingData.pmPlatform,
      },
      source: "extension",
    });
  }
}

