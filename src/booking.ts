import type { ConsultationType, EnrichedDoctor } from "./data";
import { dateKey, getAvailability, isValidEmail } from "./utils";

export interface PatientDetails {
  name: string;
  email: string;
  phone: string;
}

export interface BookingDraft {
  doctorId: string;
  clinicId: string;
  fee: number;
  date: string;
  time: string;
  type: ConsultationType;
  patient: PatientDetails;
}

export type AppointmentStatus = "upcoming" | "completed" | "cancelled";

export interface Appointment extends Omit<BookingDraft, "patient" | "fee"> {
  id: string;
  status: AppointmentStatus;
  createdAt?: string;
  patient?: PatientDetails;
  fee?: number;
}

export function isValidPatient(value: unknown): value is PatientDetails {
  if (!value || typeof value !== "object") return false;
  const patient = value as Partial<PatientDetails>;
  return Boolean(
    typeof patient.name === "string" &&
      patient.name.trim() &&
      typeof patient.email === "string" &&
      isValidEmail(patient.email.trim()) &&
      typeof patient.phone === "string" &&
      patient.phone.replace(/\D/g, "").length >= 9,
  );
}

export function isValidBookingDraft(
  value: unknown,
  doctor?: EnrichedDoctor,
): value is BookingDraft {
  if (!value || typeof value !== "object" || !doctor) return false;
  const draft = value as Partial<BookingDraft>;
  const today = dateKey(new Date());

  return Boolean(
    draft.doctorId === doctor.id &&
      draft.clinicId === doctor.clinicId &&
      draft.fee === doctor.fee &&
      typeof draft.type === "string" &&
      doctor.consultationTypes.includes(draft.type as ConsultationType) &&
      typeof draft.date === "string" &&
      draft.date >= today &&
      typeof draft.time === "string" &&
      getAvailability(doctor.id, draft.date, draft.type).includes(draft.time) &&
      isValidPatient(draft.patient),
  );
}

export function createAppointmentId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `apt-${crypto.randomUUID()}`;
  }
  return `apt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
