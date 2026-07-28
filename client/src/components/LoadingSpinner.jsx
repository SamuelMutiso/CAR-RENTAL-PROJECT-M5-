export default function LoadingSpinner({
  label = "Loading..."
}) {
  return <div className="flex flex-col items-center justify-center gap-3 py-section text-brand-navy/60">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-navy/20 border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>;
}