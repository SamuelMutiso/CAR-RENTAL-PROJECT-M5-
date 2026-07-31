import { createContext, useCallback, useContext, useState } from "react";
import translations from "../i18n/translations";
const LanguageContext = createContext(null);
const LANG_KEY = "gearshift_language";
export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "sw", label: "Kiswahili" },
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
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
