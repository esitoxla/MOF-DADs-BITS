import React, { useEffect, useMemo } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { RiArrowDownSFill } from "react-icons/ri";
import { useLocation } from "react-router";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuarterlyReport } from "../store/features/reportSlice";
import EconomicClassificationTable from "../components/EconomicClassificationTable";
import { useNavigate } from "react-router";
import { fetchQuarterlyRevenueReport } from "../store/features/revenueReport";
import {
  downloadQuarterlyExcel,
  downloadQuarterlyPDF,
} from "../store/features/reportSlice";
import {
  downloadQuarterlyRevenueExcel,
  downloadQuarterlyRevenuePDF,
} from "../store/features/revenueReport";
import RevenuePerformanceTable from "../components/RevenuePerformanceTable";
import CashPerformanceTable from "../components/CashPerformanceTable";
import {
  downloadCashPositionExcel,
  downloadCashPositionPDF,
  fetchCashPositionReport,
} from "../store/features/cashReportSlice";
import { quarterEndDate } from "../data/BudgetExpenditureData";

export default function ReportPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const economicClass = useSelector((store) => store.report);
  const revenue = useSelector((store) => store.revenueReport);
  const cash = useSelector((store) => store.cashReport);

  const {
    reportType = "EC",
    fundingSource = "ALL",
    year,
    quarter,
    organization,
  } = location.state || {};

  const as_at_date =
    reportType === "CP" && quarter && year
      ? `${year}-${quarterEndDate[quarter]}`
      : null;

  useEffect(() => {
    if (!year || !quarter) {
      navigate("/dashboard/reports/summaryReport");
    }
  }, [year, quarter, navigate]);

  let reportData = [];
  let totals = {};
  let loading = false;
  let error = null;

  if (reportType === "EC") {
    ({ reportData, totals, loading, error } = economicClass);
  }

  if (reportType === "IRP") {
    ({ reportData, totals, loading, error } = revenue);
  }

  if (reportType === "CP") {
    reportData = cash.summary.records;
    totals = cash.summary.totals;
    loading = cash.summary.loading;
    error = cash.summary.error;
  }

  // fetch from backend when page loads or filters change
  useEffect(() => {
    if (!reportType || !year || !quarter) return;

    if (reportType === "EC") {
      dispatch(
        fetchQuarterlyReport({
          year,
          quarter,
          sourceOfFunding: fundingSource,
          organization,
        }),
      );
    }

    if (reportType === "IRP") {
      dispatch(
        fetchQuarterlyRevenueReport({
          year,
          quarter,
          organization,
        }),
      );
    }

    if (reportType === "CP") {
      dispatch(
        fetchCashPositionReport({
          year,
          quarter,
          organization,
        }),
      );
    }
  }, [
    dispatch,
    reportType,
    year,
    quarter,
    fundingSource,
    organization,
    as_at_date,
  ]);

  // transform backend payload into your table format
  const tableData = useMemo(() => {
    return reportData;
  }, [reportData]);

  // Choose which table to render
  const renderTable = () => {
    switch (reportType) {
      case "EC":
        return (
          <EconomicClassificationTable
            data={tableData}
            totals={totals}
            year={year}
            quarter={quarter}
            fundingSource={fundingSource}
            organization={organization}
          />
        );
      case "IRP":
        return (
          <RevenuePerformanceTable
            data={tableData}
            totals={totals}
            year={year}
            quarter={quarter}
            organization={organization}
          />
        );
      case "CP":
        return (
          <CashPerformanceTable
            data={tableData}
            totals={totals}
            year={year}
            quarter={quarter}
            organization={organization}
          />
        );
      default:
        return <p>No table available for this report type.</p>;
    }
  };

  // export handlers use tableData (not local dummy)
  const handleExport = async (type) => {
    // ===============================
    // ECONOMIC CLASSIFICATION (EC)
    // ===============================
    if (reportType === "EC") {
      if (type === "pdf") {
        dispatch(
          downloadQuarterlyPDF({
            year,
            quarter,
            sourceOfFunding: fundingSource,
            organization,
          }),
        );
      }

      if (type === "excel") {
        dispatch(
          downloadQuarterlyExcel({
            year,
            quarter,
            sourceOfFunding: fundingSource,
            organization,
          }),
        );
      }
    }

    // ===============================
    // REVENUE PERFORMANCE (IRP)
    // ===============================
    if (reportType === "IRP") {
      if (type === "pdf") {
        dispatch(
          downloadQuarterlyRevenuePDF({
            year,
            quarter,
            organization,
          }),
        );
      }

      if (type === "excel") {
        dispatch(
          downloadQuarterlyRevenueExcel({
            year,
            quarter,
            organization,
          }),
        );
      }
    }

    // ===============================
    // CASH POSITION
    // ===============================
    if (reportType === "CP") {
      if (type === "pdf") {
        await downloadCashPositionPDF({
          year,
          quarter,
          organization,
        });
      }

      if (type === "excel") {
        await downloadCashPositionExcel({
          year,
          quarter,
          organization,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col ">
      <div className="flex justify-end items-center space-x-6 mb-4">
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="flex gap-1 bg-green-600 text-white px-4 py-2 rounded font-medium"
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

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p>Loading report...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
}
