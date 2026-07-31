import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import VehicleCard from "../components/VehicleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import HeroCarousel from "../components/HeroCarousel";
import { useLanguage } from "../context/LanguageContext";
const STEPS = [{
  titleKey: "home_step_search",
  bodyKey: "home_step_search_body"
}, {
  titleKey: "home_step_book",
  bodyKey: "home_step_book_body"
}, {
  titleKey: "home_step_drive",
  bodyKey: "home_step_drive_body"
}];
export default function Landing() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  useEffect(() => {
    api.get("/vehicles").then(res => setVehicles(res.data.vehicles.slice(0, 6))).catch(() => setVehicles([])).finally(() => setLoading(false));
  }, []);
  return <div>

      <HeroCarousel>

        <h1 className="max-w-2xl text-4xl text-white sm:text-5xl">
          {t("home_heading")}
        </h1>
        <p className="max-w-xl text-white/80">
          {t("home_sub")}
        </p>
        <div className="flex gap-gutter">
          <Link to="/vehicles" className="btn-primary">{t("home_cta_browse")}</Link>
          <Link to="/vehicles/new" className="btn-secondary bg-transparent text-white hover:bg-white/10">
            {t("home_cta_list")}
          </Link>
        </div>
      </HeroCarousel>


      <section className="section-wrap py-section">
        <h2 className="mb-gutter-lg text-center text-3xl">{t("home_how_it_works")}</h2>
        <div className="grid gap-gutter sm:grid-cols-3">
          {STEPS.map((step, i) => <div key={step.titleKey} className="card p-gutter text-center">
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display font-semibold text-white">
                {i + 1}
              </div>
              <h3 className="mb-1 text-lg font-semibold">{t(step.titleKey)}</h3>
              <p className="text-sm text-brand-navy/60">{t(step.bodyKey)}</p>
            </div>)}
        </div>
      </section>


      <section className="bg-brand-navy-light">
        <div className="section-wrap flex flex-col items-center justify-between gap-gutter py-section-lg text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">{t("home_convoy_heading")}</h2>
            <p className="mt-2 max-w-xl text-white/70">
              {t("home_convoy_body")}
            </p>
          </div>
          <Link to="/events/new" className="btn-primary whitespace-nowrap">{t("home_convoy_cta")}</Link>
        </div>
      </section>


      <section className="section-wrap pb-section">
        <div className="mb-gutter-lg flex items-center justify-between">
          <h2 className="text-3xl">{t("home_featured")}</h2>
          <Link to="/vehicles" className="text-sm font-medium text-accent hover:underline">
            {t("home_see_all")} &rarr;
          </Link>
        </div>

        {loading ? <LoadingSpinner label="Loading featured cars..." /> : vehicles.length === 0 ? <p className="text-brand-navy/60">{t("home_no_cars")}</p> : <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} />)}
          </div>}
      </section>
    </div>;
}
