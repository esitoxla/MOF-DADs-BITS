import React, { useState } from "react";
import AdminTab from "../components/AdminTab";
import Users from "./Users";
import AppropriationLoading from "./AppropriationLoading";
import Virement from "./Virement";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className=" min-h-screen lg:py-8 lg:px-12 p-4 sm:px-6 w-full">
      <h2 className="text-2xl font-bold text-green-800 mb-6">
        Admin Dashboard
      </h2>

      <div className="">
        <AdminTab activeTab={activeTab} changeTab={setActiveTab} />

        <div className="mt-6 h-full">
          {activeTab === "users" && <Users />}
          {activeTab === "loading" && <AppropriationLoading />}
          {activeTab === "virement" && <Virement />}
        </div>
      </div>
    </div>
  );
}
