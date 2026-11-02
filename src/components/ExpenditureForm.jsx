import { useEffect, useState } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";
import {
  capitalExpenditureAccounts,
  economicClassOptions,
  goodsAndServicesAccounts,
  sourceOfFundingOptions,
} from "../data/BudgetExpenditureData";
import { getMyActivities } from "../store/features/activitySlice";
import {
  addExpenditure,
  cancelEditing,
  reviewExpenditure,
  updateExpenditure,
} from "../store/features/budgetSlice";
import {
  fetchBudgetValues,
  fetchNaturalAccounts,
  resetBudgetValues,
} from "../store/features/budgetDynamicSlice";

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600";

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "42px",
    borderColor: "#d1d5db",
    boxShadow: "none",
    borderRadius: "0.5rem",
    backgroundColor: state.isDisabled ? "#f3f4f6" : "white",
    fontSize: "0.875rem",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 80 }),
};

function FieldLabel({ children }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </label>
  );
}

export default function ExpenditureForm({ isOpen = false, onClose = () => {} }) {
  const dispatch = useDispatch();
  const { isEditing, isReviewing, formValues, editingIndex, records } =
    useSelector((state) => state.budget);
  const { naturalAccounts, budgetValues, loading: budgetLoading } =
    useSelector((state) => state.budgetDynamic);
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
  const [previousActualExpenditure, setPreviousActualExpenditure] = useState(0);
  const [previousReleases, setPreviousReleases] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recordToReview, setRecordToReview] = useState(null);

  const hasAllotment = Number(allotment) > 0;
  const usesAllotmentBalance =
    economicClass?.label === "Goods and Services" &&
    fundingSource?.label === "GOG" &&
    hasAllotment;

  const activityOptions = Array.isArray(activities)
    ? activities.map((activity) => ({
        value: activity.id,
        label: activity.name,
      }))
    : [];

  const filteredFundingOptions =
    economicClass?.value === "compensation of employees"
      ? sourceOfFundingOptions.filter(
          (opt) => opt.value === "DPF" || opt.value === "IGF",
        )
      : sourceOfFundingOptions;

  const fetchedAccountOptions = Array.isArray(naturalAccounts)
    ? naturalAccounts.map((acc) => {
        const value = typeof acc === "string" ? acc : acc?.naturalAccount;
        return { label: value, value };
      })
    : [];

  const naturalAccountOptions =
    selectedAccount?.value &&
    !fetchedAccountOptions.some((opt) => opt.value === selectedAccount.value)
      ? [selectedAccount, ...fetchedAccountOptions]
      : fetchedAccountOptions;

  useEffect(() => {
    dispatch(getMyActivities());
  }, [dispatch]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isReviewModalOpen) onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isReviewModalOpen, onClose]);

  useEffect(() => {
    if (!economicClass || !fundingSource) return;

    dispatch(
      fetchNaturalAccounts({
        eco: economicClass.label,
        fund: fundingSource.label,
      }),
    );
  }, [economicClass, fundingSource, dispatch]);

  useEffect(() => {
    if (!economicClass || !fundingSource || !selectedAccount) return;

    dispatch(
      fetchBudgetValues({
        eco: (economicClass?.label ?? "").trim(),
        fund: (fundingSource?.label ?? "").trim(),
        account: (selectedAccount?.value ?? "").trim(),
      }),
    );
  }, [selectedAccount, economicClass, fundingSource, dispatch]);

  useEffect(() => {
    if (isEditing || isReviewing || !economicClass) return;

    const validOptions =
      economicClass.value === "goods & services"
        ? goodsAndServicesAccounts
        : capitalExpenditureAccounts;

    const isStillValid = validOptions.some(
      (opt) => opt.value === selectedAccount?.value,
    );

    if (!isStillValid) setSelectedAccount(null);
  }, [economicClass]);

  useEffect(() => {
    if (isEditing || isReviewing) return;
    if (!selectedAccount || budgetLoading) return;
    if (budgetValues?.appropriation == null) return;

    setAppropriation(budgetValues.appropriation ?? "");
    setAllotment(Number(budgetValues.allotment ?? 0));
    setPreviousActualExpenditure(
      Number(budgetValues.previousActualExpenditure ?? 0),
    );
    setPreviousReleases(Number(budgetValues.previousReleases ?? 0));
    setAllotmentBalance(Number(budgetValues.allotmentBalance ?? 0));
    setAppropriationBalance(Number(budgetValues.appropriationBalance ?? 0));
  }, [budgetValues, selectedAccount, isEditing, isReviewing, budgetLoading]);

  const clearForm = () => {
    setSelectedActivity(null);
    setSelectedDate("");
    setEconomicClass(null);
    setFundingSource(null);
    setSelectedAccount(null);
    setDescription("");
    setAppropriation("");
    setAllotment("");
    setAllotmentBalance("");
    setAppropriationBalance("");
    setReleases("");
    setExpenditure("");
    setPayment("");
    setPreviousActualExpenditure(0);
    setPreviousReleases(0);
  };

  useEffect(() => {
    if (!isEditing && !isReviewing) {
      clearForm();
      return;
    }

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
          value: formValues.economicClassification,
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
    setSelectedAccount(
      formValues.naturalAccount && eco
        ? {
            label: formValues.naturalAccount,
            value: formValues.naturalAccount,
          }
        : null,
    );
    setDescription(formValues.description || "");
    setAppropriation(formValues.appropriation || "");
    setAllotment(formValues.allotment || "");
    setAllotmentBalance(formValues.allotmentBalance || "");
    setAppropriationBalance(formValues.appropriationBalance || "");
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

  const handleReleasesChange = (e) => {
    const value = Number(e.target.value || 0);
    setReleases(value);

    const remainingAppropriation =
      Number(appropriation || 0) - (Number(previousReleases || 0) + value);

    if (remainingAppropriation < 0) {
      toast.error("Releases cannot exceed available appropriation.");
      return;
    }

    setAppropriationBalance(remainingAppropriation);
  };

  const handleExpenditureChange = (e) => {
    const value = e.target.value;
    setExpenditure(value);

    const currentActual = Number(value || 0);

    if (economicClass?.value === "Goods and Services" && hasAllotment) {
      const previewBalance =
        Number(allotment) -
        (Number(previousActualExpenditure) + currentActual);

      setAllotmentBalance(previewBalance);

      if (previewBalance < 0) {
        toast.error("Actual expenditure cannot exceed available allotment!");
      }
      return;
    }

    if (currentActual > Number(releases || 0)) {
      toast.error("Actual expenditure cannot exceed releases.");
    }
  };

  const handlePaymentChange = (e) => {
    const value = e.target.value;
    setPayment(value);

    if (parseFloat(value) > parseFloat(expenditure || 0)) {
      toast.error("Actual payment cannot exceed actual expenditure.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReviewing) return;

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
        const id = formValues?.id ?? records?.[editingIndex]?.id;
        if (!id) {
          toast.error("Cannot update: record id not found.");
          return;
        }

        await dispatch(updateExpenditure({ id, formData: newRecord })).unwrap();
        toast.success("Record updated successfully!");
        dispatch(resetBudgetValues());
        dispatch(cancelEditing());
      } else {
        await dispatch(addExpenditure(newRecord)).unwrap();
        toast.success("Record added successfully!");
        dispatch(resetBudgetValues());
      }

      clearForm();
      onClose();
    } catch (err) {
      toast.error(err?.message || err || "Something went wrong");
    }
  };

  const handleExpenditureReview = async ({ id, comment }) => {
    await dispatch(reviewExpenditure({ id, reviewComment: comment })).unwrap();
    clearForm();
    dispatch(cancelEditing());
    onClose();
  };

  if (!isOpen) return null;

  const title = isReviewing
    ? "Review Expenditure Record"
    : isEditing
      ? "Edit Expenditure Record"
      : "Add Expenditure Record";

  const subtitle = isReviewing
    ? "These fields are filled from the selected record. Submit a review when the details look right."
    : isEditing
      ? "Update the expenditure details, then save the record."
      : "Appropriation, allotment, and balances are filled from the selected natural account.";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="expenditure-form-title"
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div>
              <h2
                id="expenditure-form-title"
                className="text-xl font-bold text-green-800"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <FieldLabel>Date</FieldLabel>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    disabled={isReviewing}
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Activity</FieldLabel>
                  <Select
                    options={activityOptions}
                    value={selectedActivity}
                    onChange={setSelectedActivity}
                    isLoading={activitiesLoading}
                    isDisabled={isReviewing}
                    placeholder="Search or select an activity..."
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Economic classification</FieldLabel>
                  <Select
                    options={economicClassOptions}
                    value={economicClass}
                    onChange={setEconomicClass}
                    isDisabled={isReviewing}
                    placeholder="Select economic classification"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Source of funding</FieldLabel>
                  <Select
                    options={filteredFundingOptions}
                    value={fundingSource}
                    onChange={setFundingSource}
                    isDisabled={isReviewing}
                    placeholder="Select source of funding"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <FieldLabel>Natural account</FieldLabel>
                  <Select
                    options={naturalAccountOptions}
                    value={selectedAccount}
                    onChange={setSelectedAccount}
                    isDisabled={!economicClass || !fundingSource || isReviewing}
                    placeholder="Select natural account"
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    styles={selectStyles}
                    filterOption={(option, inputValue) => {
                      const label = option?.label || "";
                      const search = inputValue || "";
                      return label.toLowerCase().includes(search.toLowerCase());
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Appropriation</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={`${fieldClass} bg-gray-50`}
                    value={appropriation || ""}
                    readOnly
                    placeholder="Not applicable"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Allotment</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={`${fieldClass} bg-gray-50`}
                    value={allotment ?? 0}
                    readOnly
                    placeholder="Not applicable"
                  />
                </div>

                {usesAllotmentBalance ? (
                  <div className="flex flex-col gap-2">
                    <FieldLabel>Allotment balance</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      className={`${fieldClass} bg-gray-50`}
                      value={allotmentBalance ?? 0}
                      readOnly
                      placeholder="Not applicable"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <FieldLabel>Appropriation balance</FieldLabel>
                    <input
                      type="number"
                      min="0"
                      className={`${fieldClass} bg-gray-50`}
                      value={appropriationBalance ?? 0}
                      readOnly
                      placeholder="Not applicable"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <FieldLabel>Releases</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
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

                <div className="flex flex-col gap-2">
                  <FieldLabel>Actual expenditure</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={expenditure || ""}
                    onChange={handleExpenditureChange}
                    disabled={isReviewing}
                    placeholder="Enter actual expenditure here..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Actual payment</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={payment || ""}
                    onChange={handlePaymentChange}
                    disabled={isReviewing}
                    placeholder="Enter actual payment here..."
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <input
                    type="text"
                    className={fieldClass}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isReviewing}
                    placeholder="Enter a description..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type={isReviewing ? "button" : "submit"}
                onClick={() => {
                  if (!isReviewing) return;
                  setRecordToReview(formValues);
                  setIsReviewModalOpen(true);
                }}
                className={`${
                  isReviewing
                    ? "bg-blue-600 hover:bg-blue-700"
                    : isEditing
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-green-600 hover:bg-green-700"
                } cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white`}
              >
                {isEditing ? "OK" : isReviewing ? "Review" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="relative z-[60]">
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          record={recordToReview}
          onSubmit={handleExpenditureReview}
          title="Review Expenditure"
        />
      </div>
    </>
  );
}
