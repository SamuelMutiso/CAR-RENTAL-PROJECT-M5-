import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";
import { useLanguage } from "../context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";
export default function Navbar() {
  const {
    user,
    logout,
    driver,
    driverLogout
  } = useAuth();
  const {
    compareIds
  } = useCompare();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/");
  }
  function handleDriverLogout() {
    driverLogout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/driver-login");
  }
  function closeMobile() {
    setMobileOpen(false);
  }

  // Marketing/shopping links (Browse, Services, Compare) are for guests and
  // clients only - once someone is in the driver or admin app, their nav is
  // scoped entirely to their own workspace instead.
  const isDriverOrAdmin = !!driver || user?.role === "admin";
  const showShoppingLinks = !isDriverOrAdmin;
  const showServices = !user && !driver;

  const navLinks = <>
      {showShoppingLinks && <Link to="/vehicles" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_browse")}</Link>}
      {showServices && <Link to="/services" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_services")}</Link>}
      {showShoppingLinks && <Link to="/compare" onClick={closeMobile} className="text-white/80 hover:text-white">
          {t("nav_compare")}{compareIds.length > 0 && ` (${compareIds.length})`}
        </Link>}

      {!user && !driver && <>
          <Link to="/login" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_login")}</Link>
          <Link to="/signup" onClick={closeMobile} className="btn-primary py-2 text-center">{t("nav_signup")}</Link>
        </>}

      {user && user.role !== "admin" && (user.rental_intent === "owner" || user.rental_intent === "both") && <>
          <Link to="/vehicles/new" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_list_car")}</Link>
          <Link to="/dashboard" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_dashboard")}</Link>
        </>}

      {user && user.role !== "admin" && (user.rental_intent === "renter" || user.rental_intent === "both") && <>
          <Link to="/bookings" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_my_bookings")}</Link>
          <Link to="/events/new" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_book_event")}</Link>
        </>}

      {user && user.role === "admin" && <Link to="/admin" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_admin")}</Link>}

      {driver && !user && <Link to="/driver-portal" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_driver_portal")}</Link>}
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

          <LanguageSwitcher />

          {user && user.role !== "admin" && <NotificationBell />}

          {user && <div className="relative">
              <button onClick={() => setDropdownOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold uppercase">
                {(user.name || user.email)?.[0] || "U"}
              </button>

              {dropdownOpen && <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-card bg-white text-brand-navy shadow-card">
                  <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-brand-navy/5">
                    {t("nav_profile")}
                  </Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-navy/5">
                    {t("nav_logout")}
                  </button>
                </div>}
            </div>}

          {!user && driver && <div className="relative">
              <button onClick={() => setDropdownOpen(v => !v)} className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold uppercase">
                {driver.name?.[0] || "D"}
              </button>

              {dropdownOpen && <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-card bg-white text-brand-navy shadow-card">
                  <Link to="/driver-portal" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-brand-navy/5">
                    {t("nav_driver_portal")}
                  </Link>
                  <Link to="/driver-profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-brand-navy/5">
                    {t("nav_profile")}
                  </Link>
                  <button onClick={handleDriverLogout} className="block w-full px-4 py-2.5 text-left text-sm hover:bg-brand-navy/5">
                    {t("nav_logout")}
                  </button>
                </div>}
            </div>}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          {user && user.role !== "admin" && <NotificationBell />}
          <button onClick={() => setMobileOpen(v => !v)} aria-label="Toggle menu" className="flex h-10 w-10 items-center justify-center rounded-card text-white">
            {mobileOpen ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>}
          </button>
        </div>
      </nav>

      {mobileOpen && <div className="border-t border-white/10 bg-brand-navy md:hidden">
          <div className="section-wrap flex flex-col gap-4 py-4 text-sm font-medium">
            {navLinks}

            {user && <>
                <Link to="/profile" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_profile")}</Link>
                <button onClick={handleLogout} className="text-left text-white/80 hover:text-white">{t("nav_logout")}</button>
              </>}

            {!user && driver && <>
                <Link to="/driver-profile" onClick={closeMobile} className="text-white/80 hover:text-white">{t("nav_profile")}</Link>
                <button onClick={handleDriverLogout} className="text-left text-white/80 hover:text-white">{t("nav_logout")}</button>
              </>}
          </div>
        </div>}
    </header>;
}
