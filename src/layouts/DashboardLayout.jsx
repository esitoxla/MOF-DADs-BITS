import { useState } from "react";
import { Outlet } from "react-router";
import { PanelLeft } from "lucide-react";
import Sidebar from "../components/Sidebar";
import NotificationBell from "../components/NotificationBell";
import ProfileMenu from "../components/ProfileMenu";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-green-50">
      {isSidebarOpen && (
        <div className="h-full w-48 shrink-0 sm:w-56 md:w-68">
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
