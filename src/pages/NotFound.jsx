import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../store/LanguageContext";

export function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="simple">
      <PageMeta title="Page not found | Medora" />
      <b className="huge">404</b>
      <h1>{t("notFound.title")}</h1>
      <p>{t("notFound.text")}</p>
      <div className="not-found-actions">
        <Link className="button" to="/">
          {t("notFound.returnHome")}
        </Link>
        <Link to="/doctors">{t("notFound.findDoctors")}</Link>
      </div>
    </section>
  );
}
