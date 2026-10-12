import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64Image } from "../imageToBase64";
import logo from "../../assets/images/logo.jpeg";
import {
  fmtAmount,
  drawReportHeader,
  drawFooters,
  tableOptions,
} from "../detailedPdfTheme";

export const exportRevenueToPDF = async (detailedRecords, meta = {}) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const doc = new jsPDF("p", "pt", "a4"); // Portrait
  const logoBase64 = await getBase64Image(logo);

  const orgLabel =
    meta.organization === "ALL" ? "ALL ORGANIZATIONS" : meta.organization || "";

  /* =========================
     HEADER BAND
  ========================== */
  const startY = drawReportHeader(doc, {
    title: "Detailed Report of IGF Performance by Revenue Categories",
    lines: [
      `DADs: ${orgLabel}`,
      `Reporting Period: Q${meta.quarter || ""} ${meta.year || ""}`,
      "Currency: Ghana Cedis (GHS)",
    ],
    logo: logoBase64,
  });

  /* =========================
     TABLE
  ========================== */
  const tableBody = detailedRecords.map((r, index) => [
    index + 1,
    r.date,
    r.revenue_category,
    fmtAmount(r.budgetProjections),
    fmtAmount(r.actual_collection),
    fmtAmount(r.payment_amount),
    r.retention_rate ?? "",
    fmtAmount(r.retention_amount),
    r.remarks ?? "",
  ]);

  // Usable width = 595.28 - 2 * 28 = 539pt. Widths below sum to exactly 539.
  const numericCols = [3, 4, 5, 7];
  const columnStyles = {
    0: { halign: "center", cellWidth: 22 }, // S.N
    1: { cellWidth: 54 }, // Date
    2: { cellWidth: 80 }, // Revenue Category
    3: { cellWidth: 66, fontSize: 7.5 }, // Budget Projections
    4: { cellWidth: 66, fontSize: 7.5 }, // Actual Collections
    5: { cellWidth: 70, fontSize: 7.5 }, // Payment into Consolidated Fund
    6: { halign: "center", cellWidth: 52 }, // Retention Rate (%)
    7: { cellWidth: 62, fontSize: 7.5 }, // Retention
    8: { cellWidth: 67 }, // Remarks
  };

  autoTable(doc, {
    ...tableOptions(doc, {
      logo: logoBase64,
      startY,
      numericCols,
      columnStyles,
    }),
    head: [
      [
        "S.N",
        "Date",
        "Revenue Category",
        "Budget Projections",
        "Actual Collections",
        "Payment into Consolidated Fund",
        "Retention Rate (%)",
        "Retention",
        "Remarks",
      ],
    ],
    body: tableBody,
  });

  /* =========================
     FOOTER ON EVERY PAGE
  ========================== */
  drawFooters(doc, "BITS | Ministry of Finance");

  doc.save("Detailed_Revenue_Report.pdf");
};
