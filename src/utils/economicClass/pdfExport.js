import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64Image } from "../imageToBase64";
import logo from "../../assets/images/logo.jpeg";
import { formatGHS } from "../numberFormat";


export const exportToPDF = async (detailedRecords, meta = {}) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const doc = new jsPDF("l", "pt", "a4"); // Landscape
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =========================
     TITLE
  ========================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    "Detailed Report of Budget Performance by Economic Classification",
    40,
    40
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`DADs: ${meta.organization || ""}`, 40, 60);
  doc.text(
    `Reporting Period: Q${meta.quarter || ""} ${meta.year || ""}`,
    40,
    75
  );
  doc.text("Currency: Ghana Cedis (GHS)", 40, 90);

  /* =========================
     LOGO
  ========================== */
  const logoBase64 = await getBase64Image(logo);
  doc.addImage(logoBase64, "JPEG", pageWidth - 120, 20, 80, 60);

  /* =========================
   LOGO WATERMARK
========================= */

  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.08 }));

  doc.addImage(
    logoBase64,
    "PNG",
    pageWidth / 2 - 250, // center horizontally
    pageHeight / 2 - 150, // center vertically
    500, // width
    300 // height
  );

  doc.restoreGraphicsState();

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
    formatGHS(r.appropriation),
    formatGHS(r.allotment),
    formatGHS(r.releases),
    formatGHS(r.actualExpenditure),
    formatGHS(r.actualPayment),
    formatGHS(r.allotmentBalance),
  ]);

  autoTable(doc, {
    startY: 110,
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

    /* ===== STYLING ===== */
    styles: {
      fontSize: 8,
      cellPadding: 4,
      valign: "middle",
    },

    headStyles: {
      fillColor: [3, 56, 30], // Dark green
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    columnStyles: {
      0: { halign: "center", cellWidth: 30 }, // S.N
      7: { halign: "right" }, // Appropriation
      8: { halign: "right" }, // Allotment
    },

    margin: { left: 20, right: 20 },

    didDrawPage: (data) => {
      // Footer
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth - 60,
        pageHeight - 20
      );
    },
  });


  doc.save("Detailed_EC_Report.pdf");
};
