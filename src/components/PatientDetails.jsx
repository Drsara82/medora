import { ArrowRight, LockKeyhole } from "lucide-react";
import { BookingSummary } from "./BookingSummary";

export function PatientDetails({
  patient,
  setPatient,
  errors,
  setErrors,
  submit,
  doctor,
  date,
  time,
  type,
}) {
  const fieldSettings = {
    name: { maxLength: 60 },
    email: { maxLength: 100 },
    phone: { maxLength: 24, inputMode: "tel" },
  };
  const field = (name, label, type, autoComplete) => (
    <label>
      <span>{label}</span>
      <input
        id={`patient-${name}`}
        type={type}
        autoComplete={autoComplete}
        value={patient[name]}
        required
        {...fieldSettings[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `patient-${name}-error` : undefined}
        onChange={(e) => {
          setPatient({ ...patient, [name]: e.target.value });
          if (errors[name])
            setErrors((current) => ({ ...current, [name]: undefined }));
        }}
      />
      {errors[name] && (
        <small className="field-error" id={`patient-${name}-error`}>
          {errors[name]}
        </small>
      )}
    </label>
  );
  return (
    <div className="patient-layout">
      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        noValidate
      >
        <span className="eyebrow">Patient details</span>
        <h1>Who is this appointment for?</h1>
        <p>
          Only basic contact information is used for this local front-end
          demonstration.
        </p>
        {field("name", "Full name", "text", "name")}
        {field("email", "Email address", "email", "email")}
        {field("phone", "Phone number", "tel", "tel")}
        <div className="privacy-note">
          <LockKeyhole />
          <span>
            <b>Privacy-conscious demo</b>No medical history, identification,
            insurance, or password is requested or stored.
          </span>
        </div>
        <button className="button full" type="submit">
          Review appointment <ArrowRight />
        </button>
      </form>
      <BookingSummary doctor={doctor} date={date} time={time} type={type} />
    </div>
  );
}
