import React, { useEffect, useMemo} from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { RiArrowDownSFill } from "react-icons/ri";
import { useLocation } from "react-router";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getYearAndQuarter } from "../helpers/dateHelper";
import { formatReportData } from "../helpers/formatReportData";
import { fetchQuarterlyReport } from "../store/features/reportSlice";
import EconomicClassificationTable from "../components/EconomicClassificationTable";
import { economicClassificationData } from "../data/EconomicClassification";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ReportPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { reportData, totals, loading, error } = useSelector((s) => s.report);
  const {
    reportType = "EC",
    fundingSource = "ALL",
    date,
  } = location.state || {};

  // compute year & quarter from date (fallback to today)
  const { year, quarter } = useMemo(() => getYearAndQuarter(date), [date]);




  // fetch from backend when page loads or filters change
  useEffect(() => {
    // Only EC implemented now; extend for other report types later
    if (reportType === "EC") {
      dispatch(
        fetchQuarterlyReport({ year, quarter, sourceOfFunding: fundingSource })
      );
    }
  }, [dispatch, year, quarter, fundingSource, reportType]);



  // transform backend payload into your table format
 const tableData = useMemo(
   () => formatReportData(reportData, fundingSource),
   [reportData, fundingSource]
 );



  // export handlers use tableData (not local dummy)
  const handleExport = (type) => {
    // PDF & Excel export code — adapt to use tableData and totals
    if (type === "pdf") {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });
      doc.setFont("times", "bold");
      doc.setFontSize(14);
      doc.text(
        "Summary of Budget Performance by Economic Classification and Funding",
        40,
        40
      );
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        `DADs: ${/* you can get authUser from store if you like */ ""}`,
        40,
        60
      );
      doc.text(`Year: ${year}`, 40, 75);
      doc.text("Currency: Ghana cedis (GHS)", 40, 90);
      doc.text(`Funding Source: ${fundingSource}`, 40, 105);
      doc.setLineWidth(0.5);
      doc.line(40, 115, 800, 115);

      const columns = [
        { header: "EXPENDITURE ITEM", dataKey: "item" },
        { header: "APPROPRIATION", dataKey: "budget" },
        { header: "AMOUNT RELEASED", dataKey: "released" },
        { header: "ACTUAL EXPENDITURE", dataKey: "expenditure" },
        { header: "ACTUAL PAYMENTS", dataKey: "payments" },
        { header: "PROJECTION", dataKey: "projection" },
      ];

      const rows = [];
      tableData.forEach((item) => {
        rows.push({
          item: item.title,
          budget: item.totalBudget.toLocaleString(),
          released: item.amountReleased.toLocaleString(),
          expenditure: item.actualExpenditure.toLocaleString(),
          payments: item.actualPayments.toLocaleString(),
          projection: item.projection.toLocaleString(),
        });

        if (Array.isArray(item.breakdown)) {
          item.breakdown.forEach((b) => {
            rows.push({
              item: `    ${b.source}`,
              budget: b.totalBudget.toLocaleString(),
              released: b.amountReleased.toLocaleString(),
              expenditure: b.actualExpenditure.toLocaleString(),
              payments: b.actualPayments.toLocaleString(),
              projection: b.projection.toLocaleString(),
            });
          });
        }
      });

      // total row
      rows.push({
        item: "TOTAL",
        budget: tableData
          .reduce((a, b) => a + b.totalBudget, 0)
          .toLocaleString(),
        released: tableData
          .reduce((a, b) => a + b.amountReleased, 0)
          .toLocaleString(),
        expenditure: tableData
          .reduce((a, b) => a + b.actualExpenditure, 0)
          .toLocaleString(),
        payments: tableData
          .reduce((a, b) => a + b.actualPayments, 0)
          .toLocaleString(),
        projection: tableData
          .reduce((a, b) => a + b.projection, 0)
          .toLocaleString(),
      });

      autoTable(doc, {
        startY: 125,
        columns,
        body: rows,
        styles: { fontSize: 9, cellPadding: 5, halign: "right" },
        columnStyles: { item: { halign: "left" } },
        headStyles: {
          fillColor: [219, 234, 254],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        didParseCell: (data) => {
          if (data.row.raw.item?.startsWith("    ")) {
            data.cell.styles.fontStyle = "italic";
            data.cell.styles.textColor = [90, 90, 90];
          }
          if (data.row.raw.item === "TOTAL") {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.textColor = [22, 101, 52];
            data.cell.styles.fillColor = [240, 253, 244];
          }
        },
        margin: { left: 40, right: 40 },
      });

      doc.save(`Economic_Report_${fundingSource}.pdf`);
    }

    if (type === "excel") {
      const rows = [];
      rows.push([
        "EXPENDITURE ITEM",
        "APPROPRIATION",
        "AMOUNT RELEASED",
        "ACTUAL EXPENDITURE",
        "ACTUAL PAYMENTS",
        "PROJECTION",
      ]);

      tableData.forEach((item) => {
        rows.push([
          item.title,
          item.totalBudget,
          item.amountReleased,
          item.actualExpenditure,
          item.actualPayments,
          item.projection,
        ]);
        if (Array.isArray(item.breakdown)) {
          item.breakdown.forEach((b) => {
            rows.push([
              `   ${b.source}`,
              b.totalBudget,
              b.amountReleased,
              b.actualExpenditure,
              b.actualPayments,
              b.projection,
            ]);
          });
        }
      });

      rows.push([
        "TOTAL",
        tableData.reduce((a, b) => a + b.totalBudget, 0),
        tableData.reduce((a, b) => a + b.amountReleased, 0),
        tableData.reduce((a, b) => a + b.actualExpenditure, 0),
        tableData.reduce((a, b) => a + b.actualPayments, 0),
        tableData.reduce((a, b) => a + b.projection, 0),
      ]);

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Economic Report");
      XLSX.writeFile(workbook, `Economic_Report_${fundingSource}.xlsx`);
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
          <EconomicClassificationTable data={tableData} />
        )}
      </div>
    </div>
  );
}
