import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Activity,
  Baby,
  Bone,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { clinics, specialties } from "../data";
import { doctors } from "../doctors";
import { PageMeta } from "../components/PageMeta";
import { DoctorCard } from "../components/DoctorCard";
import { useLanguage } from "../store/LanguageContext";

export function Home() {
  const nav = useNavigate();
  const { t } = useLanguage();
  const [q, setQ] = useState("");
  const specialtyIcons = [Sparkles, Activity, Baby, Bone];
  return (
    <>
      <PageMeta
        title="Medora | Doctor discovery & booking"
        description="Explore fictional Riyadh doctors and try a front-end appointment booking experience."
      />
      <section className="hero">
        <div>
          <span className="eyebrow">{t("home.eyebrow")}</span>
          <h1>
            {t("home.heading1")}
            <br />
            <em>{t("home.heading2")}</em>
          </h1>
          <p>{t("home.intro")}</p>
          <form
            className="hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              nav("/doctors", { state: { q: q.trim() } });
            }}
          >
            <Search />
            <label className="sr-only" htmlFor="home-search">
              {t("home.searchLabel")}
            </label>
            <input
              id="home-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("home.searchPlaceholder")}
              autoComplete="off"
            />
            <button type="submit">
              {q.trim() ? t("home.searchSubmit") : t("home.browseSubmit")}
            </button>
          </form>
          <div className="trust-row">
            <span>
              <ShieldCheck />
              {t("home.trust.profiles")}
            </span>
            <span>
              <CalendarDays />
              {t("home.trust.availability")}
            </span>
            <span>
              <Clock />
              {t("home.trust.confirmation")}
            </span>
          </div>
        </div>
        <div className="hero-card hero-image-card">
          <img
            src="/images/hero/medora-hero.webp"
            alt="Doctor speaking with a patient in a modern Riyadh clinic"
            width="1600"
            height="900"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="home-stats" aria-label="Medora demo overview">
        <div>
          <b>{doctors.length}</b>
          <span>{t("home.stats.doctors")}</span>
        </div>
        <div>
          <b>{specialties.length}</b>
          <span>{t("home.stats.specialties")}</span>
        </div>
        <div>
          <b>{clinics.length}</b>
          <span>{t("home.stats.clinics")}</span>
        </div>
        <div>
          <b>3</b>
          <span>{t("home.stats.steps")}</span>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t("home.specialties.eyebrow")}</span>
            <h2>{t("home.specialties.heading")}</h2>
          </div>
          <Link to="/specialties">
            {t("home.specialties.viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="specialty-grid">
          {specialties.map((item, i) => {
            const SpecialtyIcon = specialtyIcons[i];
            return (
              <Link
                to={`/specialty/${item.slug}`}
                className="specialty"
                key={item.id}
              >
                <span aria-hidden="true">
                  <SpecialtyIcon />
                </span>
                <b>{item.name}</b>
                <p>{item.description}</p>
                <small>
                  {t("home.specialties.doctorCount", {
                    count: doctors.filter((d) => d.specialtyId === item.id)
                      .length,
                  })}
                </small>
                <ArrowRight className="specialty-arrow" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section tint">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t("home.doctors.eyebrow")}</span>
            <h2>{t("home.doctors.heading")}</h2>
          </div>
          <Link to="/doctors">
            {t("home.doctors.exploreAll")} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="doctor-grid">
          {doctors
            .filter((d) => d.featured)
            .map((d) => (
              <DoctorCard doctor={d} key={d.id} />
            ))}
        </div>
      </section>
      <section className="section home-clinics">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t("home.clinics.eyebrow")}</span>
            <h2>{t("home.clinics.heading")}</h2>
          </div>
          <Link to="/clinics">
            {t("home.clinics.viewAll")} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="home-clinic-grid">
          {clinics.map((clinic) => {
            const doctorCount = doctors.filter(
              (doctor) => doctor.clinicId === clinic.id,
            ).length;
            return (
              <Link
                className="home-clinic-card"
                to={`/clinic/${clinic.slug}`}
                key={clinic.id}
              >
                <img
                  src={clinic.image}
                  alt={`Interior view of ${clinic.name}`}
                  loading="lazy"
                  width="1280"
                  height="800"
                />
                <div>
                  <span>
                    <MapPin /> {clinic.area}, Riyadh
                  </span>
                  <h3>{clinic.name}</h3>
                  <small>
                    {t("home.clinics.doctorCount", {
                      count: doctorCount,
                      plural: doctorCount === 1 ? "" : "s",
                    })}
                  </small>
                </div>
                <ArrowRight aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="section booking-story">
        <div className="section-head booking-story-head">
          <div>
            <span className="eyebrow">{t("home.story.eyebrow")}</span>
            <h2>{t("home.story.heading")}</h2>
          </div>
          <p>{t("home.story.intro")}</p>
        </div>
        <div className="journey-grid">
          <article>
            <span>01</span>
            <Search />
            <h3>{t("home.story.step1.title")}</h3>
            <p>{t("home.story.step1.text")}</p>
          </article>
          <article>
            <span>02</span>
            <CalendarDays />
            <h3>{t("home.story.step2.title")}</h3>
            <p>{t("home.story.step2.text")}</p>
          </article>
          <article>
            <span>03</span>
            <CheckCircle2 />
            <h3>{t("home.story.step3.title")}</h3>
            <p>{t("home.story.step3.text")}</p>
          </article>
        </div>
        <div className="home-cta">
          <div>
            <span className="eyebrow">{t("home.cta.eyebrow")}</span>
            <h2>{t("home.cta.heading")}</h2>
          </div>
          <Link className="button" to="/doctors">
            {t("home.cta.browse")} <ArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
