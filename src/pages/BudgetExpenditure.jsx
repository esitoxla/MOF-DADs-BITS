import React from "react";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import BudgetTable from "../components/BudgetTable";
import toast, { Toaster } from "react-hot-toast";

export default function BudgetExpenditure() {
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
  const [isFormValid, setIsFormValid] = useState(true);

  const [showExpenditureAlert, setShowExpenditureAlert] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [showReleasesAlert, setShowReleasesAlert] = useState(false);

  //BudgetTable
  const [records, setRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Create activities 1–20 as options for react-select
  const activityOptions = Array.from({ length: 20 }, (_, i) => ({
    value: i + 1,
    label: `Activity ${i + 1}`,
  }));

  const goodsAndServicesAccounts = [
    { value: "2210101", label: "2210101 - Printed Material and Stationery" },
    {
      value: "2210102",
      label: "2210102 - Office Facilities, Supplies and Accessories",
    },
    { value: "2210103", label: "2210103 - Refreshment Items" },
    { value: "2210104", label: "2210104 - Medical Supplies" },
    { value: "2210105", label: "2210105 - Drugs" },
  ];

  const capitalExpenditureAccounts = [
    { value: "3111102 ", label: "3111102 - Destitute Homes" },
    { value: "3111103", label: "3111103 - Bungalows/Flats" },
    { value: "3111104", label: "3111104 - Homes of Aged" },
    { value: "3111105", label: "3111105 - Palace" },
    { value: "3111106", label: "3111106 - Barracks" },
  ];

  const dataMap = {
    "goods & services": {
      IGF: { appropriation: 120000, allotment: 10000 },
      DPF: { appropriation: 150000, allotment: 12000 },
      GOG: { appropriation: 200000, allotment: 17000 },
    },
    "capital expenditure": {
      IGF: { appropriation: 250000, allotment: 20000 },
      DPF: { appropriation: 300000, allotment: 25000 },
      GOG: { appropriation: 400000, allotment: 35000 },
    },
  };

  //
  const economicClassOptions = [
    { value: "goods & services", label: "Use of goods & services" },
    { value: "capital expenditure", label: "Capital expenditure" },
  ];

  const sourceOfFundingOptions = [
    { value: "GOG", label: "GOG" },
    { value: "DPF", label: "DPF" },
    { value: "IGF", label: "IGF" },
  ];

  //Dynamically switch accounts based on selected economic class
  const naturalAccountOptions =
    economicClass?.value === "goods & services"
      ? goodsAndServicesAccounts
      : capitalExpenditureAccounts;

  // Auto-fill based on both selected fields
  useEffect(() => {
    const ecoValue = economicClass?.value;
    const fundValue = fundingSource?.value;

    if (ecoValue && fundValue) {
      const selectedData = dataMap[ecoValue]?.[fundValue];
      if (selectedData) {
        setAppropriation(selectedData.appropriation);
        setAllotment(selectedData.allotment);
      } else {
        setAppropriation("");
        setAllotment("");
      }
    }
  }, [economicClass, fundingSource]);

  //
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Cannot add record — please fix input errors!");
      return;
    }

    // build the record
    const newRecord = {
      activity: selectedActivity?.label || "",
      date: selectedDate,
      economicClass: economicClass?.label || "",
      fundingSource: fundingSource?.label || "",
      naturalAccount: selectedAccount?.label || "",
      description,
      appropriation,
      allotment,
      releases,
      expenditure,
      payment,
      allotmentBalance,
    };

    // add it to the table
    setRecords([...records, newRecord]);
     toast.success("Record submitted successfully!");

    // clear fields
    setSelectedActivity(null);
    setSelectedDate("");
    setEconomicClass("Select");
    setFundingSource("select");
    setSelectedAccount(null);
    setDescription("");
    setAppropriation("");
    setAllotment("");
    setReleases("");
    setExpenditure("");
    setPayment("");
    setAllotmentBalance("");
  };

  //This ensures your Allotment Balance updates automatically when releases, allotment, or the previous records change.
  useEffect(() => {
    const releaseNum = parseFloat(releases);
    const allotmentNum = parseFloat(allotment);
    const expNum = parseFloat(expenditure);
    const payNum = parseFloat(payment);

    let newBalance = allotmentBalance;

    // ---- 1 CALCULATE NEW BALANCE LOCALLY ----
    if (!isNaN(allotmentNum)) {
      if (records.length === 0) {
        newBalance = isNaN(releaseNum)
          ? allotmentNum
          : allotmentNum - releaseNum;
      } else {
        const lastBalance = parseFloat(
          records[records.length - 1].allotmentBalance
        );
        newBalance = isNaN(lastBalance)
          ? allotmentNum
          : lastBalance - (isNaN(releaseNum) ? 0 : releaseNum);
      }
      setAllotmentBalance(newBalance);
    }

    // ---- 2 VALIDATE RELATIONSHIPS ----
    const exceedsAllotment = releaseNum > (parseFloat(newBalance) || 0);
    const exceedsReleases = expNum > releaseNum;
    const exceedsExpenditure = payNum > expNum;

    setShowReleasesAlert(exceedsAllotment);
    setShowExpenditureAlert(exceedsReleases);
    setShowPaymentAlert(exceedsExpenditure);

    // ---- 3 UPDATE FORM VALIDITY ----
    const formValid =
      !exceedsAllotment && !exceedsReleases && !exceedsExpenditure;
    setIsFormValid(formValid);
  }, [releases, expenditure, payment, allotment, records]);


  // Handle releases input
  const handleReleasesChange = (e) => {
    const value = e.target.value;
    setReleases(value);

    const releaseNum = parseFloat(value);
    const balanceNum = parseFloat(allotmentBalance || 0);

    if (releaseNum > balanceNum) {
      toast.error("Releases cannot exceed the current allotment balance.");
      setShowReleasesAlert(true);
    } else {
      setShowReleasesAlert(false);
    }

    setShowExpenditureAlert(false);
  };

  // Handle expenditure input
  const handleExpenditureChange = (e) => {
    const value = e.target.value;
    setExpenditure(value);

    if (parseFloat(value) > parseFloat(releases || 0)) {
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

  return (
    <div className="flex flex-col gap-6 justify-center lg:px-4">
      <form className="min-h-screen w-full p-4 sm:p-6 flex flex-col">
        {/* --- ACTIVITIES FIELD --- */}
        <div className="flex flex-col sm:flex-row sm:items-center text-2xl font-bold text-green-800 mb-8 border-0 shadow bg-white px-4 py-4 w-full gap-4">
          <label className="text-center sm:w-1/3">ACTIVITIES</label>
          <div className="w-full sm:w-2/3">
            <Select
              options={activityOptions}
              value={selectedActivity}
              onChange={setSelectedActivity}
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

        <div className="font-semibold cursor-pointer shadow bg-white h-[30rem] py-8 px-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 bg-white  w-full px-4 mb-8">
            {/* --- DATE FIELD --- */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">DATE</label>
              <div className="">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border w-full py-[0.7rem] px-2 rounded"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-500">ECONOMIC CLASSIFICATION</label>
              <Select
                options={economicClassOptions}
                value={economicClass} // should be an object like {value, label}
                onChange={setEconomicClass}
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
                    fontWeight: 600,
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#000000",
                  }),
                }}
              />
            </div>

            {/* <div className="flex items-center justify-center gap-4">
              <p>NATURAL ACCOUNT</p>
              <span className="text-4xl">
                <IoMdArrowDropdown />
              </span>
            </div> */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-500">SOURCE OF FUNDING</label>
              <Select
                options={sourceOfFundingOptions}
                value={fundingSource} // should be an object like {value, label}
                onChange={setFundingSource}
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
              <label className="text-gray-500">NATURAL ACCOUNT</label>
              <Select
                options={naturalAccountOptions}
                value={selectedAccount}
                onChange={setSelectedAccount}
                placeholder={`Select natural account`}
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

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                DESCRIPTION
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter a description..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                APPROPRIATION
              </label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={appropriation}
                readOnly
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                ALLOTMENT
              </label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={allotment}
                readOnly
                disabled
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                ALLOTMENT BALANCE
              </label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={allotmentBalance}
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white w-full px-4 mb-8">
            {/* RELEASES */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">RELEASES</label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={releases}
                onChange={handleReleasesChange}
                placeholder="Enter releases here..."
              />
            </div>

            {/* ACTUAL EXPENDITURE */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">ACTUAL EXPENDITURE</label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={expenditure}
                onChange={handleExpenditureChange}
                placeholder="Enter actual expenditure here..."
              />
            </div>

            {/* ACTUAL PAYMENT */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">ACTUAL PAYMENT</label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={payment}
                onChange={handlePaymentChange}
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
              toast.success("Form reset successfully!");
            }}
            className="bg-gray-400 text-white px-4 py-2 font-semibold hover:bg-gray-500 transition duration-300 shadow-md cursor-pointer w-[10%]"
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition duration-300 shadow-md cursor-pointer w-[10%]"
          >
            Submit
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
          className="border px-3 py-2 rounded-md w-1/3"
        />
      </div>
      <BudgetTable records={records} searchQuery={searchQuery} />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
          },
          error: {
            style: { background: "#dc2626" },
          },
        }}
      />
    </div>
  );
}
