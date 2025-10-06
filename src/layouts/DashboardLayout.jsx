import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-green-50 relative overflow-hidden">
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
        className={`flex-1 p-6 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-68" : "ml-0"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
