import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { DoctorCard } from "./DoctorCard";
import { StoreProvider } from "../store/StoreContext";
import { doctors } from "../doctors";

function renderCard(doctor = doctors[0]) {
  return render(
    <MemoryRouter>
      <StoreProvider>
        <DoctorCard doctor={doctor} />
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe("DoctorCard", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the doctor's name and specialty", () => {
    const doctor = doctors[0];
    renderCard(doctor);
    expect(screen.getByText(doctor.name)).toBeInTheDocument();
    expect(screen.getByText(doctor.specialty)).toBeInTheDocument();
  });

  it("links to the doctor's booking page", () => {
    const doctor = doctors[0];
    renderCard(doctor);
    expect(
      screen.getByRole("link", { name: "Book appointment" }),
    ).toHaveAttribute("href", `/book/${doctor.id}`);
  });

  it("toggles the saved state when the heart button is clicked", () => {
    const doctor = doctors[0];
    renderCard(doctor);
    const saveButton = screen.getByRole("button", {
      name: `Save ${doctor.name}`,
    });
    expect(saveButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(saveButton);

    const removeButton = screen.getByRole("button", {
      name: `Remove ${doctor.name}`,
    });
    expect(removeButton).toHaveAttribute("aria-pressed", "true");
  });

  it("persists the saved state to localStorage", () => {
    const doctor = doctors[0];
    renderCard(doctor);
    fireEvent.click(screen.getByRole("button", { name: `Save ${doctor.name}` }));
    expect(JSON.parse(localStorage.getItem("medora-saved"))).toContain(
      doctor.id,
    );
  });
});
