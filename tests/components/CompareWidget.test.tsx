import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CompareWidget } from "../../components/CompareWidget";

describe("CompareWidget", () => {
  const mockProps = {
    savings: {
      amount: 150,
      percentage: 10,
    },
    prices: {
      currency: "USD",
      nights: 7,
      airbnb_per_night: 214,
      airbnb_total: 1500,
      direct_per_night: 180,
      direct_cleaning: 150,
      direct_taxes: 120,
      direct_total: 1350,
    },
    company: {
      name: "Coastal Retreats",
      logo: "https://example.com/logo.png",
    },
    directUrl: "https://coastal-retreats.com/property",
    onCtaClick: vi.fn(),
  };

  it("should render savings amount", () => {
    render(<CompareWidget {...mockProps} />);

    expect(screen.getByText(/Save \$150/i)).toBeInTheDocument();
  });

  it("should render direct price", () => {
    render(<CompareWidget {...mockProps} />);

    expect(screen.getByText(/Book direct for \$1,350/i)).toBeInTheDocument();
  });

  it("should render airbnb comparison price", () => {
    render(<CompareWidget {...mockProps} />);

    expect(screen.getByText(/vs \$1,500 on Airbnb/i)).toBeInTheDocument();
  });

  it("should render price breakdown", () => {
    render(<CompareWidget {...mockProps} />);

    expect(screen.getByText(/Accommodation/i)).toBeInTheDocument();
    expect(screen.getByText(/Cleaning fee/i)).toBeInTheDocument();
    expect(screen.getByText(/Taxes & fees/i)).toBeInTheDocument();
  });

  it("should render company logo when provided", () => {
    render(<CompareWidget {...mockProps} />);

    const logo = screen.getByAltText("Coastal Retreats");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "https://example.com/logo.png");
  });

  it("should call onCtaClick when CTA button is clicked", () => {
    render(<CompareWidget {...mockProps} />);

    const ctaButton = screen.getByText(/View Direct Booking/i);
    fireEvent.click(ctaButton);

    expect(mockProps.onCtaClick).toHaveBeenCalledTimes(1);
  });

  it("should render without logo when not provided", () => {
    const propsWithoutLogo = {
      ...mockProps,
      company: { name: "Coastal Retreats" },
    };

    render(<CompareWidget {...propsWithoutLogo} />);

    const logo = screen.queryByAltText("Coastal Retreats");
    expect(logo).not.toBeInTheDocument();
  });
});
