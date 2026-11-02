import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { api } from "../config/axios";
import {
  organizationOptions,
  quarterOptions,
  economicClassOptions,
  fundingSourceOptions,
} from "../data/BudgetExpenditureData";
import { revenueCategoriesOptions } from "../data/RevenueFormsData";
import { getOrganizationLabel } from "../helpers/organizationLabel";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ALL_OPTION = { value: "", label: "All" };
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_FLOOR = 2000;

const yearOptions = Array.from(
  { length: CURRENT_YEAR - YEAR_FLOOR + 1 },
  (_, index) => {
    const year = String(CURRENT_YEAR - index);
    return { value: year, label: year };
  },
);

const periodQuarterOptions = [
  ALL_OPTION,
  ...quarterOptions.map((quarter) => ({
    value: String(quarter.value),
    label: quarter.label,
  })),
];

const defaultPeriodFilters = {
  year: String(CURRENT_YEAR),
  quarter: "",
};

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

const REALLOCATION_COLORS = {
  light: ["#15803d", "#0284c7", "#d97706", "#7c3aed"],
  dark: ["#39FF88", "#38bdf8", "#fbbf24", "#c4b5fd"],
};

const CURRENCY_PALETTE = {
  light: {
    GHS: "#15803d",
    EUR: "#2563eb",
    GBP: "#7c3aed",
    USD: "#d97706",
  },
  dark: {
    GHS: "#39FF88",
    EUR: "#60a5fa",
    GBP: "#c4b5fd",
    USD: "#fbbf24",
  },
};

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

