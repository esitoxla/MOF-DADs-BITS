import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportToExcel = (detailedRecords, fileName = "report.xlsx") => {
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

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
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
    fileName
  );
};
