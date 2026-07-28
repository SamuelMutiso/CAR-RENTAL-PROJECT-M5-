import { useEffect, useState } from "react";
import api from "../api";
import RatingStars from "./RatingStars";
export default function DriverPicker({
  hireType,
  setHireType,
  driverId,
  setDriverId,
  excludeDriverIds = []
}) {
  const [drivers, setDrivers] = useState([]);
  useEffect(() => {
    api.get("/drivers").then(res => setDrivers(res.data)).catch(() => setDrivers([]));
  }, []);
  const availableDrivers = drivers.filter(d => !excludeDriverIds.includes(d.id));
  return <div>
      <label className="mb-1 block text-sm font-medium">Hire type</label>
      <div className="flex gap-3">
        <button type="button" onClick={() => {
        setHireType("self_drive");
        setDriverId(null);
      }} className={`flex-1 rounded-card border px-3 py-2 text-sm transition ${hireType === "self_drive" ? "border-accent bg-accent/10 font-medium text-accent" : "border-brand-navy/15"}`}>
          Self-drive
        </button>
        <button type="button" onClick={() => setHireType("chauffeur")} className={`flex-1 rounded-card border px-3 py-2 text-sm transition ${hireType === "chauffeur" ? "border-accent bg-accent/10 font-medium text-accent" : "border-brand-navy/15"}`}>
          With chauffeur
        </button>
      </div>

      {hireType === "chauffeur" && <div className="mt-3">
          <label className="mb-1 block text-sm font-medium">Choose a chauffeur</label>
          <select required value={driverId || ""} onChange={e => setDriverId(Number(e.target.value))} className="input-field">
            <option value="" disabled>Select a chauffeur...</option>
            {availableDrivers.map(d => <option key={d.id} value={d.id}>
                {d.name} - {d.rating.toFixed(1)}/5 - KES {Number(d.daily_rate).toLocaleString()}/day
              </option>)}
          </select>
          {excludeDriverIds.length > 0 && <p className="mt-1 text-xs text-brand-navy/50">
              Chauffeurs already assigned to another vehicle in this convoy aren't shown - one chauffeur can't be in two cars at once.
            </p>}
          {driverId && drivers.find(d => d.id === driverId) && <div className="mt-1 flex items-center gap-2 text-xs text-brand-navy/60">
              <RatingStars rating={drivers.find(d => d.id === driverId).rating} size="text-sm" />
              <span>Higher-rated chauffeurs cost more per day.</span>
            </div>}
        </div>}
    </div>;
}