import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

function ThemeProbe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>current: {theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    window.matchMedia = vi.fn(() => ({ matches: false }));
  });

  afterEach(() => {
    delete window.matchMedia;
    delete document.documentElement.dataset.theme;
  });

  it("defaults to light when there is no stored preference and no dark system preference", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByText("current: light")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("light");
  });

  it("toggles the theme and persists the choice to localStorage", () => {
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("current: dark")).toBeInTheDocument();
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(JSON.parse(localStorage.getItem("medora-theme"))).toBe("dark");
  });

  it("reads a previously stored theme preference on mount", () => {
    localStorage.setItem("medora-theme", JSON.stringify("dark"));
    render(
      <ThemeProvider>
        <ThemeProbe />
      </ThemeProvider>,
    );
    expect(screen.getByText("current: dark")).toBeInTheDocument();
  });
});
