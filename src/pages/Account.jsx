import { useState } from "react";
import { CheckCircle2, LogIn, UserPlus, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { isValidEmail } from "../utils";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";

const emptyProfile = { name: "", email: "", phone: "" };

export function Account() {
  const { profile, setProfile } = useStore();
  const hasSavedProfile = Boolean(profile?.name || profile?.email || profile?.phone);
  const [draft, setDraft] = useState(hasSavedProfile ? profile : emptyProfile);
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (!draft.name.trim() || !isValidEmail(draft.email) || !draft.phone.trim()) return;
    setProfile(draft);
    setSaved(true);
  };

  return (
    <section className="account-page">
      <PageMeta title="Account | Medora" />
      <div className="account-intro">
        <span className="account-icon" aria-hidden="true"><UserRound /></span>
        <div>
          <span className="eyebrow">Your Medora space</span>
          <h1>Account</h1>
          <p>Sign in, create a demo account, or save contact details locally to make the booking flow quicker.</p>
        </div>
      </div>

      <div className="account-auth-panel" aria-label="Account access">
        <div>
          <span>Demo access</span>
          <strong>Want to explore the account flow?</strong>
          <p>Authentication screens are UI demonstrations only—no real account is created.</p>
        </div>
        <div className="account-auth-actions">
          <Link className="button" to="/signin"><LogIn /> Sign in</Link>
          <Link className="button secondary" to="/signup"><UserPlus /> Sign up</Link>
        </div>
      </div>

      <form className="form-card account-form" onSubmit={submit}>
        <div className="form-section-head">
          <div>
            <span className="eyebrow">Local profile</span>
            <h2>Booking details</h2>
          </div>
          <small>Stored on this device only</small>
        </div>
        <label>
          <span>Full name</span>
          <input required autoComplete="name" placeholder="e.g. Nora Ahmed"
            value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </label>
        <label>
          <span>Email address</span>
          <input required type="email" autoComplete="email" placeholder="e.g. nora@example.com"
            value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </label>
        <label>
          <span>Phone number</span>
          <input required type="tel" autoComplete="tel" placeholder="e.g. +966 50 000 0000"
            value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
        </label>
        <button className="button" type="submit">Save local profile</button>
        {saved && <p className="form-success" role="status"><CheckCircle2 />Saved on this device.</p>}
        <p className="fine">This demo does not create a real healthcare account or send these details to a clinic.</p>
      </form>
    </section>
  );
}
