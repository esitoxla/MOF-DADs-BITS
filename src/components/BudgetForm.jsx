import React from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import { economicClassOptions } from "../data/BudgetExpenditureData";
import { useBudgetFormLogic } from "../Hooks/useBudgetFormLogic";

export default function BudgetForm() {
  const {
    activityOptions,
    selectedActivity,
    selectedDate,
    economicClass,
    fundingSource,
    selectedAccount,
    description,
    appropriation,
    allotment,
    allotmentBalance,
    releases,
    expenditure,
    payment,
    isFormValid,
    filteredFundingOptions,
    naturalAccountOptions,
    searchQuery,
    setSearchQuery,

    setSelectedActivity,
    setSelectedDate,
    setEconomicClass,
    setFundingSource,
    setSelectedAccount,
    setDescription,
    setReleases,
    setExpenditure,
    setPayment,
    handleSubmit,
    handleReleasesChange,
    handleExpenditureChange,
    handlePaymentChange,
    handleEditRecord,
    resetForm,
    records,
    setRecords,
    isEditing,
  } = useBudgetFormLogic();

  return (
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
  
            
  
              <div className="flex flex-col gap-2">
                <label className="text-gray-500">SOURCE OF FUNDING</label>
                <Select
                  options={filteredFundingOptions}
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
                  min="0"
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
                  min="0"
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
                  min="0"
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
                  min="0"
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
                  min="0"
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
                  min="0"
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
  );
}
