import { useEffect, useState } from "react";
const SLIDES = [["https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_S-Class_2020_W223.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Land_Rover_Range_Rover_P525_Autobiography_L405_black_(4).jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Porsche_911_Turbo.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Bentley_Continental_GT_(front).jpg?width=700"], ["https://commons.wikimedia.org/wiki/Special:FilePath/BMW_4_Series.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Audi_A8_D4.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Lamborghini_Huracan_Performante_Purple.jpg?width=700", "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_C-Class_W205_FL_silver_(2).jpg?width=700"]];
const FALLBACK_IMG = "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=700&q=60";
export default function HeroCarousel({
  children
}) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);
  return <div className="relative h-[520px] overflow-hidden bg-brand-navy">
      {SLIDES.map((photos, slideIndex) => <div key={slideIndex} className={`absolute inset-0 grid grid-cols-2 gap-1 transition-opacity duration-1000 sm:grid-cols-4 ${slideIndex === active ? "opacity-100" : "opacity-0"}`} aria-hidden={slideIndex !== active}>
          {photos.map((src, photoIndex) => <img key={photoIndex} src={src} alt="" className="h-full w-full object-cover" onError={e => {
        e.currentTarget.src = FALLBACK_IMG;
      }} />)}
        </div>)}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy/70 to-brand-navy/40" />
      <div className="section-wrap relative flex h-full flex-col items-center justify-center gap-gutter text-center text-white">
        {children}
      </div>
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, i) => <button key={i} onClick={() => setActive(i)} aria-label={`Show slide ${i + 1}`} className={`h-2 rounded-full transition-all ${i === active ? "w-6 bg-accent" : "w-2 bg-white/40"}`} />)}
      </div>
    </div>;
}