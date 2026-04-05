import React from 'react'
import { useNavigate } from 'react-router'
import reallocationPic from "../assets/images/reallocation.png";
import budgetPic from "../assets/images/budget.png";

export default function BudgetReallocationPage() {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 p-6 mt-20">
      {/* Buttons Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl h-[40vh] mt-10">
        <button
          onClick={() => navigate("budget")}
          className="flex-col gap-3 w-full h-full bg-green-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition duration-300 cursor-pointer flex items-center justify-center"
        >
          <div>
            <img src={budgetPic} alt="budget Image" className="w-26 h-26" />
          </div>
          <span>DADs Expenditure</span>
        </button>

        <button
          onClick={() => navigate("reallocation")}
          className="flex-col gap-3 w-full h-full bg-white text-green-600 text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-100 transition duration-300 cursor-pointer flex items-center justify-center"
        >
          <div>
            <img
              src={reallocationPic}
              alt="reallocation Image"
              className="w-26 h-26"
            />
          </div>
          <span>Reallocation</span>
        </button>
      </div>
    </div>
  );
}
