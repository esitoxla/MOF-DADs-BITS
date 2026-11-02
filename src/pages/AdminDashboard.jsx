import React, { useState } from "react";
import AdminTab from "../components/AdminTab";
import Users from "./Users";
import AppropriationLoading from "./AppropriationLoading";
import Virement from "./Virement";
import ActivityLoading from "./ActivityLoading";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="w-full p-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#166534]/70 dark:text-[#39FF88]/80">
          Console
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#166534] dark:text-[#39FF88]">
          Admin Dashboard
        </h2>
      </div>

      <div>
        <AdminTab activeTab={activeTab} changeTab={setActiveTab} />

        <div className="mt-4 h-full">
          {activeTab === "users" && <Users />}
          {activeTab === "loading" && <AppropriationLoading />}
          {activeTab === "activitiesLoading" && <ActivityLoading />}
          {activeTab === "virement" && <Virement />}
        </div>
      </div>
    </div>
  );
}
