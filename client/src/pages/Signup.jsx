import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import PasswordInput from "../components/PasswordInput";
import UsernameInput from "../components/UsernameInput";
import { AUTH_BG_IMAGES, isValidEmail, isValidKenyanPhone } from "../constants";
import { useLanguage } from "../context/LanguageContext";
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
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [intent, setIntent] = useState("both");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const emailInvalid = emailTouched && email.length > 0 && !isValidEmail(email);
  const nameInvalid = nameTouched && name.trim().length > 0 && name.trim().length < 2;
  const phoneInvalid = phoneTouched && phone.length > 0 && !isValidKenyanPhone(phone);
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    if (name.trim().length < 2) {
      setError("Enter your full name");
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError("Choose a username (3-30 characters: letters, numbers, underscores)");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address, e.g. name@example.com");
      return;
    }
    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid phone number, e.g. +254712345678");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/register", {
        name,
        username,
        email,
        phone,
        password,
        role: "client",
        rental_intent: intent
      });
      login(res.data.user, res.data.token);
      navigate("/profile");
    } catch (err) {
      const errors = err.response?.data?.errors;
      const fieldError = errors?.email?.[0] || errors?.username?.[0] || errors?.phone?.[0] || errors?.name?.[0];
      setError(fieldError || err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  function handleGoogleSuccess(user, token) {
    login(user, token);
    navigate("/profile");
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
          <h1 className="text-2xl">{t("auth_signup_heading")}</h1>

          {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-gutter">
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth_full_name")}</label>
              <input required value={name} onChange={e => setName(e.target.value)} onBlur={() => setNameTouched(true)} className={`input-field ${nameInvalid ? "border-red-400 focus:ring-red-400" : ""}`} aria-invalid={nameInvalid} placeholder="Jane Wanjiru" />
              {nameInvalid && <p className="mt-1 text-xs text-red-600">Enter your full name</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Username</label>
              <UsernameInput value={username} onChange={setUsername} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth_email")}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} className={`input-field ${emailInvalid ? "border-red-400 focus:ring-red-400" : ""}`} aria-invalid={emailInvalid} />
              {emailInvalid && <p className="mt-1 text-xs text-red-600">Enter a valid email address, e.g. name@example.com</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth_phone")}</label>
              <input required value={phone} onChange={e => setPhone(e.target.value)} onBlur={() => setPhoneTouched(true)} className={`input-field ${phoneInvalid ? "border-red-400 focus:ring-red-400" : ""}`} aria-invalid={phoneInvalid} placeholder="+254712345678" />
              {phoneInvalid && <p className="mt-1 text-xs text-red-600">Enter a valid phone number, e.g. +254712345678</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">{t("auth_password")}</label>
              <PasswordInput required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm password</label>
              <PasswordInput required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">I want to</label>
              <div className="flex gap-3">
                {INTENT_OPTIONS.map(opt => <button type="button" key={opt.value} onClick={() => setIntent(opt.value)} className={`flex-1 rounded-card border px-3 py-2 text-sm transition ${intent === opt.value ? "border-accent bg-accent/10 font-medium text-accent" : "border-brand-navy/15"}`}>
                    {opt.label}
                  </button>)}
              </div>
            </div>
            <p className="text-xs text-brand-navy/50">
              By signing up, you agree that we'll collect your name, username, email, and phone number
              to operate your account. See our <Link to="/data-protection" className="text-accent hover:underline">Privacy Policy</Link> for details.
            </p>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <GoogleSignInButton onSuccess={handleGoogleSuccess} onError={setError} />

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
