export const formatGHS = (v) =>
  v === null || v === undefined
    ? ""
    : Number(v).toLocaleString("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

export function formatAmount(value, { zero = "-", decimals = 2 } = {}) {
  if (value === null || value === undefined) return zero;

  const raw =
    typeof value === "string" ? value.replace(/,/g, "").trim() : value;
  if (raw === "") return zero;

  const numeric = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(numeric) || numeric === 0) return zero;

  return numeric.toLocaleString("en-GH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
