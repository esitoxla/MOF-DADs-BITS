import React from "react";
import { Fragment } from "react";
import logo from "../assets/images/logo.jpeg"
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

const EconomicClassificationTable = ({ data }) => {
  const { authUser } = useSelector((store) => store.auth);
  console.log(authUser);

  //This extracts the values passed from the previous page — including the date
  const location = useLocation();
  const { date, fundingSource } = location.state || {};

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">

        {/* Header Section */}
        <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
          {/* Left Text Section */}
          <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
            <h1>
              Summary of Budget Performance by Economic Classification and
              Funding
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

        <table className="min-w-[750px] table-auto border border-gray-400 text-sm text-gray-800">
          <thead className="bg-gray-100">
            <tr className="text-center font-semibold">
              <th
                rowSpan="2"
                className="border border-gray-400 px-4 py-3 text-left bg-blue-50"
              >
                EXPENDITURE ITEM
              </th>
              
            </tr>
            <tr className="text-center font-semibold bg-blue-50">
              <th className="border border-gray-400 px-3 py-2">
                2025 APPROVED BUDGET / APPROPRIATION
              </th>
              <th className="border border-gray-400 px-3 py-2">
                AMOUNT RELEASED AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL EXPENDITURE AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL PAYMENTS AS AT END AUG 2025
              </th>
              <th className="border border-gray-400 px-3 py-2">
                PROJECTIONS AS AT 31 DEC 2025
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const filteredBreakdown =  
                fundingSource === "ALL"
                  ? item.breakdown
                  : item.breakdown.filter((b) => b.source === fundingSource);

              return (
                <Fragment key={index}>
                  {/* Main category row */}
                  <tr className="font-semibold bg-gray-50">
                    <td className="border border-gray-400 px-4 py-2 text-left">
                      {item.title}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.totalBudget.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.amountReleased.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.actualExpenditure.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.actualPayments.toLocaleString()}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {item.projection.toLocaleString()}
                    </td>
                  </tr>

                  {/* Breakdown rows */}
                  {filteredBreakdown.map((b, i) => (
                    <tr key={i} className="text-gray-700">
                      <td className="border border-gray-400 px-8 py-2 text-left italic">
                        {b.source}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-right">
                        {(b.appropriation ?? 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-right">
                        {(b.releases ?? 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-right">
                        {(b.expenditure ?? 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-right">
                        {(b.payment ?? 0).toLocaleString()}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-right">
                        {(b.projection ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}

            {/* TOTAL Row */}
            <tr className="bg-green-50 font-bold text-green-800">
              <td className="border border-gray-400 px-4 py-2 text-left">
                TOTAL
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data.reduce((a, b) => a + b.totalBudget, 0).toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.amountReleased, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.actualExpenditure, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data
                  .reduce((a, b) => a + b.actualPayments, 0)
                  .toLocaleString()}
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                {data.reduce((a, b) => a + b.projection, 0).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EconomicClassificationTable;



//That converts the selected date (like "2025-10-14") into a readable format ("14/10/2025").
{/* <p className="text-sm">
  Date: {date ? new Date(date).toLocaleDateString("en-GB") : "No date selected"}
</p>; */}
