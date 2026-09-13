import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Review } from "./Review";
import { Confirmation } from "./Confirmation";
import { NotFound } from "./NotFound";
import { StoreProvider, useStore } from "../store/StoreContext";
import { doctors } from "../doctors";
import { dateKey, getAvailability } from "../utils";

// Find a real, currently-bookable date/time for a real doctor, the same way
// the actual Booking page would — so this test tracks real availability
// instead of a hardcoded date that could go stale.
function findBookableSlot(doctor) {
  const type = doctor.consultationTypes[0];
  for (let offset = 0; offset < 14; offset++) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const key = dateKey(date);
    const slots = getAvailability(doctor.id, key, type);
    if (slots.length > 0) return { date: key, time: slots[0], type };
  }
  throw new Error("No bookable slot found in the next 14 days");
}

function SeedDraft({ draft, children }) {
  const { setDraft } = useStore();
  useEffect(() => {
    setDraft(draft);
    // seed once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return children;
}

function renderReviewFlow(draft) {
  return render(
    <MemoryRouter initialEntries={["/booking/review"]}>
      <StoreProvider>
        <SeedDraft draft={draft}>
          <Routes>
            <Route path="/booking/review" element={<Review />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
            <Route path="/doctors" element={<h1>Find your doctor</h1>} />
            <Route path="/appointments" element={<h1>Appointments</h1>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SeedDraft>
      </StoreProvider>
    </MemoryRouter>,
  );
}

describe("Review -> Confirmation flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("reaches the confirmation page (not /doctors) after confirming a valid booking", async () => {
    const doctor = doctors[0];
    const { date, time, type } = findBookableSlot(doctor);
    const draft = {
      doctorId: doctor.id,
      clinicId: doctor.clinicId,
      fee: doctor.fee,
      date,
      time,
      type,
      patient: {
        name: "Test Patient",
        email: "test@example.com",
        phone: "0500000000",
      },
    };

    renderReviewFlow(draft);

    expect(
      await screen.findByRole("heading", { name: /review your appointment/i }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /confirm in demo/i }));

    // This is the regression check: before the fix, clearing the draft
    // inside Review's confirm() caused Review to re-render with draft=null
    // while still mounted, tripping its own guard and landing on /doctors
    // instead of /booking/confirmation.
    expect(
      await screen.findByRole("heading", { name: "Saved in this demo" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Find your doctor" }),
    ).not.toBeInTheDocument();
  });

  it("adds the confirmed appointment to the store", async () => {
    const doctor = doctors[1];
    const { date, time, type } = findBookableSlot(doctor);
    const draft = {
      doctorId: doctor.id,
      clinicId: doctor.clinicId,
      fee: doctor.fee,
      date,
      time,
      type,
      patient: {
        name: "Test Patient",
        email: "test@example.com",
        phone: "0500000000",
      },
    };

    renderReviewFlow(draft);
    await screen.findByRole("heading", { name: /review your appointment/i });
    fireEvent.click(screen.getByRole("button", { name: /confirm in demo/i }));
    await screen.findByRole("heading", { name: "Saved in this demo" });

    await waitFor(() => {
      const stored = JSON.parse(
        localStorage.getItem("medora-appointments") || "[]",
      );
      expect(stored.some((a) => a.doctorId === doctor.id && a.date === date)).toBe(
        true,
      );
    });
  });
  it("prevents duplicate appointments from repeated confirmation attempts", async () => {
    const doctor = doctors[0];
    const { date, time, type } = findBookableSlot(doctor);
    const draft = {
      doctorId: doctor.id,
      clinicId: doctor.clinicId,
      fee: doctor.fee,
      date,
      time,
      type,
      patient: {
        name: "Test Patient",
        email: "test@example.com",
        phone: "0500000000",
      },
    };

    renderReviewFlow(draft);
    await screen.findByRole("heading", { name: /review your appointment/i });
    const button = screen.getByRole("button", { name: /confirm in demo/i });
    fireEvent.click(button);
    fireEvent.click(button);
    await screen.findByRole("heading", { name: "Saved in this demo" });

    await waitFor(() => {
      const stored = JSON.parse(
        localStorage.getItem("medora-appointments") || "[]",
      );
      const matches = stored.filter(
        (a) =>
          a.doctorId === doctor.id &&
          a.date === date &&
          a.time === time &&
          a.type === type,
      );
      expect(matches).toHaveLength(1);
    });
  });
});
