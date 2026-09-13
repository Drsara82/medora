import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { PageMeta } from "../components/PageMeta";
import { useStore } from "../store/StoreContext";

export function Confirmation() {
  const location = useLocation();
  const { setDraft } = useStore();
  const confirmed = Boolean(location.state?.confirmed);
  useEffect(() => {
    if (confirmed) setDraft(null);
    // Only clear once, when this page mounts with a confirmed booking —
    // not on every render or every setDraft identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmed]);
  if (!confirmed) return <Navigate to="/appointments" />;
  return (
    <section className="success">
      <PageMeta title="Booking confirmation | Medora" />
      <span>
        <Check />
      </span>
      <h1>Saved in this demo</h1>
      <p>
        Your sample appointment is stored locally on this device. No clinic,
        doctor, email, or SMS service was contacted.
      </p>
      <Link className="button" to="/appointments">
        View sample appointments
      </Link>
      <Link to="/doctors">Find another doctor</Link>
    </section>
  );
}
