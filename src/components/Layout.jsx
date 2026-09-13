import { lazy, Suspense } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Header } from "./Header";
import { PageLoading } from "./PageLoading";
import { ScrollToTop } from "./ScrollToTop";
import { useLanguage } from "../store/LanguageContext";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";

// Home and NotFound are on the critical path (first paint / always-reachable
// fallback), so they stay in the main bundle. Every other route is
// code-split: each page's chunk is only fetched when its route is visited.
const Doctors = lazy(() =>
  import("../pages/Doctors").then((m) => ({ default: m.Doctors })),
);
const DoctorProfile = lazy(() =>
  import("../pages/DoctorProfile").then((m) => ({ default: m.DoctorProfile })),
);
const Directory = lazy(() =>
  import("../pages/Directory").then((m) => ({ default: m.Directory })),
);
const Booking = lazy(() =>
  import("../pages/Booking").then((m) => ({ default: m.Booking })),
);
const Review = lazy(() =>
  import("../pages/Review").then((m) => ({ default: m.Review })),
);
const Confirmation = lazy(() =>
  import("../pages/Confirmation").then((m) => ({ default: m.Confirmation })),
);
const Appointments = lazy(() =>
  import("../pages/Appointments").then((m) => ({ default: m.Appointments })),
);
const Saved = lazy(() =>
  import("../pages/Saved").then((m) => ({ default: m.Saved })),
);
const Notifications = lazy(() =>
  import("../pages/Notifications").then((m) => ({ default: m.Notifications })),
);
const Account = lazy(() =>
  import("../pages/Account").then((m) => ({ default: m.Account })),
);
const About = lazy(() =>
  import("../pages/About").then((m) => ({ default: m.About })),
);
const Contact = lazy(() =>
  import("../pages/Contact").then((m) => ({ default: m.Contact })),
);
const Faq = lazy(() => import("../pages/Faq").then((m) => ({ default: m.Faq })));
const Auth = lazy(() =>
  import("../pages/Auth").then((m) => ({ default: m.Auth })),
);

export function Layout() {
  const { t } = useLanguage();
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#content">
        {t("header.skipToContent")}
      </a>
      <Header />
      <main id="content">
        <Suspense fallback={<PageLoading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctor/:slug" element={<DoctorProfile />} />
            <Route
              path="/specialties"
              element={<Directory type="specialties" />}
            />
            <Route path="/specialty/:slug" element={<Doctors />} />
            <Route path="/clinics" element={<Directory type="clinics" />} />
            <Route path="/clinic/:slug" element={<Doctors />} />
            <Route path="/book/:doctorId" element={<Booking />} />
            <Route path="/booking/review" element={<Review />} />
            <Route path="/booking/confirmation" element={<Confirmation />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/signin" element={<Auth mode="signin" />} />
            <Route path="/signup" element={<Auth mode="signup" />} />
            <Route path="/forgot-password" element={<Auth mode="forgot" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <footer>
        <div>
          <div className="brand">Medora</div>
          <p>{t("footer.tagline")}</p>
        </div>
        <div className="footer-links">
          <Link to="/doctors">{t("footer.findDoctors")}</Link>
          <Link to="/about">{t("footer.about")}</Link>
          <Link to="/faq">{t("footer.faq")}</Link>
          <Link to="/contact">{t("footer.contact")}</Link>
          <Link to="/signin">{t("footer.signIn")}</Link>
        </div>
        <span>{t("footer.copyright")}</span>
      </footer>
    </>
  );
}
