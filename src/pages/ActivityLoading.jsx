import { useState } from "react";
import ActivityTab from "../components/ActivityTab";
import ActivityUpload from "../components/ActivityUpload";
import ActivitySingleForm from "../components/ActivitySingleForm";

export default function ActivityLoading() {
  const [activeTab, setActiveTab] = useState("single");

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-green-800 dark:text-[#39FF88]">
            Activities
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add an activity for an organization, or upload them together.
          </p>
        </div>
        <ActivityTab activeTab={activeTab} changeTab={setActiveTab} />
      </div>

      {activeTab === "single" ? <ActivitySingleForm /> : <ActivityUpload />}
    </div>
  );
}
