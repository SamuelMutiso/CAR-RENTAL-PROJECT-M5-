import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { driverApi } from "../api";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import RatingStars from "../components/RatingStars";
import PasswordInput from "../components/PasswordInput";
export default function DriverPortal() {
  const {
    driver,
    driverLogout
  } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingOn, setActingOn] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  function load() {
    setLoading(true);
    driverApi.get("/driver/bookings").then(res => setBookings(res.data)).finally(() => setLoading(false));
  }
  useEffect(load, []);
  async function respond(bookingId, status) {
    setActingOn(bookingId);
    try {
      await driverApi.put(`/driver/bookings/${bookingId}`, {
        driver_status: status
      });
      load();
    } finally {
      setActingOn(null);
    }
  }
  function handleLogout() {
    driverLogout();
    navigate("/driver-login");
  }
  async function handleChangePassword(e) {
    e.preventDefault();
    setChangingPassword(true);
    setPasswordError("");
    setPasswordMessage("");
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match");
      setChangingPassword(false);
      return;
    }
    try {
      await driverApi.put("/driver/password", {
        current_password: currentPassword,
        new_password: newPassword
      });
      setPasswordMessage("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.response?.data?.error || err.response?.data?.errors?.new_password?.[0] || "Could not update password");
    } finally {
      setChangingPassword(false);
    }
  }
  const pending = bookings.filter(b => b.driver_status === "pending");
  const responded = bookings.filter(b => b.driver_status !== "pending");
  return <div className="section-wrap py-section">
      <div className="mb-gutter-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl">Welcome, {driver?.name}</h1>
          <RatingStars rating={driver?.rating || 0} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowPasswordForm(v => !v)} className="btn-secondary">
            {showPasswordForm ? "Close" : "Change password"}
          </button>
          <button onClick={handleLogout} className="btn-secondary">Log out</button>
        </div>
      </div>

      {showPasswordForm && <div className="mb-gutter-lg card space-y-gutter p-gutter-lg">
          <div>
            <h2 className="text-lg font-semibold">Change password</h2>
            <p className="text-sm text-brand-navy/60">Logging in with a default password? Set your own here.</p>
          </div>

          {passwordMessage && <p className="rounded-card bg-green-50 px-4 py-2.5 text-sm text-green-700">{passwordMessage}</p>}
          {passwordError && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{passwordError}</p>}

          <form onSubmit={handleChangePassword} className="space-y-gutter">
            <div>
              <label className="mb-1 block text-sm font-medium">Current password</label>
              <PasswordInput required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            </div>
            <div className="grid gap-gutter sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">New password</label>
                <PasswordInput required minLength={5} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Confirm new password</label>
                <PasswordInput required minLength={5} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={changingPassword} className="btn-primary">
              {changingPassword ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>}

      {loading ? <LoadingSpinner label="Loading your jobs..." /> : <div className="space-y-gutter-lg">
          <section>
            <h2 className="mb-gutter text-lg font-semibold">
              Awaiting your response
              {pending.length > 0 && <span className="ml-2 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  {pending.length}
                </span>}
            </h2>
            {pending.length === 0 ? <p className="text-sm text-brand-navy/60">No new job requests right now.</p> : <div className="space-y-gutter">
                {pending.map(b => <div key={b.id} className="card flex flex-col gap-3 p-gutter sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                      <p className="font-semibold">{b.vehicle_make} {b.vehicle_model}</p>
                      <p className="text-brand-navy/60">
                        {b.start_date} &rarr; {b.end_date}
                        {b.event_type && b.event_type !== "other" && ` · ${b.event_type.replace("_", " ")}`}
                      </p>
                      {b.traveller_service && <p className="text-brand-navy/60">
                          {b.pickup_location && <>From {b.pickup_location} </>}
                          {b.dropoff_location && <>&rarr; {b.dropoff_location} </>}
                          {b.meet_and_greet && <>&middot; Meet &amp; greet</>}
                        </p>}
                      <p className="text-brand-navy/60">Contact: {b.contact_phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button disabled={actingOn === b.id} onClick={() => respond(b.id, "accepted")} className="btn-primary py-2">
                        Accept
                      </button>
                      <button disabled={actingOn === b.id} onClick={() => respond(b.id, "declined")} className="btn-secondary py-2 text-red-600">
                        Decline
                      </button>
                    </div>
                  </div>)}
              </div>}
          </section>

          <section>
            <h2 className="mb-gutter text-lg font-semibold">Job history</h2>
            {responded.length === 0 ? <p className="text-sm text-brand-navy/60">Nothing here yet.</p> : <div className="space-y-gutter">
                {responded.map(b => <div key={b.id} className="card flex flex-col gap-2 p-gutter sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm">
                      <p className="font-semibold">{b.vehicle_make} {b.vehicle_model}</p>
                      <p className="text-brand-navy/60">{b.start_date} &rarr; {b.end_date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={b.driver_status} />
                      <StatusBadge status={b.status} />
                    </div>
                  </div>)}
              </div>}
          </section>
        </div>}
    </div>;
}
