import { CalendarDays } from "lucide-react";
import { getAvailability, prettyDate, timeToMinutes } from "../utils";

export function TimeSlots({ doctorId, type = "In-clinic", date, value, onChange }) {
  if (!date)
    return (
      <div className="slot-empty">
        <CalendarDays />
        <b>Select a date first</b>
        <span>Available demo times will appear here.</span>
      </div>
    );
  const slots = getAvailability(doctorId, date, type);
  const morningSlots = slots.filter((slot) => timeToMinutes(slot) < 12 * 60);
  const afternoonSlots = slots.filter((slot) => timeToMinutes(slot) >= 12 * 60);
  const slotGroup = (label, values) =>
    values.length ? (
      <div className="slot-group">
        <h4>{label}</h4>
        <div className="slot-grid">
          {values.map((slot) => (
            <button
              type="button"
              aria-pressed={value === slot}
              aria-label={`${slot}, ${value === slot ? "selected" : "available"}`}
              className={value === slot ? "selected" : ""}
              onClick={() => onChange(slot)}
              key={slot}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    ) : null;
  return (
    <div className="slots">
      <div className="slot-heading">
        <div>
          <b>Available demo times</b>
          <span>{prettyDate(date)}</span>
        </div>
        <small>Riyadh time</small>
      </div>
      {slots.length ? (
        <>
          {slotGroup("Morning", morningSlots)}
          {slotGroup("Afternoon", afternoonSlots)}
        </>
      ) : (
        <div className="slot-empty">
          No appointment times are available for this date.
        </div>
      )}
    </div>
  );
}
