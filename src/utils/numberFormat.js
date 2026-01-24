export const formatGHS = (v) =>
  v === null || v === undefined
    ? ""
    : Number(v).toLocaleString("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
