import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select"
import { revenueCategoriesOptions, revenueBudgetProjections, organizationRetentionRates } from "../data/RevenueFormsData";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addRevenue } from "../store/features/revenueSlice";
import toast from "react-hot-toast";


export default function RevenueForm() {
  const [selectedDate, setSelectedDate] = useState("");
  const [revenue, setRevenue] = useState(null);
  const [projectionB, setProjectionB] = useState(null);
  const [collections, setCollections] = useState("");
  const [payment, setPayment] = useState("");
  const [retention, setRetention] = useState("");
  // const [projectionYear, setProjectionYear] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [retentionRate, setRetentionRate] = useState(0);

  const { authUser: user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();




  //Load the retention rate from the logged-in user
 useEffect(() => {
   if (user?.organization) {
     const rate = organizationRetentionRates[user.organization];
     console.log("Retention Rate Loaded:", rate);
     setRetentionRate(rate);
   }
 }, [user]);



  // Auto-calculate logic based on retention rate
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Date is required!");
      return;
    }
    if (!revenue) {
      toast.error("Date is required!");
      return;
    }
    if (!projectionB) {
      toast.error("Date is required!");
      return;
    }
    if (!collections) {
      toast.error("Date is required!");
      return;
    }
    if (!remarks) {
      toast.error("Date is required!");
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

    console.log("Submitting Revenue Data:", formData);

    dispatch(addRevenue(formData))
      .unwrap()
      .then(() => {
        toast.success("Revenue record added successfully!");

        // Reset form
        setSelectedDate("");
        setRevenue(null);
        setProjectionB("");
        setCollections("");
        setPayment("");
        setRetention("");
        setRemarks("");
      })
      .catch((err) => {
        toast.error("Failed to add revenue: " + err);
      });
  };



  return (
    <div className="flex flex-col gap-6 justify-center">
      <form onSubmit={handleSubmit} className="min-h-screen w-full p-4 sm:p-6 flex flex-col">
        <div className=" text-center text-2xl font-bold text-green-800 mb-8 border-0 shadow bg-white px-4 py-4 w-full">
          IGF Revenue Collections
        </div>

        <div className="font-semibold cursor-pointer shadow bg-white h-full py-8 px-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">DATE</label>
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
              <label className="text-gray-500">REVENUE CATEGORIES</label>

              <Select
                options={revenueCategoriesOptions}
                value={revenue}
                onChange={(value) => {
                  setRevenue(value);
                  setProjectionB(revenueBudgetProjections[value.value]); // <-- Auto-fill
                }}
                // disabled={isReviewing}
                placeholder="Select revenue category"
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
                    fontWeight: 600,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#000000",
                  }),
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                BUDGET PROJECTIONS
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={projectionB || ""}
                readOnly
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-500">ACTUAL COLLECTIONS</label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={collections}
                onChange={(e) => handleCollectionsChange(e.target.value)}
                // disabled={isReviewing}
                placeholder="Enter actual collection here..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                PAYMENT INTO CONSOLIDATED FUND
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={payment}
                readOnly
                placeholder="Auto calculated..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                RETENTION
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={retention}
                readOnly
                placeholder="Auto calculated..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10  w-full px-4 mb-8">
            {/* <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                BUDGET PROJECTIONS (END OF YEAR)
              </label>
              <input
                type="number"
                min="0"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={projectionYear || ""}
                readOnly
                disabled
              />
            </div> */}

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                REMARKS
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black placeholder:text-sm"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter a remark..."
              />
            </div>
          </div>
        </div>

        <div className="text-right flex justify-end gap-4">
          <button className="bg-gray-400 text-white px-4 py-2 font-semibold hover:bg-gray-500 transition duration-300 shadow-md cursor-pointer lg:w-[10%]">
            Cancel
          </button>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition duration-300 shadow-md cursor-pointer lg:w-[10%]">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
