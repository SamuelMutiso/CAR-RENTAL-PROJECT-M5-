import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { AUTH_BG_IMAGES } from "../constants";
const INTENT_OPTIONS = [{
  value: "renter",
  label: "Rent cars"
}, {
  value: "owner",
  label: "List my car"
}, {
  value: "both",
  label: "Both"
}];
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [intent, setIntent] = useState("both");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/register", {
        email,
        password,
        role: "client",
        rental_intent: intent
      });
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="relative min-h-[80vh] overflow-hidden">
      
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        {AUTH_BG_IMAGES.map(url => <div key={url} className="bg-cover bg-center" style={{
        backgroundImage: `url("${url}")`
      }} />)}
      </div>
      <div className="absolute inset-0 bg-brand-navy-dark/85" />

      <div className="section-wrap relative flex min-h-[80vh] items-center justify-center py-section">
        <div className="card w-full max-w-md space-y-gutter p-gutter-lg">
          <h1 className="text-2xl">Create your account</h1>

          {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-gutter">
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm password</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">I want to</label>
              <div className="flex gap-3">
                {INTENT_OPTIONS.map(opt => <button type="button" key={opt.value} onClick={() => setIntent(opt.value)} className={`flex-1 rounded-card border px-3 py-2 text-sm transition ${intent === opt.value ? "border-accent bg-accent/10 font-medium text-accent" : "border-brand-navy/15"}`}>
                    {opt.label}
                  </button>)}
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-brand-navy/60">
            Already have an account? <Link to="/login" className="text-accent hover:underline">Log in</Link>
          </p>

          <div className="border-t border-brand-navy/10 pt-gutter text-center text-sm text-brand-navy/60">
            <p>
              Already a GearShift chauffeur? <Link to="/driver-login" className="text-accent hover:underline">Log in here</Link>
            </p>
            <p className="mt-1">
              Chauffeur for hire? Want to join as one?{" "}
              <Link to="/become-a-driver" className="text-accent hover:underline">Apply here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
