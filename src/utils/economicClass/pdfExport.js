import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64Image } from "../imageToBase64";
import logo from "../../assets/images/logo.jpeg";

export const exportToPDF = async (records, meta = {}) => {
  if (!records || records.length === 0) return;

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
  doc.text(`Organization: ${meta.organization || ""}`, 40, 60);
  doc.text(`Date: ${meta.date || ""}`, 40, 75);
  doc.text("Currency: Ghana Cedis (GHS)", 40, 90);

  /* =========================
     LOGO
  ========================== */
  const logoBase64 = await getBase64Image(logo);
  doc.addImage(logoBase64, "PNG", pageWidth - 120, 20, 80, 60);

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
  const tableBody = records.map((r, index) => [
    index + 1,
    r.activity,
    r.date,
    r.economicClassification,
    r.sourceOfFunding,
    r.naturalAccount,
    r.description,
    r.appropriation,
    r.allotment,
    r.allotmentBalance,
    r.releases,
    r.actualExpenditure,
    r.actualPayment,
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
        "Allotment Balance",
        "Releases",
        "Actual Expenditure",
        "Actual Payment",
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
