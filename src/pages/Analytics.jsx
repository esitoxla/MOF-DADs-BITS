import React, { useEffect, useState } from "react";
import Select from "react-select";
import { api } from "../config/axios";
import {
  organizationOptions,
  quarterOptions,
  economicClassOptions,
  fundingSourceOptions,
} from "../data/BudgetExpenditureData";
import { revenueCategoriesOptions } from "../data/RevenueFormsData";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ALL_OPTION = { value: "", label: "All" };

const currencyTypeOptions = [
  { value: "GHS", label: "GHS" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "USD", label: "USD" },
];

const optionsWithAll = (options) => {
  const rest = options.filter(
    (o) => o.value !== "" && String(o.value).toUpperCase() !== "ALL"
  );
  return [ALL_OPTION, ...rest];
};

const isAllValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  String(value).toUpperCase() === "ALL";

const AXIS_WIDTH = 76;

const formatAxisTick = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  const compact = (divisor, suffix) => {
    const scaled = n / divisor;
    const label =
      Math.abs(scaled) >= 10 || Number.isInteger(scaled)
        ? scaled.toFixed(0)
        : scaled.toFixed(1);
    return `${label}${suffix}`;
  };
  if (abs >= 1_000_000) return compact(1_000_000, "M");
  if (abs >= 1_000) return compact(1_000, "K");
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: 38,
    height: 38,
    boxShadow: "none",
  }),
  valueContainer: (base) => ({
    ...base,
    height: 38,
    padding: "0 8px",
    flexWrap: "nowrap",
    overflow: "hidden",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    height: 38,
  }),
  singleValue: (base) => ({
    ...base,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  }),
  placeholder: (base) => ({
    ...base,
    margin: 0,
    whiteSpace: "nowrap",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function Analytics() {
  const filters = [
    {
      label: "DADs",
      key: "organization",
      options: optionsWithAll(organizationOptions),
    },
    {
      label: "Period",
      key: "period",
      options: optionsWithAll(quarterOptions),
    },
    {
      label: "Economic Classification",
      key: "economicClassification",
      options: optionsWithAll(economicClassOptions),
    },
    {
      label: "Source of Funding",
      key: "sourceOfFunding",
      options: optionsWithAll(fundingSourceOptions),
    },
    {
      label: "Revenue Category",
      key: "revenueCategory",
      options: optionsWithAll(revenueCategoriesOptions),
    },
    {
      label: "Currency Type",
      key: "currencyType",
      options: optionsWithAll(currencyTypeOptions),
    },
  ];

  const [filterValues, setFilterValues] = useState({});
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async (values) => {
    const params = {};
    Object.entries(values).forEach(([key, value]) => {
      if (!isAllValue(value)) params[key] = value;
    });

    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/analytics/dashboard", { params });
      setData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load analytics dashboard."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(filterValues);
    // Initial load on mount; subsequent fetches are triggered by handleFilterChange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (key, value) => {
    const next = { ...filterValues, [key]: value };
    setFilterValues(next);
    fetchDashboard(next);
  };

  const formatAmount = (num) =>
    Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });

  // Matches the app's actual sidebar green — adjust this one value if the
  // sidebar shade changes and every chart below will follow.
  const SIDEBAR_GREEN = "#15803d";

  const CURRENCY_COLORS = {
    GHS: "#14532d",
    EUR: SIDEBAR_GREEN,
    GBP: "#4ade80",
    USD: "#86efac",
  };

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-slate-50">
        <p className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 text-sm text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const reallocationChartData = [
    { name: "Reallocated Amount", value: data.reallocation.reallocatedAmount },
    { name: "Released", value: data.reallocation.released },
    { name: "Actual Expenditure", value: data.reallocation.actualExpenditure },
    { name: "Actual Payment", value: data.reallocation.actualPayment },
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-slate-50">
      <div className="shrink-0 sticky top-0 bg-slate-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 z-10">
        {/* Filter bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {filters.map((f) => (
            <div key={f.key} className="flex flex-col">
              <label className="text-xs font-semibold text-slate-500 mb-1">
                {f.label}
              </label>
              <Select
                options={f.options}
                placeholder="All"
                defaultValue={
                  f.options.find((o) => isAllValue(o.value)) || ALL_OPTION
                }
                value={
                  f.options.find((o) =>
                    isAllValue(filterValues[f.key])
                      ? isAllValue(o.value)
                      : o.value === filterValues[f.key],
                  ) || ALL_OPTION
                }
                onChange={(option) =>
                  handleFilterChange(f.key, option?.value ?? "")
                }
                menuPortalTarget={document.body}
                menuPosition="fixed"
                styles={selectStyles}
                filterOption={(option, inputValue) =>
                  option.label.toLowerCase().includes(inputValue.toLowerCase())
                }
              />
            </div>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryCard
            label="TOTAL BUDGET"
            currency="GHS"
            value={formatAmount(data.summary.totalBudget)}
          />
          <SummaryCard
            label="EXPENDITURE to date"
            currency="GHS"
            value={formatAmount(data.summary.expenditureToDate)}
            sub={`${data.summary.expenditureChangePct}% vs last Month`}
          />
          <SummaryCard
            label="BUDGET UTILISATION"
            value={`${Number(data.summary.budgetUtilisationPct).toFixed(3)}%`}
          />
          <SummaryCard
            label="VARIANCE"
            currency="GHS"
            value={formatAmount(data.summary.variance)}
          />
          <SummaryCard
            label="IGF COLLECTION to date"
            currency="GHS"
            value={formatAmount(data.summary.igfCollectionToDate)}
            sub={`${data.summary.igfChangePct}% vs last Month`}
          />
          <SummaryCard
            label="CASH POSITION to date"
            currency="GHS"
            value={formatAmount(data.summary.cashPositionToDate)}
            sub={`${data.summary.cashPositionChangePct}% vs last Quarter`}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {/* IGF Collection Trend + Expenditure Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="IGF Collection Trend">
            <TrendAreaChart
              data={data.igfCollectionTrend}
              color={SIDEBAR_GREEN}
              gradientId="igfTrendGradient"
            />
          </ChartCard>

          <ChartCard title="Expenditure Trend">
            <TrendAreaChart
              data={data.expenditureTrend}
              color={SIDEBAR_GREEN}
              gradientId="expenditureTrendGradient"
            />
          </ChartCard>
        </div>

        {/* Top 5 IGF DADs + Reallocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Top 5 IGF collection DADs">
            <div className="space-y-3">
              {data.topIgfDads.map((dad) => (
                <div key={dad.organization} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm truncate">
                    {dad.organization}
                  </span>
                  <div className="relative flex-1 h-7 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="relative h-full rounded-full"
                      style={{
                        width: `${dad.percent}%`,
                        backgroundColor: SIDEBAR_GREEN,
                      }}
                    >
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-white">
                        {dad.percent}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Reallocation">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
              {reallocationChartData.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: SIDEBAR_GREEN }}
                  />
                  <span className="text-xs">{item.name}</span>
                </div>
              ))}
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={reallocationChartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                  height={50}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  width={AXIS_WIDTH}
                  label={{
                    value: "Thousands",
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 11,
                  }}
                  tickFormatter={formatAxisTick}
                />
                <Tooltip cursor={false} content={<ReallocationTooltip />} />
                <Bar
                  dataKey="value"
                  fill={SIDEBAR_GREEN}
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Cash Position by Category */}
        <ChartCard title="Cash Position by Category">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={data.cashPositionByCategory}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis
                width={AXIS_WIDTH}
                label={{
                  value: "Thousands",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
                tickFormatter={formatAxisTick}
              />
              <Tooltip formatter={(v) => v.toFixed(2)} cursor={false} />
              <Legend />
              <Bar
                dataKey="GHS"
                fill={CURRENCY_COLORS.GHS}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="EUR"
                fill={CURRENCY_COLORS.EUR}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="GBP"
                fill={CURRENCY_COLORS.GBP}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="USD"
                fill={CURRENCY_COLORS.USD}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function TrendAreaChart({ data, color, gradientId }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="75%" stopColor={color} stopOpacity={0.06} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis width={AXIS_WIDTH} tickFormatter={formatAxisTick} />
        <Tooltip
          formatter={(v) =>
            v.toLocaleString(undefined, { minimumFractionDigits: 2 })
          }
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke={color}
          strokeWidth={3}
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={{ fill: color, r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SummaryCard({ label, value, currency, sub }) {
  const changePct = sub != null ? parseFloat(sub) : NaN;
  const hasTrend = Number.isFinite(changePct);
  const isIncrease = hasTrend && changePct >= 0;
  const trendClass = hasTrend
    ? isIncrease
      ? "text-positive"
      : "text-negative"
    : "text-slate-500";

  return (
    <div className="bg-white rounded-lg p-3 flex flex-col border-l-4 border-l-green-700 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/10 hover:z-10">
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <div
        className={`mt-1 min-w-0 ${
          currency
            ? "grid grid-cols-[2rem_minmax(0,1fr)] gap-x-1.5 items-baseline"
            : "flex flex-col"
        }`}
      >
        {currency ? (
          <span className="text-xs font-semibold text-slate-500 leading-tight">
            {currency}
          </span>
        ) : null}
        <span className="text-sm sm:text-base font-bold text-slate-800 tabular-nums leading-tight">
          {value}
        </span>
        {sub ? (
          <span className={`col-start-2 text-[11px] mt-0.5 ${trendClass}`}>
            {hasTrend && (
              <span aria-hidden="true">{isIncrease ? "▲ " : "▼ "}</span>
            )}
            {sub}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ReallocationTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const value = Number(item.value);
  const display = Number.isFinite(value)
    ? value.toLocaleString(undefined, { minimumFractionDigits: 2 })
    : item.value;

  return (
    <div className="bg-gray-900 text-white rounded-md px-3 py-2">
      <p className="font-bold">{item.payload?.name ?? item.name}</p>
      <p>GHS {display}</p>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md w-full border border-gray-100">
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800">
          {title}
        </h3>
        {subtitle ? (
          <span className="text-xs text-gray-400">{subtitle}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-slate-50">
      <div className="shrink-0 bg-slate-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`filter-skel-${i}`} className="flex flex-col gap-1">
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-[38px] bg-gray-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`card-skel-${i}`}
              className="h-[72px] bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-[340px] bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-[340px] bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
