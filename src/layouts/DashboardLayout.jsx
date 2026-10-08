import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { PanelLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import ProfileMenu from "../components/ProfileMenu";

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
    <div className="flex h-screen w-full bg-green-50">
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
              ? "h-full w-48 shrink-0 sm:w-56 md:w-68"
              : "fixed inset-y-0 left-0 z-40 h-full w-64 max-w-[85vw] shadow-xl"
          }
        >
          <Sidebar />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((open) => !open)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-white"
          >
            <PanelLeft className="h-7 w-7" />
          </button>

          <div className="flex items-center gap-2 rounded-md bg-white px-2 py-1 shadow-sm">
            <NotificationBell />
            <ProfileMenu />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
