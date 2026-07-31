import { useLanguage } from "../context/LanguageContext";
export default function About() {
  const { t } = useLanguage();
  return <div className="section-wrap max-w-3xl py-section">
      <h1 className="mb-gutter text-4xl">{t("about_heading")}</h1>
      <div className="space-y-gutter text-brand-navy/80">
        <p>{t("about_p1")}</p>
        <p>{t("about_p2")}</p>
        <p>{t("about_p3")}</p>
      </div>
    </div>;
}
