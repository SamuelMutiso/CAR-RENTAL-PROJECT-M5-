import { useEffect, useRef, useState } from "react";
import api from "../api";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export default function UsernameInput({ value, onChange, placeholder = "janedoe" }) {
  const [status, setStatus] = useState("idle"); // idle | checking | available | taken | invalid
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    if (!value) {
      setStatus("idle");
      setSuggestions([]);
      return;
    }
    if (!USERNAME_REGEX.test(value)) {
      setStatus("invalid");
      setSuggestions([]);
      return;
    }
    setStatus("checking");
    timeoutRef.current = setTimeout(() => {
      const requestId = ++requestIdRef.current;
      api.get("/check-username", { params: { username: value } }).then(res => {
        if (requestId !== requestIdRef.current) return;
        setStatus(res.data.available ? "available" : "taken");
        setSuggestions(res.data.suggestions || []);
      }).catch(() => {
        if (requestId !== requestIdRef.current) return;
        setStatus("idle");
      });
    }, 450);
    return () => clearTimeout(timeoutRef.current);
  }, [value]);

  return (
    <div>
      <input
        required
        value={value}
        onChange={e => onChange(e.target.value.trim())}
        className={`input-field ${status === "taken" || status === "invalid" ? "border-red-400 focus:ring-red-400" : status === "available" ? "border-green-400 focus:ring-green-400" : ""}`}
        placeholder={placeholder}
        aria-invalid={status === "taken" || status === "invalid"}
      />
      {status === "checking" && <p className="mt-1 text-xs text-brand-navy/50">Checking availability...</p>}
      {status === "available" && <p className="mt-1 text-xs text-green-600">@{value} is available</p>}
      {status === "invalid" && <p className="mt-1 text-xs text-red-600">3-30 characters: letters, numbers, underscores only</p>}
      {status === "taken" && <div className="mt-1">
          <p className="text-xs text-red-600">@{value} is already taken</p>
          {suggestions.length > 0 && <div className="mt-1.5 flex flex-wrap gap-1.5">
              {suggestions.map(s => <button key={s} type="button" onClick={() => onChange(s)} className="rounded-full border border-accent/30 bg-accent/5 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/10">
                  @{s}
                </button>)}
            </div>}
        </div>}
    </div>
  );
}
