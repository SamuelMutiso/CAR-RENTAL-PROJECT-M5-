import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { driverApi } from "../api";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";
export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    driverLogin
  } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await driverApi.post("/driver-login", {
        email,
        password
      });
      driverLogin(res.data.driver, res.data.token);
      navigate("/driver-portal", {
        replace: true
      });
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  return <div className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center py-section" style={{
    backgroundImage: "url(https://commons.wikimedia.org/wiki/Special:FilePath/Toyota_Land_Cruiser_200_002.JPG?width=1600)"
  }}>
      <div className="absolute inset-0 bg-brand-navy-dark/80" />

      <div className="relative card w-full max-w-md space-y-gutter p-gutter-lg">
        <h1 className="text-2xl">Chauffeur log in</h1>
        <p className="text-sm text-brand-navy/60">
          For GearShift chauffeurs only. Not a chauffeur yet?{" "}
          <Link to="/become-a-driver" className="text-accent hover:underline">Apply here</Link>.
        </p>

        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-gutter">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <PasswordInput required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="text-sm text-brand-navy/60">
          Looking to rent or list a car instead? <Link to="/login" className="text-accent hover:underline">Client log in</Link>
        </p>
      </div>
    </div>;
}
