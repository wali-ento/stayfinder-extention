import { describe, it, expect } from "vitest";
import {
  extractAirbnbIdFromUrl,
  extractSearchParams,
  isConfirmationPage,
  detectPMPlatform,
  calculateNights,
  formatCurrency,
} from "../../utils/parser";

describe("Parser Utils", () => {
  describe("extractAirbnbIdFromUrl", () => {
    it("should extract Airbnb ID from listing URL", () => {
      const url = "https://www.airbnb.com/rooms/12345678";
      expect(extractAirbnbIdFromUrl(url)).toBe("12345678");
    });

    it("should extract Airbnb ID from URL with query params", () => {
      const url = "https://www.airbnb.com/rooms/12345678?checkin=2025-07-01";
      expect(extractAirbnbIdFromUrl(url)).toBe("12345678");
    });

    it("should return null for invalid URL", () => {
      const url = "https://www.airbnb.com/search";
      expect(extractAirbnbIdFromUrl(url)).toBeNull();
    });
  });

  describe("extractSearchParams", () => {
    it("should extract search parameters from URL", () => {
      const url =
        "https://www.airbnb.com/s/San-Francisco--CA?checkin=2025-07-01&checkout=2025-07-08&adults=2&children=1";
      const params = extractSearchParams(url);

      expect(params.checkin).toBe("2025-07-01");
      expect(params.checkout).toBe("2025-07-08");
      expect(params.adults).toBe(2);
      expect(params.children).toBe(1);
    });

    it("should return undefined for missing parameters", () => {
      const url = "https://www.airbnb.com/s/San-Francisco--CA";
      const params = extractSearchParams(url);

      expect(params.checkin).toBeUndefined();
      expect(params.checkout).toBeUndefined();
    });
  });

  describe("isConfirmationPage", () => {
    it("should detect confirmation page by URL", () => {
      expect(isConfirmationPage("https://example.com/confirmation")).toBe(true);
      expect(isConfirmationPage("https://example.com/thank-you")).toBe(true);
      expect(isConfirmationPage("https://example.com/booking-success")).toBe(
        true
      );
    });

    it("should return false for non-confirmation pages", () => {
      expect(isConfirmationPage("https://example.com/booking")).toBe(false);
      expect(isConfirmationPage("https://example.com/property/123")).toBe(
        false
      );
    });
  });

  describe("detectPMPlatform", () => {
    it("should detect CloudBeds", () => {
      expect(
        detectPMPlatform("https://hotels.cloudbeds.com/en/booking/123")
      ).toBe("cloudbeds");
    });

    it("should detect Hostfully", () => {
      expect(
        detectPMPlatform("https://coastal.hostfully.com/property/123")
      ).toBe("hostfully");
    });

    it("should detect Lodgify", () => {
      expect(detectPMPlatform("https://www.lodgify.com/booking/123")).toBe(
        "lodgify"
      );
    });

    it("should return unknown for unrecognized platforms", () => {
      expect(detectPMPlatform("https://example.com/booking/123")).toBe(
        "unknown"
      );
    });
  });

  describe("calculateNights", () => {
    it("should calculate nights between two dates", () => {
      expect(calculateNights("2025-07-01", "2025-07-08")).toBe(7);
      expect(calculateNights("2025-01-01", "2025-01-02")).toBe(1);
    });

    it("should handle same-day check-in and check-out", () => {
      expect(calculateNights("2025-07-01", "2025-07-01")).toBe(0);
    });
  });

  describe("formatCurrency", () => {
    it("should format USD currency", () => {
      expect(formatCurrency(1234.56, "USD")).toBe("$1,234.56");
    });

    it("should format without decimals for whole numbers", () => {
      const formatted = formatCurrency(1000, "USD");
      expect(formatted).toContain("1,000");
    });

    it("should default to USD", () => {
      const formatted = formatCurrency(100);
      expect(formatted).toContain("$");
    });
  });
});

