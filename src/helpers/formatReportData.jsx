// ---- FIXED REPORT TEMPLATE ----
// This defines what always appears in your report
const EXPENDITURE_STRUCTURE = [
  {
    title: "Compensation of Employees",
    sources: ["GOG", "IGF"], // these always appear under this heading
  },
  {
    title: "Use of Goods and Services",
    sources: ["GOG", "IGF", "DPF"],
  },
  {
    title: "Capital Expenditure",
    sources: ["GOG", "IGF", "DPF"],
  },
];

/**
 * This function merges backend report data with the fixed expenditure layout.
 * - Fills in real values from the DB.
 * - Automatically sets missing ones to 0.
 * - Returns an array ready for your table component.
 */
export function formatReportData(reportRows = [], sourceOfFunding = "ALL") {
  // STEP 1: Index backend results for quick lookup
  const lookup = {};
  reportRows.forEach((row) => {
    const econ = row.economicClassification?.trim() || "";
    const source = row.sourceOfFunding?.trim()?.toUpperCase() || "";
    lookup[`${econ}-${source}`] = {
      appropriation: Number(row.totalAppropriation || 0),
      releases: Number(row.totalReleases || 0),
      expenditure: Number(row.totalExpenditure || 0),
      payment: Number(row.totalPayment || 0),
    };
  });

  // STEP 2: Merge backend data with fixed report template
  const formatted = EXPENDITURE_STRUCTURE.map((item) => {
    const breakdown = item.sources.map((src) => {
      const key = `${item.title}-${src}`;
      const data = lookup[key] || {};
      return {
        source: src,
        appropriation: data.appropriation || 0,
        releases: data.releases || 0,
        expenditure: data.expenditure || 0,
        payment: data.payment || 0,
        projection: 0,
      };
    });

    // Sum totals for this expenditure category
    const totalBudget = breakdown.reduce((sum, b) => sum + b.appropriation, 0);
    const amountReleased = breakdown.reduce((sum, b) => sum + b.releases, 0);
    const actualExpenditure = breakdown.reduce(
      (sum, b) => sum + b.expenditure,
      0
    );
    const actualPayments = breakdown.reduce((sum, b) => sum + b.payment, 0);

    return {
      title: item.title,
      totalBudget,
      amountReleased,
      actualExpenditure,
      actualPayments,
      projection: 0,
      breakdown,
    };
  });

  return formatted;
}
