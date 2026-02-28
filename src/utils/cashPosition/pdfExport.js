import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getBase64Image } from "../imageToBase64";
import logo from "../../assets/images/logo.jpeg";



//Every element in jsPDF is positioned using:
//doc.addImage(image, format, x, y, width, height)
// doc.text(text, x, y)
//x → distance from the left edge of the page
//y → distance from the top of the page


export const exportCashToPDF = async (detailedRecords, meta = {}) => {
  if (!detailedRecords || detailedRecords.length === 0) return;
  
//Units are in points (pt) because you used:
 const doc = new jsPDF("p", "pt", "a4");

 const pageWidth = doc.internal.pageSize.getWidth();
 const pageHeight = doc.internal.pageSize.getHeight();

 const marginLeft = 60;
 const marginRight = 60;
 const headerTop = 70;

 const logoBase64 = await getBase64Image(logo);

 /* ===== LOGO ===== */
 doc.addImage(
   logoBase64,
   "JPEG",
   pageWidth - marginRight - 130 ,
   85 ,
   70,
   50,
 );

 /* ===== TITLE ===== */
 doc.setFont("helvetica", "bold");
 doc.setFontSize(16);
 doc.text("DETAILED CASH POSITION REPORT", pageWidth / 2, headerTop, {
   align: "center",
 });

 /* ===== DETAILS ===== */
 doc.setFontSize(10);
 doc.setFont("helvetica", "normal");

 doc.text(
   `Organization: ${meta.organization || ""}`,
   marginLeft,
   headerTop + 30,
 );
 doc.text(
   `Reporting Period: Q${meta.quarter || ""} ${meta.year || ""}`,
   marginLeft,
   headerTop + 45,
 );
 doc.text("Currency: Ghana Cedis (GHS)", marginLeft, headerTop + 60);

  /* =========================
     WATERMARK
  ========================== */
  doc.saveGraphicsState();
  doc.setGState(new doc.GState({ opacity: 0.05 }));
  doc.addImage(
    logoBase64,
    "PNG",
    pageWidth / 2 - 200,
    pageHeight / 2 - 120,
    400,
    240,
  );
  doc.restoreGraphicsState();

  /* =========================
     TABLE
  ========================== */

  const tableBody = detailedRecords.map((r, index) => [
    index + 1,
    new Date(r.as_at_date).toLocaleDateString("en-GB"),
    r.account_name,
    r.currency,
    Number(r.balance).toLocaleString(),
  ]);

  autoTable(doc, {
    startY: headerTop + 90,
    head: [["S.N", "Date", "Account Name", "Currency", "Balance"]],
    body: tableBody,

    styles: {
      fontSize: 9,
      cellPadding: 5,
      valign: "middle",
    },

    headStyles: {
      fillColor: [3, 56, 30],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },

    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },

    columnStyles: {
      0: { halign: "center", cellWidth: 35 },
      1: { halign: "center", cellWidth: 70 },
      2: { cellWidth: 160 },
      3: { halign: "center", cellWidth: 60 },
      4: { halign: "right", cellWidth: 90 },
    },

    margin: { left: marginLeft, right: marginRight },

    didDrawPage: () => {
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        `Page ${doc.internal.getNumberOfPages()}`,
        pageWidth - 60,
        pageHeight - 20,
      );
    },
  });

  doc.save("Detailed_Cash_Position_Report.pdf");
};
