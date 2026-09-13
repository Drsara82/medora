import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { clinics, specialties } from "../data";
import {
  consultationTypes,
  doctorLanguages,
  doctors,
  hasUpcomingAvailability,
} from "../doctors";
import { PageMeta } from "../components/PageMeta";
import { DoctorCard } from "../components/DoctorCard";
import { FilterSelect } from "../components/FilterSelect";

export function Doctors() {
  const location = useLocation();
  const { slug } = useParams();
  const routeSpecialty = specialties.find((x) => x.slug === slug);
  const routeClinic = clinics.find((x) => x.slug === slug);
  const [q, setQ] = useState(location.state?.q || "");
  const [specialty, setSpecialty] = useState(routeSpecialty?.id || "all");
  const [clinic, setClinic] = useState(routeClinic?.id || "all");
  const [area, setArea] = useState("all");
  const [type, setType] = useState("all");
  const [language, setLanguage] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [sort, setSort] = useState("recommended");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const resultsRef = useRef(null);
  const invalidRoute = slug && !routeSpecialty && !routeClinic;
  const defaultSpecialty = routeSpecialty?.id || "all";
  const defaultClinic = routeClinic?.id || "all";
  const normalizedQuery = q.trim().toLowerCase();
  const clear = () => {
    setQ("");
    setSpecialty(defaultSpecialty);
    setClinic(defaultClinic);
    setArea("all");
    setType("all");
    setLanguage("all");
    setAvailabilityFilter("all");
    setSort("recommended");
    setPage(1);
  };
  const filtered = useMemo(
    () =>
      doctors
        .filter(
          (d) =>
            (specialty === "all" || d.specialtyId === specialty) &&
            (clinic === "all" || d.clinicId === clinic) &&
            (area === "all" || d.area === area) &&
            (type === "all" || d.consultationTypes.includes(type)) &&
            (language === "all" || d.languages.includes(language)) &&
            (availabilityFilter === "all" ||
              hasUpcomingAvailability(d, type)) &&
            `${d.name} ${d.specialty} ${d.clinic}`
              .toLowerCase()
              .includes(normalizedQuery),
        )
        .sort((a, b) =>
          sort === "fee-low"
            ? a.fee - b.fee
            : sort === "experience"
              ? b.experience - a.experience
              : sort === "rating"
                ? b.rating - a.rating
                : Number(b.featured) - Number(a.featured),
        ),
    [
      normalizedQuery,
      specialty,
      clinic,
      area,
      type,
      language,
      availabilityFilter,
      sort,
    ],
  );
  const perPage = 6;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const shown = filtered.slice(
    (Math.min(page, pages) - 1) * perPage,
    Math.min(page, pages) * perPage,
  );
  const changePage = (nextPage) => {
    setPage(Math.min(pages, Math.max(1, nextPage)));
    requestAnimationFrame(() => {
      resultsRef.current?.focus({ preventScroll: true });
      resultsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  };
  useEffect(
    () => setPage(1),
    [q, specialty, clinic, area, type, language, availabilityFilter, sort],
  );
  useEffect(() => {
    setSpecialty(routeSpecialty?.id || "all");
    setClinic(routeClinic?.id || "all");
  }, [slug]);
  const activeFilterCount = [
    normalizedQuery,
    specialty !== defaultSpecialty,
    clinic !== defaultClinic,
    area !== "all",
    type !== "all",
    language !== "all",
    availabilityFilter !== "all",
  ].filter(Boolean).length;
  const pageHeading = routeSpecialty
    ? `${routeSpecialty.name} doctors`
    : routeClinic
      ? `Doctors at ${routeClinic.name}`
      : "Find your doctor";
  if (invalidRoute) return <Navigate to="/not-found" />;
  return (
    <section className="page">
      <PageMeta
        title={`${pageHeading} | Medora`}
        description="Search and filter doctor profiles by specialty, clinic, language, and availability."
      />
      <div className="page-title">
        <span className="eyebrow">Discover care</span>
        <h1>{pageHeading}</h1>
        <p>
          Compare fictional specialists, locations, consultation types, and demo
          availability.
        </p>
      </div>
      <div className="filter-panel">
        <div className="filter-panel-head">
          <span>
            <SlidersHorizontal /> Search and filters
          </span>
          <div>
            {activeFilterCount > 0 && (
              <button type="button" className="clear-filters" onClick={clear}>
                Clear all ({activeFilterCount})
              </button>
            )}
            <button
              type="button"
              className="mobile-filter-toggle"
              aria-expanded={filtersOpen}
              aria-controls="doctor-filter-options"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              {filtersOpen ? "Hide filters" : "Show filters"}
            </button>
          </div>
        </div>
        <div className="search-field">
          <Search />
          <label className="sr-only" htmlFor="doctor-search">
            Search doctors
          </label>
          <input
            type="search"
            id="doctor-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search doctor, specialty, or clinic"
            autoComplete="off"
          />
          {normalizedQuery && (
            <button
              type="button"
              className="search-clear"
              onClick={() => setQ("")}
              aria-label="Clear doctor search"
            >
              <X />
            </button>
          )}
        </div>
        <div
          id="doctor-filter-options"
          className={`filter-options ${filtersOpen ? "open" : ""}`}
        >
          <div className="filter-grid">
            <FilterSelect
              label="Specialty"
              value={specialty}
              set={setSpecialty}
              options={specialties.map((x) => [x.id, x.name])}
            />
            <FilterSelect
              label="Clinic"
              value={clinic}
              set={setClinic}
              options={clinics.map((x) => [x.id, x.name])}
            />
            <FilterSelect
              label="Area"
              value={area}
              set={setArea}
              options={[...new Set(clinics.map((x) => x.area))].map((x) => [
                x,
                x,
              ])}
            />
            <FilterSelect
              label="Consultation"
              value={type}
              set={setType}
              options={consultationTypes.map((item) => [item, item])}
            />
            <FilterSelect
              label="Language"
              value={language}
              set={setLanguage}
              options={doctorLanguages.map((item) => [item, item])}
            />
            <FilterSelect
              label="Availability"
              value={availabilityFilter}
              set={setAvailabilityFilter}
              options={[["next-seven", "Available in next 7 days"]]}
            />
          </div>
          <div className="filter-chips" aria-label="Active filters">
            {normalizedQuery && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label={`Remove search filter: ${q.trim()}`}
              >
                Search: {q.trim()}
                <X />
              </button>
            )}
            {specialty !== defaultSpecialty && (
              <button
                type="button"
                onClick={() => setSpecialty(defaultSpecialty)}
                aria-label={`Remove specialty filter: ${specialties.find((item) => item.id === specialty)?.name}`}
              >
                {specialties.find((item) => item.id === specialty)?.name}
                <X />
              </button>
            )}
            {clinic !== defaultClinic && (
              <button
                type="button"
                onClick={() => setClinic(defaultClinic)}
                aria-label={`Remove clinic filter: ${clinics.find((item) => item.id === clinic)?.name}`}
              >
                {clinics.find((item) => item.id === clinic)?.name}
                <X />
              </button>
            )}
            {area !== "all" && (
              <button
                type="button"
                onClick={() => setArea("all")}
                aria-label={`Remove area filter: ${area}`}
              >
                {area}
                <X />
              </button>
            )}
            {type !== "all" && (
              <button
                type="button"
                onClick={() => setType("all")}
                aria-label={`Remove consultation filter: ${type}`}
              >
                {type}
                <X />
              </button>
            )}
            {language !== "all" && (
              <button
                type="button"
                onClick={() => setLanguage("all")}
                aria-label={`Remove language filter: ${language}`}
              >
                {language}
                <X />
              </button>
            )}
            {availabilityFilter !== "all" && (
              <button
                type="button"
                onClick={() => setAvailabilityFilter("all")}
                aria-label="Remove availability filter"
              >
                Available in 7 days
                <X />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="results-toolbar" ref={resultsRef} tabIndex="-1">
        <div className="results-head" aria-live="polite">
          <b>
            {filtered.length} doctor{filtered.length === 1 ? "" : "s"}
          </b>
          <span>
            {filtered.length
              ? `Showing ${(Math.min(page, pages) - 1) * perPage + 1}–${Math.min(Math.min(page, pages) * perPage, filtered.length)} · Sample data`
              : "Sample directory data"}
          </span>
        </div>
        <label className="sort-control">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="rating">Highest rating</option>
            <option value="fee-low">Lowest fee</option>
            <option value="experience">Most experienced</option>
          </select>
        </label>
      </div>
      {shown.length ? (
        <>
          <div className="doctor-grid">
            {shown.map((d) => (
              <DoctorCard doctor={d} key={d.id} />
            ))}
          </div>
          {pages > 1 && (
            <div className="pagination" aria-label="Doctor results pages">
              <button
                type="button"
                className="pagination-nav"
                disabled={page === 1}
                onClick={() => changePage(page - 1)}
                aria-label="Previous results page"
              >
                <ChevronLeft />
              </button>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  type="button"
                  aria-current={page === i + 1 ? "page" : undefined}
                  className={page === i + 1 ? "active" : ""}
                  onClick={() => changePage(i + 1)}
                  key={i}
                >
                  {i + 1}
                </button>
              ))}
              <button
                type="button"
                className="pagination-nav"
                disabled={page === pages}
                onClick={() => changePage(page + 1)}
                aria-label="Next results page"
              >
                <ChevronRight />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="empty">
          <Search />
          <h2>No doctors match these filters</h2>
          <p>Try removing a filter or searching with a different name.</p>
          <button type="button" className="button" onClick={clear}>
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
