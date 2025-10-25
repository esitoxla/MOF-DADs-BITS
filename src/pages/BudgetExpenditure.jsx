import React from "react";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";
import BudgetTable from "../components/BudgetTable";
import toast, { Toaster } from "react-hot-toast";
import { goodsAndServicesAccounts } from "../data/BudgetExpenditureData";
import { capitalExpenditureAccounts } from "../data/BudgetExpenditureData";
import { dataMap } from "../data/BudgetExpenditureData";
import { economicClassOptions } from "../data/BudgetExpenditureData";
import { sourceOfFundingOptions } from "../data/BudgetExpenditureData";
import { useSelector, useDispatch } from "react-redux";
import { updateRecord, cancelEditing, addExpenditure } from "../store/features/budgetSlice";




export default function BudgetExpenditure() {
  //redux handling the edit functionality
  const dispatch = useDispatch();
  const { isEditing, formValues, editingIndex, loading, error } = useSelector(
    (state) => state.budget
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

  //Dynamically switch accounts based on selected economic class
  const naturalAccountOptions =
    economicClass?.value === "goods & services"
      ? goodsAndServicesAccounts
      : capitalExpenditureAccounts;

  //this handles the logic behind the relationship between economic classification and the natural account
  useEffect(() => {
     if (isEditing) {
      return;
     } else if (!economicClass) {
      return
     }

    const validOptions =
      economicClass.value === "goods & services"
        ? goodsAndServicesAccounts
        : capitalExpenditureAccounts;

    const isStillValid = validOptions.some(
      (opt) => opt.value === selectedAccount?.value
    );

    //if natural account selected does not correspond to that of the economic classification, set it to its default
    if (!isStillValid) {
      setSelectedAccount(null);
    }
  }, [economicClass]);



  // Auto-fill based on both selected fields for allotment, appropriation and allotment balance depending on economic classification and source of funding
useEffect(() => {
  // Get the actual selected values from your dropdowns
  const ecoValue = economicClass?.value;
  const fundValue = fundingSource?.value;

  // Only run if both are selected
  if (!ecoValue || !fundValue) return;

  // Lookup from your dataMap directly (no case conversion)
  const selectedData = dataMap[ecoValue]?.[fundValue];

  // If a valid combination exists, update the state fields
  if (selectedData) {
    setAppropriation(selectedData.appropriation);
    setAllotment(selectedData.allotment);
    setAllotmentBalance(selectedData.allotment);
  }
}, [economicClass, fundingSource]);







  //handles populating fields that are dependent on each other(natural account, allotment, appropriation, allotment balance)
  // Handles populating fields when editing a record
  useEffect(() => {
    if (isEditing && formValues) {
      setSelectedActivity(
        formValues.activity
          ? { label: formValues.activity, value: formValues.activity }
          : null
      );
      setSelectedDate(formValues.date || "");
      setEconomicClass(
        formValues.economicClass
          ? { label: formValues.economicClass, value: formValues.economicClass }
          : null
      );
      setFundingSource(
        formValues.fundingSource
          ? { label: formValues.fundingSource, value: formValues.fundingSource }
          : null
      );
      setSelectedAccount(
        formValues.naturalAccount
          ? {
              label: formValues.naturalAccount,
              value: formValues.naturalAccount,
            }
          : null
      );
      setDescription(formValues.description || "");

      //restore appropriation and allotment if they exist
      if (formValues.appropriation) setAppropriation(formValues.appropriation);
      if (formValues.allotment) setAllotment(formValues.allotment);

      setAllotmentBalance(formValues.allotmentBalance || "");
      setReleases(formValues.releases || "");
      setExpenditure(formValues.expenditure || "");
      setPayment(formValues.payment || "");
    }
  }, [isEditing, formValues]);



  //handles submiting of records and editing a record
  const handleSubmit = (e) => {
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
      activity: selectedActivity?.value || selectedActivity?.label || "",
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



    // add or update it to the table
    if (isEditing) {
      dispatch(updateRecord({ index: editingIndex, updatedRecord: newRecord }));
      toast.success("Record updated successfully!");
      dispatch(cancelEditing());
    } else {
      // setRecords([...records, newRecord]);
      // but also dispatch to redux so the table updates
      dispatch(addExpenditure(newRecord));
      toast.success("Record added successfully!");
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
  };



  //This ensures your Allotment Balance updates automatically when releases, allotment, or the previous records change.
  useEffect(() => {

     if (isEditing) return;

    const releaseNum = parseFloat(releases) || 0;
    const expNum = parseFloat(expenditure) || 0;
    const payNum = parseFloat(payment) || 0;

    const ecoValue = economicClass?.value?.toLowerCase();
    const fundValue = fundingSource?.value?.toUpperCase(); // make sure this matches your keys (IGF, DPF, GOG)

    // --- Get the correct base allotment for the selected combo ---
    const baseAllotment =
      ecoValue && fundValue && dataMap[ecoValue]?.[fundValue]
        ? dataMap[ecoValue][fundValue].allotment
        : "";

    // If nothing is selected, clear the field
    if (baseAllotment === "") {
      setAllotmentBalance("");
      return;
    }

    let newBalance = baseAllotment;

    // --- Find existing records for the same category ---
    const matchingRecords = records.filter(
      (rec) =>
        rec.economicClass.toLowerCase() ===
          (economicClass?.label?.toLowerCase() || "") &&
        rec.fundingSource.toUpperCase() ===
          (fundingSource?.label?.toUpperCase() || "")
    );

    if (matchingRecords.length > 0) {
      const lastBalance =
        parseFloat(
          matchingRecords[matchingRecords.length - 1].allotmentBalance
        ) || baseAllotment;
      newBalance = lastBalance - releaseNum;
    } else {
      newBalance = baseAllotment - releaseNum;
    }

    setAllotmentBalance(newBalance);

    // --- Validate relationships ---
    const exceedsAllotment = releaseNum > baseAllotment;
    const exceedsReleases = expNum > releaseNum;
    const exceedsExpenditure = payNum > expNum;

    setShowReleasesAlert(exceedsAllotment);
    setShowExpenditureAlert(exceedsReleases);
    setShowPaymentAlert(exceedsExpenditure);

    setIsFormValid(
      !exceedsAllotment && !exceedsReleases && !exceedsExpenditure
    );
  }, [releases, expenditure, payment, economicClass, fundingSource, records]);

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

        <div className="font-semibold cursor-pointer shadow bg-white h-full py-8 px-4 mb-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                APPROPRIATION
              </label>
              <input
                type="number"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={appropriation || ""}
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
                value={allotment || ""}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-between gap-4 bg-white w-full px-4 mb-8">
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
            className="bg-gray-400 text-white px-4 py-2 font-semibold hover:bg-gray-500 transition duration-300 shadow-md cursor-pointer lg:w-[10%]"
          >
            Cancel
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition duration-300 shadow-md cursor-pointer lg:w-[10%]"
          >
            {isEditing ? "OK" : "Submit"}
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
        records={records}
        setRecords={setRecords}
        searchQuery={searchQuery}
        onEdit={handleEditRecord}
      />

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
