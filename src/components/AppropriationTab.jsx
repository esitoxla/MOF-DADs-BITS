import React from 'react'

const tabItems = [
  { key: "single", label: "Single" },
  { key: "upload", label: "Upload CSV" },
];

export default function AppropriationTab({ activeTab, changeTab }) {
  return (
    <div className='mx-auto w-full'>
    <div className="flex justify-center gap-6 border-b border-gray-300 md:w-[21%]">
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
    </div>
  );
}
