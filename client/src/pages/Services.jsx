import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
function commonsUrl(filename, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;
}
const PHONE_DISPLAY = "+254 723 657 333";
const PHONE_TEL = "+254723657333";
const IMAGES = {
  hero: commonsUrl("Mercedes_s-class_w223_black_(1).jpg", 1920),
  transfers: commonsUrl("Mercedes-Benz_W447_V_250d_AMG_Line_Black_(1).jpg"),
  chauffeur: commonsUrl("Worldwide-chauffeured-service-client-arrival.jpg"),
  rental: commonsUrl("Mercedes_s-class_w222_black_(3).jpg"),
  airport: commonsUrl("Jomo_Kenyatta_International_Airport_(JKIA).jpg"),
  interior: commonsUrl("Mercedes_S-Class_Interior_(W222).jpg")
};
const SERVICES = [{
  titleKey: "svc_transfers_title",
  bodyKey: "svc_transfers_body",
  image: IMAGES.transfers
}, {
  titleKey: "svc_chauffeur_title",
  bodyKey: "svc_chauffeur_body",
  image: IMAGES.chauffeur
}, {
  titleKey: "svc_rental_title",
  bodyKey: "svc_rental_body",
  image: IMAGES.rental
}, {
  titleKey: "svc_airport_title",
  bodyKey: "svc_airport_body",
  image: IMAGES.airport
}];
const EXCELLENCE = [{
  titleKey: "exc_fleet_title",
  bodyKey: "exc_fleet_body"
}, {
  titleKey: "exc_chauffeurs_title",
  bodyKey: "exc_chauffeurs_body"
}, {
  titleKey: "exc_countrywide_title",
  bodyKey: "exc_countrywide_body"
}, {
  titleKey: "exc_seamless_title",
  bodyKey: "exc_seamless_body"
}];
const STEPS = [{
  titleKey: "step_contact_title",
  bodyKey: "step_contact_body",
  image: IMAGES.chauffeur
}, {
  titleKey: "step_confirm_title",
  bodyKey: "step_confirm_body",
  image: IMAGES.airport
}, {
  titleKey: "step_enjoy_title",
  bodyKey: "step_enjoy_body",
  image: IMAGES.transfers
}];
export default function Services() {
  const { t } = useLanguage();
  return <div>
      
      <div className="relative flex min-h-screen items-center bg-cover bg-center" style={{
      backgroundImage: `url("${IMAGES.hero}")`,
      backgroundPosition: "70% 40%"
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/70 to-brand-navy-dark/20" />

        <div className="section-wrap relative py-section text-white">
          
          <h1 className="max-w-xl font-serif text-4xl italic text-white sm:text-5xl">{t("services_hero_heading")}</h1>
          <p className="mt-2 font-semibold text-accent">{t("services_hero_tag")}</p>
          <p className="mt-4 max-w-lg text-white/80">
            {t("services_hero_sub")}
          </p>
        </div>
      </div>


      <section className="section-wrap py-section">
        <h2 className="mb-2 text-center text-3xl">{t("services_our_services")}</h2>
        <div className="mx-auto mb-gutter-lg h-1 w-16 rounded-full bg-accent" />

        <div className="space-y-gutter-lg">
          {SERVICES.map((s, i) => <div key={s.titleKey} className={`grid items-center gap-gutter-lg sm:grid-cols-2 ${i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""}`}>
              <img src={s.image} alt={t(s.titleKey)} className="h-72 w-full rounded-card object-cover shadow-card" />
              <div className="text-center sm:text-left">
                <h3 className="mb-2 text-2xl">{t(s.titleKey)}</h3>
                <p className="text-brand-navy/70">{t(s.bodyKey)}</p>
              </div>
            </div>)}
        </div>
      </section>


      <section className="bg-brand-navy text-white">
        <div className="section-wrap grid items-center gap-gutter-lg py-section sm:grid-cols-2">
          <img src={IMAGES.interior} alt="Premium interior" className="h-80 w-full rounded-card object-cover shadow-card sm:h-[420px]" />
          <div>
            <h2 className="mb-gutter-lg text-3xl text-white">{t("services_excellence")}</h2>
            <div className="space-y-gutter">
              {EXCELLENCE.map(item => <div key={item.titleKey} className="flex gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-accent text-accent">
                    &#9679;
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{t(item.titleKey)}</h3>
                    <p className="text-sm text-white/70">{t(item.bodyKey)}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>


      <section className="section-wrap py-section">
        <h2 className="mb-2 text-center text-3xl">{t("services_steps_heading")}</h2>
        <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-accent" />
        <p className="mb-gutter-lg text-center text-brand-navy/60">
          {t("services_steps_sub")}
        </p>

        <div className="grid gap-gutter sm:grid-cols-3">
          {STEPS.map((step, i) => <div key={step.titleKey} className="relative flex h-64 flex-col justify-end overflow-hidden rounded-card bg-cover bg-center p-gutter text-white shadow-card" style={{
          backgroundImage: `url("${step.image}")`
        }}>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy-dark/40 to-transparent" />
              <div className="relative">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-light">
                  {t("services_step_label")} {i + 1}
                </p>
                <h3 className="mb-1 text-xl text-white">{t(step.titleKey)}</h3>
                <p className="text-sm text-white/80">{t(step.bodyKey)}</p>
              </div>
            </div>)}
        </div>
      </section>


      <section className="bg-brand-navy-light">
        <div className="section-wrap flex flex-col items-center justify-between gap-gutter py-section-lg text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">{t("services_cta_heading")}</h2>
            <p className="mt-2 max-w-xl text-white/70">
              {t("services_cta_sub")}
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <a href={`tel:${PHONE_TEL}`} className="btn-secondary bg-transparent text-white hover:bg-white/10">
              {PHONE_DISPLAY}
            </a>
            <Link to="/contact" className="btn-primary whitespace-nowrap">{t("services_cta_contact")}</Link>
          </div>
        </div>
      </section>
    </div>;
}
