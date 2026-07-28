import { Link } from "react-router-dom";
export default function NotFound() {
  return <div className="section-wrap flex flex-col items-center justify-center gap-4 py-section text-center">
      <h1 className="text-4xl">404</h1>
      <p className="text-brand-navy/60">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back home</Link>
    </div>;
}