import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import DriverPicker from "../components/DriverPicker";
import { isValidKenyanPhone } from "../constants";
export default function BookingNew() {
  const {
    id
  } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(location.state?.vehicle || null);
  const [loading, setLoading] = useState(!location.state?.vehicle);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [hireType, setHireType] = useState("self_drive");
  const [driverId, setDriverId] = useState(null);
  const [driverDailyRate, setDriverDailyRate] = useState(0);
  const [contactPhone, setContactPhone] = useState("");
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!vehicle) {
      api.get(`/vehicles/${id}`).then(res => setVehicle(res.data)).finally(() => setLoading(false));
    }
  }, [id, vehicle]);
  useEffect(() => {
    if (hireType === "chauffeur" && driverId) {
      api.get("/drivers").then(res => {
        const match = res.data.find(d => d.id === driverId);
        setDriverDailyRate(match ? match.daily_rate : 0);
      });
    } else {
      setDriverDailyRate(0);
    }
  }, [hireType, driverId]);
  const days = startDate && endDate ? Math.max(0, Math.round((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))) : 0;
  const vehicleCost = vehicle ? days * vehicle.daily_rate : 0;
  const driverCost = hireType === "chauffeur" ? days * driverDailyRate : 0;
  const totalPrice = vehicleCost + driverCost;
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isValidKenyanPhone(contactPhone)) {
      setError("Enter a valid contact number in the format +254 followed by 9 digits, e.g. +254795038762.");
      return;
    }
    if (!disclaimerAccepted) {
      setError("You must accept the damage liability disclaimer to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/bookings", {
        vehicle_id: Number(id),
        start_date: startDate,
        end_date: endDate,
        notes,
        hire_type: hireType,
        driver_id: hireType === "chauffeur" ? driverId : null,
        contact_phone: contactPhone
      });
      navigate("/bookings", {
        state: {
          success: true
        }
      });
    } catch (err) {
      if (err.response?.status === 409) {
        setError("These dates are already taken, please choose different dates.");
      } else {
        setError(err.response?.data?.error || "Could not create booking");
      }
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) return <LoadingSpinner label="Loading vehicle..." />;
  if (!vehicle) return <p className="section-wrap py-section text-brand-navy/60">Vehicle not found.</p>;
  return <div className="section-wrap max-w-xl py-section">
      <Link to={`/vehicles/${id}`} className="mb-gutter inline-block text-sm text-accent hover:underline">&larr; Back to listing</Link>
      <h1 className="mb-1 text-3xl">{vehicle.make} {vehicle.model}</h1>
      <p className="mb-gutter text-brand-navy/60">KES {Number(vehicle.daily_rate).toLocaleString()}/day</p>

      <form onSubmit={handleSubmit} className="card space-y-gutter p-gutter-lg">
        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        <div className="grid gap-gutter sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Start date</label>
            <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">End date</label>
            <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
          </div>
        </div>

        <DriverPicker hireType={hireType} setHireType={setHireType} driverId={driverId} setDriverId={setDriverId} />

        <div>
          <label className="mb-1 block text-sm font-medium">Contact phone number</label>
          <input type="tel" required value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+254795038762" pattern="^\+254\d{9}$" className="input-field" />
          <p className="mt-1 text-xs text-brand-navy/50">Format: +254 followed by 9 digits, e.g. +254795038762.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Notes (optional)</label>
          <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} className="input-field" />
        </div>

        {days > 0 && <div className="space-y-1 rounded-card bg-brand-navy/5 px-4 py-3 text-sm">
            <div className="flex justify-between">
              <span>{days} day{days > 1 ? "s" : ""} &times; KES {Number(vehicle.daily_rate).toLocaleString()} (vehicle)</span>
              <span>KES {vehicleCost.toLocaleString()}</span>
            </div>
            {hireType === "chauffeur" && driverId && <div className="flex justify-between text-brand-navy/70">
                <span>{days} day{days > 1 ? "s" : ""} &times; KES {Number(driverDailyRate).toLocaleString()} (chauffeur)</span>
                <span>KES {driverCost.toLocaleString()}</span>
              </div>}
            <div className="flex justify-between border-t border-brand-navy/10 pt-1 font-semibold text-accent">
              <span>Total</span>
              <span>KES {totalPrice.toLocaleString()}</span>
            </div>
          </div>}

        <label className="flex items-start gap-3 rounded-card bg-amber-50 p-gutter text-sm text-amber-900">
          <input type="checkbox" checked={disclaimerAccepted} onChange={e => setDisclaimerAccepted(e.target.checked)} className="mt-0.5" />
          <span>
            I understand that any damage to this vehicle during the rental period will be charged according to
            the extent of the damage, and that I - as the person making this booking - am responsible for that cost.
          </span>
        </label>

        <button type="submit" disabled={submitting || days <= 0 || hireType === "chauffeur" && !driverId} className="btn-primary w-full">
          {submitting ? "Booking..." : "Book now"}
        </button>
      </form>
    </div>;
}
