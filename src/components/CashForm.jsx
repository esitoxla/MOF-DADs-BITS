import { useState, useEffect } from "react";
import { cashAccountOptions, cashCurrencyOptions } from "../data/CashFormData";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import {
  addCashRecord,
  updateCashRecord,
  cancelEditing,
  reviewCashRecord,
} from "../store/features/cashSlice";
import ReviewModal from "./ReviewModal";

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

export default function CashForm({ isOpen = false, onClose = () => {} }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recordToReview, setRecordToReview] = useState(null);

  const { formValues, isEditing, isReviewing } = useSelector(
    (state) => state.cash,
  );
  const dispatch = useDispatch();

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

  const clearForm = () => {
    setSelectedDate("");
    setAccount(null);
    setBalance("");
    setCurrency(null);
  };

  useEffect(() => {
    if (!isEditing && !isReviewing) {
      clearForm();
      return;
    }

    if (formValues && Object.keys(formValues).length > 0) {
      setSelectedDate(formValues.as_at_date || "");
      setAccount(
        formValues.account_name
          ? {
              label: formValues.account_name,
              value: formValues.account_name,
            }
          : null,
      );
      setCurrency(
        formValues.currency
          ? {
              label: formValues.currency,
              value: formValues.currency,
            }
          : null,
      );
      setBalance(formValues.balance || "");
    }
  }, [isEditing, isReviewing, formValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReviewing) return;

    if (!selectedDate) {
      toast.error("Date is required!");
      return;
    }
    if (!account) {
      toast.error("Account is required!");
      return;
    }
    if (!currency) {
      toast.error("Currency is required!");
      return;
    }
    if (!balance) {
      toast.error("Balance is required!");
      return;
    }

    const formData = {
      as_at_date: selectedDate,
      account_name: account.value,
      currency: currency.value,
      balance,
    };

    if (isEditing) {
      dispatch(updateCashRecord({ id: formValues.id, formData }))
        .unwrap()
        .then(() => {
          toast.success("Cash record updated successfully!");
          clearForm();
          dispatch(cancelEditing());
          onClose();
        })
        .catch((err) => toast.error(err));
      return;
    }

    dispatch(addCashRecord(formData))
      .unwrap()
      .then(() => {
        toast.success("Cash record added successfully!");
        clearForm();
        onClose();
      })
      .catch((err) => toast.error(err));
  };

  const handleCashReview = async ({ id, comment }) => {
    await dispatch(reviewCashRecord({ id, reviewComment: comment })).unwrap();
    clearForm();
    dispatch(cancelEditing());
    onClose();
  };

  if (!isOpen) return null;

  const title = isReviewing
    ? "Review Cash Record"
    : isEditing
      ? "Edit Cash Record"
      : "Add Cash Record";

  const subtitle = isReviewing
    ? "These fields are filled from the selected record. Submit a review when the details look right."
    : isEditing
      ? "Update the cash position details, then save the record."
      : "Enter the account balance for the selected date.";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cash-form-title"
          className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div>
              <h2
                id="cash-form-title"
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
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    disabled={isReviewing}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Account name
                  </label>
                  <Select
                    options={cashAccountOptions}
                    value={account}
                    onChange={setAccount}
                    placeholder="Select account name"
                    isSearchable
                    isDisabled={isReviewing}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    styles={selectStyles}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Currency
                  </label>
                  <Select
                    options={cashCurrencyOptions}
                    value={currency}
                    onChange={setCurrency}
                    placeholder="Select currency"
                    isSearchable
                    isDisabled={isReviewing}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    styles={selectStyles}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={balance}
                    disabled={isReviewing}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="Enter balance here..."
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
          onSubmit={handleCashReview}
          title="Review Cash Record"
        />
      </div>
    </>
  );
}
