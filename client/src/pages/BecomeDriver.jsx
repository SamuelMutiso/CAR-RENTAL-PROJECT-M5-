import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { VEHICLE_CATEGORIES, isValidKenyanPhone } from "../constants";
const MAX_CV_SIZE_MB = 5;
export default function BecomeDriver() {
  const [form, setForm] = useState({
    full_name: "",
    id_number: "",
    email: "",
    phone: "",
    license_number: "",
    preferred_category: VEHICLE_CATEGORIES[0]
  });
  const [cvFile, setCvFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  function handleChange(field, value) {
    setForm(f => ({
      ...f,
      [field]: value
    }));
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setCvFile(null);
      return;
    }
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      setError("CV must be a PDF, DOC, or DOCX file.");
      setCvFile(null);
      return;
    }
    if (file.size > MAX_CV_SIZE_MB * 1024 * 1024) {
      setError(`CV must be smaller than ${MAX_CV_SIZE_MB}MB.`);
      setCvFile(null);
      return;
    }
    setError("");
    setCvFile(file);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!isValidKenyanPhone(form.phone)) {
      setError("Enter a valid contact number in the format +254 followed by 9 digits, e.g. +254795038762.");
      return;
    }
    if (!cvFile) {
      setError("Please attach your CV (PDF, DOC, or DOCX).");
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("cv", cvFile);
      await api.post("/driver-applications", formData, {
        headers: {
          "Content-Type": undefined
        }
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  if (success) {
    return <div className="section-wrap max-w-xl py-section text-center">
        <h1 className="mb-gutter text-3xl">Application received</h1>
        <p className="mb-gutter text-brand-navy/70">
          Thanks for applying to drive with GearShift. Our admin team will review your CV and
          contact you at the email or phone number you provided.
        </p>
        <Link to="/" className="btn-primary">Back to home</Link>
      </div>;
  }
  return <div className="section-wrap max-w-xl py-section">
      <h1 className="mb-1 text-3xl">Drive with GearShift</h1>
      <p className="mb-gutter-lg text-brand-navy/60">
        Chauffeur for hire, or want to become one of our chauffeurs? Tell us about yourself and
        attach your CV - our admin team reviews every application.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-gutter p-gutter-lg">
        {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium">Full name</label>
          <input required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} className="input-field" />
        </div>

        <div className="grid gap-gutter sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">National ID number</label>
            <input required value={form.id_number} onChange={e => handleChange("id_number", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Driving license number</label>
            <input required value={form.license_number} onChange={e => handleChange("license_number", e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="grid gap-gutter sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input type="email" required value={form.email} onChange={e => handleChange("email", e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone number</label>
            <input type="tel" required value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+254795038762" pattern="^\+254\d{9}$" className="input-field" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Vehicle class you'd like to drive</label>
          <select value={form.preferred_category} onChange={e => handleChange("preferred_category", e.target.value)} className="input-field">
            {VEHICLE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">CV (PDF, DOC, or DOCX, max {MAX_CV_SIZE_MB}MB)</label>
          <input type="file" required accept=".pdf,.doc,.docx" onChange={handleFileChange} className="input-field" />
          {cvFile && <p className="mt-1 text-xs text-brand-navy/50">Selected: {cvFile.name}</p>}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </div>;
}
