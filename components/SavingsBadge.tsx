import React from "react";
import "./SavingsBadge.css";

interface SavingsBadgeProps {
  savings: number;
  currency?: string;
  onClick: () => void;
}

export const SavingsBadge: React.FC<SavingsBadgeProps> = ({
  savings,
  currency = "USD",
  onClick,
}) => {
  const formattedSavings = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(savings);

  return (
    <div
      className="stayfinder-badge"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="stayfinder-badge-icon">💰</span>
      <span className="stayfinder-badge-text">Save {formattedSavings}</span>
    </div>
  );
};

interface ComparePriceBadgeProps {
  onClick: () => void;
}

export const ComparePriceBadge: React.FC<ComparePriceBadgeProps> = ({
  onClick,
}) => {
  return (
    <div
      className="stayfinder-badge stayfinder-badge-compare"
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      <span className="stayfinder-badge-icon">🔍</span>
      <span className="stayfinder-badge-text">Compare Price</span>
    </div>
  );
};

export default SavingsBadge;

