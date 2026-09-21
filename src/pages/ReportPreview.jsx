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
import NaturalAccountPerformanceTable from "../components/NaturalAccountPerformanceTable";
import {
  fetchNaturalAccountQuarterlyReport,
  downloadNaturalAccountPDF,
  downloadNaturalAccountExcel,
} from "../store/features/naturalAccountSlice";
import ReallocationPerformanceTable from "../components/ReallocationPerformanceTable";
import { downloadReallocationExcel, downloadReallocationPDF, fetchReallocationReport } from "../store/features/reallocationReportSlice";
import TableSkeleton from "../components/ui/TableSkeleton";



export default function ReportPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const economicClass = useSelector((store) => store.report);
  const revenue = useSelector((store) => store.revenueReport);
  const cash = useSelector((store) => store.cashReport);
  const naturalAccount = useSelector((store) => store.naturalAccountReport);
  const reallocationReport = useSelector((store) => store.reallocationReport);

  const {
    reportType = "EC",
    fundingSource = "ALL",
    year,
    quarter,
    organization,
    status = "ALL",
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

  if (reportType === "NA") {
    ({ reportData, totals, loading, error } = naturalAccount);
  }

 if ( reportType === "RE") {
  ({ reportData, totals, loading, error } = reallocationReport);
 }
  

  //for NA source of funding filtering
  const normalizedFunding =
    fundingSource && typeof fundingSource === "object"
      ? fundingSource.value
      : fundingSource;

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
          status,
        }),
      );
    }

    if (reportType === "IRP") {
      dispatch(
        fetchQuarterlyRevenueReport({
          year,
          quarter,
          organization,
          status,
        }),
      );
    }

    if (reportType === "CP") {
      dispatch(
        fetchCashPositionReport({
          year,
          quarter,
          organization,
          status,
        }),
      );
    }

    if (reportType === "NA") {
      dispatch(
        fetchNaturalAccountQuarterlyReport({
          year,
          quarter,
          organization,
          sourceOfFunding: normalizedFunding,
          status,
        }),
      );
    }

    if (reportType === "RE") {
      dispatch(
        fetchReallocationReport({
          year,
          quarter,
          organization,
          status,
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
    status,
    as_at_date,
  ]);

  // transform backend payload into your table format
  const tableData = reportData;

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
      case "NA":
        return (
          <NaturalAccountPerformanceTable
            data={tableData}
            totals={totals}
            year={year}
            quarter={quarter}
            fundingSource={fundingSource}
            organization={organization}
          />
        );
      case "RE":
        return (
          <ReallocationPerformanceTable
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

  // export handlers use tableData
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
            status,
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
            status,
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
            status,
          }),
        );
      }

      if (type === "excel") {
        dispatch(
          downloadQuarterlyRevenueExcel({
            year,
            quarter,
            organization,
            status,
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
          status,
        });
      }

      if (type === "excel") {
        await downloadCashPositionExcel({
          year,
          quarter,
          organization,
          status,
        });
      }
    }

    // ===============================
    // NATURAL ACCOUNT
    // ===============================
    if (reportType === "NA") {
      if (type === "pdf") {
        dispatch(
          downloadNaturalAccountPDF({
            year,
            quarter,
            organization,
            sourceOfFunding: normalizedFunding,
            status,
          }),
        );
      }

      if (type === "excel") {
        dispatch(
          downloadNaturalAccountExcel({
            year,
            quarter,
            organization,
            sourceOfFunding: normalizedFunding,
            status,
          }),
        );
      }
    }
    // ===============================
    // REALLOCATION
    // ===============================
    if (reportType === "RE") {
      if (type === "pdf") {
        dispatch(
          downloadReallocationPDF({
            year,
            quarter,
            organization,
            sourceOfFunding: normalizedFunding,
            status,
          }),
        );
      }

      if (type === "excel") {
        dispatch(
          downloadReallocationExcel({
            year,
            quarter,
            organization,
            sourceOfFunding: normalizedFunding,
            status,
          }),
        );
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
          <TableSkeleton
            variant="report"
            rows={8}
            headers={
              reportType === "IRP"
                ? [
                    "Revenue Categories",
                    "Projections / Budget",
                    "Actual Collection",
                    "Payment into Consolidated Fund",
                    "Retention",
                    "Remarks",
                  ]
                : reportType === "CP"
                  ? ["Account Name", "GHS", "EUR", "GBP", "USD"]
                  : reportType === "NA"
                    ? ["Natural Account", "GOG", "IGF", "DPF"]
                    : reportType === "RE"
                      ? [
                          "Expenditure Item",
                          "Amount Reallocated",
                          "Amount Released",
                          "Actual Expenditure",
                          "Actual Payment",
                        ]
                      : [
                          "Expenditure Item",
                          "Approved Budget / Appropriation",
                          "Amount Released",
                          "Actual Expenditure",
                          "Actual Payments",
                        ]
            }
          />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
}
