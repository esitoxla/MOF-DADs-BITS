import { createContext, useContext } from "react";

const tones = {
  edit: "hover:border-green-600 hover:text-green-700 dark:hover:border-[#39FF88] dark:hover:text-[#39FF88]",
  delete:
    "hover:border-rose-400 hover:text-rose-600 dark:hover:border-rose-400 dark:hover:text-rose-300",
  review:
    "hover:border-sky-500 hover:text-sky-700 dark:hover:border-sky-300 dark:hover:text-sky-300",
  approve:
    "hover:border-green-600 hover:text-green-700 dark:hover:border-[#39FF88] dark:hover:text-[#39FF88]",
  done: "border-green-600 text-green-700 dark:border-[#39FF88] dark:text-[#39FF88]",
};

const coloredTones = {
  edit: "text-yellow-600 hover:border-yellow-500 dark:text-[#fbbf24]",
  delete: "text-red-600 hover:border-rose-400 dark:text-[#fca5a5]",
  review: "text-blue-700 hover:border-sky-500 dark:text-[#7dd3fc]",
  approve: "text-green-800 hover:border-green-700",
  done: "border-green-600 text-green-800",
};

const base =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm transition dark:border-white/20 dark:bg-[#182444]";

const IconColorContext = createContext(false);

export function IconActionGroup({ colored = false, children }) {
  return (
    <IconColorContext.Provider value={colored}>
      <div className="inline-flex items-center justify-center gap-2">
        {children}
      </div>
    </IconColorContext.Provider>
  );
}

export default function IconAction({
  label,
  tone = "edit",
  onClick,
  children,
}) {
  const colored = useContext(IconColorContext);
  const palette = colored ? coloredTones : tones;
  const resting = colored ? "" : "text-gray-600 dark:text-gray-300";
  const className = `${base} ${resting} ${palette[tone] || palette.edit}`;
  const icon = (
    <span className="inline-flex h-[18px] w-[18px] items-center justify-center [&>svg]:h-[18px] [&>svg]:w-[18px]">
      {children}
    </span>
  );

  if (!onClick) {
    return (
      <span title={label} aria-label={label} className={className}>
        {icon}
      </span>
    );
  }

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      {icon}
    </button>
  );
}
