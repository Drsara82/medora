import { describe, expect, it } from "vitest";
import { doctors } from "./doctors";
import {
  createAppointmentId,
  isValidBookingDraft,
  isValidPatient,
} from "./booking";
import { dateKey, getAvailability } from "./utils";

function findSlot(doctor) {
  for (let offset = 0; offset < 14; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const key = dateKey(date);
    for (const type of doctor.consultationTypes) {
      const slots = getAvailability(doctor.id, key, type);
      if (slots.length) return { date: key, time: slots[0], type };
    }
  }
  throw new Error("No bookable slot found");
}

describe("booking domain validation", () => {
  it("accepts a valid patient and rejects malformed contact details", () => {
    expect(
      isValidPatient({
        name: "Nora Ahmed",
        email: "nora@example.com",
        phone: "+966 50 000 0000",
      }),
    ).toBe(true);
    expect(
      isValidPatient({ name: "", email: "not-an-email", phone: "123" }),
    ).toBe(false);
  });

  it("validates a draft against the selected doctor's real availability", () => {
    const doctor = doctors[0];
    const slot = findSlot(doctor);
    const draft = {
      doctorId: doctor.id,
      clinicId: doctor.clinicId,
      fee: doctor.fee,
      ...slot,
      patient: {
        name: "Test Patient",
        email: "patient@example.com",
        phone: "0500000000",
      },
    };

    expect(isValidBookingDraft(draft, doctor)).toBe(true);
    expect(isValidBookingDraft({ ...draft, fee: doctor.fee + 1 }, doctor)).toBe(
      false,
    );
  });

  it("creates collision-resistant appointment ids with the expected prefix", () => {
    const first = createAppointmentId();
    const second = createAppointmentId();
    expect(first).toMatch(/^apt-/);
    expect(second).toMatch(/^apt-/);
    expect(first).not.toBe(second);
  });
});
