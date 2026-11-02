const tabItems = [
  { key: "users", label: "Users" },
  { key: "loading", label: "Appropriation & Allotment Loading" },
  { key: "activitiesLoading", label: "Activities Loading" },
  { key: "virement", label: "Virement" },
];

export default function AdminTab({ activeTab, changeTab }) {
  return (
    <div className="flex flex-wrap gap-1.5 rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_8px_22px_rgba(15,23,42,0.05)]">
      {tabItems.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            type="button"
            key={tab.key}
            onClick={() => changeTab(tab.key)}
            className={`cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              isActive
                ? "bg-[#e8f6ee] text-[#166534] shadow-sm dark:bg-[rgba(57,255,136,0.12)] dark:text-[#39FF88]"
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
