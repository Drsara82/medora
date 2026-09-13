import { useLanguage } from "../store/LanguageContext";

export function PageLoading() {
  const { t } = useLanguage();
  return (
    <div className="page-loading" role="status" aria-live="polite">
      <span className="page-loading-spinner" aria-hidden="true" />
      <span>{t("loading.label")}</span>
    </div>
  );
}
