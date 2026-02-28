import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportToExcel = (detailedRecords, year) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const formattedData = detailedRecords.map((r, index) => ({
    "S.N": index + 1,
    Activity: r.activity,
    Date: r.date,
    "Economic Class": r.economicClassification,
    "Funding Source": r.sourceOfFunding,
    "Natural Account": r.naturalAccount,
    Description: r.description,
    Appropriation: r.appropriation,
    Allotment: r.allotment,
    "Allotment Balance": r.allotmentBalance,
    Releases: r.releases,
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
    [
      [
        `Detailed Report of Budget Performance by Economic Classification - ${year}`,
      ],
    ],
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
  XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed EC");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([excelBuffer], {
      type: "application/octet-stream",
    }),
    `Detailed EC Report ${year}.xlsx`,
  );
};
