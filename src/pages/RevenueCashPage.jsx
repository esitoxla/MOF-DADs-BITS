import React from 'react'
import { useNavigate } from 'react-router';
import revenuePic from "../assets/images/revenue.png";
import cashPic from "../assets/images/cash.png";

export default function RevenueCashPage() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center bg-green-50 p-6 mt-20">
      {/* Buttons Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl h-[40vh] mt-10">
        <button
          onClick={() => navigate("revenue")}
          className="flex-col gap-3 w-full h-full bg-green-600 text-white text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-700 transition duration-300 cursor-pointer flex items-center justify-center"
        >
          <div>
            <img
              src={revenuePic}
              alt="Summary Report Image"
              className="w-26 h-26"
            />
          </div>
          <span>IGF Revenue Collection</span>
        </button>

        <button className="flex-col gap-3 w-full h-full bg-white text-green-600 text-xl font-semibold rounded-2xl shadow-lg hover:bg-green-100 transition duration-300 cursor-pointer flex items-center justify-center">
          <div>
            <img
              src={cashPic}
              alt="Summary Report Image"
              className="w-26 h-26"
            />
          </div>
          <span>Cash Position</span>
        </button>
      </div>
    </div>
  );
}
