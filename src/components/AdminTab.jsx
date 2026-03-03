import React from "react";

const tabItems = [
  { key: "users", label: "Users" },
  { key: "loading", label: "Appropriation & Allotment Loading" },
  { key: "activitiesLoading", label: "Activities Loading" },
  { key: "virement", label: "Virement" },
];

export default function AdminTab({  activeTab, changeTab }) {
  return (
    <div className="">
      {tabItems.map((tab) => (
        <button
          onClick={() => changeTab(tab.key)}
          key={tab.key}
          className={`py-2 px-4 font-medium transition-all cursor-pointer ${
            activeTab === tab.key
              ? "border-2 border-green-600 bg-grey-50 rounded-t-sm border-b-white text-green-700"
              : "text-gray-500 "
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
