import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleRequestToken(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/reset-password", {
        email
      });
      setToken(res.data.reset_token || "");
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  async function handleConfirm(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/reset-password/confirm", {
        token,
        new_password: newPassword
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed - the token may have expired");
    } finally {
      setLoading(false);
    }
  }
  return <div className="section-wrap flex min-h-[70vh] items-center justify-center py-section">
      <div className="card w-full max-w-md space-y-gutter p-gutter-lg">
        <h1 className="text-2xl">Reset your password</h1>

        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        {step === 1 && <form onSubmit={handleRequestToken} className="space-y-gutter">
            <p className="text-sm text-brand-navy/60">Enter your account email and we'll generate a reset token.</p>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send reset token"}
            </button>
          </form>}

        {step === 2 && <form onSubmit={handleConfirm} className="space-y-gutter">
            {message && <p className="rounded-card bg-brand-navy/5 px-4 py-2.5 text-sm">{message}</p>}
            {token && <p className="break-all rounded-card bg-accent/10 px-4 py-2.5 text-xs text-brand-navy">
                Demo token (would normally be emailed): <span className="font-mono">{token}</span>
              </p>}
            <div>
              <label className="mb-1 block text-sm font-medium">Reset token</label>
              <input required value={token} onChange={e => setToken(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">New password</label>
              <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>}

        <p className="text-sm text-brand-navy/60">
          Remembered it? <Link to="/login" className="text-accent hover:underline">Back to login</Link>
        </p>
      </div>
    </div>;
}
