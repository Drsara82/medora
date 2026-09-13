import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, writeStorage } from "../utils";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    writeStorage(STORAGE_KEYS.language, language);
  }, [language]);

  const toggleLanguage = () =>
    setLanguage((current) => (current === "ar" ? "en" : "ar"));

  const t = (key, params) => {
    const template = translations[language]?.[key] ?? translations.en[key] ?? key;
    if (!params) return template;
    return Object.keys(params).reduce(
      (text, paramKey) => text.replaceAll(`{${paramKey}}`, params[paramKey]),
      template,
    );
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
