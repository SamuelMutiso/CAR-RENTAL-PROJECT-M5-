import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
export default function Navbar() {
  const {
    user,
    logout
  } = useAuth();
  const {
    compareIds
  } = useCompare();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    navigate("/");
  }
  return <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-brand-navy text-white">
      <nav className="section-wrap flex items-center justify-between py-4">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display text-xl font-bold tracking-tight">
            Gear<span className="text-accent">Shift</span>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/60">
            Car Rental For Your Luxury Drive
          </span>
        </Link>

        <div className="flex items-center gap-gutter text-sm font-medium">
          <Link to="/vehicles" className="text-white/80 hover:text-white">Browse cars</Link>
          <Link to="/services" className="text-white/80 hover:text-white">Services</Link>
          <Link to="/compare" className="text-white/80 hover:text-white">
            Compare{compareIds.length > 0 && ` (${compareIds.length})`}
          </Link>

          {!user && <>
              <Link to="/login" className="text-white/80 hover:text-white">Log in</Link>
              <Link to="/signup" className="btn-primary py-2">Sign up</Link>
            </>}

          {user && user.role !== "admin" && (user.rental_intent === "owner" || user.rental_intent === "both") && <>
              <Link to="/vehicles/new" className="text-white/80 hover:text-white">List a car</Link>
              <Link to="/dashboard" className="text-white/80 hover:text-white">Dashboard</Link>
            </>}

          {user && user.role !== "admin" && (user.rental_intent === "renter" || user.rental_intent === "both") && <>
              <Link to="/bookings" className="text-white/80 hover:text-white">My bookings</Link>
              <Link to="/events/new" className="text-white/80 hover:text-white">Book an event</Link>
            </>}

          {user && user.role === "admin" && <Link to="/admin" className="text-white/80 hover:text-white">Admin</Link>}

          {user && <div className="relative">
              <button onClick={() => setDropdownOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold uppercase">
                {user.email?.[0] || "U"}
              </button>

              {dropdownOpen && <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-card bg-white text-brand-navy shadow-card">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-brand-navy/5">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-navy/5">
                    Log out
                  </button>
                </div>}
            </div>}
        </div>
      </nav>
    </header>;
}