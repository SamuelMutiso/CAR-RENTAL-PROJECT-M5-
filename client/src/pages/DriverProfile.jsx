import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { driverApi } from "../api";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";
import PasswordInput from "../components/PasswordInput";
export default function DriverProfile() {
  const { driver, driverLogout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
  return <div className="section-wrap max-w-2xl py-section">
      <div className="mb-gutter flex items-center justify-between">
        <h1 className="text-3xl">My profile</h1>
        <Link to="/driver-portal" className="text-sm text-accent hover:underline">Back to jobs</Link>
      </div>

      <div className="card space-y-gutter p-gutter-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-xl font-semibold uppercase text-white">
            {driver?.name?.[0] || "D"}
          </div>
          <div>
            <p className="text-lg font-semibold">{driver?.name}</p>
            <RatingStars rating={driver?.rating || 0} />
          </div>
        </div>

        <dl className="grid gap-gutter sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-navy/50">Email</dt>
            <dd className="mt-0.5 text-sm">{driver?.email || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-navy/50">Phone</dt>
            <dd className="mt-0.5 text-sm">{driver?.phone || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-navy/50">License number</dt>
            <dd className="mt-0.5 text-sm">{driver?.license_number || "-"}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-brand-navy/50">Daily rate</dt>
            <dd className="mt-0.5 text-sm">KES {driver?.daily_rate?.toLocaleString?.() || driver?.daily_rate || "-"}</dd>
          </div>
          {driver?.bio && <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-brand-navy/50">Bio</dt>
              <dd className="mt-0.5 text-sm">{driver.bio}</dd>
            </div>}
        </dl>

        <button onClick={handleLogout} className="btn-secondary">Log out</button>
      </div>

      <div className="mt-gutter-lg card space-y-gutter p-gutter-lg">
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
      </div>
    </div>;
}
