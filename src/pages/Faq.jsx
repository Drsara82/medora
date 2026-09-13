import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../store/LanguageContext";

export function Faq() {
  const { t, language } = useLanguage();
  const items = [
    ["faq.q1", "faq.a1"],
    ["faq.q2", "faq.a2"],
    ["faq.q3", "faq.a3"],
    ["faq.q4", "faq.a4"],
  ];

  return (
    <section className="content-page faq" dir={language === "ar" ? "rtl" : "ltr"}>
      <PageMeta title={`${t("faq.heading")} | Medora`} />
      <div className="faq-hero">
        <span className="faq-hero-icon" aria-hidden="true"><HelpCircle /></span>
        <div>
          <span className="eyebrow">{t("faq.eyebrow")}</span>
          <h1>{t("faq.heading")}</h1>
          <p>{t("faq.intro")}</p>
        </div>
      </div>
      <div className="faq-list">
        {items.map(([questionKey, answerKey]) => (
          <details key={questionKey}>
            <summary>
              <span>{t(questionKey)}</span>
              <ChevronDown aria-hidden="true" />
            </summary>
            <p>{t(answerKey)}</p>
          </details>
        ))}
      </div>
      <div className="faq-note">
        <ShieldCheck aria-hidden="true" />
        <p>{t("faq.note")}</p>
      </div>
    </section>
  );
}
