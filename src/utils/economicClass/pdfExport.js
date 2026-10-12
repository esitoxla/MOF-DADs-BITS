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

export const exportToPDF = async (detailedRecords, meta = {}) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const doc = new jsPDF("l", "pt", "a4"); // Landscape
  const logoBase64 = await getBase64Image(logo);

  const orgLabel =
    meta.organization === "ALL" ? "ALL ORGANIZATIONS" : meta.organization || "";

  /* =========================
     HEADER BAND
  ========================== */
  const startY = drawReportHeader(doc, {
    title: "Detailed Report of Budget Performance by Economic Classification",
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
    r.activity,
    r.date,
    r.economicClassification,
    r.sourceOfFunding,
    r.naturalAccount,
    r.description,
    fmtAmount(r.appropriation),
    fmtAmount(r.allotment),
    fmtAmount(r.releases),
    fmtAmount(r.actualExpenditure),
    fmtAmount(r.actualPayment),
    fmtAmount(r.allotmentBalance),
  ]);

  // Usable width = 842 - 2 * 28 = 786pt. Widths below sum to exactly 786.
  const numericCols = [7, 8, 9, 10, 11, 12];
  const columnStyles = {
    0: { halign: "center", cellWidth: 22 }, // S.N
    1: { cellWidth: 52 }, // Activity
    2: { cellWidth: 54 }, // Date
    3: { cellWidth: 60 }, // Economic Class
    4: { cellWidth: 42 }, // Funding Source
    5: { cellWidth: 88 }, // Natural Account
    6: { cellWidth: 60 }, // Description
  };
  numericCols.forEach((i) => {
    columnStyles[i] = { cellWidth: 68, fontSize: 7.5 };
  });

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
        "Activity",
        "Date",
        "Economic Class",
        "Funding Source",
        "Natural Account",
        "Description",
        "Appropriation",
        "Allotment",
        "Releases",
        "Actual Expenditure",
        "Actual Payment",
        "Allotment Balance",
      ],
    ],
    body: tableBody,
  });

  /* =========================
     FOOTER ON EVERY PAGE
  ========================== */
  drawFooters(doc, "BITS | Ministry of Finance");

  doc.save("Detailed_EC_Report.pdf");
};
