import React from "react";
import { useState } from "react";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
toast
import { addReallocation, reviewReallocation, fetchReallocations } from "../store/features/reallocationSlice";
import ReallocationTable from "../components/ReallocationTable";
import ReviewModal from "../components/ReviewModal";
import {
  updateReallocation,
  cancelEditing,
} from "../store/features/reallocationSlice";

export default function ReallocationPage() {

  const dispatch = useDispatch();
  const { isEditing, isReviewing, formValues, editingIndex, error } =
      useSelector((state) => state.reallocation);

  const [selectedActivity, setSelectedActivity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [fundingSource, setFundingSource] = useState(null);
  const [description, setDescription] = useState("");
  const [appropriation, setAppropriation] = useState("");
  const [allotment, setAllotment] = useState("");
  const [releases, setReleases] = useState("");
  const [payment, setPayment] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [allotmentBalance, setAllotmentBalance] = useState("");

  //ReallocationTable
    const [records, setRecords] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    //review logic
      const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
      const [recordToReview, setRecordToReview] = useState(null);
  

  const sourceOfFundingOptions = [
    { value: "GOG", label: "GOG" },
  ];

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = {
    activity: selectedActivity,
    date: selectedDate,
    economicClassification: economicClass,
    sourceOfFunding: fundingSource?.value,
    naturalAccount: selectedAccount,
    description,
    appropriation: Number(appropriation),
    allotment: Number(allotment),
    allotmentBalance: Number(allotmentBalance),
    releases: Number(releases),
    actualExpenditure: Number(expenditure),
    actualPayment: Number(payment),
  };

  try {
    if (isEditing) {
      await dispatch(
        updateReallocation({ id: formValues.id, formData })
      ).unwrap();

      toast.success("Record updated successfully!");
    } else {
      await dispatch(addReallocation(formData)).unwrap();

      toast.success("Reallocation added successfully!");
    }

    dispatch(cancelEditing());
    resetForm();
  } catch (error) {
    toast.error(error || "Failed operation");
  }
};


const resetForm = () => {
  setSelectedActivity("");
  setSelectedDate("");
  setEconomicClass("");
  setFundingSource(null);
  setSelectedAccount("");
  setDescription("");
  setAppropriation("");
  setAllotment("");
  setReleases("");
  setExpenditure("");
  setPayment("");
  setAllotmentBalance("");
};

  const handleEditRecord = (record) => {
    setSelectedActivity(record.activity);

    setSelectedDate(record.date);

    setEconomicClass(record.economicClassification);

    setFundingSource({
      label: record.sourceOfFunding,
      value: record.sourceOfFunding,
    });

    setSelectedAccount(record.naturalAccount);

    setDescription(record.description);

    setAppropriation(record.appropriation);
    setAllotment(record.allotment);
    setAllotmentBalance(record.allotmentBalance);

    setReleases(record.releases);
    setExpenditure(record.actualExpenditure);
    setPayment(record.actualPayment);
  };

  const handleReallocationReview = async ({ id, comment }) => {
    try {
      await dispatch(
        reviewReallocation({ id, reviewComment: comment }),
      ).unwrap();

      toast.success("Reviewed successfully");
      dispatch(cancelEditing());
       resetForm();
    } catch (error) {
      toast.error(error || "Failed to review");
    }
  };
  

  return (
    <div className="flex flex-col gap-6 justify-center lg:px-4">
      <form
        onSubmit={handleSubmit}
        className="min-h-screen w-full p-4 sm:p-6 flex flex-col"
      >
        <div className="text-center text-2xl font-bold text-green-700 mb-8 border-0 shadow bg-white px-4 py-4 w-full">
          Reallocation
        </div>

        <div className="cursor-pointer shadow bg-white h-full py-8 px-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 bg-white  w-full px-4 mb-8">
            {/* --- DATE FIELD --- */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                DATE
              </label>
              <div className="">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  //   disabled={isReviewing}
                  className="border w-full py-[0.7rem] px-2 rounded"
                />
              </div>
            </div>

            {/* --- ACTIVITIES FIELD --- */}

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ACTIVITIES
              </label>
              <input
                type="text"
                className="border w-full py-[0.7rem] px-2 rounded"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter activities..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ECONOMIC CLASSIFICATION
              </label>
              <input
                type="text"
                value={economicClass}
                onChange={(e) => setEconomicClass(e.target.value)}
                className="border w-full py-[0.7rem] px-2 rounded"
                placeholder="Enter economic classification..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                SOURCE OF FUNDING
              </label>
              <Select
                options={sourceOfFundingOptions}
                value={fundingSource}
                onChange={setFundingSource}
                // isDisabled={isReviewing}
                placeholder="Select source of funding"
                isSearchable
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
                styles={{
                  control: (base) => ({
                    ...base,
                    padding: ".3rem .2rem",
                    boxShadow: "none",
                    borderColor: "black",
                    fontSize: "1rem",

                    backgroundColor: "white",
                  }),
                  // placeholder: (base) => ({
                  //   ...base,
                  //   color: "black",
                  // }),
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                NATURAL ACCOUNT
              </label>
              <input
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                // isDisabled={!economicClass || !fundingSource || isReviewing}
                placeholder="Enter natural account"
                className="border w-full py-[0.7rem] px-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-gray-600 mb-1 font-semibold"
              >
                DESCRIPTION
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter a description..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-gray-600 mb-1 font-semibold"
              >
                APPROPRIATION
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={appropriation}
                onChange={(e) => setAppropriation(e.target.value)}
                placeholder="Enter appropriation"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-gray-600 mb-1 font-semibold"
              >
                ALLOTMENT
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={allotment}
                onChange={(e) => setAllotment(e.target.value)}
                placeholder="Enter allotment"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ALLOTMENT BALANCE
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={allotmentBalance}
                onChange={(e) => setAllotmentBalance(e.target.value)}
                placeholder="Enter allotment balance"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 bg-white w-full px-4 mb-8">
            {/* RELEASES */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                RELEASES
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={releases || ""}
                onChange={(e) => setReleases(e.target.value)}
                // disabled={isReviewing || hasAllotment}
                placeholder="Enter Releases"
              />
            </div>

            {/* ACTUAL EXPENDITURE */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ACTUAL EXPENDITURE
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded "
                value={expenditure || ""}
                onChange={(e) => setExpenditure(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter actual expenditure here..."
              />
            </div>

            {/* ACTUAL PAYMENT */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ACTUAL PAYMENT
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded"
                value={payment || ""}
                onChange={(e) => setPayment(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter actual payment here..."
              />
            </div>
          </div>
        </div>

        <div className="text-right flex justify-end gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              setSelectedActivity("");
              setSelectedDate("");
              setEconomicClass("");
              setFundingSource(null);
              setSelectedAccount("");
              setDescription("");
              setAppropriation("");
              setAllotment("");
              setReleases("");
              setExpenditure("");
              setPayment("");
              setAllotmentBalance("");
                dispatch(cancelEditing());
              toast.success("Form reset successfully!");
            }}
            className="bg-gray-400 text-white px-4 py-2 font-semibold hover:bg-gray-500 transition duration-300 shadow-md cursor-pointer lg:w-[10%]"
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type={isReviewing ? "button" : "submit"}
            onClick={(e) => {
              if (isReviewing) {
                setRecordToReview(formValues); // record already in Redux
                setIsReviewModalOpen(true);
              } else {
                handleSubmit(e);
              }
            }}
            className={`${
              isReviewing
                ? "bg-blue-600 hover:bg-blue-700"
                : isEditing
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 font-semibold transition duration-300 shadow-md cursor-pointer lg:w-[10%]`}
          >
            {isReviewing ? "Review" : isEditing ? "OK" : "Submit"}
          </button>
        </div>
      </form>

      {/* --- SEARCH BAR --- */}
      <div className="flex items-center justify-between mb-4 w-full px-6">
        <input
          type="text"
          placeholder="Search any field..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded-md w-full lg:w-1/3 md:w-1/2"
        />
      </div>
      <ReallocationTable
        searchQuery={searchQuery}
        onEdit={handleEditRecord}
        setRecordToReview={setRecordToReview}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        record={recordToReview}
        onSubmit={handleReallocationReview}
        title="Review Reallocation"
      />
    </div>
  );
}
