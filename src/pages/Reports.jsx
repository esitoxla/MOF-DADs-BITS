import React from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";


export default function Reports() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 p-6">
      {/* Heading stays fixed at top */}
      <h2 className="text-2xl font-bold text-green-800 mb-10">Reports</h2>

      {/* Buttons Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl h-[40vh] mt-10">
        {/* Summary Report */}
        <button
          onClick={() => navigate("summaryReport")}
          className="w-full h-full bg-green-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition duration-300 cursor-pointer flex items-center justify-center"
        >
          Summary Report
        </button>

        {/* Detailed Report */}
        <button className="w-full h-full bg-white border-2 border-green-600 text-green-700 text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-50 transition duration-300 cursor-pointer flex items-center justify-center">
          Detailed Report
        </button>
      </div>
    </div>
  );
}
