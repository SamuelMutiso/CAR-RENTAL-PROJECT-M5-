import { useLanguage } from "../context/LanguageContext";
const CONTACT_LINK_CLASS = "card group flex items-center justify-between gap-3 p-gutter transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-accent/30";

function ArrowIcon() {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-brand-navy/30 transition group-hover:translate-x-0.5 group-hover:text-accent">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>;
}

export default function Contact() {
  const { t } = useLanguage();
  return <div className="section-wrap max-w-2xl py-section">
      <h1 className="mb-gutter text-4xl">{t("contact_heading")}</h1>
      <p className="mb-gutter-lg text-brand-navy/80">
        {t("contact_sub")}
      </p>

      <div className="grid gap-gutter sm:grid-cols-2">
        <a href="mailto:support@gearshift.com" className={CONTACT_LINK_CLASS}>
          <div>
            <h3 className="mb-1 font-semibold">{t("contact_email_label")}</h3>
            <p className="text-sm text-brand-navy/60">support@gearshift.com</p>
          </div>
          <ArrowIcon />
        </a>
        <a href="tel:+254723657333" className={CONTACT_LINK_CLASS}>
          <div>
            <h3 className="mb-1 font-semibold">{t("contact_phone_label")}</h3>
            <p className="text-sm text-brand-navy/60">+254 723 657 333</p>
          </div>
          <ArrowIcon />
        </a>
        <a href="https://maps.google.com/?q=Westlands,+Nairobi,+Kenya" target="_blank" rel="noopener noreferrer" className={CONTACT_LINK_CLASS}>
          <div>
            <h3 className="mb-1 font-semibold">{t("contact_office_label")}</h3>
            <p className="text-sm text-brand-navy/60">Westlands, Nairobi, Kenya</p>
          </div>
          <ArrowIcon />
        </a>
        <div className="card p-gutter">
          <h3 className="mb-1 font-semibold">{t("contact_hours_label")}</h3>
          <p className="text-sm text-brand-navy/60">{t("contact_hours_value")}</p>
        </div>
      </div>
    </div>;
}
