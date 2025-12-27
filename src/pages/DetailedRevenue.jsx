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
import { fetchRevenues } from "../store/features/revenueSlice";
import { exportRevenueToExcel } from "../utils/revenue/exportToExcel";
import { exportRevenueToPDF } from "../utils/revenue/exportToPdf";

export default function DetailedRevenue() {
  const { authUser } = useSelector((store) => store.auth);
  const { records, loading, error } = useSelector((store) => store.revenue);
  const location = useLocation();
  const { date } = location.state || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchRevenues());
  }, [dispatch]);

  //Pagination logic
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = records.length;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = records.slice(startIndex, startIndex + PAGE_SIZE);

  //If filters or date change, you must reset to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [records]);


  const handleExport = async (type) => {
    if (type === "excel") {
      exportRevenueToExcel(records, "Detailed_Revenue_Report.xlsx");
    }

    if (type === "pdf") {
      await exportRevenueToPDF(records, {
        organization: authUser?.organization,
        date: date ? new Date(date).toLocaleDateString("en-GB") : "",
      });
    }
  };


  if (loading) return <p className="text-center py-4">Loading records...</p>;
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
            <h1>Detailed Report of IGF Performance by Revenue Categories</h1>
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
            <tr className="text-center font-semibold bg-blue-50">
              <th className="border border-gray-400 px-3 py-2">S.N</th>
              <th className="border border-gray-400 px-3 py-2">Date</th>
              <th className="border border-gray-400 px-3 py-2">
                Revenue Categories
              </th>
              <th className="border border-gray-400 px-3 py-2">
                Budget Projections
              </th>
              <th className="border border-gray-400 px-3 py-2">
                Actual Collections
              </th>
              <th className="border border-gray-400 px-3 py-2">
                Payment into Consolidated Fund
              </th>
              <th className="border border-gray-400 px-3 py-2">
                Retention Rate (%)
              </th>
              <th className="border border-gray-400 px-3 py-2">Retention</th>
              <th className="border border-gray-400 px-3 py-2">Remarks</th>
            </tr>
          </thead>

          <tbody className="text-gray-900">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan="15"
                  className="text-center text-gray-500 py-3 italic"
                >
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => (
                <tr key={record.id || index} className="text-center">
                  <td className="border border-gray-400 px-2 py-1 bg-gray-50 font-semibold">
                    {startIndex + index + 1}
                  </td>
                  <td className="border border-gray-400  px-2 py-1">
                    {record?.date}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.revenue_category}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.budgetProjections}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.actual_collection}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.payment_amount}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.retention_rate}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.retention_amount}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {record.remarks}
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
