import { useState } from "react";
import api from "../api";
import { isValidKenyanPhone } from "../constants";
const FAQS = [{
  q: "Do you allow self-drive for tourists?",
  a: "Yes. Every listing can be booked self-drive with a valid driving license (an international driving permit works too), or with one of our professional chauffeurs if you'd rather not drive yourself."
}, {
  q: "I'm an international traveller - can I still rent a car?",
  a: "Yes. Your home-country license or an international driving permit (IDP) is accepted for self-drive, or choose \"with chauffeur\" if you'd rather not navigate unfamiliar roads yourself."
}, {
  q: "Do I need a Kenyan phone number to book?",
  a: "Yes - every booking needs a contact number in the +254 format, since that's how we and the vehicle owner reach you. A local SIM or a Kenyan WhatsApp number both work; your hotel or tour operator can usually help you get one on arrival."
}, {
  q: "What currency are prices shown in?",
  a: "All rates on GearShift are listed in Kenyan Shillings (KES). If you're budgeting from abroad, check your card or bank's exchange rate before booking."
}, {
  q: "Can I take a car to the Maasai Mara or other parks?",
  a: "Yes. Filter vehicles by the Safari category, or use the event booking flow for a dedicated safari trip - our SUVs and 4x4s are built for game-park roads."
}, {
  q: "Which cities do you operate in?",
  a: "Nairobi, Mombasa, Kisumu, Nakuru and Eldoret today. Browse by location on the vehicles page to see what's available near you."
}, {
  q: "Can I hire a car with a chauffeur instead of self-drive?",
  a: "Yes. When booking, choose \"With chauffeur\" and pick from our rated chauffeurs - their daily rate is added on top of the vehicle's rate."
}, {
  q: "Can I book several vehicles at once, e.g. for a wedding or group trip?",
  a: "Yes - our event/convoy booking flow lets you book multiple vehicles together for weddings, funerals, safaris, and group transport, with a discount that scales up the more you book."
}, {
  q: "How do you make sure listed vehicles are safe to rent?",
  a: "Every listing is reviewed and approved by our admin team before it goes live, and both owners and renters build a public rating from real completed bookings."
}];
export default function FAQ() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  function handleChange(field, value) {
    setForm(f => ({
      ...f,
      [field]: value
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (form.phone && !isValidKenyanPhone(form.phone) && !/^\+?[0-9\s()-]{7,20}$/.test(form.phone)) {
      setError("Enter a valid phone/WhatsApp number.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/contact", form);
      setSuccess(true);
      setForm({
        full_name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (err) {
      setError(err.response?.data?.error || "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return <div className="section-wrap max-w-3xl py-section">
      <h1 className="mb-gutter-lg text-center text-4xl">FAQ for tourists &amp; renters</h1>

      <div className="space-y-gutter">
        {FAQS.map(({
        q,
        a
      }) => <div key={q}>
            <p className="font-semibold">{q}</p>
            <p className="mt-1 text-brand-navy/70">{a}</p>
          </div>)}
      </div>

      <div className="mt-section-lg">
        <p className="mb-gutter text-lg font-semibold">
          Do you have any other question? Drop us a message below.
        </p>

        {success ? <div className="card p-gutter-lg text-center">
            <p className="font-semibold">Thanks - we've got your message.</p>
            <p className="mt-1 text-sm text-brand-navy/60">Our team will get back to you at the email or number you provided.</p>
          </div> : <form onSubmit={handleSubmit} className="card space-y-gutter p-gutter-lg">
            {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

            <div className="grid gap-gutter sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Full Name</label>
                <input required value={form.full_name} onChange={e => handleChange("full_name", e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Email Address</label>
                <input type="email" required value={form.email} onChange={e => handleChange("email", e.target.value)} className="input-field" />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Phone Number / WhatsApp Number</label>
              <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)} placeholder="+254795038762" className="input-field" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">How can we serve you?</label>
              <textarea required rows={4} value={form.message} onChange={e => handleChange("message", e.target.value)} className="input-field" />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>}
      </div>
    </div>;
}
