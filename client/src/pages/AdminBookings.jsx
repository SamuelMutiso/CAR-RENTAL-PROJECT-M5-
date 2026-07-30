import { useEffect, useState } from "react";
import api from "../api";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  function load() {
    setLoading(true);
    api.get("/admin/bookings", {
      params: {
        page
      }
    }).then(res => {
      setBookings(res.data.bookings);
      setTotalPages(res.data.total_pages);
    }).finally(() => setLoading(false));
  }
  useEffect(load, [page]);
  async function setStatus(id, status, confirmMessage) {
    if (confirmMessage && !confirm(confirmMessage)) return;
    try {
      await api.put(`/bookings/${id}`, {
        status
      });
    } catch {
      alert("Could not update this booking.");
    }
    load();
  }
  if (loading) return <LoadingSpinner label="Loading bookings..." />;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">All bookings</h1>

      <div className="card overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-navy/5 text-xs uppercase text-brand-navy/60">
            <tr>
              <th className="px-4 py-3">Vehicle</th>
              <th className="px-4 py-3">Renter</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/10">
            {bookings.map(b => <tr key={b.id}>
                <td className="px-4 py-3">{b.vehicle_make} {b.vehicle_model}</td>
                <td className="px-4 py-3">{b.renter_name}</td>
                <td className="px-4 py-3">{b.start_date} &rarr; {b.end_date}</td>
                <td className="px-4 py-3">KES {Number(b.total_price).toLocaleString()}</td>
                <td className="px-4 py-3">
                  {b.payment_status === "paid" ? <span className="text-xs font-semibold text-green-700">Paid (M-Pesa)</span> : <span className="text-xs font-semibold text-amber-700">Pending</span>}
                </td>
                <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                <td className="space-x-3 px-4 py-3">
                  {b.status === "pending" && <>
                      <button onClick={() => setStatus(b.id, "confirmed")} className="text-accent hover:underline">
                        Approve
                      </button>
                      <button onClick={() => setStatus(b.id, "cancelled", "Decline this booking request?")} className="text-red-600 hover:underline">
                        Decline
                      </button>
                    </>}
                  {(b.status === "confirmed" || b.status === "active") && <button onClick={() => setStatus(b.id, "cancelled", "Force cancel this booking?")} className="text-red-600 hover:underline">
                      Force cancel
                    </button>}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && <div className="mt-gutter flex items-center justify-center gap-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Previous
          </button>
          <span className="text-sm text-brand-navy/60">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary py-2 text-sm disabled:opacity-40">
            Next
          </button>
        </div>}
    </div>;
}
