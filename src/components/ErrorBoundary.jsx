import { Component } from "react";
import { STORAGE_KEYS, readStorage } from "../utils";
import { translations } from "../i18n/translations";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deployment this is where you'd report to an error-tracking
    // service. Errors are logged locally in this client-only prototype.
    console.error("Medora crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // This boundary sits outside <LanguageProvider> on purpose (so it can
      // still catch an error thrown by the provider itself), so it can't
      // use the useLanguage() hook — it reads the stored preference
      // directly instead.
      const language = readStorage(STORAGE_KEYS.language, null) === "ar" ? "ar" : "en";
      const t = (key) => translations[language]?.[key] ?? translations.en[key];
      return (
        <section className="simple">
          <b className="huge">{language === "ar" ? "خطأ" : "Error"}</b>
          <h1>{t("errorBoundary.title")}</h1>
          <p>{t("errorBoundary.text")}</p>
          <div className="not-found-actions">
            <a className="button" href="/">
              {t("errorBoundary.reload")}
            </a>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}
