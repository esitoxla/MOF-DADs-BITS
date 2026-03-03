import React from "react";
import { useState, useEffect } from "react";
import { organizationOptions } from "../data/BudgetExpenditureData";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { createActivity, resetActivityState } from "../store/features/activitySlice";
import toast from "react-hot-toast";

export default function ActivitySingleForm() {
  const [organization, setOrganization] = useState(null);
  const [activities, setActivities] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useDispatch();

  const { loading, error, success } = useSelector((state) => state.activity);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!organization || !activities) {
      toast.error("Organization and activities are required");
      return;
    }

    dispatch(
      createActivity({
        organization: organization.value, // IMPORTANT (react-select returns object)
        name: activities,
      }),
    );
  };

  useEffect(() => {
    if (success) {
      toast.success("Activity added successfully!")
      setActivities("");
      setOrganization(null);
      dispatch(resetActivityState());
    }
  }, [success, dispatch]);

  return (
    <div>
      {" "}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-[70%] mx-auto"
      >
        <div className=" border-0 shadow-lg bg-white px-4 py-8">
          <div className="w-[80%] mx-auto flex flex-col gap-6">
            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Organization
              </label>
              <Select
                options={organizationOptions}
                placeholder="Search or select organization"
                value={organization}
                onChange={setOrganization}
                maxMenuHeight={130} //dropdown height
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: "black",
                    boxShadow: "none",
                    "&:hover": {
                      borderColor: "black",
                    },
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-1 font-semibold">
                Activities
              </label>
              <textarea
                type="text"
                value={activities}
                onChange={(e) => setActivities(e.target.value)}
                className="py-[0.7rem] px-2 w-full border border-black rounded outline-none focus:ring-0"
                placeholder="Enter all activities"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            // disabled={loading}
            className="mt-6 w-full bg-green-500 hover:bg-green-700 text-white px-4 py-2 font-semibold transition duration-300 shadow-md cursor-pointer lg:w-[20%]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
