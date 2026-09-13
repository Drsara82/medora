import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  RotateCcw,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { prettyDate, timeToMinutes } from "../utils";
import { doctors } from "../doctors";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";
import { Empty } from "../components/Empty";
import { RescheduleModal } from "../components/RescheduleModal";
import { CancelModal } from "../components/CancelModal";

export function Appointments() {
  const { appointments, updateAppointment } = useStore();
  const [tab, setTab] = useState("all");
  const [reschedule, setReschedule] = useState(null);
  const [cancel, setCancel] = useState(null);
  const [feedback, setFeedback] = useState("");
  const tabItems = ["all", "upcoming", "completed", "cancelled"];
  const statusOrder = { upcoming: 0, completed: 1, cancelled: 2 };
  const appointmentTime = (appointment) =>
    `${appointment.date}-${String(timeToMinutes(appointment.time)).padStart(4, "0")}`;
  const visible = [...appointments]
    .filter((appointment) => tab === "all" || appointment.status === tab)
    .sort((a, b) => {
      if (tab === "all" && statusOrder[a.status] !== statusOrder[b.status])
        return statusOrder[a.status] - statusOrder[b.status];
      const direction = tab === "upcoming" || a.status === "upcoming" ? 1 : -1;
      return appointmentTime(a).localeCompare(appointmentTime(b)) * direction;
    });
  return (
    <section className="page">
      <PageMeta title="Appointments | Medora" />
      <div className="page-title">
        <span className="eyebrow">Your demo schedule</span>
        <h1>Appointments</h1>
        <p>
          Review, reschedule, or cancel sample appointments stored on this
          device.
        </p>
      </div>
      {feedback && (
        <div className="appointment-feedback" role="status">
          <Check />
          <span>{feedback}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setFeedback("")}
          >
            <X />
          </button>
        </div>
      )}
      <div
        className="tabs"
        role="tablist"
        aria-label="Appointment status"
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
          event.preventDefault();
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const current = tabItems.indexOf(tab);
          const next =
            tabItems[(current + direction + tabItems.length) % tabItems.length];
          setTab(next);
          requestAnimationFrame(() =>
            document.getElementById(`appointment-tab-${next}`)?.focus(),
          );
        }}
      >
        {tabItems.map((item) => {
          const count =
            item === "all"
              ? appointments.length
              : appointments.filter(({ status }) => status === item).length;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={tab === item}
              aria-controls="appointment-results"
              id={`appointment-tab-${item}`}
              tabIndex={tab === item ? 0 : -1}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
              key={item}
            >
              <span>{item}</span>
              <small>{count}</small>
            </button>
          );
        })}
      </div>
      <div
        id="appointment-results"
        role="tabpanel"
        aria-labelledby={`appointment-tab-${tab}`}
      >
        {visible.length === 0 ? (
          <Empty
            title={
              appointments.length
                ? "No appointments in this view"
                : "No appointments yet"
            }
            text={
              appointments.length
                ? "Choose another status to see your appointments."
                : "Book a fictional doctor to try the complete scheduling workflow."
            }
            actionText={
              appointments.length ? "View all appointments" : undefined
            }
            onAction={appointments.length ? () => setTab("all") : undefined}
          />
        ) : (
          <div className="appointment-list">
            {visible.map((a) => {
              const d = doctors.find((x) => x.id === a.doctorId);
              if (!d) return null;
              return (
                <article className={`appointment ${a.status}`} key={a.id}>
                  <time className="date-block" dateTime={a.date}>
                    <b>
                      {new Date(`${a.date}T12:00:00`).toLocaleDateString(
                        "en-US",
                        { day: "2-digit" },
                      )}
                    </b>
                    <span>
                      {new Date(`${a.date}T12:00:00`).toLocaleDateString(
                        "en-US",
                        { month: "short" },
                      )}
                    </span>
                    <small>{a.date.slice(0, 4)}</small>
                  </time>
                  <img
                    className="doctor-photo"
                    src={d.image}
                    alt={`Portrait of ${d.name}`}
                    loading="lazy"
                    width="900"
                    height="1125"
                  />
                  <div className="apt-main">
                    <span className={`status ${a.status}`}>{a.status}</span>
                    <h3>
                      <Link to={`/doctor/${d.slug}`}>{d.name}</Link>
                    </h3>
                    <p>
                      {d.specialty} · {d.clinic}
                    </p>
                    <div>
                      <span>
                        <Clock /> {a.time}
                      </span>
                      <span>
                        {a.type === "Video" ? <Video /> : <MapPin />} {a.type}
                      </span>
                    </div>
                  </div>
                  {a.status === "upcoming" && (
                    <div className="apt-actions">
                      <button type="button" onClick={() => setReschedule(a)}>
                        <RotateCcw />
                        Reschedule
                      </button>
                      <button
                        type="button"
                        className="danger-link"
                        onClick={() => setCancel(a)}
                      >
                        <Trash2 />
                        Cancel
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
      {reschedule && (
        <RescheduleModal
          appointment={reschedule}
          close={() => setReschedule(null)}
          save={(date, time) => {
            updateAppointment(reschedule.id, { date, time });
            setFeedback(
              `Sample appointment moved to ${prettyDate(date)} at ${time}. No clinic was contacted.`,
            );
            setReschedule(null);
          }}
        />
      )}
      {cancel && (
        <CancelModal
          appointment={cancel}
          close={() => setCancel(null)}
          confirm={() => {
            updateAppointment(cancel.id, { status: "cancelled" });
            setFeedback(
              "Sample appointment marked as cancelled on this device. No clinic was contacted.",
            );
            setCancel(null);
          }}
        />
      )}
    </section>
  );
}
