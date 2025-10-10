import { defineConfig } from "wxt";

export default defineConfig({
  manifest: {
    name: "StayFinder - Direct Booking Savings",
    description:
      "Save money by booking vacation rentals direct from property managers",
    version: "1.0.0",
    permissions: ["storage", "tabs"],
    host_permissions: [
      "https://www.airbnb.com/*",
      "https://api.stayfinder.com/*",
      "https://*.cloudbeds.com/*",
      "https://*.hostfully.com/*",
      "https://*.lodgify.com/*",
      "https://*.bookingpal.com/*",
    ],
    action: {
      default_title: "StayFinder Extension",
    },
  },
  modules: ["@wxt-dev/module-react"],
});

