import { Link } from "react-router-dom";
import SocialIcons from "./SocialIcons";
export default function Footer() {
  const year = new Date().getFullYear();
  return <footer className="mt-section border-t border-brand-navy/10 bg-brand-navy text-white">
      <div className="section-wrap grid gap-gutter-lg py-section sm:grid-cols-3">
        <div className="space-y-3">
          <p className="font-display text-xl">
            Gear<span className="text-accent">Shift</span>
          </p>
          <p className="max-w-xs text-sm text-white/60">
            Kenya's peer-to-peer car rental marketplace - 50+ verified vehicles across Nairobi,
            Mombasa, Kisumu, Nakuru and Eldoret.
          </p>
          <SocialIcons />
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            Company
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/services" className="hover:text-white">Services</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/vehicles" className="hover:text-white">Browse cars</Link></li>
            <li><Link to="/vehicles/new" className="hover:text-white">List your car</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/50">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
            <li><Link to="/data-protection" className="hover:text-white">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-wrap flex flex-col items-center justify-between gap-3 py-gutter text-xs text-white/50 sm:flex-row">
          <p>&copy; {year} GearShift. All rights reserved.</p>
          <p>Built for Module 5 Project Week - Full-Stack Web Application.</p>
        </div>
      </div>
    </footer>;
}