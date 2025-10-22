// Listings Prices API Types
export type OtaPrice = {
    provider: string;
    price_per_night: number;
    total_price: number;
    external_url: string;
  };

export type ListingPricesParams = {
  check_in_date: string;
  check_out_date: string;
  number_of_adults: number;
  number_of_children: number;
  number_of_infants: number;
  number_of_pets: number;
};

export type ListingPrices = {
    currency: string;
    ota_prices: OtaPrice[];
    nights: number;
    price_per_night: number;
    cleaning_fee: number;
    taxes_and_fees: number;
    direct_booking_website_discount: number;
    total_price: number;
    check_in_date?: Date | null;
    check_out_date?: Date | null;
    direct_booking_website_discount_percentage?: number;
    estimated_direct_booking_price?: number;
    book_now_url: string | null;
  };

export type ListingPricesResponse = {
  data: ListingPrices;
};

export type ListingPricesError = {
  success: boolean;
  error: string;
};


// OTA Listings Lookup API Types
export type OtaListingLookupParams = {
  listing_ids: string[];
};

export type OtaListingData = {
  airbnb_listing_id: string;
  listing_id: number;
  direct_booking: boolean;
  price_available: boolean;
};

export type OtaListingsLookupResponse = {
  data: OtaListingData[];
};

export type OtaListingsLookupError = {
  success: false;
  error: string;
};


