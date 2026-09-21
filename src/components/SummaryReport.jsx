import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import Select from "react-select";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { organizationOptions } from "../data/BudgetExpenditureData";
import { fundingSourceOptions } from "../data/BudgetExpenditureData";
import { reportTypeOptions } from "../data/BudgetExpenditureData";
import { quarterOptions } from "../data/BudgetExpenditureData";
import { statusOptions } from "../data/BudgetExpenditureData";

export default function SummaryReport() {
  const navigate = useNavigate();

  // State for selected options
  const [reportType, setReportType] = useState(null);
  const [fundingSource, setFundingSource] = useState(null);
  const [organization, setOrganization] = useState(null);

  const [quarter, setQuarter] = useState(null);
  const [year, setYear] = useState("");
  const [status, setStatus] = useState(
    statusOptions.find((option) => option.value === "ALL"),
  );

  //ADMIN CHECKS
  const { authUser } = useSelector((state) => state.auth);
  const userRole = authUser?.role;
  const isAdmin = userRole === "admin";

  //It is automatically setting current quarter and current year, also because of [] It runs only once when the component mounts.
  useEffect(() => {
    const now = new Date();
    // getMonth() gets the index of the month then adds 1 and divide by 3. Math.ceil always rounds up the number after the . does not have to be 5 and above e.g Math.ceil(2.1)   // 3
    const currentQuarter = Math.ceil((now.getMonth() + 1) / 3);

    setQuarter(quarterOptions.find((q) => q.value === currentQuarter));
    setYear(now.getFullYear());
  }, []);

  // Handle generate button click
  //these states are being passed via React Router:
  const handleGenerate = () => {
    if (!reportType) {
      toast.error("Please select report type");
      return;
    }

    if ((reportType.value === "EC" || reportType.value === "NA") && !fundingSource) {
      toast.error("Please select source of funding");
      return;
    }

    const state = {
      reportType: reportType.value,
      quarter: quarter.value, // 1–4
      year: Number(year),
      organization: isAdmin ? organization?.value : authUser?.organization,
      status: status?.value || "ALL",
    };

    if (reportType.value === "EC" || reportType.value === "NA") {
     state.fundingSource = fundingSource?.value;
    }

    navigate("/dashboard/reports/preview", { state });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50 px-4"
    >
      <div className="relative bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg space-y-6 animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="absolute top-3 right-5 text-gray-400 hover:text-gray-700 text-2xl transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">
          Generate Summary Report
        </h2>

        {/* Modal Content */}
        <div className="flex flex-col gap-6">
          {isAdmin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Organization
              </label>
              <Select
                options={organizationOptions}
                placeholder="Search or select organization"
                value={organization}
                onChange={setOrganization}
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </div>
          )}

          {/* Report By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Type
            </label>
            <Select
              options={reportTypeOptions}
              value={reportType}
              onChange={setReportType}
              placeholder="Search or select a report type"
              filterOption={(option, inputValue) =>
                option.label.toLowerCase().includes(inputValue.toLowerCase())
              }
            />
          </div>

          {/* Source of Funding (only visible for EC) */}
          {(reportType?.value === "EC" || reportType?.value === "NA") && (
            <div className="transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source of Funding
              </label>
              <Select
                options={fundingSourceOptions}
                value={fundingSource}
                onChange={setFundingSource}
                placeholder="Search or select funding source"
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-4">
            <label className="block text-sm font-semibold text-gray-700">
              Reporting Period
            </label>

            <Select
              options={quarterOptions}
              value={quarter}
              onChange={setQuarter}
              placeholder="Select Quarter"
            />

            <input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Year (e.g. 2025)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <Select
              options={statusOptions}
              value={status}
              onChange={setStatus}
              placeholder="Select status"
            />
          </div>

          {/* Action Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleGenerate}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-300 shadow-md cursor-pointer"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
