import { describe, it, expect } from "vitest";
import {
  doctors,
  clinics,
  specialties,
  getSpecialty,
  getClinic,
  enrichDoctor,
} from "./data";

describe("getSpecialty / getClinic", () => {
  it("finds an existing specialty or clinic by id", () => {
    expect(getSpecialty(specialties[0].id)?.id).toBe(specialties[0].id);
    expect(getClinic(clinics[0].id)?.id).toBe(clinics[0].id);
  });

  it("returns undefined for an unknown id", () => {
    expect(getSpecialty("nope")).toBeUndefined();
    expect(getClinic("nope")).toBeUndefined();
  });
});

describe("enrichDoctor", () => {
  it("attaches readable specialty, clinic, and area names", () => {
    const enriched = enrichDoctor(doctors[0]);
    expect(enriched.specialty).toBe(getSpecialty(doctors[0].specialtyId).name);
    expect(enriched.clinic).toBe(getClinic(doctors[0].clinicId).name);
    expect(enriched.area).toBe(getClinic(doctors[0].clinicId).area);
  });

  it("falls back to 'Unknown' for a dangling reference", () => {
    const enriched = enrichDoctor({
      ...doctors[0],
      specialtyId: "missing",
      clinicId: "missing",
    });
    expect(enriched.specialty).toBe("Unknown");
    expect(enriched.clinic).toBe("Unknown");
    expect(enriched.area).toBe("Unknown");
  });
});

describe("data integrity", () => {
  it("every doctor references a real specialty and clinic", () => {
    for (const doctor of doctors) {
      expect(getSpecialty(doctor.specialtyId)).toBeDefined();
      expect(getClinic(doctor.clinicId)).toBeDefined();
    }
  });
});
