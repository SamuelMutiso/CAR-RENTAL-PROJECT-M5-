export default function DataProtection() {
  return <div className="section-wrap max-w-3xl py-section">
      <h1 className="mb-gutter text-4xl">Privacy Policy</h1>
      <div className="space-y-gutter-lg text-sm text-brand-navy/70">
        <p>Last updated: August 2026</p>

        <p>
          This page explains, in plain language, what information GearShift collects from you and why.
          If anything here isn't clear, contact us on the Contact page and we'll explain further.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-brand-navy">Information you give us directly</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Account details:</strong> full name, username, email address, phone number, and password (never stored in plain text - it's hashed before saving).</li>
            <li><strong>Driver &amp; owner details:</strong> driving license number, and for driver applicants, bio, daily rate, and any documents you submit.</li>
            <li><strong>Booking details:</strong> pickup/drop-off dates and locations, chauffeur or self-drive preference, and event details for convoy bookings.</li>
            <li><strong>Payment details:</strong> your M-Pesa phone number for the M-Pesa integration. We do not collect or store card numbers, and no real charge is made against your card details on this platform.</li>
            <li><strong>Reviews:</strong> star ratings and any written feedback you leave after a booking.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-brand-navy">Information collected automatically</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li><strong>Login session:</strong> a security token stored in your browser's local storage so you stay signed in. It's removed when you log out.</li>
            <li><strong>Language preference:</strong> your chosen display language, stored locally in your browser so we can remember it next visit.</li>
            <li><strong>Compare list:</strong> vehicles you've added to Compare, stored locally in your browser and tied to your account so it doesn't mix with other accounts on a shared device.</li>
          </ul>
          <p>We don't use tracking cookies or sell browsing data to advertisers.</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-brand-navy">How we use this information</h2>
          <p>
            Strictly to operate GearShift: matching renters with owners and drivers, processing bookings,
            sending you booking confirmations, receipts, and status updates (accepted/declined/cancelled),
            and maintaining trust and safety on the platform (for example, so an owner can identify who
            is picking up their vehicle). Booking confirmation and cancellation notices are currently
            simulated within the app rather than sent as real emails/SMS, as this is a student capstone
            project rather than a commercial service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-brand-navy">Who can see your information</h2>
          <p>
            Your name and phone number are shared with a driver only once you book them for a chauffeured
            trip, so they can identify and reach you. Vehicle owners see the renter's name for bookings on
            their listings. We do not sell or share your personal information with third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-brand-navy">Your choices</h2>
          <p>
            You can update your name, username, phone number, and email at any time from your Profile
            page. You can request an export or permanent deletion of your account data at any time by
            contacting support.
          </p>
        </section>

        <p>&copy; 2026 GearShift. All rights reserved.</p>
      </div>
    </div>;
}
