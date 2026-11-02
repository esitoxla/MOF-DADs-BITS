import { useEffect, useState } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";
import { economicClassOptions } from "../data/BudgetExpenditureData";
import { fetchNaturalAccounts } from "../store/features/budgetDynamicSlice";
import {
  addReallocation,
  cancelEditing,
  reviewReallocation,
  updateReallocation,
} from "../store/features/reallocationSlice";

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

const sourceOfFundingOptions = [{ value: "GOG", label: "GOG" }];

function FieldLabel({ children }) {
  return (
    <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </label>
  );
}

export default function ReallocationForm({
  isOpen = false,
  onClose = () => {},
}) {
  const dispatch = useDispatch();
  const { isEditing, isReviewing, formValues } = useSelector(
    (state) => state.reallocation,
  );
  const { naturalAccounts } = useSelector((state) => state.budgetDynamic);

  const [activity, setActivity] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fundingSource, setFundingSource] = useState(null);
  const [description, setDescription] = useState("");
  const [amountReallocated, setAmountReallocated] = useState("");
  const [amountReleased, setAmountReleased] = useState("");
  const [payment, setPayment] = useState("");
  const [expenditure, setExpenditure] = useState("");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recordToReview, setRecordToReview] = useState(null);

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

  const clearForm = () => {
    setActivity("");
    setSelectedDate("");
    setEconomicClass(null);
    setFundingSource(null);
    setSelectedAccount(null);
    setDescription("");
    setAmountReallocated("");
    setAmountReleased("");
    setExpenditure("");
    setPayment("");
  };

  useEffect(() => {
    if (!isEditing && !isReviewing) {
      clearForm();
      return;
    }

    if (!formValues) return;

    setActivity(formValues.activity || "");
    setSelectedDate(formValues.date || "");
    setEconomicClass(
      formValues.economicClassification
        ? {
            label: formValues.economicClassification,
            value: formValues.economicClassification,
          }
        : null,
    );
    setFundingSource(
      formValues.sourceOfFunding
        ? {
            label: formValues.sourceOfFunding,
            value: formValues.sourceOfFunding,
          }
        : null,
    );
    setSelectedAccount(
      formValues.naturalAccount
        ? {
            label: formValues.naturalAccount,
            value: formValues.naturalAccount,
          }
        : null,
    );
    setDescription(formValues.description || "");
    setAmountReallocated(formValues.amountReallocated || "");
    setAmountReleased(formValues.amountReleased || "");
    setExpenditure(formValues.actualExpenditure || "");
    setPayment(formValues.actualPayment || "");
  }, [isEditing, isReviewing, formValues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isReviewing) return;

    if (!amountReallocated) {
      return toast.error("Amount reallocated is required");
    }

    const parsedAmountReallocated = Number(amountReallocated);
    const parsedAmountReleased = Number(amountReleased);
    const parsedExpenditure = Number(expenditure);
    const parsedPayment = Number(payment);

    if (parsedAmountReleased > parsedAmountReallocated) {
      return toast.error("Amount released cannot exceed amount reallocated.");
    }
    if (parsedExpenditure > parsedAmountReleased) {
      return toast.error("Actual expenditure cannot exceed amount released.");
    }
    if (parsedPayment > parsedAmountReleased) {
      return toast.error("Actual payment cannot exceed amount released.");
    }
    if (parsedPayment > parsedExpenditure) {
      return toast.error("Actual payment cannot exceed actual expenditure.");
    }

    const formData = {
      activity,
      date: selectedDate,
      economicClassification: economicClass?.value,
      sourceOfFunding: fundingSource?.value,
      naturalAccount: selectedAccount?.value,
      description,
      amountReallocated: parsedAmountReallocated,
      amountReleased: parsedAmountReleased,
      actualExpenditure: parsedExpenditure,
      actualPayment: parsedPayment,
    };

    try {
      if (isEditing) {
        await dispatch(
          updateReallocation({ id: formValues.id, formData }),
        ).unwrap();
        toast.success("Record updated successfully!");
      } else {
        await dispatch(addReallocation(formData)).unwrap();
        toast.success("Reallocation added successfully!");
      }

      dispatch(cancelEditing());
      clearForm();
      onClose();
    } catch (error) {
      toast.error(error || "Failed operation");
    }
  };

  const handleReallocationReview = async ({ id, comment }) => {
    await dispatch(
      reviewReallocation({ id, reviewComment: comment }),
    ).unwrap();
    dispatch(cancelEditing());
    clearForm();
    onClose();
  };

  if (!isOpen) return null;

  const title = isReviewing
    ? "Review Reallocation Record"
    : isEditing
      ? "Edit Reallocation Record"
      : "Add Reallocation Record";

  const subtitle = isReviewing
    ? "These fields are filled from the selected record. Submit a review when the details look right."
    : isEditing
      ? "Update the reallocation details, then save the record."
      : "Released amount, expenditure, and payment cannot exceed the amounts above them.";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reallocation-form-title"
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div>
              <h2
                id="reallocation-form-title"
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
                  <input
                    type="text"
                    className={fieldClass}
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    disabled={isReviewing}
                    placeholder="Enter activities..."
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
                    options={sourceOfFundingOptions}
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
                  <FieldLabel>Amount reallocated</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={amountReallocated || ""}
                    onChange={(e) => setAmountReallocated(e.target.value)}
                    disabled={isReviewing}
                    placeholder="Enter amount reallocated"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Amount released</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={amountReleased || ""}
                    onChange={(e) => setAmountReleased(e.target.value)}
                    disabled={isReviewing}
                    placeholder="Enter amount released"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <FieldLabel>Actual expenditure</FieldLabel>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={expenditure || ""}
                    onChange={(e) => setExpenditure(e.target.value)}
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
                    onChange={(e) => setPayment(e.target.value)}
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
                {isReviewing ? "Review" : isEditing ? "OK" : "Submit"}
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
          onSubmit={handleReallocationReview}
          title="Review Reallocation"
        />
      </div>
    </>
  );
}
