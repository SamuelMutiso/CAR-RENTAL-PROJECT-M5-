export default function RatingStars({ rating = 0, size = "text-base" }) {
  const rounded = Math.round(rating);
  return (
    <span className={`${size} text-accent`} title={`${rating.toFixed(1)} / 5`}>
      {"*".repeat(rounded)}
      <span className="text-brand-navy/20">{"*".repeat(5 - rounded)}</span>
    </span>
  );
}