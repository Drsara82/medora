import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  Clock,
  Heart,
  Info,
  Languages,
  MapPin,
  Star,
  Video,
} from "lucide-react";
import { clinics } from "../data";
import { doctors } from "../doctors";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";

export function DoctorProfile() {
  const { slug } = useParams();
  const { saved, toggleSaved } = useStore();
  const d = doctors.find((x) => x.slug === slug);
  if (!d) return <Navigate to="/not-found" />;
  const clinic = clinics.find((item) => item.id === d.clinicId);
  const isSaved = saved.includes(d.id);
  return (
    <section className="page profile">
      <PageMeta
        title={`${d.name} | Medora`}
        description={`View the ${d.specialty} profile for ${d.name} in Medora.`}
      />
      <Link className="back" to="/doctors">
        <ChevronLeft />
        Back to doctors
      </Link>
      <div className="profile-hero">
        <div className="profile-photo-wrap">
          <img
            className="doctor-photo large"
            src={d.image}
            alt={`Portrait of ${d.name}`}
            width="900"
            height="1125"
          />
          <span>
            <Info /> Fictional profile
          </span>
        </div>
        <div className="profile-summary">
          <span className="specialty-label">{d.specialty}</span>
          <h1>{d.name}</h1>
          <p>
            <MapPin size={16} />
            {d.clinic}, {d.area}, Riyadh
          </p>
          <div className="doctor-meta">
            <span>
              <Star fill="currentColor" /> {d.rating} ({d.reviews} demo reviews)
            </span>
            <span>{d.experience} years experience</span>
          </div>
          <div className="profile-tags" aria-label="Profile details">
            <span>
              <Languages /> {d.languages.join(" · ")}
            </span>
            {d.consultationTypes.map((type) => (
              <span key={type}>
                {type === "Video" ? <Video /> : <MapPin />}
                {type}
              </span>
            ))}
          </div>
        </div>
        <div className="profile-book">
          <span>Demo consultation fee</span>
          <b>SAR {d.fee}</b>
          <Link className="button" to={`/book/${d.id}`}>
            Book sample appointment
          </Link>
          <button
            type="button"
            className={`profile-save ${isSaved ? "active" : ""}`}
            onClick={() => toggleSaved(d.id)}
            aria-pressed={isSaved}
          >
            <Heart /> {isSaved ? "Saved doctor" : "Save doctor"}
          </button>
        </div>
      </div>
      <div className="profile-content">
        <article>
          <span className="eyebrow">Profile overview</span>
          <h2>About {d.name.replace("Dr. ", "").split(" ")[0]}</h2>
          <p>{d.bio}</p>
          <h2>Consultation approach</h2>
          <p>
            This fictional profile demonstrates clear explanations, careful
            listening, and a user-friendly doctor-detail hierarchy.
          </p>
          <div className="demo-disclaimer">
            <Info />
            <span>
              This profile is sample content, not medical advice or a real
              practitioner listing.
            </span>
          </div>
        </article>
        <aside className="profile-clinic-card">
          {clinic?.image && (
            <img
              src={clinic.image}
              alt={`Interior view of ${clinic.name}`}
              loading="lazy"
              width="1280"
              height="800"
            />
          )}
          <div>
            <h3>Clinic information</h3>
            <p>
              <MapPin />
              {d.clinic}
              <small>{clinic?.address}</small>
            </p>
            <p>
              <Clock />
              Demo hours<small>{clinic?.hours}</small>
            </p>
            {d.consultationTypes.includes("Video") && (
              <p>
                <Video />
                Video consultation UI
                <small>Available on selected demo days</small>
              </p>
            )}
            <p>
              <CalendarDays />
              Demo scheduling
              <small>Choose a date and time in the booking flow</small>
            </p>
            {clinic && (
              <Link
                className="clinic-profile-link"
                to={`/clinic/${clinic.slug}`}
              >
                View doctors at this clinic <ArrowRight />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
