import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { isValidEmail } from "../utils";
import { PageMeta } from "../components/PageMeta";

export function Auth({ mode }) {
  const [show, setShow] = useState(false);
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setShow(false);
    setValues({ name: "", email: "", password: "" });
    setMessage("");
    setErrors({});
  }, [mode]);
  const title =
    mode === "signup"
      ? "Create a demo account"
      : mode === "forgot"
        ? "Reset password UI"
        : "Welcome back";
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (mode === "signup" && !values.name.trim())
      next.name = "Enter your name.";
    if (!isValidEmail(values.email)) next.email = "Enter a valid email.";
    if (mode !== "forgot" && values.password.length < 8)
      next.password = "Use at least 8 characters.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      requestAnimationFrame(() =>
        document.getElementById(`auth-${first}`)?.focus(),
      );
      setMessage("Please correct the highlighted fields.");
      return;
    }
    setErrors({});
    setMessage(
      mode === "forgot"
        ? "Demo complete. No reset email was sent."
        : "Demo complete. No real account or password was stored.",
    );
  };
  return (
    <section className="auth-page">
      <PageMeta title={`${title} | Medora`} />
      <form className="form-card auth-card" onSubmit={submit} noValidate>
        <span className="brandmark">
          <Stethoscope />
        </span>
        <h1>{title}</h1>
        <p>This screen demonstrates accessible form states only.</p>
        {mode === "signup" && (
          <label>
            <span>Full name</span>
            <input
              id="auth-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "auth-name-error" : undefined}
              value={values.name}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
            {errors.name && (
              <small className="field-error" id="auth-name-error">
                {errors.name}
              </small>
            )}
          </label>
        )}
        <label>
          <span>Email address</span>
          <input
            id="auth-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "auth-email-error" : undefined}
            value={values.email}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
          {errors.email && (
            <small className="field-error" id="auth-email-error">
              {errors.email}
            </small>
          )}
        </label>
        {mode !== "forgot" && (
          <label>
            <span>Password</span>
            <div className="password-field">
              <input
                id="auth-password"
                type={show ? "text" : "password"}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "auth-password-error" : "auth-password-help"
                }
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={`${show ? "Hide" : "Show"} password`}
              >
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <small className="field-error" id="auth-password-error">
                {errors.password}
              </small>
            )}
            <small id="auth-password-help">
              At least 8 characters. Passwords are never stored.
            </small>
          </label>
        )}
        <button type="submit" className="button full">
          {mode === "forgot"
            ? "Complete demo reset"
            : mode === "signup"
              ? "Create demo account"
              : "Sign in to demo"}
        </button>
        {message && (
          <p
            className={
              message.startsWith("Please") ? "form-error" : "form-success"
            }
            role="status"
          >
            {message}
          </p>
        )}
        <div className="auth-links">
          {mode === "signin" && (
            <>
              <Link to="/forgot-password">Forgot password?</Link>
              <Link to="/signup">Create account</Link>
            </>
          )}
          {mode !== "signin" && <Link to="/signin">Back to sign in</Link>}
        </div>
      </form>
    </section>
  );
}
