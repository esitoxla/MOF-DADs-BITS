import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportRevenueToExcel = (
  detailedRecords,
  fileName = "Detailed_Revenue_Report.xlsx"
) => {
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

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Revenue Performance");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
};
