import React from "react";
import "./StatsDashboard.css";

interface StatsData {
  total_savings: number;
  properties_compared: number;
  bookings_completed: number;
  currency?: string;
}

interface StatsDashboardProps {
  stats: StatsData;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: stats.currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="stayfinder-stats">
      <div className="stayfinder-stats-card">
        <h3 className="stayfinder-stats-title">Your Savings</h3>
        <div className="stayfinder-stats-amount">
          {formatCurrency(stats.total_savings)}
        </div>
        <div className="stayfinder-stats-meta">
          <div className="stayfinder-stats-meta-item">
            <span className="stayfinder-stats-meta-label">From</span>
            <span className="stayfinder-stats-meta-value">
              {stats.properties_compared} properties compared
            </span>
          </div>
          <div className="stayfinder-stats-meta-item">
            <span className="stayfinder-stats-meta-icon">✓</span>
            <span className="stayfinder-stats-meta-value">
              {stats.bookings_completed} bookings completed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;

