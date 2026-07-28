import { useNavigate } from "react-router-dom";
import FeatureBadge from "./FeatureBadge";
import { useCompare } from "../context/CompareContext";

export default function VehicleCard({ vehicle }) {
  const navigate = useNavigate();
  const { compareIds, toggleCompare, maxCompare } = useCompare();
  const isComparing = compareIds.includes(vehicle.id);
  const compareFull = !isComparing && compareIds.length >= maxCompare;
  const fallbackImage = "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=600&q=60";

  return (
    <div onClick={() => navigate(`/vehicles/${vehicle.id}`)} className="card group cursor-pointer overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-navy/5">
        <img
          src={vehicle.image_url || fallbackImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover transition group-hover:scale-105"
          onError={(e) => { e.currentTarget.src = fallbackImage; }}
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); if (!compareFull) toggleCompare(vehicle.id); }}
          disabled={compareFull}
          title={compareFull ? `You can compare up to ${maxCompare} cars` : isComparing ? "Remove from compare" : "Add to compare"}
          className={`absolute right-2 top-2 rounded-full px-3 py-1.5 text-xs font-semibold shadow-card transition ${isComparing ? "bg-accent text-white" : "bg-white/90 text-brand-navy hover:bg-white"} ${compareFull ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isComparing ? "Comparing" : "+ Compare"}
        </button>
      </div>

      <div className="space-y-2 p-gutter">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-semibold">
            {vehicle.make} {vehicle.model}
          </h3>
          <span className="whitespace-nowrap font-semibold text-accent">
            KES {Number(vehicle.daily_rate).toLocaleString()}/day
          </span>
        </div>

        <p className="flex items-center gap-1 text-sm text-brand-navy/60">
          {vehicle.location}
        </p>

        {vehicle.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {vehicle.features.slice(0, 3).map((f) => (
              <FeatureBadge key={f.id ?? f.name} feature={f} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}