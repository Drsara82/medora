import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { dateKey, getAvailability } from "../utils";

export function Calendar({ doctorId, type = "In-clinic", value, onChange }) {
  const [month, setMonth] = useState(() => {
    if (value) {
      const selected = new Date(`${value}T12:00:00`);
      if (!Number.isNaN(selected.getTime()))
        return new Date(selected.getFullYear(), selected.getMonth(), 1);
    }
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  useEffect(() => {
    if (!value) return;
    const selected = new Date(`${value}T12:00:00`);
    if (Number.isNaN(selected.getTime())) return;
    setMonth((current) =>
      current.getFullYear() === selected.getFullYear() &&
      current.getMonth() === selected.getMonth()
        ? current
        : new Date(selected.getFullYear(), selected.getMonth(), 1),
    );
  }, [value]);
  const days = useMemo(() => {
    const a = [];
    const start = month.getDay();
    for (let i = 0; i < start; i++) a.push(null);
    const total = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0,
    ).getDate();
    for (let i = 1; i <= total; i++)
      a.push(new Date(month.getFullYear(), month.getMonth(), i));
    return a;
  }, [month]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const isCurrentMonth = month.getTime() <= currentMonth.getTime();
  const moveDateFocus = (event) => {
    const offsets = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
    };
    const offset = offsets[event.key];
    if (!offset) return;
    const buttons = [...event.currentTarget.querySelectorAll(".days button")];
    const current = buttons.indexOf(document.activeElement);
    const target = buttons[current + offset];
    if (!target) return;
    event.preventDefault();
    if (!target.disabled) target.focus();
    else {
      const direction = Math.sign(offset);
      let next = current + offset;
      while (buttons[next]?.disabled) next += direction;
      buttons[next]?.focus();
    }
  };
  return (
    <div
      className="calendar"
      aria-label="Appointment calendar"
      onKeyDown={moveDateFocus}
    >
      <div className="cal-head">
        <button
          type="button"
          disabled={isCurrentMonth}
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
          }
          aria-label="Previous month"
        >
          <ChevronLeft />
        </button>
        <b aria-live="polite">
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </b>
        <button
          type="button"
          onClick={() =>
            setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
          }
          aria-label="Next month"
        >
          <ChevronRight />
        </button>
      </div>
      <div className="week" aria-hidden="true">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
      <div className="days">
        {days.map((d, i) => {
          if (!d) return <span aria-hidden="true" key={`e${i}`} />;
          const k = dateKey(d),
            past = d < today,
            has = getAvailability(doctorId, k, type).length > 0,
            disabled = past || !has,
            isToday = d.getTime() === today.getTime();
          return (
            <button
              type="button"
              key={k}
              disabled={disabled}
              aria-pressed={value === k}
              className={`${value === k ? "selected" : ""} ${isToday ? "today" : ""}`.trim()}
              onClick={() => onChange(k)}
              aria-label={`${d.toDateString()}${isToday ? ", today" : ""}${disabled ? ", unavailable" : ", available"}`}
            >
              <span>{d.getDate()}</span>
              {!disabled && <i />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
