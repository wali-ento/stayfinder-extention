import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SavingsBadge, ComparePriceBadge } from "../../components/SavingsBadge";

describe("SavingsBadge", () => {
  it("should render with savings amount", () => {
    const onClick = vi.fn();
    render(<SavingsBadge savings={150} onClick={onClick} />);

    expect(screen.getByText(/Save \$150/i)).toBeInTheDocument();
  });

  it("should format currency correctly", () => {
    const onClick = vi.fn();
    render(<SavingsBadge savings={1234.56} currency="USD" onClick={onClick} />);

    expect(screen.getByText(/Save \$1,235/i)).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const onClick = vi.fn();
    render(<SavingsBadge savings={150} onClick={onClick} />);

    const badge = screen.getByRole("button");
    fireEvent.click(badge);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct CSS class", () => {
    const onClick = vi.fn();
    render(<SavingsBadge savings={150} onClick={onClick} />);

    const badge = screen.getByRole("button");
    expect(badge).toHaveClass("stayfinder-badge");
  });
});

describe("ComparePriceBadge", () => {
  it("should render compare price text", () => {
    const onClick = vi.fn();
    render(<ComparePriceBadge onClick={onClick} />);

    expect(screen.getByText(/Compare Price/i)).toBeInTheDocument();
  });

  it("should call onClick when clicked", () => {
    const onClick = vi.fn();
    render(<ComparePriceBadge onClick={onClick} />);

    const badge = screen.getByRole("button");
    fireEvent.click(badge);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("should have correct CSS classes", () => {
    const onClick = vi.fn();
    render(<ComparePriceBadge onClick={onClick} />);

    const badge = screen.getByRole("button");
    expect(badge).toHaveClass("stayfinder-badge");
    expect(badge).toHaveClass("stayfinder-badge-compare");
  });
});

