import { useEffect, useState } from "react";
import { isValidKenyanPhone } from "../constants";

export default function MpesaPaymentModal({ open, amount, defaultPhone, onClose, onSuccess }) {
  const [step, setStep] = useState("phone");
  const [phone, setPhone] = useState(defaultPhone || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setStep("phone");
      setPhone(defaultPhone || "");
      setError("");
    }
  }, [open, defaultPhone]);

  useEffect(() => {
    if (step === "pending") {
      const t = setTimeout(() => setStep("success"), 2400);
      return () => clearTimeout(t);
    }
    if (step === "success") {
      const t = setTimeout(() => onSuccess(phone), 1100);
      return () => clearTimeout(t);
    }
  }, [step, phone, onSuccess]);

  if (!open) return null;

  function handleSend(e) {
    e.preventDefault();
    if (!isValidKenyanPhone(phone)) {
      setError("Enter a valid Safaricom number in the format +254 followed by 9 digits.");
      return;
    }
    setError("");
    setStep("pending");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-navy-dark/70 p-gutter">
      <div className="card w-full max-w-sm space-y-gutter p-gutter-lg">
        {step === "phone" && (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                M
              </div>
              <div>
                <h2 className="text-lg font-semibold">Pay with M-Pesa</h2>
                <p className="text-sm text-brand-navy/60">KES {Number(amount).toLocaleString()}</p>
              </div>
            </div>

            {error && <p className="rounded-card bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

            <form onSubmit={handleSend} className="space-y-gutter">
              <div>
                <label className="mb-1 block text-sm font-medium">M-Pesa phone number</label>
                <input
                  type="tel"
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254795038762"
                  pattern="^\+254\d{9}$"
                  className="input-field"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Send STK push
                </button>
              </div>
            </form>
          </>
        )}

        {step === "pending" && (
          <div className="flex flex-col items-center gap-gutter py-gutter text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-navy/10 border-t-green-600" />
            <div>
              <p className="font-semibold">Check your phone</p>
              <p className="mt-1 text-sm text-brand-navy/60">
                Enter your M-Pesa PIN on {phone} to complete this KES {Number(amount).toLocaleString()} payment.
              </p>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-gutter py-gutter text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
              &#10003;
            </div>
            <div>
              <p className="font-semibold text-green-700">Payment received</p>
              <p className="mt-1 text-sm text-brand-navy/60">KES {Number(amount).toLocaleString()} confirmed via M-Pesa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
