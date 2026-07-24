import { useEffect, useState } from "react";
import api from "../api";
import { KENYAN_CITIES, VEHICLE_CATEGORIES, VEHICLE_YEARS } from "../constants";

export default function VehicleForm({ initialData, onSubmit, submitLabel }) {
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: 2022,
    daily_rate: "",
    location: KENYAN_CITIES[0],
    category: VEHICLE_CATEGORIES[0],
    image_url: "",
    description: "",
    features: [],
  });
  const [allFeatures, setAllFeatures] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/features").then((res) => setAllFeatures(res.data)).catch(() => setAllFeatures([]));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        features: initialData.features?.map((f) => f.id) || [],
      });
    }
  }, [initialData]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleFeature(id) {
    setForm((f) => ({
      ...f,
      features: f.features.includes(id) ? f.features.filter((x) => x !== id) : [...f.features, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await onSubmit(form);
      setSuccess("Your listing has been submitted for approval.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save this listing");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-gutter p-gutter-lg">
      {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
      {success && <p className="rounded-card bg-green-50 px-4 py-2.5 text-sm text-green-700">{success}</p>}

      <div className="grid gap-gutter sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Make</label>
          <input required value={form.make} onChange={(e) => handleChange("make", e.target.value)} className="input-field" placeholder="Toyota" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Model</label>
          <input required value={form.model} onChange={(e) => handleChange("model", e.target.value)} className="input-field" placeholder="RAV4" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Year</label>
          <select value={form.year} onChange={(e) => handleChange("year", Number(e.target.value))} className="input-field">
            {VEHICLE_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Daily rate (KES)</label>
          <input type="number" min="0" required value={form.daily_rate} onChange={(e) => handleChange("daily_rate", e.target.value)} className="input-field" placeholder="4500" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Location</label>
          <select value={form.location} onChange={(e) => handleChange("location", e.target.value)} className="input-field">
            {KENYAN_CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Category</label>
          <select value={form.category} onChange={(e) => handleChange("category", e.target.value)} className="input-field">
            {VEHICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Image URL</label>
        <input value={form.image_url || ""} onChange={(e) => handleChange("image_url", e.target.value)} className="input-field" placeholder="https://..." />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea rows={4} value={form.description || ""} onChange={(e) => handleChange("description", e.target.value)} className="input-field" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Features</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allFeatures.map((f) => (
            <label key={f.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.features.includes(f.id)} onChange={() => toggleFeature(f.id)} />
              {f.name}
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}