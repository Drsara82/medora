import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, Languages, Menu, Moon, Stethoscope, Sun } from "lucide-react";
import { navigation } from "../data";
import { useStore } from "../store/StoreContext";
import { useTheme } from "../store/ThemeContext";
import { useLanguage } from "../store/LanguageContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { notifications } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage } = useLanguage();
  const location = useLocation();
  const unread = notifications.filter((item) => !item.read).length;
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <header>
      <Link className="brand" to="/">
        <span className="brandmark">
          <Stethoscope size={21} />
        </span>
        Medora
      </Link>
      <nav id="main-navigation" className={open ? "open" : ""}>
        {navigation.map(([to, labelKey]) => (
          <NavLink key={to} to={to}>
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
      <div className="head-actions">
        <Link className="text-link" to="/saved">
          {t("header.saved")}
        </Link>
        <Link className="text-link" to="/appointments">
          {t("header.appointments")}
        </Link>
        <button
          type="button"
          className="icon-btn language-toggle"
          onClick={toggleLanguage}
          aria-label={t("header.switchLanguage")}
        >
          <Languages size={16} />
          <span aria-hidden="true">{t("header.language")}</span>
        </button>
        <button
          type="button"
          className="icon-btn theme-toggle"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? t("header.themeToLight") : t("header.themeToDark")
          }
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <Link
          className="icon-btn notification-link"
          to="/notifications"
          aria-label={t("header.notifications", { count: unread })}
        >
          <Bell size={19} />
          {unread > 0 && <span>{unread}</span>}
        </Link>
        <Link className="avatar-mini" to="/account" aria-label={t("header.account")}>
          NA
        </Link>
        <button
          type="button"
          className="menu"
          aria-controls="main-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          aria-label={t("header.toggleMenu")}
        >
          <Menu />
        </button>
      </div>
    </header>
  );
}
