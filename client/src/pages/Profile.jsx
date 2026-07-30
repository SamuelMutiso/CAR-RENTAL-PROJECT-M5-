import { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";
export default function Profile() {
  const {
    user,
    updateUser
  } = useAuth();
  const [licenseNumber, setLicenseNumber] = useState(user?.license_number || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rentalIntent, setRentalIntent] = useState(user?.rental_intent || "both");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
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
      await api.put("/me/password", {
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
  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const res = await api.put("/me", {
        license_number: licenseNumber,
        email,
        rental_intent: rentalIntent
      });
      updateUser(res.data);
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.error || "Could not save changes");
    } finally {
      setSaving(false);
    }
  }
  const verificationStyle = user?.verification_status === "verified" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";
  return <div className="section-wrap max-w-2xl py-section">
      <h1 className="mb-gutter text-3xl">My profile</h1>

      <div className="card space-y-gutter p-gutter-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RatingStars rating={user?.rating || 0} />
            <span className="text-sm text-brand-navy/60">({(user?.rating || 0).toFixed(1)})</span>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${verificationStyle}`}>
            {user?.verification_status}
          </span>
        </div>

        {message && <p className="rounded-card bg-green-50 px-4 py-2.5 text-sm text-green-700">{message}</p>}
        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSave} className="space-y-gutter">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Driving license number</label>
            <input value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="input-field" placeholder="e.g. DL-100234" />
          </div>

          {user?.role !== "admin" && <div>
              <label className="mb-1 block text-sm font-medium">I want to</label>
              <div className="flex gap-3">
                {[{
              value: "renter",
              label: "Rent cars"
            }, {
              value: "owner",
              label: "List my car"
            }, {
              value: "both",
              label: "Both"
            }].map(opt => <button type="button" key={opt.value} onClick={() => setRentalIntent(opt.value)} className={`flex-1 rounded-card border px-3 py-2 text-sm transition ${rentalIntent === opt.value ? "border-accent bg-accent/10 font-medium text-accent" : "border-brand-navy/15"}`}>
                    {opt.label}
                  </button>)}
              </div>
              <p className="mt-1 text-xs text-brand-navy/50">Controls which nav links you see (My bookings vs List a car).</p>
            </div>}

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>

      <div className="mt-gutter-lg card space-y-gutter p-gutter-lg">
        <h2 className="text-lg font-semibold">Change password</h2>

        {passwordMessage && <p className="rounded-card bg-green-50 px-4 py-2.5 text-sm text-green-700">{passwordMessage}</p>}
        {passwordError && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{passwordError}</p>}

        <form onSubmit={handleChangePassword} className="space-y-gutter">
          <div>
            <label className="mb-1 block text-sm font-medium">Current password</label>
            <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input-field" />
          </div>
          <div className="grid gap-gutter sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">New password</label>
              <input type="password" required minLength={5} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm new password</label>
              <input type="password" required minLength={5} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={changingPassword} className="btn-primary">
            {changingPassword ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>;
}
