import React from "react";
import "./CompareWidget.css";

interface PriceBreakdown {
  currency: string;
  nights: number;
  airbnb_per_night: number;
  airbnb_total: number;
  direct_per_night: number;
  direct_cleaning: number;
  direct_taxes: number;
  direct_total: number;
}

interface CompareWidgetProps {
  savings: {
    amount: number;
    percentage: number | string;
  };
  prices: PriceBreakdown;
  company: {
    name: string;
    logo?: string;
  };
  directUrl: string;
  onCtaClick: () => void;
}

export const CompareWidget: React.FC<CompareWidgetProps> = ({
  savings,
  prices,
  company,
  directUrl,
  onCtaClick,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: prices.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="stayfinder-widget">
      <div className="stayfinder-widget-header">
        <span className="stayfinder-widget-icon">🎯</span>
        <h3 className="stayfinder-widget-title">StayFinder Direct Booking</h3>
      </div>

      {company.logo && (
        <div className="stayfinder-widget-company">
          <img
            src={company.logo}
            alt={company.name}
            className="stayfinder-widget-logo"
          />
        </div>
      )}

      <div className="stayfinder-widget-savings">
        <div className="stayfinder-widget-savings-amount">
          Save {formatCurrency(savings.amount)}
        </div>
        <div className="stayfinder-widget-savings-subtitle">
          Book direct for {formatCurrency(prices.direct_total)}
        </div>
        <div className="stayfinder-widget-savings-comparison">
          (vs {formatCurrency(prices.airbnb_total)} on Airbnb)
        </div>
      </div>

      <div className="stayfinder-widget-breakdown">
        <h4 className="stayfinder-widget-breakdown-title">Price Breakdown:</h4>
        <div className="stayfinder-widget-breakdown-row">
          <span>Accommodation ({prices.nights} nights)</span>
          <span>{formatCurrency(prices.direct_per_night * prices.nights)}</span>
        </div>
        <div className="stayfinder-widget-breakdown-row">
          <span>Cleaning fee</span>
          <span>{formatCurrency(prices.direct_cleaning)}</span>
        </div>
        <div className="stayfinder-widget-breakdown-row">
          <span>Taxes & fees</span>
          <span>{formatCurrency(prices.direct_taxes)}</span>
        </div>
        <div className="stayfinder-widget-breakdown-divider"></div>
        <div className="stayfinder-widget-breakdown-row stayfinder-widget-breakdown-total">
          <span>Total</span>
          <span>{formatCurrency(prices.direct_total)}</span>
        </div>
      </div>

      <button className="stayfinder-widget-cta" onClick={onCtaClick}>
        View Direct Booking →
      </button>

      <div className="stayfinder-widget-footer">
        Powered by <strong>StayFinder</strong>
      </div>
    </div>
  );
};

export default CompareWidget;

