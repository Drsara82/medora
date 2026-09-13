import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "./LanguageContext";

function LanguageProbe() {
  const { language, toggleLanguage, t } = useLanguage();
  return (
    <div>
      <span>lang: {language}</span>
      <span>{t("header.saved")}</span>
      <span>{t("header.notifications", { count: 3 })}</span>
      <button onClick={toggleLanguage}>toggle</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute("dir");
    document.documentElement.removeAttribute("lang");
  });

  it("defaults to English with ltr direction", () => {
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    expect(screen.getByText("lang: en")).toBeInTheDocument();
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
    expect(document.documentElement.lang).toBe("en");
  });

  it("interpolates {placeholders} in a translated string", () => {
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    expect(screen.getByText("3 unread notifications")).toBeInTheDocument();
  });

  it("switches to Arabic with rtl direction and persists the choice", () => {
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(screen.getByText("lang: ar")).toBeInTheDocument();
    expect(screen.getByText("المحفوظات")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("rtl");
    expect(document.documentElement.lang).toBe("ar");
    expect(JSON.parse(localStorage.getItem("medora-language"))).toBe("ar");
  });

  it("always opens in English, even with a previously stored preference", () => {
    localStorage.setItem("medora-language", JSON.stringify("ar"));
    render(
      <LanguageProvider>
        <LanguageProbe />
      </LanguageProvider>,
    );
    expect(screen.getByText("lang: en")).toBeInTheDocument();
    expect(document.documentElement.dir).toBe("ltr");
  });
});
