import { doctors as doctorRecords, enrichDoctor, type EnrichedDoctor } from "./data";
import { dateKey, getAvailability } from "./utils";

export const doctors: EnrichedDoctor[] = doctorRecords.map(enrichDoctor);

export const doctorLanguages: string[] = [
  ...new Set(doctors.flatMap((doctor) => doctor.languages)),
];

export const consultationTypes: string[] = [
  ...new Set(doctors.flatMap((doctor) => doctor.consultationTypes)),
];

export function hasUpcomingAvailability(
  doctor: EnrichedDoctor,
  consultationType: string = "all",
): boolean {
  const types =
    consultationType === "all" ? doctor.consultationTypes : [consultationType];
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return types.some(
      (type) => getAvailability(doctor.id, dateKey(date), type).length > 0,
    );
  }).some(Boolean);
}
