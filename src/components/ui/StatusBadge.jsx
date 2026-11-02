const tones = {
  Approved:
    "bg-[#166534]/15 text-[#14532d] dark:bg-[#39FF88]/20 dark:text-[#39FF88]",
  Reviewed:
    "bg-sky-700/15 text-sky-900 dark:bg-sky-400/20 dark:text-sky-300",
  Pending:
    "bg-amber-600/15 text-amber-900 dark:bg-amber-400/25 dark:text-amber-300",
  active:
    "bg-[#166534]/15 text-[#14532d] dark:bg-[#39FF88]/20 dark:text-[#39FF88]",
  inactive:
    "bg-slate-500/15 text-slate-700 dark:bg-white/10 dark:text-[#c5d4e4]",
};

export default function StatusBadge({ status }) {
  const tone =
    tones[status] ||
    "bg-slate-500/15 text-slate-800 dark:bg-white/10 dark:text-[#e8fff3]";

  return (
    <span
      className={`inline-flex min-w-[7.5rem] items-center justify-center rounded-full px-4 py-2 text-sm font-semibold capitalize ${tone}`}
    >
      {status}
    </span>
  );
}