function useDarkTheme() {
  const [dark, setDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const node = document.documentElement;
    const sync = () => setDark(node.classList.contains("dark"));
    const observer = new MutationObserver(sync);
    observer.observe(node, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return dark;
}

function getSelectStyles(dark) {
  const border = dark ? "rgba(57, 255, 136, 0.35)" : "#e2e8f0";
  const focus = dark ? "#39FF88" : "#15803d";
  const bg = dark ? "#0b132b" : "#ffffff";
  const text = dark ? "#e8fff3" : "#1e293b";
  const muted = dark ? "#a9b8c9" : "#64748b";
  const menuBg = dark ? "#121b36" : "#ffffff";

  return {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      borderRadius: 10,
      borderColor: state.isFocused ? focus : border,
      backgroundColor: bg,
      boxShadow: state.isFocused
        ? `0 0 0 3px ${dark ? "rgba(57,255,136,0.18)" : "rgba(21,128,61,0.12)"}`
        : "none",
      cursor: "pointer",
      "&:hover": { borderColor: focus },
    }),
    valueContainer: (base) => ({
      ...base,
      height: 40,
      padding: "0 10px",
      flexWrap: "nowrap",
      overflow: "hidden",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 40,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: muted,
      padding: "0 8px",
      "&:hover": { color: focus },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    singleValue: (base) => ({
      ...base,
      margin: 0,
      color: text,
      fontSize: 13,
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    placeholder: (base) => ({
      ...base,
      margin: 0,
      color: muted,
      fontSize: 13,
      whiteSpace: "nowrap",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: text,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: menuBg,
      border: `1px solid ${border}`,
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      fontSize: 13,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? dark
          ? "rgba(57,255,136,0.18)"
          : "#ecfdf3"
        : state.isFocused
          ? dark
            ? "rgba(57,255,136,0.1)"
            : "#f0fdf4"
          : "transparent",
      color: state.isSelected ? (dark ? "#39FF88" : "#166534") : text,
    }),
  };
}

export default function Analytics() {
  const { authUser, authChecked } = useSelector((state) => state.auth);
  const dark = useDarkTheme();
  const isAdmin = authUser?.role === "admin";
  const userOrganization = authUser?.organization || "";

  const organizationFilterOptions = isAdmin
    ? optionsWithAll(organizationOptions)
    : userOrganization
      ? [
          {
            value: userOrganization,
            label: getOrganizationLabel(userOrganization),
          },
        ]
      : [];

  const [filterValues, setFilterValues] = useState(() => ({
    ...defaultPeriodFilters,
    ...(authUser && authUser.role !== "admin" && authUser.organization
      ? { organization: authUser.organization }
      : {}),
  }));

  const filters = [
    {
      label: "DADs",
      key: "organization",
      options: organizationFilterOptions,
      locked: !isAdmin,
    },
    {
      label: "Year",
      key: "year",
      options: yearOptions,
      allowAll: false,
      placeholder: "Year",
    },
    {
      label: "Quarter",
      key: "quarter",
      options: periodQuarterOptions,
      placeholder: "Quarter",
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
    if (!authChecked || !authUser) return;

    const initial = {
      ...defaultPeriodFilters,
      ...(isAdmin ? {} : { organization: userOrganization }),
    };
    setFilterValues(initial);
    fetchDashboard(initial);
    // Wait until the signed-in user is known so non-admins load on their own DAD.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authChecked, authUser?.id, isAdmin, userOrganization]);

  const handleFilterChange = (key, value) => {
    if (key === "organization" && !isAdmin) return;

    const next = { ...filterValues, [key]: value };
    if (!isAdmin) next.organization = userOrganization;
    setFilterValues(next);
    fetchDashboard(next);
  };

  const formatAmount = (num) =>
    Number(num).toLocaleString(undefined, { minimumFractionDigits: 2 });

  const SIDEBAR_GREEN = dark ? "#39FF88" : "#15803d";
  const reallocationColors = dark
    ? REALLOCATION_COLORS.dark
    : REALLOCATION_COLORS.light;
  const CURRENCY_COLORS = dark ? CURRENCY_PALETTE.dark : CURRENCY_PALETTE.light;

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <div className="h-full min-h-0 overflow-hidden flex flex-col bg-slate-50">
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
    <div className="@container h-full min-h-0 min-w-0 overflow-hidden flex flex-col bg-green-50">
      <div className="shrink-0 sticky top-0 bg-green-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 z-10 max-h-[70vh] overflow-y-auto @3xl:max-h-none @3xl:overflow-visible">
        {/* Filter bar */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-7 gap-3">
            {filters.map((f) => (
              <div key={f.key} className="flex min-w-0 flex-col">
                <label
                  className="mb-1.5 line-clamp-2 min-h-8 text-[11px] font-semibold uppercase leading-4 tracking-wide text-slate-500"
                  title={f.label}
                >
                  {f.label}
                </label>
                <Select
                  options={f.options}
                  placeholder={
                    f.placeholder || (f.locked ? "Your organization" : "All")
                  }
                  isSearchable={!f.locked}
                  value={
                    f.locked
                      ? f.options[0] || null
                      : f.options.find((o) =>
                          isAllValue(filterValues[f.key])
                            ? isAllValue(o.value)
                            : String(o.value) === String(filterValues[f.key]),
                        ) || (f.allowAll === false ? f.options[0] || null : ALL_OPTION)
                  }
                  onChange={(option) =>
                    handleFilterChange(f.key, option?.value ?? "")
                  }
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  styles={getSelectStyles(dark)}
                  filterOption={(option, inputValue) =>
                    option.label.toLowerCase().includes(inputValue.toLowerCase())
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-6 gap-3">
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

      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        {/* IGF Collection Trend + Expenditure Trend */}
        <div className="grid min-w-0 grid-cols-1 @4xl:grid-cols-2 gap-6 mb-8">
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
        <div className="grid min-w-0 grid-cols-1 @4xl:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Top 5 IGF collection DADs">
            <div className="space-y-3">
              {data.topIgfDads.map((dad) => (
                <div key={dad.organization} className="flex min-w-0 items-center gap-2 @sm:gap-3">
                  <span className="w-20 @sm:w-28 shrink-0 text-sm truncate">
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
                      <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-xs text-white dark:text-[#0B132B]">
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
              {reallocationChartData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: reallocationColors[index] }}
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
                  angle={-32}
                  textAnchor="end"
                  interval={0}
                  height={64}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(name) =>
                    ({
                      "Reallocated Amount": "Reallocated",
                      "Actual Expenditure": "Expenditure",
                      "Actual Payment": "Payment",
                    })[name] || name
                  }
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
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {reallocationChartData.map((item, index) => (
                    <Cell key={item.name} fill={reallocationColors[index]} />
                  ))}
                </Bar>
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
              <XAxis
                dataKey="category"
                interval={0}
                angle={-28}
                textAnchor="end"
                height={64}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => {
                  const text = String(value);
                  return text.length > 14 ? `${text.slice(0, 12)}…` : text;
                }}
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
  const xKey = data[0]?.date ? "date" : "month";
  const monthTicks = [];
  let previousMonth = "";
  for (const point of data) {
    if (point.month === previousMonth) continue;
    monthTicks.push(point[xKey]);
    previousMonth = point.month;
  }

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
        <XAxis
          dataKey={xKey}
          ticks={monthTicks}
          interval={0}
          tickFormatter={(value) =>
            data.find((point) => point[xKey] === value)?.month || ""
          }
        />
        <YAxis width={AXIS_WIDTH} tickFormatter={formatAxisTick} />
        <Tooltip
          labelFormatter={(label) => {
            const point = data.find((item) => item[xKey] === label);
            if (!point?.date) return point?.month || label;
            const day = Number(String(point.date).slice(8, 10));
            return `${point.month} ${day}`;
          }}
          formatter={(v) =>
            Number(v).toLocaleString(undefined, { minimumFractionDigits: 2 })
          }
        />
        <Area
          type="linear"
          dataKey="amount"
          stroke="none"
          fill={`url(#${gradientId})`}
          fillOpacity={1}
          dot={false}
          activeDot={false}
          legendType="none"
          tooltipType="none"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="amount"
          stroke="#ffffff"
          strokeWidth={3.5}
          strokeLinejoin="miter"
          strokeLinecap="butt"
          strokeMiterlimit={8}
          fill="none"
          dot={false}
          activeDot={false}
          legendType="none"
          tooltipType="none"
          isAnimationActive={false}
        />
        <Area
          type="linear"
          dataKey="amount"
          stroke={color}
          strokeWidth={1.75}
          strokeLinejoin="miter"
          strokeLinecap="butt"
          strokeMiterlimit={8}
          fill="none"
          dot={false}
          activeDot={{ r: 4, fill: color, stroke: "#ffffff", strokeWidth: 2 }}
          isAnimationActive={false}
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
    <div className="flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 border-l-4 border-l-green-700 bg-white p-3.5 shadow-sm transition-all duration-200 ease-out hover:z-10 hover:-translate-y-1 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/10">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <p className="mt-2 flex min-w-0 items-baseline gap-1.5">
        {currency ? (
          <span className="shrink-0 text-[11px] font-semibold text-slate-500">
            {currency}
          </span>
        ) : null}
        <span className="min-w-0 text-sm font-bold leading-tight tracking-tight text-slate-800 tabular-nums @5xl:text-[15px]">
          {value}
        </span>
      </p>
      {sub ? (
        <p className={`mt-auto pt-2 text-[11px] font-medium leading-snug ${trendClass}`}>
          {hasTrend && (
            <span aria-hidden="true">{isIncrease ? "▲ " : "▼ "}</span>
          )}
          {sub}
        </p>
      ) : (
        <span className="mt-auto pt-2" />
      )}
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
    <div className="min-w-0 w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg hover:shadow-green-900/10 sm:p-6">
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
    <div className="@container h-full min-h-0 min-w-0 overflow-hidden flex flex-col bg-green-50">
      <div className="shrink-0 bg-green-50 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8 pb-4 max-h-[70vh] overflow-y-auto @3xl:max-h-none @3xl:overflow-visible">
        <div className="mb-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={`filter-skel-${i}`} className="flex flex-col gap-1.5">
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-[10px] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`card-skel-${i}`}
              className="h-[104px] bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0 min-w-0 overflow-y-auto px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-6 mb-8">
          <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-[360px] bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-6 mb-8">
          <div className="h-[340px] bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-[340px] bg-gray-200 rounded-2xl animate-pulse" />
        </div>
        <div className="h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
