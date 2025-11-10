import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import logo from "../assets/images/logo.jpeg";





export default function RevenuePerformanceTable({ data }) {

    const { authUser } = useSelector((store) => store.auth);

     //This extracts the values passed from the previous page — including the date
      const location = useLocation();
      const { date } = location.state || {};


  return (
    <>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
        {/* Header Section */}
        <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
          {/* Left Text Section */}
          <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
            <h1>
              Summary of IGF Performance as at end-December 2025 by Revenue
              Categories (in GH₵) 
            </h1>
            <p className="text-sm">
              <span> DADs: </span>
              <span>{authUser?.organization}</span>
            </p>
            <p className="text-sm">
              Date:{" "}
              {date
                ? new Date(date).toLocaleDateString("en-GB")
                : "No date selected"}
            </p>

            <p className="text-sm">Currency: Ghana cedis (GHS)</p>
          </div>

          {/* Right Logo Section */}
          <div className="flex items-center justify-center w-[20%] min-w-[150px]">
            <span className="font-bold text-[#03381E]">
              <img src={logo} alt="mof logo" />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
