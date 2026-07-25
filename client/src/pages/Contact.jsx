export default function Contact() {
  return <div className="section-wrap max-w-2xl py-section">
      <h1 className="mb-gutter text-4xl">Contact us</h1>
      <p className="mb-gutter-lg text-brand-navy/80">
        Questions about a booking, a listing, or the platform in general? Reach us any of these ways.
      </p>

      <div className="grid gap-gutter sm:grid-cols-2">
        <div className="card p-gutter">
          <h3 className="mb-1 font-semibold">Email</h3>
          <p className="text-sm text-brand-navy/60">support@gearshift.com</p>
        </div>
        <div className="card p-gutter">
          <h3 className="mb-1 font-semibold">Phone</h3>
          <p className="text-sm text-brand-navy/60">+254 723 657 333</p>
        </div>
        <div className="card p-gutter">
          <h3 className="mb-1 font-semibold">Head office</h3>
          <p className="text-sm text-brand-navy/60">Westlands, Nairobi, Kenya</p>
        </div>
        <div className="card p-gutter">
          <h3 className="mb-1 font-semibold">Support hours</h3>
          <p className="text-sm text-brand-navy/60">Mon - Sat, 8:00 - 20:00 EAT</p>
        </div>
      </div>
    </div>;
}
