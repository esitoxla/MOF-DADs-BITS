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

export const exportCashToPDF = async (detailedRecords, meta = {}) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  // Units are in points (pt). Portrait A4.
  const doc = new jsPDF("p", "pt", "a4");
  const logoBase64 = await getBase64Image(logo);

  const orgLabel =
    meta.organization === "ALL" ? "ALL ORGANIZATIONS" : meta.organization || "";

  /* =========================
     HEADER BAND
  ========================== */
  const startY = drawReportHeader(doc, {
    title: "Detailed Cash Position Report",
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
    new Date(r.as_at_date).toLocaleDateString("en-GB"),
    r.account_name,
    r.currency,
    fmtAmount(r.balance),
  ]);

  // Usable width = 595.28 - 2 * 28 = 539pt. Widths below sum to exactly 539.
  const numericCols = [4];
  const columnStyles = {
    0: { halign: "center", cellWidth: 30 }, // S.N
    1: { halign: "center", cellWidth: 70 }, // Date
    2: { cellWidth: 240 }, // Account Name
    3: { halign: "center", cellWidth: 70 }, // Currency
    4: { cellWidth: 129 }, // Balance
  };

  const base = tableOptions(doc, {
    logo: logoBase64,
    startY,
    numericCols,
    columnStyles,
  });

  autoTable(doc, {
    ...base,
    // Roomier text than the 8pt default: this table only has 5 columns.
    styles: { ...base.styles, fontSize: 9, cellPadding: 5 },
    head: [["S.N", "Date", "Account Name", "Currency", "Balance"]],
    body: tableBody,
  });

  /* =========================
     FOOTER ON EVERY PAGE
  ========================== */
  drawFooters(doc, "BITS | Ministry of Finance");

  doc.save("Detailed_Cash_Position_Report.pdf");
};
