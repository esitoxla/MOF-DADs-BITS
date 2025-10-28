import React from 'react'


 const tabItems = [
   { key: "account", label: "Account" },
   { key: "changePass", label: "Change Password" },
 ];

export default function SettingsTab({ activeTab, changeTab}) {
  return (
    <div className="flex gap-6 border-b border-gray-300 md:w-[21%]">
      {tabItems.map((tab) => (
        <button
          onClick={() => changeTab(tab.key)}
          key={tab.key}
          className={`inline-flex pb-1 font-medium transition-all cursor-pointer ${
            activeTab === tab.key
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
