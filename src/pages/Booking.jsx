import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronLeft, MapPin, Video } from "lucide-react";
import { getAvailability, isValidEmail, prettyDate } from "../utils";
import { doctors } from "../doctors";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";
import { BookingStepper } from "../components/BookingStepper";
import { Calendar } from "../components/Calendar";
import { TimeSlots } from "../components/TimeSlots";
import { PatientDetails } from "../components/PatientDetails";

export function Booking() {
  const { doctorId } = useParams();
  const d = doctors.find((x) => x.id === doctorId);
  const { draft, setDraft, profile } = useStore();
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(
    draft?.doctorId === doctorId ? draft.date : "",
  );
  const [time, setTime] = useState(
    draft?.doctorId === doctorId ? draft.time : "",
  );
  const [type, setType] = useState(
    draft?.doctorId === doctorId
      ? draft.type
      : d?.consultationTypes[0] || "In-clinic",
  );
  const [patient, setPatient] = useState(
    draft?.patient || {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
    },
  );
  const [errors, setErrors] = useState({});
  useEffect(() => {
    if (!d) return;
    const same = draft?.doctorId === doctorId;
    const savedType =
      same && d.consultationTypes.includes(draft.type)
        ? draft.type
        : d.consultationTypes[0];
    const savedDate = same ? draft.date : "";
    const savedTime =
      savedDate &&
      getAvailability(d.id, savedDate, savedType).includes(draft.time)
        ? draft.time
        : "";
    setStep(1);
    setDate(savedTime ? savedDate : "");
    setTime(savedTime);
    setType(savedType);
    setPatient(
      same && draft.patient
        ? draft.patient
        : { name: profile.name, email: profile.email, phone: profile.phone },
    );
    setErrors({});
  }, [doctorId]);
  if (!d) return <Navigate to="/not-found" />;
  const selectType = (next) => {
    setType(next);
    if (date && !getAvailability(d.id, date, next).includes(time)) setTime("");
  };
  const chooseDate = (k) => {
    setDate(k);
    if (!getAvailability(d.id, k, type).includes(time)) setTime("");
  };
  const validate = () => {
    const next = {};
    if (!patient.name.trim()) next.name = "Enter the patient name.";
    if (!isValidEmail(patient.email.trim()))
      next.email = "Enter a valid email address.";
    if (patient.phone.replace(/\D/g, "").length < 9)
      next.phone = "Enter a valid phone number.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first)
      requestAnimationFrame(() =>
        document.getElementById(`patient-${first}`)?.focus(),
      );
    return Object.keys(next).length === 0;
  };
  const continueToReview = () => {
    if (!validate()) return;
    const normalizedPatient = {
      name: patient.name.trim(),
      email: patient.email.trim(),
      phone: patient.phone.trim(),
    };
    setDraft({
      doctorId: d.id,
      clinicId: d.clinicId,
      date,
      time,
      type,
      fee: d.fee,
      patient: normalizedPatient,
    });
    nav("/booking/review");
  };
  return (
    <section className="page booking-page">
      <PageMeta
        title={`Book ${d.name} | Medora`}
        description="Try Medora's front-end appointment scheduling workflow."
      />
      <BookingStepper current={step} />
      <div className="booking-top">
        <button
          type="button"
          className="back plain"
          onClick={() => (step === 2 ? setStep(1) : nav(`/doctor/${d.slug}`))}
        >
          <ChevronLeft />
          {step === 2 ? "Back to schedule" : "Back to profile"}
        </button>
        <span>Step {step} of 3</span>
      </div>
      {step === 1 ? (
        <>
          <div className="booking-title">
            <span className="eyebrow">Choose your appointment</span>
            <h1>Select a date and time</h1>
            <p>Times are deterministic demo data shown in Riyadh local time.</p>
          </div>
          <div className="booking-layout">
            <div>
              <div className="booking-doctor">
                <img
                  className="doctor-photo"
                  src={d.image}
                  alt={`Portrait of ${d.name}`}
                  width="900"
                  height="1125"
                />
                <div>
                  <small>{d.specialty}</small>
                  <b>{d.name}</b>
                  <span>{d.clinic}</span>
                </div>
              </div>
              <div className="type-switch">
                {d.consultationTypes.map((option) => (
                  <button
                    type="button"
                    aria-pressed={type === option}
                    className={type === option ? "active" : ""}
                    onClick={() => selectType(option)}
                    key={option}
                  >
                    {option === "Video" ? <Video /> : <MapPin />}
                    {option}
                  </button>
                ))}
              </div>
              <Calendar
                doctorId={d.id}
                type={type}
                value={date}
                onChange={chooseDate}
              />
            </div>
            <TimeSlots
              doctorId={d.id}
              type={type}
              date={date}
              value={time}
              onChange={setTime}
            />
          </div>
          <div className="sticky-summary">
            <div aria-live="polite">
              {date ? (
                <>
                  <CalendarDays />
                  <span>
                    <small>Selected appointment</small>
                    <b>
                      {prettyDate(date)} · {time || "Choose a time"}
                    </b>
                  </span>
                </>
              ) : (
                <span>Choose a date and time to continue</span>
              )}
            </div>
            <button
              type="button"
              disabled={!date || !time}
              onClick={() => setStep(2)}
            >
              Continue to patient details <ArrowRight />
            </button>
          </div>
        </>
      ) : (
        <PatientDetails
          patient={patient}
          setPatient={setPatient}
          errors={errors}
          setErrors={setErrors}
          submit={continueToReview}
          doctor={d}
          date={date}
          time={time}
          type={type}
        />
      )}
    </section>
  );
}
