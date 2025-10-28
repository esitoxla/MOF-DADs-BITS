import React from "react";
import { Link } from "react-router";
import SettingsTab from "../components/SettingsTab";
import Accounts from "../components/Accounts";
import SettingsChangePass from "../components/SettingsChangePass";
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className=" min-h-screen lg:p-8 p-4 sm:p-6 w-full">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Settings</h2>

      <SettingsTab activeTab={activeTab} changeTab={setActiveTab} />

      <div className="mt-6 h-full">
        {activeTab === "account" ? <Accounts/> : <SettingsChangePass/>}
      </div>
    </div>
  );
}
