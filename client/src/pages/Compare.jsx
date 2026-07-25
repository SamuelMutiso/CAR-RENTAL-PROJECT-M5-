import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { useCompare } from "../context/CompareContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ROWS = [
  { label: "Body", key: "category" },
  { label: "Make", key: "make" },
  { label: "Model", key: "model" },
  { label: "Year", key: "year" },
  { label: "Daily rate", key: "daily_rate", format: (v) => `KES ${Number(v).toLocaleString()}/day` },
  { label: "Mileage", key: "mileage", format: (v) => `${Number(v).toLocaleString()} km` },
  { label: "Condition", key: "condition" },
  { label: "Fuel type", key: "fuel_type" },
  { label: "Transmission", key: "transmission" },
  { label: "Drive", key: "drive" },
  { label: "Exterior color", key: "exterior_color" },
  { label: "Location", key: "location" },
];

const fallbackImage = "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=600&q=60";

export default function Compare() {
  const { compareIds, removeFromCompare } = useCompare();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareIds.length === 0) {
      setVehicles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(
      compareIds.map((id) => api.get(`/vehicles/${id}`).then((res) => res.data).catch(() => null))
    ).then((results) => {
      results.forEach((v, i) => {
        if (!v) removeFromCompare(compareIds[i]);
      });
      setVehicles(results.filter(Boolean));
    }).finally(() => setLoading(false));
  }, [compareIds.join(",")]);

  const slots = Array.from({ length: 3 }, (_, i) => vehicles[i] || null);

  return (
    <div className="section-wrap py-section">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-navy/50">
        <Link to="/" className="hover:text-brand-navy">GearShift</Link>
        <span className="mx-2">&gt;</span>
        Compare
      </p>

      <div className="mb-gutter-lg">
        <h1 className="font-display text-4xl font-bold uppercase leading-tight">
          Compare<br />Vehicles
        </h1>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          <span className="h-1 w-8 rounded bg-accent" />
          <span className="h-1 w-4 rounded bg-accent" />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading comparison..." />
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[760px] grid-cols-[160px_repeat(3,1fr)] gap-x-gutter">
            <div />
            {slots.map((vehicle, i) => (
              <div key={vehicle?.id ?? `empty-${i}`}>
                {vehicle ? (
                  <div>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => removeFromCompare(vehicle.id)}
                        title="Remove from compare"
                        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow-card transition hover:bg-white"
                      >
                        &times;
                      </button>
                      <Link to={`/vehicles/${vehicle.id}`}>
                        <img
                          src={vehicle.image_url || fallbackImage}
                          alt={`${vehicle.make} ${vehicle.model}`}
                          className="aspect-[4/3] w-full rounded-card object-cover"
                          onError={(e) => { e.currentTarget.src = fallbackImage; }}
                        />
                      </Link>
                    </div>

                    <div className="relative mt-3 pr-20">
                      <Link to={`/vehicles/${vehicle.id}`} className="hover:underline">
                        <h3 className="font-display text-sm font-bold uppercase leading-snug">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                      </Link>
                      <span
                        className="absolute right-0 top-0 -mr-1 whitespace-nowrap bg-accent py-1.5 pl-4 pr-3 text-xs font-bold text-white"
                        style={{ clipPath: "polygon(10px 0, 100% 0, 100% 100%, 10px 100%, 0 50%)" }}
                      >
                        KES {Number(vehicle.daily_rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <Link to="/vehicles" className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-card bg-brand-navy/5 text-center text-xs font-semibold uppercase tracking-wide text-brand-navy/40 transition hover:bg-brand-navy/10">
                    <span className="text-3xl leading-none" aria-hidden="true">+</span>
                    Add car to compare
                  </Link>
                )}
              </div>
            ))}

            {ROWS.map((row) => (
              <div key={row.key} className="contents">
                <div className="border-b border-brand-navy/10 py-3 text-xs font-semibold uppercase tracking-wide text-brand-navy/40">
                  {row.label}
                </div>
                {slots.map((vehicle, i) => (
                  <div key={vehicle?.id ?? `empty-${i}`} className="border-b border-brand-navy/10 py-3 text-sm font-semibold text-brand-navy">
                    {vehicle ? (row.format ? row.format(vehicle[row.key]) : vehicle[row.key]) : "—"}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}