import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useState } from "react";
import Select from "react-select";
import { useEffect } from "react";

export default function BudgetExpenditure() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [economicClass, setEconomicClass] = useState("Select");
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [fundingSource, setFundingSource] = useState("select");
  const [description, setDescription] = useState("");
  const [appropriation, setAppropriation] = useState("");
  const [allotment, setAllotment] = useState("");
  const [releases, setReleases] = useState("");
  const [payment, setPayment] = useState("");
  const [expenditure, setExpenditure] = useState("");

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
    { value: "2310101", label: "2310101 - Residential Buildings" },
    { value: "2310102", label: "2310102 - Office Buildings" },
    { value: "2310103", label: "2310103 - Plant and Machinery" },
    // ... add the rest of your Capital Expenditure accounts
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

  //Dynamically switch accounts based on selected economic class
  const naturalAccountOptions =
    economicClass === "goods & services"
      ? goodsAndServicesAccounts
      : capitalExpenditureAccounts;

  // Auto-fill based on both selected fields
  useEffect(() => {
    if (economicClass && fundingSource) {
      const selectedData = dataMap[economicClass]?.[fundingSource];
      if (selectedData) {
        setAppropriation(selectedData.appropriation);
        setAllotment(selectedData.allotment);
      } else {
        setAppropriation("");
        setAllotment("");
      }
    }
  }, [economicClass, fundingSource]);

  return (
    <div className="flex justify-center lg:px-4">
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
                  borderColor: "#15803d", // Tailwind green-800
                  boxShadow: "none",
                  "&:hover": { borderColor: "#16a34a" }, // Tailwind green-600
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
          <div className="grid grid-cols-3 items-center justify-between gap-4 bg-white  w-full px-4 mb-8">
            {/* --- DATE FIELD --- */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-500">DATE</label>
              <div className="">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input outline w-full py-3 px-2  rounded text-green-800 focus:input-primary"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-500">ECONOMIC CLASSIFICATION</label>
              <select
                value={economicClass}
                onChange={(e) => setEconomicClass(e.target.value)}
                className="select select-bordered w-full outline focus:select-primary py-3 px-2 rounded"
              >
                <option value="select">Select Economic Classification</option>
                <option value="goods & services">GOODS & SERVICES</option>
                <option value="capital expenditure">CAPITAL EXPENDITURE</option>
              </select>
            </div>

            {/* <div className="flex items-center justify-center gap-4">
              <p>NATURAL ACCOUNT</p>
              <span className="text-4xl">
                <IoMdArrowDropdown />
              </span>
            </div> */}

            <div className="flex flex-col gap-2">
              <label className="text-gray-500">SOURCE OF FUNDING</label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                className="select select-bordered w-full outline focus:select-primary py-3 px-2  rounded"
              >
                <option value="select">Select Source of Funding</option>
                <option value="GOG">GOG</option>
                <option value="DPF">DPF</option>
                <option value="IGF">IGF</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10  w-full px-4 mb-8">
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

          <div className="grid grid-cols-2 gap-10 w-full px-4 mb-8">
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
          </div>

          <div className="grid grid-cols-3 gap-4 bg-white  w-full px-4 mb-8">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                RELEASES
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={releases}
                onChange={(e) => setReleases(e.target.value)}
                placeholder="Enter releases here..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                ACTUAL EXPENDITURE
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={expenditure}
                onChange={(e) => setExpenditure(e.target.value)}
                placeholder="Enter actual expenditure here..."
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-gray-500">
                ACTUAL PAYMENT
              </label>
              <input
                type="text"
                className="py-[0.7rem] px-2 w-full outline rounded placeholder:text-black"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                placeholder="Enter actual payment here..."
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 transition duration-300 shadow-md cursor-pointer    w-[10%]"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
