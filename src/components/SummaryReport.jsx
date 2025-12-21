import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";

export default function SummaryReport() {
  const navigate = useNavigate();

  // State for selected options
  const [reportType, setReportType] = useState("EC");
  const [fundingSource, setFundingSource] = useState("ALL");

  const [date, setDate] = useState("");

  // Handle generate button click
  //these states are being passed via React Router:
  const handleGenerate = () => {
    // Build the state dynamically based on selected report type
    const state = { reportType, date };

    if (reportType === "EC") {
      state.fundingSource = fundingSource;
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
          {/* Report By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="EC">Economic Classification</option>
              <option value="IRP">IGF Revenue Performance</option>
              <option value="CP">Cash Position</option>
              <option value="R">Reallocation</option>
              <option value="NA">Natural Account</option>
            </select>
          </div>

          {/* Source of Funding (only visible for EC) */}
          {reportType === "EC" && (
            <div className="transition-all duration-300">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Source of Funding
              </label>
              <select
                value={fundingSource}
                onChange={(e) => setFundingSource(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="GOG">GOG</option>
                <option value="DPF">DPF</option>
                <option value="IGF">IGF</option>
                <option value="ALL">ALL</option>
              </select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3  border border-gray-300 rounded-lg"
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
