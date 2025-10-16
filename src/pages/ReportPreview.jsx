import React from "react";
import { useLocation } from "react-router";
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import EconomicClassificationTable from "../components/EconomicClassificationTable";
import { economicClassificationData } from "../data/EconomicClassification";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportPreview() {
  const navigate = useNavigate();
  const location = useLocation();
  
 const reportType = location.state?.reportType || "EC";
 const fundingSource = location.state?.fundingSource || "ALL";


  console.log("RAW economicClassificationData:", economicClassificationData);


  // Function to filter or transform data based on funding source
  const filterByFundingSource = (data, source) => {
    if (source === "ALL") return data;

    return data.map((item) => {
      const matchingBreakdown = item.breakdown?.find(
        (b) => b.source.toLowerCase() === source.toLowerCase()
      );


      if (!matchingBreakdown) return item; // If source not found, return as-is it

      return {
        ...item,
        totalBudget: matchingBreakdown.totalBudget,
        amountReleased: matchingBreakdown.amountReleased,
        actualExpenditure: matchingBreakdown.actualExpenditure,
        actualPayments: matchingBreakdown.actualPayments,
        projection: matchingBreakdown.projection,
        breakdown: [matchingBreakdown], // only show the chosen source
      };
    });
  };

  const filteredData = filterByFundingSource(
    economicClassificationData,
    fundingSource
  );

  console.log("Filtered data:", filteredData);

  const handleExport = (type) => {
    if (type === "pdf") {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Header section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
        "Summary of Budget Performance by Economic Classification and Funding",
        40,
        40
      );

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        "DADs: The organisation of the user who runs the report",
        40,
        60
      );
      doc.text("Year: 2025", 40, 75);
      doc.text("Currency: Ghana cedis (GHS)", 40, 90);
      doc.text(`Funding Source: ${fundingSource}`, 40, 105);

      doc.setLineWidth(0.5);
      doc.line(40, 115, 800, 115);

      // Table structure
      const columns = [
        { header: "EXPENDITURE ITEM", dataKey: "item" },
        { header: "2025 APPROVED BUDGET / APPROPRIATION", dataKey: "budget" },
        { header: "AMOUNT RELEASED AS AT END AUG 2025", dataKey: "released" },
        {
          header: "ACTUAL EXPENDITURE AS AT END AUG 2025",
          dataKey: "expenditure",
        },
        { header: "ACTUAL PAYMENTS AS AT END AUG 2025", dataKey: "payments" },
        { header: "PROJECTIONS AS AT 31 DEC 2025", dataKey: "projection" },
      ];

      const rows = [];

      if (fundingSource === "ALL") {
        filteredData.forEach((item) => {
          rows.push({
            item: item.title || "",
            budget: (item.totalBudget ?? 0).toLocaleString(),
            released: (item.amountReleased ?? 0).toLocaleString(),
            expenditure: (item.actualExpenditure ?? 0).toLocaleString(),
            payments: (item.actualPayments ?? 0).toLocaleString(),
            projection: (item.projection ?? 0).toLocaleString(),
          });

          // Only include breakdown if it exists
          if (Array.isArray(item.breakdown) && item.breakdown.length > 0) {
            item.breakdown.forEach((b) => {
              rows.push({
                item: `   ↳ ${b.source || ""}`,
                budget: (b.totalBudget ?? 0).toLocaleString(),
                released: (b.amountReleased ?? 0).toLocaleString(),
                expenditure: (b.actualExpenditure ?? 0).toLocaleString(),
                payments: (b.actualPayments ?? 0).toLocaleString(),
                projection: (b.projection ?? 0).toLocaleString(),
              });
            });
          }
        });
      } else {
        // Single source (GoG / IGF / DPF)
        filteredData.forEach((item) => {
          rows.push({
            item: item.title,
            budget: item.totalBudget.toLocaleString(),
            released: item.amountReleased.toLocaleString(),
            expenditure: item.actualExpenditure.toLocaleString(),
            payments: item.actualPayments.toLocaleString(),
            projection: item.projection.toLocaleString(),
          });
        });
      }

      // Total row
      const total = {
        item: "TOTAL",
        budget: filteredData
          .reduce((a, b) => a + b.totalBudget, 0)
          .toLocaleString(),
        released: filteredData
          .reduce((a, b) => a + b.amountReleased, 0)
          .toLocaleString(),
        expenditure: filteredData
          .reduce((a, b) => a + b.actualExpenditure, 0)
          .toLocaleString(),
        payments: filteredData
          .reduce((a, b) => a + b.actualPayments, 0)
          .toLocaleString(),
        projection: filteredData
          .reduce((a, b) => a + b.projection, 0)
          .toLocaleString(),
      };
      rows.push(total);

      // Generate table
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
          if (data.row.raw.item?.startsWith("   ↳")) {
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
  };

  // function handleExport(type) {
  //   if (type === "pdf") {
  //     alert("Exporting report as PDF...");
  //   } else {
  //     alert("Exporting report as Excel...");
  //   }
  // }

  return (
    <div className="min-h-screen bg-green-50 p-6 flex flex-col ">
      {/* <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        {fundingSource === "ALL"
          ? "Economic Classification Summary (All Funding Sources)"
          : `Economic Classification Summary - ${fundingSource}`}
      </h1> */}

      <div className="flex justify-end items-center space-x-6 mb-4">
        <button
          onClick={() => navigate("/dashboard/reports")}
          className="  bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer shadow hover:bg-green-700"
        >
          ← Back
        </button>

        {/* Export Dropdown */}
        <div className="relative ">
          <details className="group">
            <summary className="list-none bg-green-600 text-white px-4 py-2 rounded font-medium cursor-pointer shadow hover:bg-green-700 flex items-center">
              Export ▼
            </summary>
            <div className="absolute right-0 mt-2 w-35 bg-white border rounded-lg shadow-lg overflow-hidden z-10 ">
              <button
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
                onClick={() => handleExport("pdf")}
              >
                <FaFilePdf className="text-red-600" /> PDF
              </button>
              <button
                className="flex items-center gap-2 w-full px-4 py-2 hover:bg-green-50"
                onClick={() => handleExport("excel")}
              >
                <FaFileExcel className="text-green-700" /> Excel
              </button>
            </div>
          </details>
        </div>
      </div>

      {/* Table */}
      <div className=" flex-1 overflow-y-auto">
        {reportType === "EC" && (
          <EconomicClassificationTable data={filteredData} />
        )}
      </div>
    </div>
  );
}
