import { useState, useEffect } from "react";
import Select from "react-select";
import { X } from "lucide-react";
import {
  revenueCategoriesOptions,
  revenueBudgetProjections,
  organizationRetentionRates,
} from "../data/RevenueFormsData";
import { useSelector, useDispatch } from "react-redux";
import {
  addRevenue,
  updateRevenue,
  reviewRevenue,
  cancelEditing,
} from "../store/features/revenueSlice";
import toast from "react-hot-toast";
import ReviewModal from "./ReviewModal";

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600";

export default function RevenueForm({ isOpen = false, onClose = () => {} }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [revenue, setRevenue] = useState(null);
  const [projectionB, setProjectionB] = useState("");
  const [collections, setCollections] = useState("");
  const [payment, setPayment] = useState("");
  const [retention, setRetention] = useState("");
  const [remarks, setRemarks] = useState("");
  const [retentionRate, setRetentionRate] = useState(0);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [recordToReview, setRecordToReview] = useState(null);

  const { authUser: user } = useSelector((state) => state.auth);
  const { formValues, isEditing, isReviewing } = useSelector(
    (state) => state.revenue,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.organization) {
      const rate = organizationRetentionRates[user.organization];
      setRetentionRate(rate);
    }
  }, [user]);

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

  const handleCollectionsChange = (value) => {
    setCollections(value);

    const C = Number(value);
    const rate = Number(retentionRate);

    if (rate === undefined || rate === null || isNaN(rate)) {
      return;
    }

    if (C <= 0 || isNaN(C)) {
      setPayment("");
      setRetention("");
      return;
    }

    const E = (rate / 100) * C;
    const D = C - E;

    setRetention(E.toFixed(2));
    setPayment(D.toFixed(2));
  };

  const clearForm = () => {
    setSelectedDate("");
    setRevenue(null);
    setProjectionB("");
    setCollections("");
    setPayment("");
    setRetention("");
    setRemarks("");
  };

  useEffect(() => {
    if (!isEditing && !isReviewing) {
      clearForm();
      return;
    }

    if ((isEditing || isReviewing) && formValues) {
      setSelectedDate(formValues.date || "");
      setRevenue({
        label: formValues.revenue_category,
        value: formValues.revenue_category,
      });
      setProjectionB(formValues.budgetProjections || "");
      setCollections(formValues.actual_collection || "");
      setPayment(formValues.payment_amount || "");
      setRetention(formValues.retention_amount || "");
      setRemarks(formValues.remarks || "");
    }
  }, [isEditing, isReviewing, formValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReviewing) return;

    if (!selectedDate) {
      toast.error("Date is required!");
      return;
    }
    if (!revenue) {
      toast.error("Revenue is required!");
      return;
    }
    if (!projectionB) {
      toast.error("ProjectionB is required!");
      return;
    }
    if (!collections) {
      toast.error("Collections is required!");
      return;
    }
    if (!remarks) {
      toast.error("Remarks is required!");
      return;
    }

    const formData = {
      date: selectedDate,
      revenueCategory: revenue.value,
      budgetProjections: projectionB,
      actualCollection: Number(collections),
      payment: Number(payment),
      retention: Number(retention),
      remarks,
    };

    if (isEditing) {
      dispatch(updateRevenue({ id: formValues.id, formData }))
        .unwrap()
        .then(() => {
          toast.success("Revenue updated successfully!");
          clearForm();
          dispatch(cancelEditing());
          onClose();
        })
        .catch((err) => toast.error(err));
      return;
    }

    dispatch(addRevenue(formData))
      .unwrap()
      .then(() => {
        toast.success("Revenue added successfully!");
        clearForm();
        onClose();
      })
      .catch((err) => toast.error(err));
  };

  const handleRevenueReview = async ({ id, comment }) => {
    await dispatch(reviewRevenue({ id, reviewComment: comment })).unwrap();
    clearForm();
    dispatch(cancelEditing());
    onClose();
  };

  if (!isOpen) return null;

  const title = isReviewing
    ? "Review Revenue Record"
    : isEditing
      ? "Edit Revenue Record"
      : "Add Revenue Record";

  const subtitle = isReviewing
    ? "These fields are filled from the selected record. Submit a review when the details look right."
    : isEditing
      ? "Update the collection details, then save the record."
      : "Payment into the consolidated fund and retention are calculated from your organization's retention rate.";

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="revenue-form-title"
          className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-4">
            <div>
              <h2
                id="revenue-form-title"
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
                    Revenue categories
                  </label>
                  <Select
                    options={revenueCategoriesOptions}
                    value={revenue}
                    onChange={(value) => {
                      setRevenue(value);
                      setProjectionB(revenueBudgetProjections[value.value]);
                    }}
                    placeholder="Select revenue category"
                    isSearchable
                    isDisabled={isReviewing}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    filterOption={(option, inputValue) =>
                      option.label
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    }
                    styles={{
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
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Budget projections
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={projectionB || ""}
                    onChange={(e) => setProjectionB(e.target.value)}
                    disabled={isReviewing}
                    placeholder="Enter budget projections here..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Actual collections
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={fieldClass}
                    value={collections}
                    disabled={isReviewing}
                    onChange={(e) => handleCollectionsChange(e.target.value)}
                    placeholder="Enter actual collection here..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Payment into consolidated fund
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`${fieldClass} bg-gray-50`}
                    value={payment}
                    readOnly
                    placeholder="Auto calculated..."
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Retention
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={`${fieldClass} bg-gray-50`}
                    value={retention}
                    readOnly
                    placeholder="Auto calculated..."
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Remarks
                  </label>
                  <input
                    type="text"
                    className={fieldClass}
                    value={remarks}
                    disabled={isReviewing}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter a remark..."
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
          onSubmit={handleRevenueReview}
          title="Review Revenue Record"
        />
      </div>
    </>
  );
}
