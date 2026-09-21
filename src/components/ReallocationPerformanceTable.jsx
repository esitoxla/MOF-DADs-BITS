import React from 'react'
import logo from "../assets/images/logo.jpeg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { quarterEndMonth } from "../data/BudgetExpenditureData";
import { getOrganizationLabel } from "../helpers/organizationLabel";
import { useRef, useEffect } from 'react';


export default function ReallocationPerformanceTable(
  {data = [],
  totals = {},
  year,
  quarter,
  organization,
  }
) {

    const { authUser } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    const hasShownToast = useRef(false);

    useEffect(() => {
      if ((!year || !quarter) && !hasShownToast.current) {
        hasShownToast.current = true;
        toast.error(
          "No reporting period selected. Please generate the report again.",
        );
        navigate("/dashboard/reports/summaryReport");
      }
    }, [year, quarter, navigate]);

    // ===============================
      // REPORT DATE
      // ===============================
      const reportYear = year || "";
      const reportMonthName = quarter ? quarterEndMonth[quarter] : "";
    
      
        console.log(data);
    

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
      {/* ================= HEADER ================= */}
      <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
        <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
          <h1>Additional funds received in Q{quarter} ({reportMonthName} {reportYear})</h1>

          <p className="text-sm">
            <span>DADs: </span>
            <span>
              {organization === "ALL"
                ? "ALL ORGANIZATIONS"
                : getOrganizationLabel(organization || authUser?.organization)}
            </span>
          </p>

          <p className="text-sm">
            Reporting Period: Q{quarter} ({reportMonthName} {reportYear})
          </p>

          <p className="text-sm">Currency: Ghana cedis (GHS)</p>
        </div>

        <div className="flex items-center justify-center w-[20%] min-w-[150px]">
          <img src={logo} alt="mof logo" />
        </div>
      </div>

      <table className="min-w-[750px] table-auto border border-gray-400 text-sm text-gray-800">
        <thead className="bg-gray-100">
          <tr className="border border-gray-400 bg-blue-50">
            <th className="px-4 py-3 text-left">EXPENDITURE ITEM</th>
            <th className="border border-gray-400 px-3 py-2">
              AMOUNT REALLOCATED AS AT {reportMonthName} {reportYear}
            </th>
            <th className="border border-gray-400 px-3 py-2">
              AMOUNT RELEASED AS AT {reportMonthName} {reportYear}
            </th>
            <th className="border border-gray-400 px-3 py-2">
              ACTUAL EXPENDITURE AS AT {reportMonthName} {reportYear}
            </th>
            <th className="border border-gray-400 px-3 py-2">
              ACTUAL PAYMENT AS AT {reportMonthName} {reportYear}
            </th>
          </tr>
        </thead>

        <tbody>
          {[
            "Compensation of Employees",
            "Goods and Services",
            "Capital Expenditure",
          ].map((item, index) => {
            // find matching backend data
            const safeData = Array.isArray(data) ? data : [];

            const row = safeData.find((d) => d.title === item) || {};

            return (
              <React.Fragment key={index}>
                {/* ================= MAIN ROW ================= */}
                <tr className="bg-gray-50">
                  <td className="border border-gray-400 px-4 py-2 font-medium">
                    {item}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    -
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    -
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    -
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    -
                  </td>
                </tr>

                {/* ================= GOG ROW ================= */}
                <tr>
                  <td className="border border-gray-400 px-4 py-2 pl-8 italic text-gray-600">
                    GOG
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {row.GOG?.reallocated?.toLocaleString() || "0"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {row.GOG?.released?.toLocaleString() || "0"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {row.GOG?.expenditure?.toLocaleString() || "0"}
                  </td>
                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {row.GOG?.payment?.toLocaleString() || "0"}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}

          {/* ================= TOTAL ================= */}
          <tr className="bg-green-50 font-bold text-green-800">
            <td className="border border-gray-400 px-4 py-2 text-left">
              TOTAL
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right">
              {totals.reallocated?.toLocaleString() || "0"}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right">
              {totals.released?.toLocaleString() || "0"}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right">
              {totals.expenditure?.toLocaleString() || "0"}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right">
              {totals.payment?.toLocaleString() || "0"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
