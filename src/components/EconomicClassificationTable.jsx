import React from "react";
import { api } from "../config/axios";
import { Fragment } from "react";
import logo from "../assets/images/logo.jpeg";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { quarterEndMonth } from "../data/BudgetExpenditureData";
import { getOrganizationLabel } from "../helpers/organizationLabel";





const EconomicClassificationTable = ({ data }) => {
  const { authUser } = useSelector((store) => store.auth);
  console.log(authUser);

  //This extracts the values passed from the previous page — including the date
  const location = useLocation();
  const navigate = useNavigate();
  //this prevents showing toast more than once
  const hasShownToast = useRef(false);

  const { year, quarter, fundingSource, organization } = location.state || {};

  const [appropriationMap, setAppropriationMap] = useState({});
  const [appropriationTotal, setAppropriationTotal] = useState(0);

  const resolvedOrganization =
    authUser?.role === "admin" ? organization || "ALL" : authUser?.organization;

  useEffect(() => {
    if ((!year || !quarter) && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.error(
        "No reporting period selected. Please generate the report again."
      );
      navigate("/dashboard/reports/summaryReport");
    }
  }, [year, quarter, navigate]);

  // Fetch appropriation summary
  useEffect(() => {
    const fetchAppropriation = async () => {
      try {
        if (!year) return;

        const res = await api.get("/appropriation/summary", {
          params: {
            year,
            organization: resolvedOrganization,
            sourceOfFunding: fundingSource || "ALL",
          },
        });

        const map = {};
        res.data.data.forEach((row) => {
          const key = `${row.economicClassification}__${row.sourceOfFunding}`;
          map[key] = Number(row.totalAppropriation || 0);
        });

        setAppropriationMap(map);
        setAppropriationTotal(res.data.totals.totalAppropriation);
      } catch (err) {
        console.error("Failed to fetch appropriation", err);
        toast.error("Failed to load appropriation data");
      }
    };

    fetchAppropriation();
  }, [year, resolvedOrganization, fundingSource]);


  
  // ===============================
  // REPORT DATE DERIVATION
  // ===============================
  const reportYear = year || "";
  const reportMonthName = quarter ? quarterEndMonth[quarter] : "";

  // console.log(reportYear, reportMonthName);

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
                {reportYear} APPROVED BUDGET / APPROPRIATION
              </th>
              <th className="border border-gray-400 px-3 py-2">
                AMOUNT RELEASED AS AT END {reportMonthName} {reportYear}
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL EXPENDITURE AS AT END {reportMonthName} {reportYear}
              </th>
              <th className="border border-gray-400 px-3 py-2">
                ACTUAL PAYMENTS AS AT END {reportMonthName} {reportYear}
              </th>
              <th className="border border-gray-400 px-3 py-2">
                PROJECTIONS AS AT 31 DEC {reportYear}
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
                      {(fundingSource === "ALL"
                        ? Object.entries(appropriationMap)
                            .filter(([key]) =>
                              key.startsWith(`${item.title}__`)
                            )
                            .reduce((sum, [, val]) => sum + val, 0)
                        : appropriationMap[`${item.title}__${fundingSource}`] ||
                          0
                      ).toLocaleString()}
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
                        {(
                          appropriationMap[`${item.title}__${b.source}`] || 0
                        ).toLocaleString()}
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
                {appropriationTotal.toLocaleString()}
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
{
  /* <p className="text-sm">
  Date: {date ? new Date(date).toLocaleDateString("en-GB") : "No date selected"}
</p>; */
}
