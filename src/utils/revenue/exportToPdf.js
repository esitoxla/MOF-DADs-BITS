import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64Image } from "../imageToBase64";
import logo from "../../assets/images/logo.jpeg";

export const exportRevenueToPDF = async (records, meta = {}) => {
  if (!records || records.length === 0) return;

  const doc = new jsPDF("l", "pt", "a4"); // landscape
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  /* =========================
     LOGO
  ========================== */
  const logoBase64 = await getBase64Image(logo);
  doc.addImage(logoBase64, "PNG", pageWidth - 120, 20, 80, 60);

  /* =========================
     HEADER TEXT
  ========================== */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Detailed Report of IGF Performance by Revenue Categories", 40, 40);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Organization: ${meta.organization || ""}`, 40, 60);
  doc.text(`Date: ${meta.date || ""}`, 40, 75);
  doc.text("Currency: Ghana Cedis (GHS)", 40, 90);

  /* =========================
     LOGO WATERMARK
  ========================== */
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.08 }));
  doc.addImage(
    logoBase64,
    "PNG",
    pageWidth / 2 - 250,
    pageHeight / 2 - 150,
    500,
    300
  );
  doc.restoreGraphicsState();

  /* =========================
     TABLE
  ========================== */
  const tableBody = records.map((r, index) => [
    index + 1,
    r.date,
    r.revenue_category,
    r.budgetProjections,
    r.actual_collection,
    r.payment_amount,
    r.retention_rate,
    r.retention_amount,
    r.remarks,
  ]);

  autoTable(doc, {
    startY: 110,
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

    styles: {
      fontSize: 8,
      cellPadding: 4,
      valign: "middle",
    },

    headStyles: {
      fillColor: [3, 56, 30], // dark green
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    columnStyles: {
      0: { halign: "center", cellWidth: 30 },
      3: { halign: "right" },
      4: { halign: "right" },
      5: { halign: "right" },
      7: { halign: "right" },
    },

    margin: { left: 20, right: 20 },

    didDrawPage: () => {
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth - 60,
        pageHeight - 20
      );
    },
  });

  doc.save("Detailed_Revenue_Report.pdf");
};
