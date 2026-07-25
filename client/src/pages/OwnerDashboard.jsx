import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
const FALLBACK_IMG = "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=300&q=60";
export default function OwnerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  function load() {
    setLoadingBookings(true);
    api.get("/bookings/owner").then(res => setBookings(res.data)).finally(() => setLoadingBookings(false));
  }
  function loadVehicles() {
    setLoadingVehicles(true);
    api.get("/vehicles/mine").then(res => setVehicles(res.data)).finally(() => setLoadingVehicles(false));
  }
  useEffect(load, []);
  useEffect(loadVehicles, []);
  async function setStatus(id, status) {
    await api.put(`/bookings/${id}`, {
      status
    });
    load();
  }
  async function deleteVehicle(id) {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    await api.delete(`/vehicles/${id}`);
    loadVehicles();
  }
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">Owner dashboard</h1>

      <section className="mb-section-lg">
        <div className="mb-gutter flex items-center justify-between">
          <h2 className="text-lg font-semibold">My listings</h2>
          <Link to="/vehicles/new" className="text-sm font-medium text-accent hover:underline">
            + List a new vehicle
          </Link>
        </div>

        {loadingVehicles ? <LoadingSpinner label="Loading your listings..." /> : vehicles.length === 0 ? <div className="card p-section text-center text-brand-navy/60">
            You haven't listed any vehicles yet.
          </div> : <div className="space-y-gutter">
            {vehicles.map(v => <div key={v.id} className="card flex flex-col gap-gutter p-gutter sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <img src={v.image_url || FALLBACK_IMG} alt="" className="h-14 w-20 rounded-md object-cover" onError={e => {
              e.currentTarget.src = FALLBACK_IMG;
            }} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display font-semibold">{v.make} {v.model}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${v.is_approved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                        {v.is_approved ? "Approved" : "Pending approval"}
                      </span>
                      {!v.is_available && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700">Unavailable</span>}
                    </div>
                    <p className="text-sm text-brand-navy/60">{v.category} &middot; KES {Number(v.daily_rate).toLocaleString()}/day</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/vehicles/${v.id}/edit`} className="btn-secondary py-2 text-sm">Edit</Link>
                  <button onClick={() => deleteVehicle(v.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>)}
          </div>}
      </section>

      <h2 className="mb-gutter text-lg font-semibold">Booking requests</h2>
      {loadingBookings ? <LoadingSpinner label="Loading booking requests..." /> : bookings.length === 0 ? <div className="card p-section text-center text-brand-navy/60">
          No booking requests yet for your listings.
        </div> : <div className="space-y-gutter">
          {bookings.map(b => <div key={b.id} className="card flex flex-col gap-gutter p-gutter sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-lg font-semibold">{b.vehicle_make} {b.vehicle_model}</p>
                <p className="text-sm text-brand-navy/60">Renter: {b.renter_name}</p>
                <p className="text-sm text-brand-navy/60">{b.start_date} &rarr; {b.end_date}</p>
                <p className="text-sm font-semibold text-accent">KES {Number(b.total_price).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-gutter">
                <StatusBadge status={b.status} />

                {b.status === "pending" && <>
                    <button onClick={() => setStatus(b.id, "confirmed")} className="btn-primary py-2 text-sm">Confirm</button>
                    <button onClick={() => setStatus(b.id, "cancelled")} className="btn-secondary py-2 text-sm">Decline</button>
                  </>}

                {b.status === "confirmed" && <button onClick={() => setStatus(b.id, "completed")} className="btn-secondary py-2 text-sm">Mark as completed</button>}
              </div>
            </div>)}
        </div>}
    </div>;
}
