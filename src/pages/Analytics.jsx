import "./analytics/motion.css";
import React, { useEffect, useRef, useState } from "react";
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
  useDarkTheme,
  getPalette,
  getSelectStyles,
  fmtCompact,
  fmtFull,
  fmtPct,
  periodLabel,
  useGrowPercent,
} from "./analytics/theme";
import { ChangeLine, Card, KpiCard, Reveal, SectionTitle } from "./analytics/widgets";
import {
  AlertsPanel,
  DadTable,
  EconomicBreakdown,
  ExecutionSection,
  IgfSection,
  LiquiditySection,
  ReallocationSection,
  TrendsSection,
} from "./analytics/sections";

const ALL_OPTION = { value: "", label: "All" };
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_FLOOR = 2000;

const yearOptions = Array.from({ length: CURRENT_YEAR - YEAR_FLOOR + 1 }, (_, index) => {
  const year = String(CURRENT_YEAR - index);
  return { value: year, label: year };
});

const periodQuarterOptions = [
  ALL_OPTION,
  ...quarterOptions.map((quarter) => ({
    value: String(quarter.value),
    label: quarter.label,
  })),
];

const currencyTypeOptions = [
  { value: "GHS", label: "GHS" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "USD", label: "USD" },
];

const dataStatusOptions = [
  { value: "", label: "All records" },
  { value: "Approved", label: "Approved only" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Pending", label: "Pending" },
];

const defaultPeriodFilters = { year: String(CURRENT_YEAR), quarter: "" };

const optionsWithAll = (options) => {
  const rest = options.filter((o) => o.value !== "" && String(o.value).toUpperCase() !== "ALL");
  return [ALL_OPTION, ...rest];
};

const isAllValue = (value) =>
  value === undefined || value === null || value === "" || String(value).toUpperCase() === "ALL";

const orgLabel = (code) => getOrganizationLabel(code) || code;

export default function Analytics() {
  const { authUser, authChecked } = useSelector((state) => state.auth);
  const dark = useDarkTheme();
  const isAdmin = authUser?.role === "admin";
  const userOrganization = authUser?.organization || "";

  const organizationFilterOptions = isAdmin
    ? optionsWithAll(organizationOptions)
    : userOrganization
      ? [{ value: userOrganization, label: getOrganizationLabel(userOrganization) }]
      : [];

  const [filterValues, setFilterValues] = useState(() => ({
    ...defaultPeriodFilters,
    ...(authUser && authUser.role !== "admin" && authUser.organization
      ? { organization: authUser.organization }
      : {}),
  }));

  const filters = [
    { label: "DADs", key: "organization", options: organizationFilterOptions, locked: !isAdmin },
    { label: "Year", key: "year", options: yearOptions, allowAll: false, placeholder: "Year" },
    { label: "Quarter", key: "quarter", options: periodQuarterOptions, placeholder: "Quarter" },
    { label: "Economic Classification", key: "economicClassification", options: optionsWithAll(economicClassOptions) },
    { label: "Source of Funding", key: "sourceOfFunding", options: optionsWithAll(fundingSourceOptions) },
    { label: "Revenue Category", key: "revenueCategory", options: optionsWithAll(revenueCategoriesOptions) },
    { label: "Currency (cash only)", key: "currencyType", options: optionsWithAll(currencyTypeOptions) },
    { label: "Data Status", key: "dataStatus", options: dataStatusOptions },
  ];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const fetchDashboard = async (values) => {
    const params = {};
    Object.entries(values).forEach(([key, value]) => {
      if (!isAllValue(value)) params[key] = value;
    });

    // Only the newest request may update the page, so a slow earlier one cannot overwrite it.
    const thisRequest = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/analytics/dashboard", { params });
      if (thisRequest !== requestId.current) return;
      setData(response.data);
    } catch (err) {
      if (thisRequest !== requestId.current) return;
      setError(err.response?.data?.message || "Failed to load analytics dashboard.");
    } finally {
      if (thisRequest === requestId.current) setLoading(false);
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

  // First load: skeleton. Later reloads keep the page and dim it, so filters never disappear.
  if (loading && !data) return <AnalyticsSkeleton />;

  return (
    <div className="analytics-motion @container flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-green-50">
      <div className="z-10 shrink-0 bg-green-50 px-3 pb-3 pt-4 sm:px-6 lg:px-8">
        <FilterBar
          filters={filters}
          filterValues={filterValues}
          onChange={handleFilterChange}
          dark={dark}
        />
      </div>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        className={`no-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-8 sm:px-6 lg:px-8 ${
          loading ? "opacity-60 transition-opacity" : "transition-opacity"
        }`}
        aria-busy={loading}
      >
        {error ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-5 text-sm shadow-sm">
            <p className="font-semibold text-slate-800">The dashboard could not be loaded.</p>
            <p className="mt-1 text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => fetchDashboard(filterValues)}
              className="mt-3 rounded-lg bg-green-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
            >
              Try again
            </button>
          </div>
        ) : null}

        {data ? <Dashboard data={data} dark={dark} /> : null}
      </div>
      {loading && data ? (
        <div className="analytics-loading-track" role="progressbar" aria-label="Updating figures">
          <div className="analytics-loading-bar" />
        </div>
      ) : null}
      </div>
    </div>
  );
}

function FilterBar({ filters, filterValues, onChange, dark }) {
  const [open, setOpen] = useState(false);
  const summary = filters
    .map((filter) => {
      const selected = filter.options.find((option) =>
        isAllValue(filterValues[filter.key])
          ? isAllValue(option.value)
          : String(option.value) === String(filterValues[filter.key]),
      );
      if (!selected) return null;
      if (filter.key !== "year" && isAllValue(selected.value)) return null;
      return selected.label;
    })
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
      <div className="flex items-center justify-between gap-3 @2xl:hidden">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Filters</p>
          <p className="truncate text-sm font-semibold text-slate-800" title={summary}>
            {summary || "All records"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="shrink-0 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-green-800 hover:bg-green-50"
        >
          {open ? "Hide" : "Change"}
        </button>
      </div>
      <div
        className={`${open ? "mt-3 grid" : "hidden"} grid-cols-1 gap-x-3 gap-y-2 @md:grid-cols-2 @2xl:mt-0 @2xl:grid @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-8`}
      >
        {filters.map((f) => (
          <div key={f.key} className="flex min-w-0 flex-col">
            <label
              className="mb-1 truncate text-[10px] font-semibold uppercase leading-4 tracking-wide text-slate-500"
              title={f.label}
            >
              {f.label}
            </label>
            <Select
              options={f.options}
              placeholder={f.placeholder || (f.locked ? "Your organization" : "All")}
              isSearchable={!f.locked}
              value={
                f.locked
                  ? f.options[0] || null
                  : f.options.find((o) =>
                      isAllValue(filterValues[f.key])
                        ? isAllValue(o.value)
                        : String(o.value) === String(filterValues[f.key]),
                    ) || (f.allowAll === false ? f.options[0] || null : f.options[0] || ALL_OPTION)
              }
              onChange={(option) => onChange(f.key, option?.value ?? "")}
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
  );
}

function PeriodStrip({ data, dark }) {
  const palette = getPalette(dark);
  const { meta, period } = data;
  const clock = useGrowPercent(Math.min(Number(meta.expectedPct) || 0, 100), 0);
  const dataNote =
    meta.dataStatus === "ALL" ? "All records, including pending" : `${meta.dataStatus} records only`;

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm @2xl:grid-cols-[auto_minmax(0,1fr)_auto] @2xl:items-center @2xl:gap-x-8">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Showing</p>
        <p className="text-sm font-semibold text-slate-800">{periodLabel(period)}</p>
      </div>

      <div className="min-w-0" title={meta.expectedBasis}>
        <div className="mb-1.5 flex flex-col gap-0.5 @2xl:flex-row @2xl:items-baseline @2xl:justify-between @2xl:gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Fiscal clock</span>
          <span className="text-[11px] leading-snug text-slate-500">
            <span className="font-semibold text-slate-800">{fmtPct(meta.expectedPct, 0)}</span> of the annual budget
            expected to be used by now
          </span>
        </div>
        <div className="h-1.5 rounded-full" style={{ backgroundColor: palette.track }}>
          <div
            className="analytics-grow h-full rounded-full"
            style={{ width: `${clock.width}%`, backgroundColor: palette.marker }}
          />
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Data</p>
        <p className="text-sm font-semibold text-slate-800">{dataNote}</p>
      </div>
    </div>
  );
}

function Dashboard({ data, dark }) {
  const { summary, meta } = data;
  const showDadTable = data.dadPerformance.length > 1;

  return (
    <>
      <PeriodStrip data={data} dark={dark} />

      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-6">
        <KpiCard
          index={0}
          dark={dark}
          label="Appropriation"
          currency="GHS"
          amount={summary.totalBudget}
          value={fmtCompact(summary.totalBudget)}
          title={`GHS ${fmtFull(summary.totalBudget)}`}
          lines={[
            "Full-year budget",
            `Allotted: ${fmtCompact(summary.totalAllotment)}`,
          ]}
        />
        <KpiCard
          index={1}
          dark={dark}
          label="Releases"
          currency="GHS"
          amount={summary.releases}
          value={fmtCompact(summary.releases)}
          title={`GHS ${fmtFull(summary.releases)}`}
          lines={[
            summary.releaseRatePct === null
              ? "No allotment loaded to compare with"
              : `${fmtPct(summary.releaseRatePct, 0)} of allotment released`,
          ]}
        />
        <KpiCard
          index={2}
          dark={dark}
          label="Expenditure"
          currency="GHS"
          status={summary.spendStatus}
          amount={summary.expenditureToDate}
          value={fmtCompact(summary.expenditureToDate)}
          title={`GHS ${fmtFull(summary.expenditureToDate)}`}
          lines={[
            `${fmtPct(summary.budgetUtilisationPct, 1)} of full-year budget`,
            summary.pacePct === null
              ? "Pace cannot be worked out yet"
              : `${fmtPct(summary.pacePct, 0)} of expected pace`,
            <ChangeLine key="c" pct={summary.expenditureChangePct} label={meta.comparisonLabel} />,
          ]}
        />
        <KpiCard
          index={3}
          dark={dark}
          label="Unpaid commitments"
          currency="GHS"
          amount={summary.unpaid}
          value={fmtCompact(summary.unpaid)}
          title={`GHS ${fmtFull(summary.unpaid)}`}
          lines={[
            summary.unpaidSharePct === null
              ? "No expenditure yet"
              : `${fmtPct(summary.unpaidSharePct, 0)} of expenditure not yet paid`,
            "Expenditure less payments",
          ]}
        />
        <KpiCard
          index={4}
          dark={dark}
          label="IGF collected"
          currency="GHS"
          status={summary.igfStatus}
          amount={summary.igfCollectionToDate}
          value={fmtCompact(summary.igfCollectionToDate)}
          title={`GHS ${fmtFull(summary.igfCollectionToDate)}`}
          lines={[
            data.igf.attainmentPct === null
              ? "No IGF target entered"
              : `${fmtPct(data.igf.attainmentPct, 0)} of target to date`,
            <ChangeLine key="c" pct={summary.igfChangePct} label={meta.comparisonLabel} />,
          ]}
        />
        <KpiCard
          index={5}
          dark={dark}
          label="Cash position"
          currency={summary.cashCurrency}
          amount={summary.cashPositionToDate}
          value={fmtCompact(summary.cashPositionToDate)}
          title={`${summary.cashCurrency} ${fmtFull(summary.cashPositionToDate)}`}
          lines={[
            data.liquidity.months === null
              ? "Cover needs recorded spending"
              : `About ${data.liquidity.months} months of GHS cover`,
            <ChangeLine key="c" pct={summary.cashPositionChangePct} label={meta.comparisonLabel} />,
          ]}
        />
      </div>

      <Reveal className="mt-12">
        <SectionTitle kicker="Attention" title="What needs a decision" />
      </Reveal>
      <Reveal>
        <AlertsPanel alerts={data.alerts} orgLabel={orgLabel} dark={dark} />
      </Reveal>

      <Reveal className="mt-12">
        <SectionTitle
          kicker="Spending"
          title="How the budget is being used"
          blurb="Bars show money released and spent. The amber marker shows where spending should be by now."
        />
      </Reveal>
      <ExecutionSection data={data} dark={dark} />

      {showDadTable ? (
        <Reveal className="mt-6">
          <Card
            title="DAD performance"
            insight="Worst status first. Click a heading to sort."
            subtitle={`${data.dadPerformance.length} DADs`}
          >
            <DadTable
              rows={data.dadPerformance}
              orgLabel={orgLabel}
              expectedPct={meta.expectedPct}
              dark={dark}
            />
          </Card>
        </Reveal>
      ) : null}

      <Reveal className="mt-6">
        <Card title="Spending by economic classification" subtitle="Budget used against expected pace">
          <EconomicBreakdown rows={data.economicBreakdown} expectedPct={meta.expectedPct} dark={dark} />
        </Card>
      </Reveal>

      <Reveal className="mt-12">
        <SectionTitle kicker="Revenue" title="Internally generated funds" />
      </Reveal>
      <IgfSection data={data} orgLabel={orgLabel} dark={dark} />
      <div className="mt-6">
        <TrendsSection data={data} dark={dark} />
      </div>

      <Reveal className="mt-12">
        <SectionTitle kicker="Liquidity" title="Cash and reallocations" />
      </Reveal>
      <div className="grid min-w-0 grid-cols-1 gap-6">
        <LiquiditySection data={data} dark={dark} />
        <ReallocationSection data={data} dark={dark} />
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-slate-500">
        {meta.currencyNote} {meta.expectedBasis}. IGF targets use the most recent Budget Projection entered for each DAD
        and revenue category. Cash is the latest recorded balance per account in the period.
      </p>
    </>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="analytics-skeleton @container flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-green-50">
      <div className="shrink-0 bg-green-50 px-3 pb-3 pt-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="mb-3 h-10 animate-pulse rounded-lg bg-gray-200 @2xl:hidden" />
          <div className="hidden grid-cols-1 gap-3 @2xl:grid @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`filter-skel-${i}`} className="flex flex-col gap-1.5">
                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-[38px] animate-pulse rounded-[10px] bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="no-scrollbar min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 pb-8 sm:px-6 lg:px-8">
        <div className="mb-4 h-16 animate-pulse rounded-2xl bg-gray-200" />
        <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`card-skel-${i}`} className="h-[132px] animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
        <div className="mt-8 h-40 animate-pulse rounded-2xl bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-6 @4xl:grid-cols-5">
          <div className="h-[380px] animate-pulse rounded-2xl bg-gray-200 @4xl:col-span-3" />
          <div className="h-[380px] animate-pulse rounded-2xl bg-gray-200 @4xl:col-span-2" />
        </div>
      </div>
    </div>
  );
}
