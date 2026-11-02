import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "bits-theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem(STORAGE_KEY) === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((value) => !value)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={dark}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#e8b931] shadow-sm transition-colors hover:bg-gray-50 dark:border-[#39FF88]/40 dark:bg-[#121b36] dark:text-[#39FF88] dark:hover:bg-[#39FF88]/10"
    >
      {dark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.75} />
      ) : (
        <Moon
          className="h-[18px] w-[18px]"
          fill="currentColor"
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}
