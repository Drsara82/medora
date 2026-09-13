export const STORAGE_KEYS = {
  saved: "medora-saved",
  appointments: "medora-appointments",
  notifications: "medora-notifications",
  profile: "medora-profile",
  theme: "medora-theme",
  language: "medora-language",
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) as string);
    return parsed === null ? fallback : (parsed as T);
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
  return true;
}

export const pad = (n: number): string => String(n).padStart(2, "0");

export const dateKey = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const prettyDate = (value: string): string =>
  new Date(`${value}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export const baseSlots: string[] = [
  "09:00 AM",
  "09:45 AM",
  "10:30 AM",
  "11:15 AM",
  "01:30 PM",
  "02:15 PM",
  "03:00 PM",
  "04:30 PM",
];

export function timeToMinutes(value?: string): number {
  const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(value || "");
  if (!match) return Number.POSITIVE_INFINITY;
  let hour = Number(match[1]) % 12;
  if (match[3] === "PM") hour += 12;
  return hour * 60 + Number(match[2]);
}

export function getAvailability(
  doctorId: string,
  date: string,
  type: string = "In-clinic",
): string[] {
  const selected = new Date(`${date}T12:00:00`);
  if (Number.isNaN(selected.getTime()) || [5, 6].includes(selected.getDay()))
    return [];
  const seed =
    Number(doctorId) * 3 + selected.getDate() + (type === "Video" ? 1 : 0);
  return baseSlots.filter((_, index) => (index + seed) % 4 !== 0);
}

export const isValidEmail = (value: string): boolean =>
  /^\S+@\S+\.\S+$/.test(value);
