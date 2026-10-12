import React from "react";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { BsArrowLeftShort } from "react-icons/bs";
import { RiArrowDownSFill } from "react-icons/ri";
import logo from "../assets/images/logo.jpeg";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { fetchDetailedECReport } from "../store/features/reportSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import { exportToExcel } from "../utils/economicClass/excelExport";
import { exportToPDF } from "../utils/economicClass/pdfExport";
import { getOrganizationLabel } from "../helpers/organizationLabel";
import TableSkeleton from "../components/ui/TableSkeleton";



export default function DetailedEC() {
  const { authUser } = useSelector((store) => store.auth);
  const location = useLocation();

  const { year, quarter, organization, status = "ALL" } = location.state || {};

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { detailedRecords, loading, error } = useSelector(
    (store) => store.report
  );

  const resolvedOrganization =
    organization === "ALL"
      ? "ALL ORGANIZATIONS"
      : organization || authUser?.organization;



  useEffect(() => {
    if (!year || !quarter) return;

    dispatch(
      fetchDetailedECReport({
        year,
        quarter,
        organization,
        status,
      })
    );
  }, [dispatch, year, quarter, organization, status]);

  //Pagination logic
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = detailedRecords.length;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedRecords = detailedRecords.slice(startIndex, startIndex + PAGE_SIZE);

  //If filters or date change, you must reset to page 1.
  useEffect(() => {
    setCurrentPage(1);
  }, [detailedRecords]);

  const handleExport = (type) => {
    if (type === "pdf") {
      exportToPDF(detailedRecords, {
        organization: resolvedOrganization,
        year,
        quarter,
      });

    }

    if (type === "excel") {
      exportToExcel(detailedRecords, year, quarter);
    }
  };

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
            <h1>
              Detailed Report of Budget Performance by Economic Classification
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

        {loading ? (
          <TableSkeleton
            variant="report"
            rows={8}
            headers={[
              "S.N",
              "Activity",
              "Date",
              "Economic Classification",
              "Funding Source",
              "Natural Account",
              "Description",
              "Appropriation",
              "Allotment",
              "Releases",
              "Actual Expenditure",
              "Actual Payment",
              "Allotment Balance",
            ]}
          />
        ) : error ? (
          <p className="text-center text-red-500 py-6">{error}</p>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[750px] table-auto border border-gray-400 text-sm text-gray-800">
            <thead className="bg-gray-100">
              <tr className="text-center font-semibold bg-blue-50">
                <th className="border border-gray-400 px-3 py-2">S.N</th>
                <th className="border border-gray-400 px-3 py-2">Activity</th>
                <th className="border border-gray-400 px-3 py-2">Date</th>
                <th className="border border-gray-400 px-3 py-2">
                  Economic Classification
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Funding Source
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Natural Account
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Description
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Appropriation
                </th>
                <th className="border border-gray-400 px-3 py-2">Allotment</th>
                <th className="border border-gray-400 px-3 py-2">Releases</th>
                <th className="border border-gray-400 px-3 py-2">
                  Actual Expenditure
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Actual Payment
                </th>
                <th className="border border-gray-400 px-3 py-2">
                  Allotment Balance
                </th>
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
                paginatedRecords.map((detailedRecords, index) => (
                  <tr key={detailedRecords.id || index} className="text-center">
                    <td className="border border-gray-400 px-2 py-1 bg-gray-50 font-semibold">
                      {startIndex + index + 1}
                    </td>

                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.activity}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.date}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.economicClassification}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.sourceOfFunding}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.naturalAccount}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.description}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.appropriation}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.allotment}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.releases}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.actualExpenditure}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.actualPayment}
                    </td>
                    <td className="border border-gray-400 px-2 py-1">
                      {detailedRecords.allotmentBalance}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {!loading && !error && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
