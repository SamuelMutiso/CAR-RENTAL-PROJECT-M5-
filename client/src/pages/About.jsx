export default function About() {
  return <div className="section-wrap max-w-3xl py-section">
      <h1 className="mb-gutter text-4xl">About GearShift</h1>
      <div className="space-y-gutter text-brand-navy/80">
        <p>
          GearShift is a peer-to-peer car rental marketplace connecting verified vehicle owners
          with renters across Kenya. Whether you need a reliable sedan for the daily commute, a
          rugged pickup for a work run upcountry, or something with a little more presence for a
          special occasion, our fleet of 50+ vehicles across Nairobi, Mombasa, Kisumu, Nakuru and
          Eldoret has you covered.
        </p>
        <p>
          We built GearShift because renting a car locally shouldn't mean stacks of paperwork and
          guesswork about pricing. Every listing shows the real daily rate upfront, every owner is
          reviewed by past renters, and every booking is protected by our approval and verification
          process before a single key changes hands.
        </p>
        <p>
          This project was built as a full-stack team submission - React on the frontend, Flask
          and JWT authentication on the backend - and every line of it was written, reviewed, and
          understood by the team that built it.
        </p>
      </div>
    </div>;
}
