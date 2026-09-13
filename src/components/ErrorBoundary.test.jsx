import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb() {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children normally when nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
  });

  it("shows a recovery screen instead of crashing when a child throws", () => {
    // React logs the caught error to the console; silence it for this test.
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );

    expect(
      screen.getByText("Something went wrong in this demo"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Reload Medora" }),
    ).toHaveAttribute("href", "/");
  });
});
