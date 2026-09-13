import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { getAvailability, prettyDate } from "../utils";
import { doctors } from "../doctors";
import { Modal } from "./Modal";
import { Calendar } from "./Calendar";
import { TimeSlots } from "./TimeSlots";

export function RescheduleModal({ appointment, close, save }) {
  const d = doctors.find((x) => x.id === appointment.doctorId);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState(appointment.time);
  const valid = getAvailability(d.id, date, appointment.type).includes(time);
  return (
    <Modal close={close} label="Reschedule appointment">
      <span className="eyebrow">Reschedule appointment</span>
      <h2>Choose a new time</h2>
      <p className="modal-context">
        {d.name} · {appointment.type} · {d.clinic}
      </p>
      <div className="change-preview">
        <div>
          <small>Current appointment</small>
          <b>{prettyDate(appointment.date)}</b>
          <span>{appointment.time}</span>
        </div>
        <ArrowRight />
        <div>
          <small>New appointment</small>
          <b>{prettyDate(date)}</b>
          <span>{valid ? time : "Choose an available time"}</span>
        </div>
      </div>
      <div className="modal-schedule">
        <Calendar
          doctorId={d.id}
          type={appointment.type}
          value={date}
          onChange={(k) => {
            setDate(k);
            if (!getAvailability(d.id, k, appointment.type).includes(time))
              setTime("");
          }}
        />
        <TimeSlots
          doctorId={d.id}
          type={appointment.type}
          date={date}
          value={time}
          onChange={setTime}
        />
      </div>
      <div className="modal-actions">
        <button type="button" onClick={close}>
          Keep current time
        </button>
        <button
          type="button"
          className="button"
          disabled={
            !valid || (date === appointment.date && time === appointment.time)
          }
          onClick={() => save(date, time)}
        >
          Confirm new time
        </button>
      </div>
      <p className="fine">
        This updates the browser demo only. No clinic is contacted.
      </p>
    </Modal>
  );
}
