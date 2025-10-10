import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsDashboard } from "../../components/StatsDashboard";

describe("StatsDashboard", () => {
  const mockStats = {
    total_savings: 450.5,
    properties_compared: 23,
    bookings_completed: 3,
    currency: "USD",
  };

  it("should render total savings", () => {
    render(<StatsDashboard stats={mockStats} />);

    expect(screen.getByText(/\$450\.50/i)).toBeInTheDocument();
  });

  it("should render properties compared", () => {
    render(<StatsDashboard stats={mockStats} />);

    expect(screen.getByText(/23 properties compared/i)).toBeInTheDocument();
  });

  it("should render bookings completed", () => {
    render(<StatsDashboard stats={mockStats} />);

    expect(screen.getByText(/3 bookings completed/i)).toBeInTheDocument();
  });

  it("should format currency correctly", () => {
    render(<StatsDashboard stats={mockStats} />);

    const savingsText = screen.getByText(/\$450\.50/i);
    expect(savingsText).toBeInTheDocument();
  });

  it("should handle zero values", () => {
    const zeroStats = {
      total_savings: 0,
      properties_compared: 0,
      bookings_completed: 0,
    };

    render(<StatsDashboard stats={zeroStats} />);

    expect(screen.getByText(/\$0\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/0 properties compared/i)).toBeInTheDocument();
    expect(screen.getByText(/0 bookings completed/i)).toBeInTheDocument();
  });

  it("should default to USD when currency not provided", () => {
    const statsWithoutCurrency = {
      total_savings: 100,
      properties_compared: 5,
      bookings_completed: 1,
    };

    render(<StatsDashboard stats={statsWithoutCurrency} />);

    expect(screen.getByText(/\$100\.00/i)).toBeInTheDocument();
  });
});

