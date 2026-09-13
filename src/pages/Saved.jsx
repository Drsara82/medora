import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";
import { doctors } from "../doctors";
import { useStore } from "../store/StoreContext";
import { PageMeta } from "../components/PageMeta";
import { DoctorCard } from "../components/DoctorCard";
import { Empty } from "../components/Empty";

export function Saved() {
  const { saved } = useStore();
  const list = doctors.filter((d) => saved.includes(d.id));
  return (
    <section className="page saved-page">
      <PageMeta
        title="Saved doctors | Medora"
        description="Review doctor profiles saved locally in Medora."
      />
      <div className="saved-page-head">
        <div className="page-title">
          <span className="eyebrow">Your shortlist</span>
          <h1>Saved doctors</h1>
          <p>
            Compare your preferred profiles and continue to the booking flow
            booking experience when you are ready.
          </p>
        </div>
        <div className="saved-overview">
          <span className="saved-overview-icon">
            <Heart fill="currentColor" />
          </span>
          <div>
            <b aria-live="polite">
              {list.length} saved {list.length === 1 ? "profile" : "profiles"}
            </b>
            <small>Stored locally on this device</small>
          </div>
          <Link to="/doctors">
            Browse more <ArrowRight />
          </Link>
        </div>
      </div>
      {list.length ? (
        <div className="doctor-grid saved-grid">
          {list.map((d) => (
            <DoctorCard doctor={d} key={d.id} />
          ))}
        </div>
      ) : (
        <Empty
          title="No saved doctors yet"
          text="Use the heart button on any fictional doctor card or profile to build your shortlist."
        />
      )}
    </section>
  );
}
