import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import PasswordInput from "../components/PasswordInput";
import { LOGIN_BG_IMAGE, isValidEmail } from "../constants";
export default function Login() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailInvalid = emailTouched && email.length > 0 && !isValidEmail(email);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEmailTouched(true);
    if (!isValidEmail(email)) {
      setError("Enter a valid email address, e.g. name@example.com");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email,
        password
      });
      login(res.data.user, res.data.token);
      const fallback = res.data.user.role === "admin" ? "/admin" : "/dashboard";
      const redirectTo = location.state?.from?.pathname || fallback;
      navigate(redirectTo, {
        replace: true
      });
    } catch (err) {
      const fieldError = err.response?.data?.errors?.email?.[0];
      setError(fieldError || err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  function handleGoogleSuccess(user, token) {
    login(user, token);
    const fallback = user.role === "admin" ? "/admin" : "/dashboard";
    const redirectTo = location.state?.from?.pathname || fallback;
    navigate(redirectTo, {
      replace: true
    });
  }
  return <div className="relative min-h-[80vh] overflow-hidden">
      
      <div className="absolute inset-0 bg-cover bg-center" style={{
      backgroundImage: `url("${LOGIN_BG_IMAGE}")`
    }} />
      <div className="absolute inset-0 bg-brand-navy-dark/85" />

      <div className="section-wrap relative flex min-h-[80vh] items-center justify-center py-section">
        <div className="card w-full max-w-md space-y-gutter p-gutter-lg">
          <h1 className="text-2xl">Log in</h1>

        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-gutter">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} className={`input-field ${emailInvalid ? "border-red-400 focus:ring-red-400" : ""}`} aria-invalid={emailInvalid} placeholder="you@example.com" />
            {emailInvalid && <p className="mt-1 text-xs text-red-600">Enter a valid email address, e.g. name@example.com</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <PasswordInput required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

          <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={setError} />

          <div className="flex justify-between text-sm text-brand-navy/60">
            <Link to="/reset-password" className="hover:text-accent">Forgot password?</Link>
            <Link to="/signup" className="hover:text-accent">Sign up</Link>
          </div>

          <div className="border-t border-brand-navy/10 pt-gutter text-center text-sm text-brand-navy/60">
            <p>
              Already a GearShift chauffeur? <Link to="/driver-login" className="text-accent hover:underline">Log in here</Link>
            </p>
            <p className="mt-1">
              Chauffeur for hire? <Link to="/become-a-driver" className="text-accent hover:underline">Apply to drive with us</Link>
            </p>
          </div>
        </div>
      </div>
    </div>;
}
