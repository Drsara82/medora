import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Doctors } from "./Doctors";
import { StoreProvider } from "../store/StoreContext";

function renderDoctors(initialPath = "/doctors") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <StoreProvider>
        <Routes>
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/specialty/:slug" element={<Doctors />} />
          <Route path="/clinic/:slug" element={<Doctors />} />
        </Routes>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe("Doctors page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("filters results as the search text changes", () => {
    renderDoctors();
    fireEvent.change(
      screen.getByPlaceholderText("Search doctor, specialty, or clinic"),
      { target: { value: "layla" } },
    );
    expect(screen.getByText("Dr. Layla Hassan")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Omar Alharbi")).not.toBeInTheDocument();
  });

  it("shows an empty state for no matches, and 'Clear filters' restores results", () => {
    renderDoctors();
    fireEvent.change(
      screen.getByPlaceholderText("Search doctor, specialty, or clinic"),
      { target: { value: "zzz-no-such-doctor" } },
    );
    expect(
      screen.getByText("No doctors match these filters"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));
    expect(screen.getByText("Dr. Layla Hassan")).toBeInTheDocument();
  });

  it("pre-selects the specialty filter from the route", () => {
    renderDoctors("/specialty/cardiology");
    expect(screen.getByText("Cardiology doctors")).toBeInTheDocument();
    expect(screen.getByText("Dr. Omar Alharbi")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Layla Hassan")).not.toBeInTheDocument();
  });

  // Regression test: React Router reuses the same Doctors instance when
  // navigating between two routes that match the same path pattern
  // (e.g. /specialty/:slug -> /specialty/:slug with a different slug), so
  // the specialty/clinic filters must re-sync from the new route params
  // instead of keeping whatever was selected for the previous slug.
  it("re-syncs the specialty filter when navigating directly between two specialty routes", () => {
    function NavigateOnClick() {
      const navigate = useNavigate();
      return (
        <button onClick={() => navigate("/specialty/cardiology")}>
          Go to cardiology
        </button>
      );
    }
    render(
      <MemoryRouter initialEntries={["/specialty/dermatology"]}>
        <StoreProvider>
          <NavigateOnClick />
          <Routes>
            <Route path="/specialty/:slug" element={<Doctors />} />
          </Routes>
        </StoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Dr. Layla Hassan")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Omar Alharbi")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Go to cardiology" }));

    expect(screen.getByText("Dr. Omar Alharbi")).toBeInTheDocument();
    expect(screen.queryByText("Dr. Layla Hassan")).not.toBeInTheDocument();
  });
});
