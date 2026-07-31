import { createContext, useCallback, useContext, useEffect, useState } from "react";
import translations from "../i18n/translations";
const LanguageContext = createContext(null);
const LANG_KEY = "gearshift_language";
const RTL_LANGUAGES = new Set(["ar"]);
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
  { code: "es", label: "Español" },
  { code: "zh", label: "中文" },
];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => localStorage.getItem(LANG_KEY) || "en");
  const setLanguage = useCallback(code => {
    setLanguageState(code);
    localStorage.setItem(LANG_KEY, code);
  }, []);
  const t = useCallback(key => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry.en || key;
  }, [language]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
