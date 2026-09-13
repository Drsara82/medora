import { Link } from "react-router-dom";
import { ArrowRight, Stethoscope } from "lucide-react";
import { clinics, specialties } from "../data";
import { doctors } from "../doctors";
import { PageMeta } from "../components/PageMeta";

export function Directory({ type }) {
  const items = type === "specialties" ? specialties : clinics;
  return (
    <section className="page">
      <PageMeta
        title={`${type === "specialties" ? "Specialties" : "Clinics"} | Medora`}
      />
      <div className="page-title">
        <span className="eyebrow">Explore Medora</span>
        <h1>
          {type === "specialties"
            ? "Medical specialties"
            : "Fictional clinics across Riyadh"}
        </h1>
        <p>Browse demo care options and find the right place to begin.</p>
      </div>
      <div className="directory">
        {items.map((item) => {
          const count = doctors.filter((d) =>
            type === "specialties"
              ? d.specialtyId === item.id
              : d.clinicId === item.id,
          ).length;
          return (
            <Link
              to={`/${type === "specialties" ? "specialty" : "clinic"}/${item.slug}`}
              key={item.id}
              className={type === "clinics" ? "clinic-directory-card" : ""}
            >
              {type === "specialties" ? (
                <span>
                  <Stethoscope />
                </span>
              ) : (
                <img
                  className="directory-image"
                  src={item.image}
                  alt={`Interior view of ${item.name}`}
                  loading="lazy"
                  width="1280"
                  height="800"
                />
              )}
              <div>
                <h3>{item.name}</h3>
                <p>{item.description || `${item.area} · ${item.hours}`}</p>
                <small>
                  {count} demo doctor{count === 1 ? "" : "s"}
                </small>
              </div>
              <ArrowRight />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
