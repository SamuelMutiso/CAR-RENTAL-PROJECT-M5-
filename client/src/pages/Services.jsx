import { Link } from "react-router-dom";
function commonsUrl(filename, width = 1600) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}?width=${width}`;
}
const PHONE_DISPLAY = "+254 723 657 333";
const PHONE_TEL = "+254723657333";
const IMAGES = {
  hero: commonsUrl("Mercedes_s-class_w223_black_(1).jpg", 1920),
  transfers: commonsUrl("Mercedes-Benz_W447_V_250d_AMG_Line_Black_(1).jpg"),
  chauffeur: commonsUrl("Worldwide-chauffeured-service-client-arrival.jpg"),
  rental: commonsUrl("Mercedes_s-class_w222_black_(3).jpg"),
  airport: commonsUrl("Jomo_Kenyatta_International_Airport_(JKIA).jpg"),
  interior: commonsUrl("Mercedes_S-Class_Interior_(W222).jpg")
};
const SERVICES = [{
  title: "Transfers",
  image: IMAGES.transfers,
  body: "Seamless and personalized transfers for any destination, including airport, train station, city-to-city, or special events. Ideal for business travelers, corporate delegations, and private clients."
}, {
  title: "Private Chauffeur",
  image: IMAGES.chauffeur,
  body: "Hourly or full-day service for business or leisure with professional chauffeurs. Perfect for executives, VIPs, and international guests who require discreet, reliable transportation."
}, {
  title: "Luxury Car Rental",
  image: IMAGES.rental,
  body: "Choose from a fleet of prestige vehicles, self-drive or with a chauffeur. Suited to corporate clients, private travelers, and VIPs seeking comfort, style, and flexibility."
}, {
  title: "Airport Meet and Greet",
  image: IMAGES.airport,
  body: "Your chauffeur waits at arrivals with a name board, helps with your luggage, and takes you straight to your vehicle - no queues, no stress."
}];
const EXCELLENCE = [{
  title: "Premium Fleet",
  body: "A fleet of premium, meticulously maintained vehicles that exceed expectations."
}, {
  title: "Professional Chauffeurs",
  body: "Discreet, professional chauffeurs dedicated to your comfort and safety."
}, {
  title: "Countrywide Service",
  body: "Available across Nairobi, Mombasa, Kisumu, Nakuru and Eldoret, fully tailored to your needs."
}, {
  title: "Seamless Experience",
  body: "From booking to arrival, a seamless experience that guarantees comfort, reliability, and peace of mind."
}];
const STEPS = [{
  title: "Contact Us",
  image: IMAGES.chauffeur,
  body: "Reach us by phone, WhatsApp, or our contact form with your pickup, drop-off, and travel details."
}, {
  title: "Confirm Your Chauffeur",
  image: IMAGES.airport,
  body: "We match your trip with a vetted chauffeur and confirm the reservation before your day arrives."
}, {
  title: "Enjoy Your Ride",
  image: IMAGES.transfers,
  body: "Sit back in comfort while your chauffeur handles traffic, luggage, and directions door to door."
}];
export default function Services() {
  return <div>
      
      <div className="relative flex min-h-screen items-center bg-cover bg-center" style={{
      backgroundImage: `url("${IMAGES.hero}")`,
      backgroundPosition: "70% 40%"
    }}>
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-dark/95 via-brand-navy-dark/70 to-brand-navy-dark/20" />

        <div className="section-wrap relative py-section text-white">
          
          <h1 className="max-w-xl font-serif text-4xl italic text-white sm:text-5xl">Your Journey, Our Priority</h1>
          <p className="mt-2 font-semibold text-accent">Luxury Car Rental &amp; Chauffeur Service</p>
          <p className="mt-4 max-w-lg text-white/80">
            Experience excellence in luxury travel with our exclusive services, including premium car
            rental, airport transfers, and private chauffeur.
          </p>
        </div>
      </div>

      
      <section className="section-wrap py-section">
        <h2 className="mb-2 text-center text-3xl">Our Services</h2>
        <div className="mx-auto mb-gutter-lg h-1 w-16 rounded-full bg-accent" />

        <div className="space-y-gutter-lg">
          {SERVICES.map((s, i) => <div key={s.title} className={`grid items-center gap-gutter-lg sm:grid-cols-2 ${i % 2 === 1 ? "sm:[&>*:first-child]:order-2" : ""}`}>
              <img src={s.image} alt={s.title} className="h-72 w-full rounded-card object-cover shadow-card" />
              <div className="text-center sm:text-left">
                <h3 className="mb-2 text-2xl">{s.title}</h3>
                <p className="text-brand-navy/70">{s.body}</p>
              </div>
            </div>)}
        </div>
      </section>

      
      <section className="bg-brand-navy text-white">
        <div className="section-wrap grid items-center gap-gutter-lg py-section sm:grid-cols-2">
          <img src={IMAGES.interior} alt="Premium interior" className="h-80 w-full rounded-card object-cover shadow-card sm:h-[420px]" />
          <div>
            <h2 className="mb-gutter-lg text-3xl">The Difference In Excellence</h2>
            <div className="space-y-gutter">
              {EXCELLENCE.map(item => <div key={item.title} className="flex gap-3">
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-accent text-accent">
                    &#9679;
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-white/70">{item.body}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </section>

      
      <section className="section-wrap py-section">
        <h2 className="mb-2 text-center text-3xl">Get Started In 3 Easy Steps</h2>
        <div className="mx-auto mb-2 h-1 w-16 rounded-full bg-accent" />
        <p className="mb-gutter-lg text-center text-brand-navy/60">
          Booking your luxury transfer or chauffeur service is simple and hassle-free.
        </p>

        <div className="grid gap-gutter sm:grid-cols-3">
          {STEPS.map((step, i) => <div key={step.title} className="relative flex h-64 flex-col justify-end overflow-hidden rounded-card bg-cover bg-center p-gutter text-white shadow-card" style={{
          backgroundImage: `url("${step.image}")`
        }}>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy-dark/40 to-transparent" />
              <div className="relative">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-light">
                  Step {i + 1}
                </p>
                <h3 className="mb-1 text-xl">{step.title}</h3>
                <p className="text-sm text-white/80">{step.body}</p>
              </div>
            </div>)}
        </div>
      </section>

      
      <section className="bg-brand-navy-light">
        <div className="section-wrap flex flex-col items-center justify-between gap-gutter py-section-lg text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl text-white sm:text-3xl">Ready to book your chauffeur?</h2>
            <p className="mt-2 max-w-xl text-white/70">
              Call us or send your travel details and we'll take it from there.
            </p>
          </div>
          <div className="flex flex-shrink-0 gap-3">
            <a href={`tel:${PHONE_TEL}`} className="btn-secondary bg-transparent text-white hover:bg-white/10">
              {PHONE_DISPLAY}
            </a>
            <Link to="/contact" className="btn-primary whitespace-nowrap">Contact us</Link>
          </div>
        </div>
      </section>
    </div>;
}
