import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import logo from "../assets/images/logo.jpeg";
import { getOrganizationLabel } from "../helpers/organizationLabel";
import { quarterEndMonth } from "../data/BudgetExpenditureData";
import toast from "react-hot-toast";
import TableSkeleton from "./ui/TableSkeleton";
import { formatAmount } from "../utils/numberFormat";

const CASH_ACCOUNTS = [
  "GOG Sub CF",
  "Internally Generated Fund (IGF)",
  "DP Funds",
  "Other Accounts",
];


export default function CashPerformanceTable({
  data = [],
  totals = {},
  year,
  quarter,
  organization,
  loading = false,
}) {
  const { authUser } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  //this prevents showing toast more than once
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

  //Convert Backend Data Into a Lookup Object
  const accountMap = useMemo(() => {
    const map = {};

    data.forEach((row) => {
      map[row.account_name] = row;
    });

    return map;
  }, [data]);

  // ===============================
  // REPORT DATE DERIVATION
  // ===============================
  const reportYear = year || "";
  const reportMonthName = quarter ? quarterEndMonth[quarter] : "";

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
      {/* Header Section */}
      <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
        {/* Left Text Section */}
        <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
          <h1>
            MDAs Cash Position as at end {reportMonthName} {reportYear} -
            MOF_DADs
          </h1>
          <p className="text-sm">
            <span> DADs: </span>
            <span>
              {" "}
              {organization === "ALL"
                ? "ALL ORGANIZATIONS"
                : getOrganizationLabel(organization || authUser?.organization)}
            </span>
          </p>
          <p className="text-sm">
            {" "}
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

      {/* table */}

      {loading ? (
        <TableSkeleton
          variant="report"
          rows={5}
          headers={["Account Name", "GHS", "EUR", "GBP", "USD"]}
        />
      ) : (
      <table className="w-full table-auto border border-gray-400 text-sm text-gray-800">
        <thead>
          <tr className="text-center font-semibold bg-blue-50">
            <th
              rowSpan="2"
              className="border border-gray-400 p-2 text-left align-middle"
            >
              ACCOUNT NAME(S)
            </th>

            {["GHS", "EUR", "GBP", "USD"].map((currency) => (
              <th
                key={currency}
                className="border border-gray-400 p-2 text-center"
              >
                <div className="leading-tight">
                  <div>BALANCE AS AT</div>
                  <div>
                    {reportMonthName} {reportYear}
                  </div>
                  <div>({currency})</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="font-bold text-gray-800">
          {CASH_ACCOUNTS.map((account) => {
            const row = accountMap[account] || {};

            return (
              <tr key={account}>
                <td className="border border-gray-400 px-4 py-2 text-left">
                  {account}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
                  {formatAmount(row.GHS)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
                  {formatAmount(row.EUR)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
                  {formatAmount(row.GBP)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
                  {formatAmount(row.USD)}
                </td>
              </tr>
            );
          })}

          <tr className="font-bold bg-green-50 text-green-800">
            <td className="border border-gray-400 px-4 py-2 text-left">
              Total Cash Position
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
              {formatAmount(totals.GHS)}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
              {formatAmount(totals.EUR)}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
              {formatAmount(totals.GBP)}
            </td>
            <td className="border border-gray-400 px-4 py-2 text-right tabular-nums">
              {formatAmount(totals.USD)}
            </td>
          </tr>
        </tbody>
      </table>
      )}
    </div>
  );
}
