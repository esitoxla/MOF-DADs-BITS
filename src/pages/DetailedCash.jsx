import React from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { BsArrowLeftShort } from "react-icons/bs";
import { RiArrowDownSFill } from "react-icons/ri";
import logo from "../assets/images/logo.jpeg";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { fetchDetailedCashReport } from "../store/features/cashReportSlice";
import { exportCashToExcel } from "../utils/cashPosition/excelExport";
import { exportCashToPDF } from "../utils/cashPosition/pdfExport";
import TableSkeleton from "../components/ui/TableSkeleton";

export default function DetailedCash() {
  const { authUser } = useSelector((store) => store.auth);
  const {
    records: detailedRecords,
    loading,
    error,
  } = useSelector((state) => state.cashReport.detailed);

  console.log(detailedRecords);

  const location = useLocation();
  const { year, quarter, organization, status = "ALL" } = location.state || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!year || !quarter) return;

    dispatch(
      fetchDetailedCashReport({
        year,
        quarter,
        organization,
        status,
      }),
    );
  }, [dispatch, year, quarter, organization, status]);

  //Pagination logic
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = detailedRecords.length;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = detailedRecords.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  //If filters or date change, you must reset to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [detailedRecords]);

  const handleExport = async (type) => {
    if (type === "excel") {
      exportCashToExcel(detailedRecords, year, quarter);
    }

    if (type === "pdf") {
      await exportCashToPDF(detailedRecords, {
        organization: organization || authUser?.organization,
        year,
        quarter,
      });
    }
  };

  if (loading)
    return (
      <TableSkeleton
        variant="report"
        headers={["S.N", "Date", "Account Name", "Currency", "Balance"]}
      />
    );
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col">
      <div className="flex justify-end items-center space-x-6 mb-4">
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="flex gap-1 bg-green-600 text-white px-4 py-2 rounded font-medium cursor cursor-pointer"
        >
          <BsArrowLeftShort className="text-3xl" />
          Back
        </button>

        <div className="relative">
          <details className="group">
            <summary className="list-none bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer flex gap-1 items-center">
              Export
              <RiArrowDownSFill className="text-3xl" />
            </summary>
            <div className="absolute right-0 mt-2 w-35 bg-white border rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleExport("pdf")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
              >
                <FaFilePdf className="text-red-600" /> PDF
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
              >
                <FaFileExcel className="text-green-700" /> Excel
              </button>
            </div>
          </details>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 border border-gray-200 w-full">
        {/* Header Section */}
        <div className="min-w-[750px] flex justify-between items-center mb-2 bg-[#F7F7F7]">
          {/* Left Text Section */}
          <div className="flex flex-col space-y-1 pr-6 p-4 font-bold text-lg w-[80%] min-w-[600px]">
            <h1>Detailed Report of Cash Position</h1>
            <p className="text-sm">
              <span> DADs: </span>
              <span>
                {" "}
                {organization === "ALL"
                  ? "ALL ORGANIZATIONS"
                  : organization || authUser?.organization}
              </span>
            </p>
            <p className="text-sm">
              Reporting Period: Q{quarter} {year}
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

        <table className="w-full table-auto border border-gray-400 text-sm text-gray-800">
          <thead className="bg-gray-100">
            <tr className="text-center font-semibold bg-blue-50">
              <th className="border border-gray-400 px-2 py-2">S.N</th>
              <th className="border border-gray-400 px-2 py-2">Date</th>
              <th className="border border-gray-400 px-2 py-2">Account Name</th>
              <th className="border border-gray-400 px-2 py-2">Currency</th>
              <th className="border border-gray-400 px-2 py-2">Balance</th>
            </tr>
          </thead>

          <tbody className="text-gray-900">
            {detailedRecords.length === 0 ? (
              <tr>
                <td
                  colSpan="15"
                  className="text-center text-gray-500 py-3 italic"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((row, index) => (
                <tr key={row.id || index} className="text-center">
                  <td className="border border-gray-400 px-2 py-2">
                    {startIndex + index + 1}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {row.as_at_date}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {row.account_name}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {row.currency}
                  </td>
                  <td className="border border-gray-400 px-2 py-2">
                    {Number(row.balance).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
