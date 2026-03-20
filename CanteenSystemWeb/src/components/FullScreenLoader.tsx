export default function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600" />

        {/* Text */}
        <p className="text-sm text-slate-600">Loading, please wait...</p>
      </div>
    </div>
  );
}
