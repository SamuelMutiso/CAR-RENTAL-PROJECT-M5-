import { useEffect, useState } from "react";
import {
  KENYAN_CITIES,
  VEHICLE_CATEGORIES,
  VEHICLE_CONDITIONS,
  FUEL_TYPES,
  TRANSMISSIONS,
  DRIVE_TYPES,
  EXTERIOR_COLORS,
  MAX_MILEAGE_OPTIONS,
  VEHICLE_YEARS,
  VEHICLE_MAKES,
  VEHICLE_MAKE_MODELS,
} from "../constants";

const fieldClass =
  "w-full rounded-md border-none bg-brand-navy/5 px-4 py-2.5 text-sm text-brand-navy/80 focus:bg-white";

function Select({ label, value, onChange, options }) {
  return (
    <select aria-label={label} value={value} onChange={onChange} className={fieldClass}>
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  );
}

export default function SearchFilter({ onFilter }) {
  const [condition, setCondition] = useState("");
  const [category, setCategory] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [year, setYear] = useState("");
  const [transmission, setTransmission] = useState("");
  const [drive, setDrive] = useState("");
  const [exteriorColor, setExteriorColor] = useState("");
  const [location, setLocation] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [keyword, setKeyword] = useState("");

  const modelOptions = make
    ? VEHICLE_MAKE_MODELS.filter((m) => m.make === make).map((m) => m.model)
    : [...new Set(VEHICLE_MAKE_MODELS.map((m) => m.model))].sort();

  useEffect(() => {
    if (model && !modelOptions.includes(model)) setModel("");
  }, [make]);

  useEffect(() => {
    const params = {};
    if (condition) params.condition = condition;
    if (category) params.category = category;
    if (make) params.make = make;
    if (model) params.model = model;
    if (maxMileage) params.max_mileage = maxMileage;
    if (fuelType) params.fuel_type = fuelType;
    if (year) params.year = year;
    if (transmission) params.transmission = transmission;
    if (drive) params.drive = drive;
    if (exteriorColor) params.exterior_color = exteriorColor;
    if (location) params.location = location;
    if (maxRate) params.max_rate = maxRate;
    if (keyword) params.q = keyword;
    const timeout = setTimeout(() => onFilter(params), 300);
    return () => clearTimeout(timeout);
  }, [condition, category, make, model, maxMileage, fuelType, year, transmission, drive, exteriorColor, location, maxRate, keyword]);

  function handleReset() {
    setCondition("");
    setCategory("");
    setMake("");
    setModel("");
    setMaxMileage("");
    setFuelType("");
    setYear("");
    setTransmission("");
    setDrive("");
    setExteriorColor("");
    setLocation("");
    setMaxRate("");
    setKeyword("");
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 bg-brand-navy px-gutter py-4 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-6 w-6 shrink-0">
          <path d="M3 12.5l1.4-4.2A2 2 0 0 1 6.3 7h7.4a2 2 0 0 1 1.9 1.3L17 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="2" y="12.5" width="15" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="6" cy="17.5" r="1.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="13" cy="17.5" r="1.4" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="18.5" cy="18.5" r="4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M21.5 21.5L23.5 23.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <h3 className="font-display text-base font-semibold">Search Options</h3>
      </div>

      <div className="space-y-3 p-gutter">
        <div className="grid grid-cols-2 gap-3">
          <Select label="Condition" value={condition} onChange={(e) => setCondition(e.target.value)} options={VEHICLE_CONDITIONS} />
          <Select label="Body" value={category} onChange={(e) => setCategory(e.target.value)} options={VEHICLE_CATEGORIES} />

          <Select label="Make" value={make} onChange={(e) => setMake(e.target.value)} options={VEHICLE_MAKES} />
          <Select label="Model" value={model} onChange={(e) => setModel(e.target.value)} options={modelOptions} />

          <select aria-label="Max Mileage" value={maxMileage} onChange={(e) => setMaxMileage(e.target.value)} className={fieldClass}>
            <option value="">Max Mileage</option>
            {MAX_MILEAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Select label="Fuel type" value={fuelType} onChange={(e) => setFuelType(e.target.value)} options={FUEL_TYPES} />

          <Select label="Year" value={year} onChange={(e) => setYear(e.target.value)} options={VEHICLE_YEARS.map(String)} />
          <Select label="Transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} options={TRANSMISSIONS} />

          <Select label="Drive" value={drive} onChange={(e) => setDrive(e.target.value)} options={DRIVE_TYPES} />
          <Select label="Exterior Color" value={exteriorColor} onChange={(e) => setExteriorColor(e.target.value)} options={EXTERIOR_COLORS} />

          <Select label="Location" value={location} onChange={(e) => setLocation(e.target.value)} options={KENYAN_CITIES} />
          <select aria-label="Price range" value={maxRate} onChange={(e) => setMaxRate(e.target.value)} className={fieldClass}>
            <option value="">Max KES/day</option>
            {[2000, 5000, 10000, 15000, 20000, 25000].map((v) => (
              <option key={v} value={v}>Under {v.toLocaleString()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-brand-navy/70">Search by keywords</label>
          <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Search..." className={fieldClass} />
        </div>

        <button onClick={handleReset} className="w-full rounded-md bg-accent py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-accent-dark">
          Reset All
        </button>
      </div>
    </div>
  );
}