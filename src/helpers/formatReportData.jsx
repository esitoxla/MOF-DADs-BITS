
export function formatReportData(reportRows = [], sourceOfFunding = "ALL") {
  const grouped = {};

  reportRows.forEach((r) => {
    const econ = r.economicClassification || "Unspecified";
    const source = r.sourceOfFunding || sourceOfFunding || "Unknown";

    const appropriation = Number(r.totalAppropriation || 0);
    const releases = Number(r.totalReleases || 0);
    const expenditure = Number(r.totalExpenditure || 0);
    const payment = Number(r.totalPayment || 0);

    if (!grouped[econ]) {
      grouped[econ] = {
        title: econ,
        totalBudget: 0,
        amountReleased: 0,
        actualExpenditure: 0,
        actualPayments: 0,
        projection: 0,
        breakdown: [],
      };
    }

    // Always add a breakdown row (even if only one source)
    grouped[econ].breakdown.push({
      source,
      totalBudget: appropriation,
      amountReleased: releases,
      actualExpenditure: expenditure,
      actualPayments: payment,
      projection: 0,
    });

    // Update top-level totals
    grouped[econ].totalBudget += appropriation;
    grouped[econ].amountReleased += releases;
    grouped[econ].actualExpenditure += expenditure;
    grouped[econ].actualPayments += payment;
  });

  return Object.values(grouped);
}
