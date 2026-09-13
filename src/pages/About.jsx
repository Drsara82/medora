import { CalendarDays, LockKeyhole, ShieldCheck } from "lucide-react";
import { PageMeta } from "../components/PageMeta";

export function About() {
  return (
    <section className="content-page about-page">
      <PageMeta title="About | Medora" />
      <div className="about-hero">
        <div>
          <span className="eyebrow">About the project</span>
          <h1>A thoughtful healthcare booking experience</h1>
          <p>
            Medora is a front-end healthcare interface exploring doctor discovery,
            deterministic scheduling, multi-step forms, local state, and accessible
            appointment management.
          </p>
        </div>
        <div className="about-signature" aria-label="Project principles">
          <span>Designed for</span>
          <strong>Clarity</strong>
          <span>Built around</span>
          <strong>Trust</strong>
        </div>
      </div>
      <div className="info-grid">
        <article>
          <ShieldCheck />
          <h2>Honest by design</h2>
          <p>
            All doctors, clinics, availability, appointments, and confirmations
            are fictional and remain inside this browser demo.
          </p>
        </article>
        <article>
          <CalendarDays />
          <h2>Scheduling focus</h2>
          <p>
            Booking and rescheduling share one availability system so dependent
            selections stay consistent.
          </p>
        </article>
        <article>
          <LockKeyhole />
          <h2>Privacy-conscious</h2>
          <p>
            The interface avoids collecting medical history, identification,
            insurance, or payment information.
          </p>
        </article>
      </div>
    </section>
  );
}
