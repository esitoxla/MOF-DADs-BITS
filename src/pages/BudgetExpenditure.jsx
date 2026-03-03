import React from "react";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import BudgetTable from "../components/BudgetTable";
import toast from "react-hot-toast";
import { goodsAndServicesAccounts } from "../data/BudgetExpenditureData";
import { capitalExpenditureAccounts } from "../data/BudgetExpenditureData";
import { economicClassOptions } from "../data/BudgetExpenditureData";
import { sourceOfFundingOptions } from "../data/BudgetExpenditureData";
import { useSelector, useDispatch } from "react-redux";
import ReviewModal from "../components/ReviewModal";
import { resetBudgetValues } from "../store/features/budgetDynamicSlice";
import {
  fetchExpenditures,
  updateExpenditure,
  cancelEditing,
  addExpenditure,
  reviewExpenditure,
} from "../store/features/budgetSlice";
import {
  fetchNaturalAccounts,
  fetchBudgetValues,
} from "../store/features/budgetDynamicSlice";
import { getMyActivities } from "../store/features/activitySlice";

export default function BudgetExpenditure() {
  //redux handling the edit functionality
  const dispatch = useDispatch();
  const { isEditing, isReviewing, formValues, editingIndex, error } =
    useSelector((state) => state.budget);

  const {
    naturalAccounts,
    budgetValues,
    loading: budgetLoading,
  } = useSelector((state) => state.budgetDynamic);

  const { activities, loading: activitiesLoading } = useSelector(
    (state) => state.activity,
  );

  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fundingSource, setFundingSource] = useState(null);
  const [description, setDescription] = useState("");
  const [appropriation, setAppropriation] = useState("");
  const [allotment, setAllotment] = useState("");
  const [releases, setReleases] = useState("");
  const [payment, setPayment] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [allotmentBalance, setAllotmentBalance] = useState("");
  const [appropriationBalance, setAppropriationBalance] = useState("");

  const [isFormValid, setIsFormValid] = useState(true);

  const [showExpenditureAlert, setShowExpenditureAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showReleasesAlert, setShowReleasesAlert] = useState(false);

  const [previousActualExpenditure, setPreviousActualExpenditure] = useState(0);
  const [previousReleases, setPreviousReleases] = useState(0);

  //BudgetTable
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //review logic
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recordToReview, setRecordToReview] = useState(null);

  //for IGF DPF checks for allotment
  const hasAllotment = Number(allotment) > 0;

  // FOR activities

  //fetch activites
  useEffect(() => {
    dispatch(getMyActivities());
  }, [dispatch]);


  const activityOptions = Array.isArray(activities)
    ? activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      }))
    : [];

  // Determine available funding options based on selected economic class
  const filteredFundingOptions =
    economicClass?.value === "compensation of employees"
      ? sourceOfFundingOptions.filter(
          (opt) => opt.value === "DPF" || opt.value === "IGF",
        )
      : sourceOfFundingOptions;

  //Dynamically switch accounts based on selected economic class
  const naturalAccountOptions = Array.isArray(naturalAccounts)
    ? naturalAccounts.map((acc) => {
        const value = typeof acc === "string" ? acc : acc?.naturalAccount;

        return {
          label: value,
          value: value,
        };
      })
    : [];

  const usesAllotmentBalance =
    economicClass?.label === "Use of Goods and Services" &&
    fundingSource?.label === "GOG"; // &&
  // hasAllotment;

  ///ALL useEFFECTS LOGIC

  // Fetch NATURAL ACCOUNTS dynamically when eco + fund are selected
  useEffect(() => {
    if (!economicClass || !fundingSource) return;

    dispatch(
      fetchNaturalAccounts({
        eco: economicClass.label, // instead of value
        fund: fundingSource.label, // instead of value
      }),
    );
  }, [economicClass, fundingSource]);

  // Fetch budget values when natural account is selected
  useEffect(() => {
    if (!economicClass || !fundingSource || !selectedAccount) return;

    const payload = {
      eco: (economicClass?.label ?? "").trim(),
      fund: (fundingSource?.label ?? "").trim(),
      account: (selectedAccount?.value ?? "").trim(),
    };

    // console.log("Sending to backend:", payload);

    dispatch(fetchBudgetValues(payload));
  }, [selectedAccount, economicClass, fundingSource, dispatch]);

  //this handles the logic behind the relationship between economic classification and the natural account
  useEffect(() => {
    if (isEditing) {
      return;
    } else if (!economicClass) {
      return;
    }

    const validOptions =
      economicClass.value === "goods & services"
        ? goodsAndServicesAccounts
        : capitalExpenditureAccounts;

    const isStillValid = validOptions.some(
      (opt) => opt.value === selectedAccount?.value,
    );

    //if natural account selected does not correspond to that of the economic classification, set it to its default
    if (!isStillValid) {
      setSelectedAccount(null);
    }
  }, [economicClass]);

  // Autofill appropriation, allotment, and balance from backend
  useEffect(() => {
    if (!budgetValues || !selectedAccount) return;

    setAppropriation(budgetValues.appropriation ?? "");
    setAllotment(Number(budgetValues.allotment ?? 0));

    setPreviousActualExpenditure(
      Number(budgetValues.previousActualExpenditure ?? 0),
    );

    setPreviousReleases(Number(budgetValues.previousReleases ?? 0));

    setAllotmentBalance(Number(budgetValues.allotmentBalance ?? 0));
    setAppropriationBalance(Number(budgetValues.appropriationBalance ?? 0));
  }, [budgetValues, selectedAccount]);

  //handles populating fields that are dependent on each other(natural account, allotment, appropriation, allotment balance)
  // Handles populating fields when editing a record
  useEffect(() => {
    //RESET FORM when NOT editing or reviewing
    if (!isEditing && !isReviewing) {
      setSelectedActivity(null);
      setSelectedDate("");
      setEconomicClass(null);
      setFundingSource(null);
      setSelectedAccount(null);
      setDescription("");
      setAppropriation("");
      setAllotment("");
      setAllotmentBalance("");
      setReleases("");
      setExpenditure("");
      setPayment("");
      return;
    }

    // POPULATE FORM when editing or reviewing
    if (!formValues) return;

    setSelectedActivity(
      formValues.activity
        ? { label: formValues.activity, value: formValues.activity }
        : null,
    );

    setSelectedDate(formValues.date || "");

    const eco = formValues.economicClassification
      ? {
          label: formValues.economicClassification,
          value: formValues.economicClassification.toLowerCase(),
        }
      : null;

    setEconomicClass(eco);

    setFundingSource(
      formValues.sourceOfFunding
        ? {
            label: formValues.sourceOfFunding,
            value: formValues.sourceOfFunding,
          }
        : null,
    );

    if (formValues.naturalAccount && eco) {
      setSelectedAccount({
        label: formValues.naturalAccount,
        value: formValues.naturalAccount,
      });
    } else {
      setSelectedAccount(null);
    }

    setDescription(formValues.description || "");
    setAppropriation(formValues.appropriation || "");
    setAllotment(formValues.allotment || "");
    setAllotmentBalance(formValues.allotmentBalance || "");
    setReleases(formValues.releases || "");
    setExpenditure(formValues.actualExpenditure || "");
    setPayment(formValues.actualPayment || "");
  }, [isEditing, isReviewing, formValues]);

  useEffect(() => {
    if (
      economicClass?.value === "compensation of employees" &&
      fundingSource?.value === "DPF"
    ) {
      setFundingSource(null);
    }
  }, [economicClass, fundingSource]);

  //OTHER INPUTS LOGICS

  // Handle releases input
  const handleReleasesChange = (e) => {
    const value = Number(e.target.value || 0);
    setReleases(value);

    const appropriationNum = Number(appropriation || 0);
    const prevReleases = Number(previousReleases || 0);

    const remainingAppropriation = appropriationNum - (prevReleases + value);

    // releases can NEVER exceed appropriation
    if (remainingAppropriation < 0) {
      toast.error("Releases cannot exceed available appropriation.");
      setShowReleasesAlert(true);
      return;
    }

    setShowReleasesAlert(false);
    setAppropriationBalance(remainingAppropriation);
  };

  // Handle expenditure input
  const handleExpenditureChange = (e) => {
    const value = e.target.value;
    setExpenditure(value);

    const currentActual = Number(value || 0);

    // CASE 1: Goods & Services WITH allotment
    if (economicClass?.value === "Use of Goods and Services" && hasAllotment) {
      const previewBalance =
        Number(allotment) - (Number(previousActualExpenditure) + currentActual);

      setAllotmentBalance(previewBalance);

      if (previewBalance < 0) {
        toast.error("Actual expenditure cannot exceed available allotment!");
        setShowExpenditureAlert(true);
      } else {
        setShowExpenditureAlert(false);
      }

      return; // stop here — releases do NOT apply
    }

    // CASE 2: All other scenarios → expenditure ≤ releases
    if (currentActual > Number(releases || 0)) {
      toast.error("Actual expenditure cannot exceed releases.");
      setShowExpenditureAlert(true);
    } else {
      setShowExpenditureAlert(false);
    }
  };

  // Handle payment input
  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setPayment(value);

    if (parseFloat(value) > parseFloat(expenditure || 0)) {
      toast.error("Actual payment cannot exceed actual expenditure.");
      setShowPaymentAlert(true);
    } else {
      setShowPaymentAlert(false);
    }
  };

  //FORM SUBMISSION

  //handles submiting of records and editing a record
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedActivity) {
      toast.error("Activity is required!");
      return;
    }

    if (!selectedDate) {
      toast.error("Date is required!");
      return;
    }

    if (!economicClass) {
      toast.error("Economic Classification is required!");
      return;
    }

    if (!fundingSource) {
      toast.error("Source of funding must not be empty!");
      return;
    }

    if (!selectedAccount) {
      toast.error("Natural Account must not be empty!");
      return;
    }

    if (!description) {
      toast.error("Description is required!");
      return;
    }

    if (!isFormValid) {
      toast.error("Cannot add record — please fix input errors!");
      return;
    }

    // build the record to match backend field names
    const newRecord = {
      activity: selectedActivity?.label || selectedActivity?.value || "",
      date: selectedDate,
      economicClassification: economicClass?.label || "",
      sourceOfFunding: fundingSource?.label || "",
      naturalAccount: selectedAccount?.label || "",
      description,
      appropriation,
      allotment,
      allotmentBalance,
      releases,
      actualExpenditure: expenditure,
      actualPayment: payment,
    };

    try {
      if (isEditing) {
        // get the id of the record being edited:
        // prefer formValues.id (set by startEditing), fallback to records[editingIndex]?.id
        const id = formValues?.id ?? records?.[editingIndex]?.id;
        if (!id) {
          toast.error("Cannot update: record id not found.");
        } else {
          await dispatch(
            updateExpenditure({ id, formData: newRecord }),
          ).unwrap();
          toast.success("Record updated successfully!");
          dispatch(resetBudgetValues());
          dispatch(cancelEditing());

          // reset fetch drivers
          setEconomicClass(null);
          setFundingSource(null);
          setSelectedAccount(null);
        }
      } else {
        await dispatch(addExpenditure(newRecord)).unwrap();
        toast.success("Record added successfully!");

        // RE-FETCH BUDGET VALUES (SOURCE OF TRUTH)
        dispatch(
          fetchBudgetValues({
            eco: economicClass.label.trim(),
            fund: fundingSource.label.trim(),
            account: selectedAccount.value.trim(),
          }),
        );
      }

      // clear fields
      setSelectedActivity(null);
      setSelectedDate("");
      setEconomicClass(null);
      setFundingSource(null);
      setSelectedAccount(null);
      setDescription("");
      setAppropriation("");
      setAllotment("");
      setReleases("");
      setExpenditure("");
      setPayment("");
      setAllotmentBalance("");
    } catch (err) {
      // err is either the rejected value or an Error
      const message = err?.message || err || "Something went wrong";
      toast.error(message);
    }
  };

  //handles the submission of the edited record
  const handleEditRecord = (record) => {
    setSelectedActivity({ label: record.activity, value: record.activity });
    setSelectedDate(record.date);
    setEconomicClass({
      label: record.economicClass,
      value: record.economicClass,
    });
    setFundingSource({
      label: record.fundingSource,
      value: record.fundingSource,
    });

    setSelectedAccount({
      label: record.naturalAccount,
      value: record.naturalAccount,
    });

    setDescription(record.description);
    setAppropriation(record.appropriation);
    setAllotment(record.allotment);
    setAllotmentBalance(record.allotmentBalance);
    setReleases(record.releases);
    setExpenditure(record.expenditure);
    setPayment(record.payment);
  };

  //THIS HANDLES REVIEWING AN EXPENDITURE RECORD
  const handleExpenditureReview = async ({ id, comment }) => {
    await dispatch(reviewExpenditure({ id, reviewComment: comment })).unwrap();

    dispatch(fetchExpenditures());
    dispatch(cancelEditing());
  };

  return (
    <div className="flex flex-col gap-6 justify-center lg:px-4">
      <form className="min-h-screen w-full p-4 sm:p-6 flex flex-col">
        {/* --- ACTIVITIES FIELD --- */}
        <div className="flex flex-col sm:flex-row sm:items-center text-2xl  text-green-800 mb-8 border-0 shadow bg-white px-4 py-4 w-full gap-4">
          <label className="text-center sm:w-1/3 font-bold">ACTIVITIES</label>
          <div className="w-full sm:w-2/3">
            <Select
              options={activityOptions}
              value={selectedActivity}
              onChange={setSelectedActivity}
              isLoading={activitiesLoading}
              placeholder="Search or select an activity..."
              className="text-base"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "black", // Tailwind green-800
                  boxShadow: "none",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected
                    ? "#16a34a"
                    : state.isFocused
                      ? "#dcfce7"
                      : "white",
                  color: state.isSelected ? "white" : "black",
                }),
              }}
              // this ensures case-insensitive matching
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </div>
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
                  disabled={isReviewing}
                  className="border w-full py-[0.7rem] px-2 rounded"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ECONOMIC CLASSIFICATION
              </label>
              <Select
                options={economicClassOptions}
                value={economicClass} // should be an object like {value, label}
                onChange={setEconomicClass}
                isDisabled={isReviewing}
                placeholder="Select economic classification"
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
                SOURCE OF FUNDING
              </label>
              <Select
                options={filteredFundingOptions}
                value={fundingSource} // should be an object like {value, label}
                onChange={setFundingSource}
                isDisabled={isReviewing}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                NATURAL ACCOUNT
              </label>
              <Select
                options={naturalAccountOptions}
                value={selectedAccount}
                onChange={setSelectedAccount}
                isDisabled={!economicClass || !fundingSource || isReviewing}
                placeholder={`Select natural account`}
                isSearchable
                filterOption={(option, inputValue) => {
                  const label = option?.label || "";
                  const search = inputValue || "";
                  return label.toLowerCase().includes(search.toLowerCase());
                }}
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
                  //   color: "#000000",
                  // }),
                }}
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
                disabled={isReviewing}
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
                value={appropriation || ""}
                readOnly
                placeholder="Not applicable"
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
                value={allotment ?? 0}
                readOnly
                placeholder="Not applicable"
              />
            </div>

            {usesAllotmentBalance ? (
              <div className="flex flex-col gap-2">
                <label className="block text-gray-600 mb-1 font-semibold">
                  ALLOTMENT BALANCE
                </label>
                <input
                  type="number"
                  min="0"
                  className="py-[0.7rem] px-2 w-full outline rounded"
                  value={allotmentBalance ?? 0}
                  readOnly
                  placeholder="Not applicable"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="block text-gray-600 mb-1 font-semibold">
                  APPROPRIATION BALANCE
                </label>
                <input
                  type="number"
                  min="0"
                  className="py-[0.7rem] px-2 w-full outline rounded"
                  value={appropriationBalance ?? 0}
                  readOnly
                  placeholder="Not applicable"
                />
              </div>
            )}
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
                onChange={handleReleasesChange}
                disabled={isReviewing || hasAllotment}
                placeholder={
                  hasAllotment
                    ? "Releases not applicable"
                    : "Enter releases here..."
                }
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
                onChange={handleExpenditureChange}
                disabled={isReviewing}
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
                onChange={handlePaymentChange}
                disabled={isReviewing}
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
              setSelectedActivity(null);
              setSelectedDate("");
              setEconomicClass(null);
              setFundingSource(null);
              setSelectedAccount(null);
              setDescription("");
              setAppropriation("");
              setAllotment("");
              setReleases("");
              setExpenditure("");
              setPayment("");
              setAllotmentBalance("");
              setAppropriationBalance("");
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
            disabled={!isFormValid}
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
      <BudgetTable
        searchQuery={searchQuery}
        onEdit={handleEditRecord}
        setRecordToReview={setRecordToReview}
        setIsReviewModalOpen={setIsReviewModalOpen}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        record={recordToReview}
        onSubmit={handleExpenditureReview}
        title="Review Expenditure"
      />
    </div>
  );
}
