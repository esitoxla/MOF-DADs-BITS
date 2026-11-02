import { useEffect, useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { organizationOptions } from "../data/BudgetExpenditureData";
import {
  createActivity,
  resetActivityState,
} from "../store/features/activitySlice";

const fieldClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderColor: state.isFocused ? "#15803d" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(21, 128, 61, 0.2)" : "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    "&:hover": { borderColor: "#15803d" },
  }),
  menuPortal: (base) => ({ ...base, zIndex: 40 }),
};

export default function ActivitySingleForm() {
  const [organization, setOrganization] = useState(null);
  const [activities, setActivities] = useState("");

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.activity);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!organization || !activities.trim()) {
      toast.error("Organization and activities are required");
      return;
    }

    dispatch(
      createActivity({
        organization: organization.value,
        name: activities,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      toast.success("Activity added successfully!");
      setActivities("");
      setOrganization(null);
      dispatch(resetActivityState());
    }
  }, [success, dispatch]);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_8px_22px_rgba(15,23,42,0.05)] sm:p-6"
    >
      <div className="mb-5">
        <h4 className="text-base font-bold text-gray-900">New activity</h4>
        <p className="mt-1 text-sm text-gray-500">
          Activities entered here show up when a user records expenditure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Organization
          </span>
          <Select
            options={organizationOptions}
            placeholder="Search or select organization"
            value={organization}
            onChange={setOrganization}
            maxMenuHeight={220}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={selectStyles}
            filterOption={(option, inputValue) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Activities
          </span>
          <textarea
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            rows={4}
            className={`${fieldClass} resize-y`}
            placeholder="Enter the activity name"
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {typeof error === "string" ? error : "Could not save this activity."}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer rounded-lg bg-[#166534] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#14532d] disabled:opacity-60 dark:bg-[#39FF88] dark:text-[#0B132B] dark:hover:bg-[#2eeb78]"
        >
          {loading ? "Saving..." : "Save activity"}
        </button>
      </div>
    </form>
  );
}
