import React from 'react'
import { useSelector } from 'react-redux';
import logo from "../assets/images/logo.jpeg";
import { useMemo, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import Pagination from './Pagination';
import { quarterEndMonth } from '../data/BudgetExpenditureData';
import { getOrganizationLabel } from '../helpers/organizationLabel';

const REVENUE_CATEGORIES = [
  "Fees/Charges",
  "Sale Of Goods and Services",
  "Fines/Forfeitures",
  "Licenses",
  "Interests",
  "Others",
];



export default function RevenuePerformanceTable({
  data = [],
  totals,
  year,
  quarter,
  organization,
}) {
  const { authUser } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  //this prevents showing toast more than once
  const hasShownToast = useRef(false);


  const PAGE_SIZE = 5; // choose what you want
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if ((!year || !quarter) && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.error(
        "No reporting period selected. Please generate the report again."
      );
      navigate("/dashboard/reports/summaryReport");
    }
  }, [year, quarter, navigate]);

  const normalize = (str = "") => str.trim().toLowerCase();

  const dataMap = useMemo(() => {
    const map = {};
    data.forEach((item) => {
      map[normalize(item.category)] = item;
    });
    return map;
  }, [data]);

  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return REVENUE_CATEGORIES.slice(start, end);
  }, [currentPage]);

  const totalPages = Math.ceil(REVENUE_CATEGORIES.length / PAGE_SIZE);

  // ===============================
  // REPORT DATE DERIVATION
  // ===============================
  const reportYear = year || "";
  const reportMonthName = quarter ? quarterEndMonth[quarter] : "";

  return (
    <>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
        {/* Header Section */}
        <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
          {/* Left Text Section */}
          <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
            <h1>
              Summary of IGF Performance as at {reportMonthName} {reportYear} by
              Revenue Categories (in GH₵)
            </h1>
            <p className="text-sm">
              <span> DADs: </span>
              <span>
                {" "}
                {organization === "ALL"
                  ? "ALL ORGANIZATIONS"
                  : getOrganizationLabel(
                      organization || authUser?.organization
                    )}
              </span>
            </p>
            <p className="text-sm">
              Reporting Period: Q{quarter} ({reportMonthName} {reportYear})
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
                ACTUAL COLLECTION AS AT END {reportMonthName} {reportYear}
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                PAYMENT INTO THE CONSOLIDATED FUND AS AT END {reportMonthName}{" "}
                {reportYear}
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                RETENTION FOR {reportYear} AS AT END {reportMonthName}{" "}
                {reportYear}
              </th>
              <th
                rowSpan={2}
                className="border border-gray-400 px-4 py-2 align-middle"
              >
                PROJECTION AS AT 31 DEC {reportYear}
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
              <th className="border border-gray-400 px-4 py-2">D = C - E</th>
              <th className="border border-gray-400 px-4 py-2">E = C - D</th>
              <th className="border border-gray-400 px-4 py-2">&nbsp;</th>
              <th className="border border-gray-400 px-4 py-2">&nbsp;</th>
            </tr>
          </thead>

          <tbody className="font-bold text-gray-800">
            {paginatedCategories.map((category) => {
              const row = dataMap[normalize(category)] || {};

              return (
                <tr key={category}>
                  <td className="border border-gray-400 px-4 py-2 text-left">
                    {category}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {(row.projection ?? 0).toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {(row.actual ?? 0).toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {(row.payment ?? 0).toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {(row.retention ?? 0).toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-4 py-2 text-right">
                    {(row.projectionDec ?? 0).toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-4 py-2">
                    {row.remarks || ""}
                  </td>
                </tr>
              );
            })}

            {/* TOTAL row */}
            <tr className="font-bold bg-green-50 text-green-800">
              <td className="border border-gray-400 px-4 py-2 text-left">
                TOTAL
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                {(totals?.projection ?? 0).toLocaleString()}
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                {(totals?.actual ?? 0).toLocaleString()}
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                {(totals?.payment ?? 0).toLocaleString()}
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                {(totals?.retention ?? 0).toLocaleString()}
              </td>

              <td className="border border-gray-400 px-4 py-2 text-right">
                {(totals?.projectionDec ?? 0).toLocaleString()}
              </td>

              <td className="border border-gray-400 px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination (EXTERNAL COMPONENT) */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
