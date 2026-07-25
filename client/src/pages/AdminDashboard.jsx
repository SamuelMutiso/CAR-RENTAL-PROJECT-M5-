import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([api.get("/admin/stats"), api.get("/admin/bookings")]).then(([statsRes, bookingsRes]) => {
      setStats(statsRes.data);
      setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);
  async function approve(id) {
    await api.put(`/bookings/${id}`, {
      status: "confirmed"
    });
    const res = await api.get("/admin/bookings");
    setRecentBookings(res.data.bookings.slice(0, 5));
  }
  async function decline(id) {
    await api.put(`/bookings/${id}`, {
      status: "cancelled"
    });
    const res = await api.get("/admin/bookings");
    setRecentBookings(res.data.bookings.slice(0, 5));
  }
  if (loading) return <LoadingSpinner label="Loading admin stats..." />;
  const cards = [{
    label: "Total Users",
    value: stats.total_users
  }, {
    label: "Total Vehicles",
    value: stats.total_vehicles
  }, {
    label: "Total Bookings",
    value: stats.total_bookings
  }, {
    label: "Total Revenue",
    value: `KES ${Number(stats.total_revenue).toLocaleString()}`
  }];
  const links = [{
    to: "/admin/users",
    label: "Manage users"
  }, {
    to: "/admin/vehicles",
    label: "Review vehicle listings"
  }, {
    to: "/admin/bookings",
    label: "View all bookings"
  }, {
    to: "/admin/driver-applications",
    label: "Review chauffeur applications"
  }, {
    to: "/admin/contact-messages",
    label: "View contact messages"
  }];
  const pendingCount = recentBookings.filter(b => b.status === "pending").length;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">Admin dashboard</h1>

      <div className="mb-gutter-lg grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(c => <div key={c.label} className="card p-gutter">
            <p className="text-sm text-brand-navy/60">{c.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{c.value}</p>
          </div>)}
      </div>

      
      <div className="mb-gutter-lg card p-gutter">
        <div className="mb-gutter flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Recent booking requests
            {pendingCount > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                {pendingCount} pending
              </span>}
          </h2>
          <Link to="/admin/bookings" className="text-sm font-medium text-accent hover:underline">
            View all &rarr;
          </Link>
        </div>

        {recentBookings.length === 0 ? <p className="text-sm text-brand-navy/60">No bookings yet.</p> : <div className="space-y-3">
            {recentBookings.map(b => <div key={b.id} className="flex flex-col gap-2 rounded-card border border-brand-navy/10 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm">
                  <span className="font-medium">{b.renter_name}</span> booked{" "}
                  <span className="font-medium">{b.vehicle_make} {b.vehicle_model}</span>
                  <span className="text-brand-navy/50"> &middot; {b.start_date} &rarr; {b.end_date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={b.status} />
                  {b.status === "pending" && <>
                      <button onClick={() => approve(b.id)} className="text-sm text-accent hover:underline">
                        Approve
                      </button>
                      <button onClick={() => decline(b.id)} className="text-sm text-red-600 hover:underline">
                        Decline
                      </button>
                    </>}
                </div>
              </div>)}
          </div>}
      </div>

      <div className="card divide-y divide-brand-navy/10">
        {links.map(l => <Link key={l.to} to={l.to} className="block px-gutter py-4 hover:bg-brand-navy/5">
            {l.label} &rarr;
          </Link>)}
      </div>
    </div>;
}
