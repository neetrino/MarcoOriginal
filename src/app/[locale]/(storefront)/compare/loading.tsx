export default function CompareLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <div className="h-8 w-64 animate-pulse rounded-md bg-gray-200" />
      <div className="h-80 animate-pulse rounded-3xl bg-gray-100" />
    </div>
  );
}
