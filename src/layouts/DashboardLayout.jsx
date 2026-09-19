import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import NotificationBell from "../components/NotificationBell";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-green-50 relative">
      {isSidebarOpen && (
        <div
          className={`fixed md:relative z-20 h-full transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar toggleSidebar={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Menu icon (visible when sidebar is closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 text-green-700 text-2xl z-30"
        >
          <FiMenu />
        </button>
      )}

      <div
        className={`flex-1 transition-all duration-300 overflow-y-auto ${
          isSidebarOpen ? "md:ml-68" : "ml-0"
        }`}
      >
         <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
          <div className="flex justify-end mb-4">
            <NotificationBell />
          </div>
        </div>
       

        <Outlet />
      </div>
    </div>
  );
}
