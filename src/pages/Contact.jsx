import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { isValidEmail } from "../utils";
import { PageMeta } from "../components/PageMeta";

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const update = (name) => (e) => {
    setValues({ ...values, [name]: e.target.value });
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!isValidEmail(values.email.trim()))
      next.email = "Enter a valid email address.";
    if (!values.message.trim()) next.message = "Enter a message.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      requestAnimationFrame(() =>
        document.getElementById(`contact-${first}`)?.focus(),
      );
      setSent(false);
      return;
    }
    setSent(true);
  };
  return (
    <section className="narrow">
      <PageMeta title="Contact | Medora" />
      <div className="page-title">
        <span className="eyebrow">Contact</span>
        <h1>Contact Medora</h1>
        <p>
          Try the form interaction. Nothing is transmitted to a real support
          team.
        </p>
      </div>
      <form className="form-card" onSubmit={submit} noValidate>
        <label>
          <span>Name</span>
          <input
            id="contact-name"
            autoComplete="name"
            value={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            onChange={update("name")}
          />
          {errors.name && (
            <small className="field-error" id="contact-name-error">
              {errors.name}
            </small>
          )}
        </label>
        <label>
          <span>Email</span>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            onChange={update("email")}
          />
          {errors.email && (
            <small className="field-error" id="contact-email-error">
              {errors.email}
            </small>
          )}
        </label>
        <label>
          <span>Message</span>
          <textarea
            id="contact-message"
            maxLength="500"
            rows="5"
            value={values.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={
              errors.message ? "contact-message-error" : undefined
            }
            onChange={update("message")}
          />
          {errors.message && (
            <small className="field-error" id="contact-message-error">
              {errors.message}
            </small>
          )}
        </label>
        <button className="button" type="submit">
          Submit demo form
        </button>
        {sent && (
          <p className="form-success" role="status">
            <CheckCircle2 />
            Form interaction completed locally. No message was sent.
          </p>
        )}
      </form>
    </section>
  );
}
