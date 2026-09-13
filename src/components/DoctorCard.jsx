import { Link } from "react-router-dom";
import { Heart, MapPin, Star } from "lucide-react";
import { useStore } from "../store/StoreContext";
import { hasUpcomingAvailability } from "../doctors";

export function DoctorCard({ doctor, compact = false }) {
  const { saved, toggleSaved } = useStore();
  const active = saved.includes(doctor.id);
  const availableSoon = hasUpcomingAvailability(doctor);
  return (
    <article className={`doctor-card ${compact ? "compact" : ""}`}>
      <button
        type="button"
        className={`save ${active ? "active" : ""}`}
        onClick={() => toggleSaved(doctor.id)}
        aria-pressed={active}
        aria-label={`${active ? "Remove" : "Save"} ${doctor.name}`}
      >
        <Heart size={18} />
      </button>
      <Link
        className="doctor-image-link"
        to={`/doctor/${doctor.slug}`}
        aria-label={`View ${doctor.name}'s fictional profile`}
      >
        <img
          className="doctor-photo"
          src={doctor.image}
          alt={`Portrait of ${doctor.name}`}
          loading={compact ? "eager" : "lazy"}
          width="900"
          height="1125"
        />
      </Link>
      <div className="doctor-info">
        <span className="specialty-label">{doctor.specialty}</span>
        <h3>
          <Link to={`/doctor/${doctor.slug}`}>{doctor.name}</Link>
        </h3>
        <p>
          <MapPin size={15} />
          {doctor.clinic} · {doctor.area}
        </p>
        <div className="doctor-meta">
          <span>
            <Star size={15} fill="currentColor" /> {doctor.rating}{" "}
            <small>({doctor.reviews})</small>
          </span>
          <span>{doctor.experience} years</span>
        </div>
        {!compact && (
          <span
            className={`availability-badge ${availableSoon ? "available" : "unavailable"}`}
          >
            <span aria-hidden="true" />
            {availableSoon ? "Demo times this week" : "No demo times this week"}
          </span>
        )}
        {!compact && (
          <div className="card-bottom">
            <b>
              SAR {doctor.fee}
              <small> / visit</small>
            </b>
            <Link className="button small" to={`/book/${doctor.id}`}>
              Book appointment
            </Link>
          </div>
        )}
      </div>
    </article>
  );
}
