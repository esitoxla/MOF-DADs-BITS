const ACCENT = "#059669"; // theme `positive` / emerald-600
const TRACK = "rgba(5, 150, 105, 0.2)";

export default function Loader({ size = 40, label, fullScreen = false }) {
  const dimension = Number(size) || 40;
  const thickness = Math.max(2, Math.round(dimension / 12));

  const spinner = (
    <div
      className="flex flex-col items-center justify-center gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="rounded-full animate-spin border-solid"
        style={{
          width: dimension,
          height: dimension,
          borderWidth: thickness,
          borderColor: TRACK,
          borderTopColor: ACCENT,
        }}
        aria-hidden="true"
      />
      {label ? (
        <p className="text-sm font-medium text-ink-secondary">{label}</p>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/15 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-xl px-8 py-6">
        {spinner}
      </div>
    </div>
  );
}
