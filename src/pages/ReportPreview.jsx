import React from "react";
import { useLocation } from "react-router";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import EconomicClassificationTable from "../components/EconomicClassificationTable";
import { economicClassificationData } from "../data/EconomicClassification";
import { useNavigate } from "react-router";

export default function ReportPreview() {

  const navigate = useNavigate()
  const location = useLocation();
  const { reportType, fundingSource } = location.state || {
    reportType: "EC",
    fundingSource: "ALL",
  };

  // Function to filter or transform data based on funding source
  const filterByFundingSource = (data, source) => {
    if (source === "ALL") return data;

    return data.map((item) => {
      const matchingBreakdown = item.breakdown.find(
        (b) => b.source.toLowerCase() === source.toLowerCase()
      );

      if (!matchingBreakdown) return item; // If source not found, return as-is it

      return {
        ...item,
        totalBudget: matchingBreakdown.totalBudget,
        amountReleased: matchingBreakdown.amountReleased,
        actualExpenditure: matchingBreakdown.actualExpenditure,
        actualPayments: matchingBreakdown.actualPayments,
        projection: matchingBreakdown.projection,
        breakdown: [matchingBreakdown], // only show the chosen source
      };
    });
  };

  const filteredData = filterByFundingSource(
    economicClassificationData,
    fundingSource
  );

  function handleExport(type) {
    if (type === "pdf") {
      alert("Exporting report as PDF...");
    } else {
      alert("Exporting report as Excel...");
    }
  }

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col ">
      {/* <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        {fundingSource === "ALL"
          ? "Economic Classification Summary (All Funding Sources)"
          : `Economic Classification Summary - ${fundingSource}`}
      </h1> */}

      <div className="flex justify-end items-center space-x-6 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="  bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer shadow hover:bg-green-700"
        >
          ← Back
        </button>

        {/* Export Dropdown */}
        <div className="relative ">
          <details className="group">
            <summary className="list-none bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer shadow hover:bg-green-700 flex items-center">
              Export ▼
            </summary>
            <div className="absolute right-0 mt-2 w-35 bg-white border rounded-lg shadow-lg overflow-hidden z-10 ">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
                onClick={() => handleExport("pdf")}
              >
                <FaFilePdf className="text-red-600" /> PDF
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
                onClick={() => handleExport("excel")}
              >
                <FaFileExcel className="text-green-700" /> Excel
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* Table */}
      <div className=" flex-1 overflow-y-auto">
        {reportType === "EC" && (
          <EconomicClassificationTable data={filteredData} />
        )}
      </div>
    </div>
  );
}
