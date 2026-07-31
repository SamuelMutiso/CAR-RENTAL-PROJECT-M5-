import { useEffect, useRef, useState } from "react";
import { useLanguage, SUPPORTED_LANGUAGES } from "../context/LanguageContext";

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={t("nav_language")}
        className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </svg>
        <span className="hidden sm:inline">{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-card bg-white text-brand-navy shadow-card">
          {SUPPORTED_LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => {
                setLanguage(l.code);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-navy/5 ${l.code === language ? "font-semibold text-accent" : ""}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
