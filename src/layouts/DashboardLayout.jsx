import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { PanelLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import ProfileMenu from "../components/ProfileMenu";
import ThemeToggle from "../components/ThemeToggle";

const DESKTOP_QUERY = "(min-width: 768px)";

export default function DashboardLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches,
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(() =>
    window.matchMedia(DESKTOP_QUERY).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => {
      setIsDesktop(media.matches);
      setIsSidebarOpen(media.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex h-screen w-full bg-green-50 dark:bg-[#0B132B]">
      {isSidebarOpen && !isDesktop && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {isSidebarOpen && (
        <div
          className={
            isDesktop
              ? "h-full w-72 shrink-0"
              : "fixed inset-y-0 left-0 z-40 h-full w-72 max-w-[85vw] shadow-xl"
          }
        >
          <Sidebar />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-20 shrink-0 items-center justify-between border-b-2 border-[#0f9b80] bg-white px-3 pt-6 pb-3 sm:px-4 dark:border-[#39FF88] dark:bg-[#0B132B]">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
          >
            <PanelLeft className="h-5 w-5" strokeWidth={1.75} />
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell />
            <ProfileMenu />
          </div>
        </header>

        <div className="bits-main min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
