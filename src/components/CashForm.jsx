import React from "react";
import { useState, useEffect } from "react";
import { cashAccountOptions, cashCurrencyOptions } from "../data/CashFormData";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCashRecord, updateCashRecord, cancelEditing, reviewCashRecord } from "../store/features/cashSlice";
import ReviewModal from "./ReviewModal";

export default function CashForm() {
  const [selectedDate, setSelectedDate] = useState("");
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState(null);

   //review logic
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [recordToReview, setRecordToReview] = useState(null);

  const { authUser } = useSelector((state) => state.auth);

  const { formValues, isEditing, isReviewing } = useSelector((state) => state.cash);

  console.log(formValues);

  const dispatch = useDispatch();

  const clearForm = () => {
    setSelectedDate("");
    setAccount(null);
    setBalance("");
    setCurrency("");
  };


  //useEffect for edit and review, also form populating values and clearing them when edit or review is false
 useEffect(() => {
   // Exit edit/review → clear form
   if (!isEditing && !isReviewing) {
     clearForm();
     return;
   }

   // Enter edit/review → populate form
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

    //edit functionality
        if (isEditing) {
          dispatch(updateCashRecord({ id: formValues.id, formData }))
            .unwrap()
            .then(() => {
              toast.success("Revenue updated successfully!");
              clearForm();
              dispatch(cancelEditing());
            })
            .catch((err) => toast.error(err));
          return;
        }

    dispatch(addCashRecord(formData))
      .unwrap()
      .then(() => {
        toast.success("Cash record added successfully!");
        clearForm(); // RESET FORM
      })
      .catch((err) => toast.error(err));
  };


  // REVENUE
  const handleCashReview = async ({ id, comment }) => {
    await dispatch(reviewCashRecord({ id, reviewComment: comment })).unwrap();

    clearForm();
    dispatch(cancelEditing());
  };

  return (
    <div className="flex flex-col gap-6 justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full py-4 sm:py-6 flex flex-col gap"
      >
        <div className="text-center text-2xl font-bold text-green-800 mb-8 border-0 shadow bg-white px-4 py-4 w-full">
          Cash Position
        </div>

        <div className=" cursor-pointer shadow bg-white h-full py-8 px-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                DATE
              </label>
              <div className="">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  // disabled={isReviewing}
                  className="border w-full py-[0.7rem] px-2 rounded"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                ACCOUNT NAME
              </label>

              <Select
                options={cashAccountOptions}
                value={account}
                onChange={(value) => {
                  setAccount(value);
                }}
                // disabled={isReviewing}
                placeholder="Select acount name"
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
                  //   color: "#000000",
                  // }),
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label
                htmlFor=""
                className="block text-gray-600 mb-1 font-semibold"
              >
                CURRENCY
              </label>
              <Select
                options={cashCurrencyOptions}
                value={currency}
                onChange={(value) => {
                  setCurrency(value);
                }}
                // disabled={isReviewing}
                placeholder="Select currency"
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
                  //   color: "#000000",
                  // }),
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-600 mb-1 font-semibold">
                BALANCE
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded "
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter balance here..."
              />
            </div>
          </div>
        </div>

        <div className="text-right flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              dispatch(cancelEditing());
              toast.success("Form reset successfully!");
            }}
            className="bg-gray-400 text-white px-4 py-2 font-semibold hover:bg-gray-500 transition duration-300 shadow-md cursor-pointer lg:w-[10%]"
          >
            Cancel
          </button>

          <button
            type={isReviewing ? "button" : "submit"}
            onClick={(e) => {
              if (isReviewing) {
                e.preventDefault();
                setRecordToReview(formValues);
                setIsReviewModalOpen(true);
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
            {isEditing ? "OK" : isReviewing ? "Review" : "Submit"}
          </button>
        </div>
      </form>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        record={recordToReview}
        onSubmit={handleCashReview}
        title="Review Cash Record"
      />
    </div>
  );
}
