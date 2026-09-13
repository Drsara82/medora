import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { MemoryRouter } from "react-router-dom";
import { StoreProvider } from "../store/StoreContext";
import { ThemeProvider } from "../store/ThemeContext";
import { LanguageProvider } from "../store/LanguageContext";
import { Header } from "./Header";
import { DoctorCard } from "./DoctorCard";
import { FilterSelect } from "./FilterSelect";
import { doctors } from "../doctors";

function withProviders(ui, initialEntries = ["/"]) {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <ThemeProvider>
        <LanguageProvider>
          <StoreProvider>{ui}</StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

describe("accessibility", () => {
  it("Header has no detectable a11y violations", async () => {
    const { container } = render(withProviders(<Header />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it("DoctorCard has no detectable a11y violations", async () => {
    const { container } = render(withProviders(<DoctorCard doctor={doctors[0]} />));
    expect(await axe(container)).toHaveNoViolations();
  });

  it("FilterSelect has no detectable a11y violations", async () => {
    const { container } = render(
      <FilterSelect
        label="Specialty"
        value="all"
        set={() => {}}
        options={[["a", "Dermatology"]]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
