import React, { useEffect, useRef } from "react";
import logo from "../assets/images/logo.jpeg";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { quarterEndMonth } from "../data/BudgetExpenditureData";
import { getOrganizationLabel } from "../helpers/organizationLabel";

export default function NaturalAccountPerformanceTable({
  data = [],
  totals = {},
  year,
  quarter,
  fundingSource,
  organization,
}) {
  const { authUser } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const hasShownToast = useRef(false);

  // ===============================
  // VALIDATION
  // ===============================
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

  const selectedFunding =
    typeof fundingSource === "object" ? fundingSource.value : fundingSource;
    

  // ===============================
  // COLUMN VISIBILITY
  // ===============================
  const showGOG = selectedFunding === "ALL" || selectedFunding === "GOG";
  const showIGF = selectedFunding === "ALL" || selectedFunding === "IGF";
  const showDPF = selectedFunding === "ALL" || selectedFunding === "DPF";

  // ===============================
  // NUMBER FORMATTER
  // ===============================
  const format = (num) =>
    Number(num || 0).toLocaleString("en-GH", {
      minimumFractionDigits: 2,
    });

  return (
    <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
      {/* ================= HEADER ================= */}
      <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
        <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
          <h1>Summary of Budget Performance by Natural Account and Funding</h1>

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

      {/* ================= TABLE ================= */}
      <table className="w-full table-auto border border-gray-400 text-sm text-gray-800">
        <thead>
          {/* TOP HEADER */}
          <tr className="bg-gray-100 text-center font-semibold">
            <th
              rowSpan="2"
              className="border border-gray-400 px-4 py-3 text-left bg-blue-50"
            >
              Natural Account
            </th>

            {showGOG && (
              <th colSpan="2" className="border border-gray-400 p-2">
                GOG
              </th>
            )}
            {showIGF && (
              <th colSpan="2" className="border border-gray-400 p-2">
                IGF
              </th>
            )}
            {showDPF && (
              <th colSpan="2" className="border border-gray-400 p-2">
                DPF
              </th>
            )}
          </tr>

          {/* SUB HEADER */}
          <tr className="text-center font-semibold bg-blue-50">
            {showGOG && (
              <>
                <th className="border border-gray-400 p-2">Appropriation</th>
                <th className="border border-gray-400 p-2">
                  Actual Expenditure
                </th>
              </>
            )}

            {showIGF && (
              <>
                <th className="border border-gray-400 p-2">Appropriation</th>
                <th className="border border-gray-400 p-2">
                  Actual Expenditure
                </th>
              </>
            )}

            {showDPF && (
              <>
                <th className="border border-gray-400 p-2">Appropriation</th>
                <th className="border border-gray-400 p-2">
                  Actual Expenditure
                </th>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {/* ================= DATA ROWS ================= */}
          {data.length === 0 ? (
            <tr>
              <td colSpan="100%" className="text-center py-4 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2 text-left">
                  {row.title}
                </td>

                {showGOG && (
                  <>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {row.GOG?.appro ? format(row.GOG.appro) : "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {row.GOG?.actual ? format(row.GOG.actual) : "-"}
                    </td>
                  </>
                )}

                {showIGF && (
                  <>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {row.IGF?.appro ? format(row.IGF.appro) : "-"}
                    </td>
                    <td className="border  border-gray-400 px-4 py-2 text-right">
                      {row.IGF?.actual ? format(row.IGF.actual) : "-"}
                    </td>
                  </>
                )}

                {showDPF && (
                  <>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {row.DPF?.appro ? format(row.DPF.appro) : "-"}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-right">
                      {row.DPF?.actual ? format(row.DPF.actual) : "-"}
                    </td>
                  </>
                )}
              </tr>
            ))
          )}

          {/* ================= TOTAL ROW ================= */}
          <tr className="bg-green-50 font-bold text-green-800">
            <td className="border border-gray-400 px-4 py-2 text-left">
              TOTAL
            </td>

            {showGOG && (
              <>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.GOG?.appro)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.GOG?.actual)}
                </td>
              </>
            )}

            {showIGF && (
              <>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.IGF?.appro)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.IGF?.actual)}
                </td>
              </>
            )}

            {showDPF && (
              <>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.DPF?.appro)}
                </td>
                <td className="border border-gray-400 px-4 py-2 text-right">
                  {format(totals.DPF?.actual)}
                </td>
              </>
            )}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
