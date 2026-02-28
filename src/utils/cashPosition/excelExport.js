import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportCashToExcel = (detailedRecords, year) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const formattedData = detailedRecords.map((r, index) => ({
    "S.N": index + 1,
    Date: new Date(r.as_at_date).toLocaleDateString("en-GB"),
    "Account Name": r.account_name,
    Currency: r.currency,
    Balance: Number(r.balance),
  }));

  // Create worksheet from JSON
  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    origin: "A3", // table starts at row 3
  });

  // Add simple title
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[`Detailed Cash Position Report - ${year}`]],
    { origin: "A1" },
  );

   const totalColumns = Object.keys(formattedData[0]).length;

   // Merge title across columns
   worksheet["!merges"] = [
     {
       s: { r: 0, c: 0 },
       e: { r: 0, c: totalColumns - 1 },
     },
   ];

   // Style title
   worksheet["A1"].s = {
     font: {
       bold: true,
       sz: 16,
     },
     alignment: {
       horizontal: "center",
       vertical: "center",
     },
   };


  /* =========================
     STYLE HEADER ROW (Row 3)
  ========================== */
  const headerRow = 3;
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      r: headerRow - 1,
      c: col,
    });

    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "008000" }, // Green text
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cash Position");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Detailed_Cash_Position_Report_${year}.xlsx`,
  );
};;;
