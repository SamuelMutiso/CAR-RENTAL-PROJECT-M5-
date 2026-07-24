export default function FeatureBadge({ feature }) {
  const name = typeof feature === "string" ? feature : feature.name;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-navy/5 px-3 py-1 text-xs font-medium text-brand-navy/80">
      {name}
    </span>
  );
}