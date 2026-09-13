import { createContext, useContext, useEffect, useState } from "react";
import {
  STORAGE_KEYS,
  dateKey,
  getAvailability,
  readStorage,
  writeStorage,
} from "../utils";
import { doctors } from "../doctors";

function createDemoAppointments() {
  const makeDate = (doctor, direction, type) => {
    for (let offset = 1; offset <= 7; offset += 1) {
      const date = new Date();
      date.setDate(date.getDate() + offset * direction);
      const value = dateKey(date);
      const slots = getAvailability(doctor.id, value, type);
      if (slots.length) return { date: value, time: slots[0] };
    }
    return null;
  };
  const upcomingDoctor = doctors[2];
  const completedDoctor = doctors[0];
  const cancelledDoctor = doctors[3];
  const upcoming = makeDate(upcomingDoctor, 1, "Video");
  const completed = makeDate(completedDoctor, -1, "In-clinic");
  const cancelled = makeDate(cancelledDoctor, 1, "In-clinic");
  return [
    upcoming && {
      id: "demo-upcoming",
      doctorId: upcomingDoctor.id,
      clinicId: upcomingDoctor.clinicId,
      type: "Video",
      status: "upcoming",
      ...upcoming,
    },
    completed && {
      id: "demo-completed",
      doctorId: completedDoctor.id,
      clinicId: completedDoctor.clinicId,
      type: "In-clinic",
      status: "completed",
      ...completed,
    },
    cancelled && {
      id: "demo-cancelled",
      doctorId: cancelledDoctor.id,
      clinicId: cancelledDoctor.clinicId,
      type: "In-clinic",
      status: "cancelled",
      ...cancelled,
    },
  ].filter(Boolean);
}


const Store = createContext();

export function StoreProvider({ children }) {
  const validDoctorIds = new Set(doctors.map((item) => item.id));
  const [saved, setSaved] = useState(() => {
    const value = readStorage(STORAGE_KEYS.saved, []);
    return Array.isArray(value)
      ? [...new Set(value.filter((id) => validDoctorIds.has(id)))]
      : [];
  });
  const [appointments, setAppointments] = useState(() => {
    const value = readStorage(
      STORAGE_KEYS.appointments,
      createDemoAppointments(),
    );
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    const today = dateKey(new Date());
    return value
      .filter((item) => {
        const doctor = doctors.find((d) => d.id === item?.doctorId);
        const valid =
          doctor &&
          item.id &&
          !seen.has(item.id) &&
          item.clinicId === doctor.clinicId &&
          doctor.consultationTypes.includes(item.type) &&
          /^\d{4}-\d{2}-\d{2}$/.test(item.date || "") &&
          getAvailability(doctor.id, item.date, item.type).includes(
            item.time,
          ) &&
          ["upcoming", "completed", "cancelled"].includes(item.status);
        if (valid) seen.add(item.id);
        return valid;
      })
      .map((item) =>
        item.status === "upcoming" && item.date < today
          ? { ...item, status: "completed" }
          : item,
      );
  });
  const [notifications, setNotifications] = useState(() => {
    const value = readStorage(STORAGE_KEYS.notifications, []);
    const legacyDemoIds = new Set(["note-1", "note-2", "note-3"]);
    return Array.isArray(value)
      ? value.filter(
          (item) =>
            item &&
            !legacyDemoIds.has(item.id) &&
            typeof item.id === "string" &&
            typeof item.title === "string" &&
            typeof item.message === "string" &&
            typeof item.read === "boolean",
        )
      : [];
  });
  const [profile, setProfile] = useState(() => {
    const fallback = { name: "", email: "", phone: "" };
    const value = readStorage(STORAGE_KEYS.profile, fallback);
    const isLegacyDemoProfile =
      value?.name === "Nora Ahmed" &&
      value?.email === "nora@example.com" &&
      value?.phone === "+966 50 000 0000";
    return value && typeof value === "object" && !isLegacyDemoProfile
      ? { ...fallback, ...value }
      : fallback;
  });
  const [draft, setDraft] = useState(null);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.saved, saved);
  }, [saved]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.appointments, appointments);
  }, [appointments]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);
  useEffect(() => {
    writeStorage(STORAGE_KEYS.profile, profile);
  }, [profile]);
  const toggleSaved = (id) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const addAppointment = (a) =>
    setAppointments((xs) => {
      const duplicate = xs.some(
        (item) =>
          item.status === "upcoming" &&
          a.status === "upcoming" &&
          item.doctorId === a.doctorId &&
          item.date === a.date &&
          item.time === a.time &&
          item.type === a.type,
      );
      return duplicate ? xs : [a, ...xs];
    });
  const updateAppointment = (id, patch) =>
    setAppointments((xs) =>
      xs.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  return (
    <Store.Provider
      value={{
        saved,
        toggleSaved,
        appointments,
        addAppointment,
        updateAppointment,
        draft,
        setDraft,
        notifications,
        setNotifications,
        profile,
        setProfile,
      }}
    >
      {children}
    </Store.Provider>
  );
}

export const useStore = () => useContext(Store);
