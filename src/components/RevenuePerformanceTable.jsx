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

        <table className="min-w-[750px] table-auto border border-gray-400 text-sm text-gray-800">
          <thead>
            {/* Top header row */}
            <tr className="text-center font-semibold bg-blue-50">
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                REVENUE CATEGORIES
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                PROJECTIONS/ BUDGET
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                ACTUAL COLLECTION AS AT END AUGUST 2025
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                PAYMENT INTO THE CONSOLIDATED FUND AS AT END AUGUST 2025
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                RETENTION FOR 2025 AS AT END AUGUST 2025
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                PROJECTION AS AT 31 DEC 2025
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                REMARKS
              </th>
            </tr>

            {/* Second header row with A, B, C... */}
            <tr className="text-center font-bold">
              <th className="hidden" />
              <th className="hidden" />
              <th className="hidden" />
              <th className="hidden" />
              <th className="hidden" />
              <th className="hidden" />
              <th className="hidden" />
            </tr>

            {/* Letter row (A, B, C=D+E, etc.) */}
            <tr className="text-center font-bold bg-gray-50">
              <th className="border border-gray-400 px-4 py-2">A</th>
              <th className="border border-gray-400 px-4 py-2">B</th>
              <th className="border border-gray-400 px-4 py-2">C = D + E</th>
              <th className="border border-gray-400 px-4 py-2">D = C − E</th>
              <th className="border border-gray-400 px-4 py-2">E = C − D</th>
              <th className="border border-gray-400 px-4 py-2">&nbsp;</th>
              <th className="border border-gray-400 px-4 py-2">&nbsp;</th>
            </tr>
          </thead>

          <tbody className='font-bold text-gray-800'>
            {/* Fees / Charges row */}
            <tr>
              <td className="border border-gray-400 px-4 py-2">Fees/Charges</td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                173,887.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                28,981.19
              </td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* Other revenue categories (empty rows ready for data) */}
            <tr>
              <td className="border border-gray-400 px-4 py-2">
                Sale Of Goods and Services
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            <tr>
              <td className="border border-gray-400 px-4 py-2">
                Fines/Forfeitures
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            <tr>
              <td className="border border-gray-400 px-4 py-2">Licenses</td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            <tr>
              <td className="border border-gray-400 px-4 py-2">Interests</td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            <tr>
              <td className="border border-gray-400 px-4 py-2">Others</td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2 text-right"></td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>

            {/* TOTAL row */}
            <tr className="font-bold bg-green-50 text-green-800">
              <td className="border border-gray-400 px-4 py-2 text-left">
                TOTAL
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                173,887.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                0.00
              </td>
              <td className="border border-gray-400 px-4 py-2 text-right">
                28,981.19
              </td>
              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
