const tabItems = [
  { key: "single", label: "Single entry" },
  { key: "upload", label: "Upload spreadsheet" },
];

export default function ActivityTab({ activeTab, changeTab }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
      {tabItems.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => changeTab(tab.key)}
            className={`cursor-pointer rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#166534] text-white dark:bg-[#39FF88] dark:text-[#0B132B]"
                : "text-gray-500 hover:bg-[#f3faf6] hover:text-[#166534]"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
