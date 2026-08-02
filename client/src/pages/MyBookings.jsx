import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import usePolling from "../hooks/usePolling";
export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  function load(showSpinner = true) {
    if (showSpinner) setLoading(true);
    api.get("/bookings/me").then(res => setBookings(res.data)).finally(() => {
      if (showSpinner) setLoading(false);
    });
  }
  useEffect(() => load(), []);
  // Live-update: pick up status changes (e.g. owner/admin confirms or
  // cancels a booking) without the user needing to refresh the page.
  usePolling(() => load(false), 5000);
  async function cancelBooking(id, startDate) {
    const isPickupDay = startDate === new Date().toISOString().slice(0, 10);
    const confirmMessage = isPickupDay ? "This is your pickup day - cancelling now incurs a 10% cancellation fee. Continue?" : "Cancel this booking? You'll receive a full refund since it's before your pickup date.";
    if (!confirm(confirmMessage)) return;
    try {
      await api.put(`/bookings/${id}`, {
        status: "cancelled"
      });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Could not cancel this booking.");
    }
  }
  async function submitReview(id, rating) {
    await api.put(`/bookings/${id}`, {
      review_rating: rating
    });
    setReviewingId(null);
    load();
  }
  if (loading) return <LoadingSpinner label="Loading your bookings..." />;
  return <div className="section-wrap py-section">
      <h1 className="mb-gutter-lg text-3xl">My bookings</h1>

      {bookings.length === 0 ? <div className="card p-section text-center text-brand-navy/60">
          No bookings yet. <Link to="/vehicles" className="text-accent hover:underline">Browse cars</Link> to get started.
        </div> : <div className="space-y-gutter">
          {bookings.map(b => <div key={b.id} className="card flex flex-col gap-gutter p-gutter sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-lg font-semibold">{b.vehicle_make} {b.vehicle_model}</p>
                  {b.is_convoy && <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-accent">
                      {b.event_type?.replace("_", " ")} convoy
                    </span>}
                </div>
                <p className="text-sm text-brand-navy/60">{b.start_date} &rarr; {b.end_date}</p>
                {b.traveller_service && <p className="text-sm text-brand-navy/60">
                    {b.pickup_location && <>From {b.pickup_location} </>}
                    {b.dropoff_location && <>&rarr; {b.dropoff_location} </>}
                    {b.meet_and_greet && <>&middot; Meet &amp; greet</>}
                  </p>}
                <p className="text-sm text-brand-navy/60">
                  {b.hire_type === "chauffeur" ? `With chauffeur${b.driver_name ? ` - ${b.driver_name}` : ""}` : "Self-drive"}
                  
                  {b.hire_type === "chauffeur" && b.driver_status && <span className="ml-2">
                      <StatusBadge status={b.driver_status} />
                    </span>}
                </p>
                <p className="text-sm font-semibold text-accent">
                  KES {Number(b.total_price).toLocaleString()}
                  {b.discount_percent > 0 && <span className="ml-1 text-xs font-normal text-green-700">({b.discount_percent}% convoy discount applied)</span>}
                </p>
                {b.payment_status === "paid" ? <p className="text-xs font-medium text-green-700">Paid via M-Pesa{b.mpesa_phone ? ` · ${b.mpesa_phone}` : ""}</p> : <p className="text-xs font-medium text-amber-700">Payment pending</p>}
                {b.status === "cancelled" && <p className="text-xs font-medium text-brand-navy/60">
                    {b.cancellation_penalty_percent > 0 ? `Cancelled on pickup day - ${b.cancellation_penalty_percent}% fee applied` : "Cancelled - fully refunded"}
                  </p>}
              </div>

              <div className="flex items-center gap-gutter">
                <StatusBadge status={b.status} />

                {(b.status === "pending" || b.status === "confirmed") && <button onClick={() => cancelBooking(b.id, b.start_date)} className="btn-secondary py-2 text-sm">Cancel</button>}

                {b.status === "completed" && !b.review_rating && reviewingId !== b.id && <button onClick={() => setReviewingId(b.id)} className="btn-secondary py-2 text-sm">Leave a review</button>}

                {reviewingId === b.id && <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => <button key={n} onClick={() => submitReview(b.id, n)} className="text-xl text-accent" title={`${n} stars`}>
                        *
                      </button>)}
                  </div>}

                {b.review_rating && <span className="text-sm text-brand-navy/60">You rated: {"*".repeat(b.review_rating)}</span>}
              </div>
            </div>)}
        </div>}
    </div>;
}
