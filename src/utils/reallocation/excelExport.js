import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportReallocationToExcel = (reallocationRecords, year) => {
  if (!reallocationRecords || reallocationRecords.length === 0) return;

  const formattedData = reallocationRecords.map((r, index) => ({
    "S.N": index + 1,
    Activity: r.activity,
    Date: r.date,
    "Economic Class": r.economicClassification,
    "Funding Source": r.sourceOfFunding,
    "Natural Account": r.naturalAccount,
    Description: r.description,
    "Amount Reallocated": r.amountReallocated,
    "Amount Released": r.amountReleased,
    "Actual Expenditure": r.actualExpenditure,
    "Actual Payment": r.actualPayment,
  }));

  // Create worksheet from data
 const worksheet = XLSX.utils.json_to_sheet(formattedData, {
   origin: "A3",
 });

  // Add Title in Row 1
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [[`Detailed Report of Budget Reallocation - ${year}`]],
    { origin: "A1" },
  );

  // Merge title across columns
  const totalColumns = Object.keys(formattedData[0]).length;
  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: { r: 0, c: totalColumns - 1 },
    },
  ];

  // Style Title
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

  // Style Header Row (Row 3)
  const headerRowNumber = 3;
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({
      r: headerRowNumber - 1,
      c: col,
    });

    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: {
          bold: true,
          color: { rgb: "008000" }, // GREEN
        },
        alignment: {
          horizontal: "center",
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed Reallocation");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `Detailed Reallocation Report ${year}.xlsx`,
  );
};
