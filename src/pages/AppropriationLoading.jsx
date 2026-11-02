import { useState } from "react";
import AppropriationTab from "../components/AppropriationTab";
import AppropriationSingleForm from "../components/AppropriationSingleForm";
import AppropriationUpload from "../components/AppropriationUpload";

export default function AppropriationLoading() {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-green-800 dark:text-[#39FF88]">
            Appropriation & Allotment
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Load one budget line, or bring in a full spreadsheet.
          </p>
        </div>
        <AppropriationTab activeTab={activeTab} changeTab={setActiveTab} />
      </div>

      {activeTab === "single" ? <AppropriationSingleForm /> : <AppropriationUpload />}
    </div>
  );
}
