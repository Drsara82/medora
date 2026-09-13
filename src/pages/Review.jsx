import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CalendarDays, Clock, MapPin, UserRound, Video } from "lucide-react";
import { prettyDate } from "../utils";
import { createAppointmentId, isValidBookingDraft } from "../booking";
import { doctors } from "../doctors";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";
import { BookingStepper } from "../components/BookingStepper";
import { DoctorCard } from "../components/DoctorCard";

export function Review() {
  const { draft, addAppointment } = useStore();
  const nav = useNavigate();
  const d = doctors.find((doctor) => doctor.id === draft?.doctorId);
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmationStarted = useRef(false);
  const validDraft = isValidBookingDraft(draft, d);
  if (!validDraft) return <Navigate to="/doctors" replace />;
  const confirm = () => {
    if (confirmationStarted.current) return;
    confirmationStarted.current = true;
    setIsConfirming(true);
    addAppointment({
      ...draft,
      id: createAppointmentId(),
      status: "upcoming",
      createdAt: new Date().toISOString(),
    });
    nav("/booking/confirmation", {
      replace: true,
      state: { confirmed: true },
    });
  };
  return (
    <section className="narrow">
      <PageMeta title="Review booking | Medora" />
      <BookingStepper current={3} />
      <div className="page-title">
        <span className="eyebrow">Almost there</span>
        <h1>Review your appointment</h1>
        <p>This confirmation updates only the local front-end demo.</p>
      </div>
      <div className="review-card">
        <DoctorCard doctor={d} compact />
        <div className="review-list">
          <p>
            <CalendarDays />
            <span>
              <small>Date</small>
              <b>{prettyDate(draft.date)}</b>
            </span>
            <Link to={`/book/${d.id}`}>Change</Link>
          </p>
          <p>
            <Clock />
            <span>
              <small>Time</small>
              <b>{draft.time}</b>
            </span>
          </p>
          <p>
            {draft.type === "Video" ? <Video /> : <MapPin />}
            <span>
              <small>Appointment type</small>
              <b>{draft.type}</b>
            </span>
          </p>
          <p>
            <UserRound />
            <span>
              <small>Patient</small>
              <b>{draft.patient.name}</b>
            </span>
          </p>
          <p>
            <span>
              <small>Consultation fee</small>
              <b>Total</b>
            </span>
            <strong>SAR {draft.fee}</strong>
          </p>
        </div>
        <button
          type="button"
          className="button full"
          onClick={confirm}
          disabled={isConfirming}
          aria-busy={isConfirming}
        >
          {isConfirming ? "Saving…" : "Confirm in demo"}
        </button>
        <p className="fine">No clinic is contacted and no payment is taken.</p>
      </div>
    </section>
  );
}
