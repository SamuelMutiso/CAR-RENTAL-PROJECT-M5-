import { useEffect, useRef } from "react";
import api from "../api";

export default function GoogleSignInButton({ onSuccess, onError }) {
  const buttonRef = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;
    let cancelled = false;
    let interval;

    function init() {
      if (cancelled || !window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async response => {
          try {
            const res = await api.post("/auth/google", { credential: response.credential });
            onSuccess(res.data.user, res.data.token);
          } catch (err) {
            onError?.(err.response?.data?.error || "Google sign-in failed");
          }
        }
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320
      });
    }

    if (window.google?.accounts?.id) {
      init();
    } else {
      interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          init();
        }
      }, 200);
    }

    return () => {
      cancelled = true;
      if (interval) clearInterval(interval);
    };
  }, [clientId]);

  if (!clientId) return null;

  return (
    <div className="flex flex-col items-center gap-gutter">
      <div className="flex w-full items-center gap-3 text-xs text-brand-navy/40">
        <span className="h-px flex-1 bg-brand-navy/10" />
        <span>OR</span>
        <span className="h-px flex-1 bg-brand-navy/10" />
      </div>
      <div ref={buttonRef} />
    </div>
  );
}
