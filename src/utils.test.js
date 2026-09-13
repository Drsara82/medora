import { describe, it, expect, beforeEach } from "vitest";
import {
  STORAGE_KEYS,
  readStorage,
  writeStorage,
  pad,
  dateKey,
  prettyDate,
  timeToMinutes,
  getAvailability,
  isValidEmail,
} from "./utils";

describe("pad", () => {
  it("left-pads single digits with a zero", () => {
    expect(pad(3)).toBe("03");
    expect(pad(12)).toBe("12");
  });
});

describe("dateKey", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe("2026-01-05");
    expect(dateKey(new Date(2026, 10, 30))).toBe("2026-11-30");
  });
});

describe("prettyDate", () => {
  it("formats a YYYY-MM-DD string as a long, human-readable date", () => {
    expect(prettyDate("2026-03-15")).toBe("Sunday, March 15, 2026");
  });
});

describe("timeToMinutes", () => {
  it("converts 12-hour clock strings to minutes since midnight", () => {
    expect(timeToMinutes("09:00 AM")).toBe(540);
    expect(timeToMinutes("12:00 PM")).toBe(720);
    expect(timeToMinutes("12:30 AM")).toBe(30);
    expect(timeToMinutes("04:30 PM")).toBe(990);
  });

  it("returns +Infinity for malformed input so it sorts last", () => {
    expect(timeToMinutes("not-a-time")).toBe(Number.POSITIVE_INFINITY);
    expect(timeToMinutes()).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("isValidEmail", () => {
  it("accepts simple valid addresses", () => {
    expect(isValidEmail("sara@example.com")).toBe(true);
  });

  it("rejects addresses without an @ or a domain", () => {
    expect(isValidEmail("sara@")).toBe(false);
    expect(isValidEmail("saraexample.com")).toBe(false);
    expect(isValidEmail("")).toBe(false);
  });
});

describe("getAvailability", () => {
  // Clinics in data.js all operate "Sun–Thu", so Friday and Saturday
  // must never return slots.
  it("returns no slots on Fridays", () => {
    const friday = "2026-09-18"; // Friday
    expect(getAvailability("1", friday, "In-clinic")).toEqual([]);
  });

  it("returns no slots on Saturdays", () => {
    const saturday = "2026-09-19"; // Saturday
    expect(getAvailability("1", saturday, "In-clinic")).toEqual([]);
  });

  it("can return slots on a weekday within the Sun–Thu window", () => {
    const sunday = "2026-09-20"; // Sunday
    expect(getAvailability("1", sunday, "In-clinic").length).toBeGreaterThan(
      0,
    );
  });

  it("returns no slots for an invalid date string", () => {
    expect(getAvailability("1", "not-a-date", "In-clinic")).toEqual([]);
  });

  it("is deterministic for the same doctor, date, and type", () => {
    const date = "2026-09-21"; // Monday
    const first = getAvailability("3", date, "Video");
    const second = getAvailability("3", date, "Video");
    expect(first).toEqual(second);
  });
});

describe("readStorage / writeStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips a value through localStorage", () => {
    writeStorage(STORAGE_KEYS.saved, ["1", "2"]);
    expect(readStorage(STORAGE_KEYS.saved, [])).toEqual(["1", "2"]);
  });

  it("falls back to the provided default when nothing is stored", () => {
    expect(readStorage("missing-key", "fallback")).toBe("fallback");
  });

  it("falls back safely when the stored value is corrupted JSON", () => {
    localStorage.setItem(STORAGE_KEYS.saved, "{not valid json");
    expect(readStorage(STORAGE_KEYS.saved, [])).toEqual([]);
  });
});
