import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import {
  applyTheme,
  readUserTheme,
  writeUserTheme,
} from "../utils/themePreference";

export default function ThemeToggle() {
  const userId = useSelector((state) => state.auth.authUser?.id);
  const [dark, setDark] = useState(() => readUserTheme(userId) === "dark");

  useEffect(() => {
    const theme = readUserTheme(userId);
    setDark(theme === "dark");
    applyTheme(theme);
  }, [userId]);

  const toggleTheme = () => {
    if (userId == null) return;
    const next = dark ? "light" : "dark";
    writeUserTheme(userId, next);
    applyTheme(next);
    setDark(next === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
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
