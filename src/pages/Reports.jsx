import React from "react";
import { NavLink } from "react-router";
import { useNavigate } from "react-router";
import summaryPic from "../assets/images/summary.png"
import detailedPic from "../assets/images/detailed.png"


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
          className="flex flex-col gap-3 w-full h-full bg-green-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition duration-300 cursor-pointer  items-center justify-center"
        >
          <div>
            <img
              src={summaryPic}
              alt="Summary Report Image"
              className="w-26 h-26"
            />
          </div>

          <span> Summary Report</span>
        </button>

        {/* Detailed Report */}
        <button
          onClick={() => navigate("detailedReport")}
          className="w-full h-full bg-green-200 text-green-600 text-xl font-semibold rounded-2xl shadow-lg hover:bg-white transition duration-300 cursor-pointer flex flex-col gap-3 items-center justify-center"
        >
          <div>
            <img
              src={detailedPic}
              alt="Summary Report Image"
              className="w-26 h-26"
            />
          </div>
          <span>Detailed Report</span>
        </button>
      </div>
    </div>
  );
}
