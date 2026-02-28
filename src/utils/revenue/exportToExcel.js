import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";

export const exportRevenueToExcel = (detailedRecords, year) => {
  if (!detailedRecords || detailedRecords.length === 0) return;

  const formattedData = detailedRecords.map((r, index) => ({
    "S.N": index + 1,
    Date: r.date,
    "Revenue Category": r.revenue_category,
    "Budget Projections": r.budgetProjections,
    "Actual Collections": r.actual_collection,
    "Payment into Consolidated Fund": r.payment_amount,
    "Retention Rate (%)": r.retention_rate,
    Retention: r.retention_amount,
    Remarks: r.remarks,
  }));

  // Start table at row 3
  const worksheet = XLSX.utils.json_to_sheet(formattedData, {
    origin: "A3",
  });

  // ===== TITLE =====
  XLSX.utils.sheet_add_aoa(worksheet, [[`Detailed Revenue Collection Report - ${year}`]], {
    origin: "A1",
  });

  const totalColumns = Object.keys(formattedData[0]).length;

  // Merge title across all columns
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

  // ===== STYLE HEADER ROW (Row 3) =====
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
          color: { rgb: "008000" }, // GREEN TEXT
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Performance");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(
    new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `Detailed_Revenue_Report_${year}.xlsx`,
  );
};
