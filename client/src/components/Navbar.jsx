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
  const [mobileOpen, setMobileOpen] = useState(false);
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  }
  function closeMobile() {
    setMobileOpen(false);
  }
  const navLinks = <>
      <Link to="/vehicles" onClick={closeMobile} className="text-white/80 hover:text-white">Browse cars</Link>
      <Link to="/services" onClick={closeMobile} className="text-white/80 hover:text-white">Services</Link>
      <Link to="/compare" onClick={closeMobile} className="text-white/80 hover:text-white">
        Compare{compareIds.length > 0 && ` (${compareIds.length})`}
      </Link>

      {!user && <>
          <Link to="/login" onClick={closeMobile} className="text-white/80 hover:text-white">Log in</Link>
          <Link to="/signup" onClick={closeMobile} className="btn-primary py-2 text-center">Sign up</Link>
        </>}

      {user && user.role !== "admin" && (user.rental_intent === "owner" || user.rental_intent === "both") && <>
          <Link to="/vehicles/new" onClick={closeMobile} className="text-white/80 hover:text-white">List a car</Link>
          <Link to="/dashboard" onClick={closeMobile} className="text-white/80 hover:text-white">Dashboard</Link>
        </>}

      {user && user.role !== "admin" && (user.rental_intent === "renter" || user.rental_intent === "both") && <>
          <Link to="/bookings" onClick={closeMobile} className="text-white/80 hover:text-white">My bookings</Link>
          <Link to="/events/new" onClick={closeMobile} className="text-white/80 hover:text-white">Book an event</Link>
        </>}

      {user && user.role === "admin" && <Link to="/admin" onClick={closeMobile} className="text-white/80 hover:text-white">Admin</Link>}
    </>;
  return <header className="sticky top-0 z-50 border-b border-brand-navy/10 bg-brand-navy text-white">
      <nav className="section-wrap flex items-center justify-between py-4">
        <Link to="/" onClick={closeMobile} className="flex flex-col leading-tight">
          <span className="font-display text-xl font-bold tracking-tight">
            Gear<span className="text-accent">Shift</span>
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/60">
            Car Rental For Your Luxury Drive
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-gutter text-sm font-medium">
          {navLinks}

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

        <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" className="flex h-10 w-10 items-center justify-center rounded-card text-white md:hidden">
          {mobileOpen ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>}
        </button>
      </nav>

      {mobileOpen && <div className="border-t border-white/10 bg-brand-navy md:hidden">
          <div className="section-wrap flex flex-col gap-4 py-4 text-sm font-medium">
            {navLinks}

            {user && <>
                <Link to="/profile" onClick={closeMobile} className="text-white/80 hover:text-white">Profile</Link>
                <button onClick={handleLogout} className="text-left text-white/80 hover:text-white">Log out</button>
              </>}
          </div>
        </div>}
    </header>;
}