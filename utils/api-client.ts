import axios, { AxiosInstance } from "axios";

// Mock data for development
const MOCK_MODE = true;

interface MatchPropertyRequest {
  airbnb_id: string;
  check_in_date?: string;
  check_out_date?: string;
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
}

interface BatchMatchRequest {
  properties: { airbnb_id: string }[];
  check_in_date?: string;
  check_out_date?: string;
  adults?: number;
}

interface TrackEventRequest {
  session_id: string;
  event_type: string;
  timestamp: string;
  listing_id?: number;
  metadata?: Record<string, any>;
}

interface BookingCompletedRequest {
  session_id: string;
  timestamp: string;
  listing_id: number;
  airbnb_id: string;
  booking_details: {
    property_name: string;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    guests: number;
    total_price: number;
    currency: string;
    confirmation_number: string;
    pm_platform: string;
  };
  source: string;
}

class ApiClient {
  private client: AxiosInstance;
  private mockDelay = 300; // Simulate network delay

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.stayfinder.com/api/v1",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API Error:", error.message);
        return Promise.reject(error);
      }
    );
  }

  private async mockDelay_() {
    return new Promise((resolve) => setTimeout(resolve, this.mockDelay));
  }

  async matchProperty(data: MatchPropertyRequest) {
    if (MOCK_MODE) {
      await this.mockDelay_();

      // Mock: 70% of properties have matches
      const hasMatch = Math.random() > 0.3;

      if (!hasMatch) {
        return { matched: false };
      }

      const savings = Math.floor(Math.random() * 300) + 50;
      const directTotal = Math.floor(Math.random() * 2000) + 800;
      const airbnbTotal = directTotal + savings;

      return {
        matched: true,
        listing_id: Math.floor(Math.random() * 1000) + 1,
        direct_url: `https://coastal-retreats.com/property-${data.airbnb_id}?checkin=${data.check_in_date}&checkout=${data.check_out_date}`,
        savings: {
          amount: savings,
          percentage: ((savings / airbnbTotal) * 100).toFixed(1),
        },
        prices: {
          currency: "USD",
          nights: 7,
          airbnb_per_night: Math.floor(airbnbTotal / 7),
          airbnb_total: airbnbTotal,
          direct_per_night: Math.floor(directTotal / 7),
          direct_cleaning: 150,
          direct_taxes: 120,
          direct_total: directTotal,
        },
        company: {
          name: "Coastal Retreats",
          logo: "https://cdn.stayfinder.com/logos/coastal.png",
        },
      };
    }

    const response = await this.client.post("/extension/match-property", data);
    return response.data;
  }

  async batchMatch(data: BatchMatchRequest) {
    if (MOCK_MODE) {
      await this.mockDelay_();

      const matches = data.properties.map((prop) => {
        const hasMatch = Math.random() > 0.3;

        if (!hasMatch) {
          return {
            airbnb_id: prop.airbnb_id,
            matched: false,
          };
        }

        const savings = Math.floor(Math.random() * 300) + 50;

        return {
          airbnb_id: prop.airbnb_id,
          matched: true,
          listing_id: Math.floor(Math.random() * 1000) + 1,
          savings: savings,
          currency: "USD",
          direct_url: `https://coastal-retreats.com/property-${prop.airbnb_id}`,
        };
      });

      return { matches };
    }

    const response = await this.client.post("/extension/batch-match", data);
    return response.data;
  }

  async trackEvent(data: TrackEventRequest) {
    if (MOCK_MODE) {
      await this.mockDelay_();
      return {
        success: true,
        event_id: `evt_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
    }

    const response = await this.client.post("/conversions/track-event", data);
    return response.data;
  }

  async trackBookingCompleted(data: BookingCompletedRequest) {
    if (MOCK_MODE) {
      await this.mockDelay_();

      const commission = data.booking_details.total_price * 0.05;

      return {
        success: true,
        conversion_id: `conv_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        commission: {
          eligible: true,
          amount: commission,
          percentage: 5.0,
          status: "pending",
        },
      };
    }

    const response = await this.client.post(
      "/conversions/booking-completed",
      data
    );
    return response.data;
  }

  async getUserStats(sessionId: string) {
    if (MOCK_MODE) {
      await this.mockDelay_();

      return {
        total_savings: 450.0,
        currency: "USD",
        properties_compared: 23,
        bookings_completed: 3,
        recent_bookings: [
          {
            property_name: "Beach House Malibu",
            date: "2025-10-01",
            savings: 150.0,
          },
          {
            property_name: "Mountain Cabin Tahoe",
            date: "2025-09-15",
            savings: 200.0,
          },
          {
            property_name: "City Loft SF",
            date: "2025-09-01",
            savings: 100.0,
          },
        ],
      };
    }

    const response = await this.client.get(
      `/extension/stats?session_id=${sessionId}`
    );
    return response.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;

