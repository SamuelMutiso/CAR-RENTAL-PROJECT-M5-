import { Link } from "react-router-dom";
import SocialIcons from "./SocialIcons";
import { useLanguage } from "../context/LanguageContext";
export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLanguage();
  return <footer className="mt-section border-t border-brand-navy/10 bg-brand-navy text-white">
      <div className="section-wrap grid gap-gutter-lg py-section sm:grid-cols-3">
        <div className="space-y-3">
          <p className="font-display text-xl">
            Gear<span className="text-accent">Shift</span>
          </p>
          <p className="max-w-xs text-sm text-white/60">
            {t("footer_tagline")}
          </p>
          <SocialIcons />
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            {t("footer_company")}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/services" className="hover:text-white">{t("nav_services")}</Link></li>
            <li><Link to="/about" className="hover:text-white">{t("footer_about")}</Link></li>
            <li><Link to="/contact" className="hover:text-white">{t("footer_contact")}</Link></li>
            <li><Link to="/faq" className="hover:text-white">{t("footer_faq")}</Link></li>
            <li><Link to="/vehicles" className="hover:text-white">{t("nav_browse")}</Link></li>
            <li><Link to="/vehicles/new" className="hover:text-white">{t("footer_list_car")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            {t("footer_legal")}
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/terms" className="hover:text-white">{t("footer_terms")}</Link></li>
            <li><Link to="/data-protection" className="hover:text-white">{t("footer_privacy")}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-wrap flex flex-col items-center justify-between gap-3 py-gutter text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} GearShift. All rights reserved.</p>
          <p>{t("footer_built_for")}</p>
        </div>
      </div>
    </footer>;
}