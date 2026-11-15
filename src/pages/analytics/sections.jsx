import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AXIS_WIDTH,
  getPalette,
  fmtCompact,
  fmtFull,
  fmtPct,
  formatAxisTick,
  useChartIntro,
  useGrowPercent,
  usePrefersReducedMotion,
} from "./theme";
import {
  Card,
  EmptyState,
  FunnelBars,
  LegendDots,
  MoneyTooltip,
  PacingBar,
  Reveal,
  SplitBar,
  StatusBadge,
  StatusIcon,
  useRevealShown,
} from "./widgets";

function ChartMotion({ children }) {
  const motion = useChartIntro();
  return children(motion);
}

const STATUS_ORDER = { at_risk: 3, watch: 2, on_track: 1, no_data: 0, no_target: 0 };

function ChartBox({ height, children }) {
  return (
    <div className="w-full min-w-0 overflow-hidden" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%" debounce={50}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function wrapWords(value, max = 16) {
  const words = String(value || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.length > max ? `${word.slice(0, max - 1)}…` : word));
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (line && next.length > max) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  if (lines.length <= 3) return lines;
  const kept = lines.slice(0, 3);
  kept[2] = `${kept[2].replace(/…$/, "").slice(0, max - 1)}…`;
  return kept;
}

function CategoryTick({ x, y, payload }) {
  const lines = wrapWords(payload?.value);
  const lineHeight = 13;
  const start = y - ((lines.length - 1) * lineHeight) / 2;
  return (
    <text x={x} y={start} textAnchor="end" fill="#64748b" fontSize={11}>
        {lines.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

// ---- Alerts ----------------------------------------------------------------------

const SEVERITY_STATUS = { critical: "at_risk", warning: "watch", info: "no_data" };
const SEVERITY_WORD = { critical: "Critical", warning: "Warning", info: "Note" };

export function AlertsPanel({ alerts, orgLabel, dark }) {
  const [showAll, setShowAll] = useState(false);
  const revealed = useRevealShown();
  const reduced = usePrefersReducedMotion();
  const introPlayed = useRef(false);
  const animateRows = revealed && !reduced && !introPlayed.current;

  useEffect(() => {
    if (revealed) introPlayed.current = true;
  }, [revealed]);

  const visible = showAll ? alerts.items : alerts.items.slice(0, 6);
  const hidden = alerts.items.length - visible.length;

  const summary = [
    alerts.counts.critical ? `${alerts.counts.critical} critical` : null,
    alerts.counts.warning ? `${alerts.counts.warning} to watch` : null,
    alerts.counts.info ? `${alerts.counts.info} note${alerts.counts.info === 1 ? "" : "s"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card
      title="Needs attention"
      insight="Flags worked out from the figures below, most serious first."
      subtitle={summary || null}
    >
      {alerts.items.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span style={{ color: getPalette(dark).brand }}>
            <StatusIcon status="on_track" size={16} />
          </span>
          Nothing needs attention. Spending, IGF and cash are all within normal ranges for this view.
        </div>
      ) : (
        <>
          <ul>
            {visible.map((alert, index) => {
              const status = SEVERITY_STATUS[alert.severity];
              return (
                <li
                  key={`${alert.code}-${alert.organization}-${index}`}
                  className={`flex items-start gap-3 border-b border-gray-100 py-2.5 last:border-b-0${animateRows ? " analytics-alert-row" : ""}`}
                  style={animateRows ? { animationDelay: `${index * 40}ms` } : undefined}
                >
                  <span className="mt-0.5">
                    <StatusBadge status={status} dark={dark} />
                  </span>
                  <p className="min-w-0 text-sm text-slate-800">
                    {alert.organization ? (
                      <span className="font-semibold">{orgLabel(alert.organization)}: </span>
                    ) : null}
                    <span className="text-slate-500">{alert.message}</span>
                    <span className="sr-only"> ({SEVERITY_WORD[alert.severity]})</span>
                  </p>
                </li>
              );
            })}
          </ul>
          {alerts.items.length > 6 ? (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="mt-2 text-xs font-semibold text-green-700 hover:underline"
            >
              {showAll ? "Show fewer" : `Show ${hidden} more`}
            </button>
          ) : null}
          {alerts.total > alerts.items.length ? (
            <p className="mt-2 text-xs text-slate-500">
              Showing the {alerts.items.length} most serious of {alerts.total} flags.
            </p>
          ) : null}
        </>
      )}
    </Card>
  );
}

// ---- Budget execution -----------------------------------------------------------

export function ExecutionSection({ data, dark }) {
  const palette = getPalette(dark);
  const { quarterly, funnel } = data.budgetExecution;
  const hasSpend = quarterly.some((q) => q.expenditure > 0 || q.releases > 0);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 @4xl:grid-cols-5">
      <Card
        className="@4xl:col-span-3"
        title="Budget execution by quarter"
        insight={data.insights.execution}
        subtitle={`${data.period.year} · even pace is ${fmtPct(data.meta.expectedPct, 0)} through the year`}
      >
        <LegendDots
          items={[
            { label: "Released", color: palette.brandSoft },
            { label: "Expenditure", color: palette.brand },
            { label: "Expected spend (even pace)", color: palette.marker, line: true },
          ]}
        />
        {hasSpend || data.summary.totalBudget ? (
          <ChartMotion>
            {(motion) => (
          <ChartBox height={280}>
            <ComposedChart data={quarterly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2} barCategoryGap="26%">
              <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
              <XAxis dataKey="quarter" tickLine={false} />
              <YAxis width={AXIS_WIDTH} tickFormatter={formatAxisTick} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: dark ? "rgba(57,255,136,0.06)" : "rgba(21,128,61,0.05)" }} content={<MoneyTooltip />} />
              <Bar dataKey="releases" name="Released" fill={palette.brandSoft} radius={[4, 4, 0, 0]} maxBarSize={30} {...motion}>
                {quarterly.map((q) => (
                  <Cell key={q.quarter} fillOpacity={q.selected ? 1 : 0.35} />
                ))}
              </Bar>
              <Bar dataKey="expenditure" name="Expenditure" fill={palette.brand} radius={[4, 4, 0, 0]} maxBarSize={30} {...motion}>
                {quarterly.map((q) => (
                  <Cell key={q.quarter} fillOpacity={q.selected ? 1 : 0.35} />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="expected"
                name="Expected spend"
                stroke={palette.marker}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={{ r: 4, fill: palette.marker, stroke: palette.surface, strokeWidth: 2 }}
                activeDot={{ r: 5 }}
                {...motion}
              />
            </ComposedChart>
          </ChartBox>
            )}
          </ChartMotion>
        ) : (
          <EmptyState>No appropriation or spending recorded for this selection.</EmptyState>
        )}
        <p className="mt-2 text-[11px] text-slate-500">
          Shows the whole year. Quarters outside your selection are faded. Expected spend assumes the
          appropriation is spread evenly, because no quarterly phasing is stored.
        </p>
      </Card>

      <Card
        className="@4xl:col-span-2"
        title="From appropriation to payment"
        insight="Appropriation and allotment are for the full year. The rest are for the selected period."
      >
        <FunnelBars stages={funnel} dark={dark} />
      </Card>
    </div>
  );
}

// ---- DAD performance table -------------------------------------------------------

const DAD_COLUMNS = [
  { key: "organization", label: "DAD", align: "left" },
  { key: "appropriation", label: "Appropriation", num: true },
  { key: "expenditure", label: "Spent", num: true },
  { key: "utilisationPct", label: "Budget used (tick = expected)", wide: true },
  { key: "pacePct", label: "Pace", num: true },
  { key: "igfAttainmentPct", label: "IGF vs target", num: true },
  { key: "unpaid", label: "Unpaid", num: true },
  { key: "status", label: "Status" },
];

export function DadTable({ rows, orgLabel, expectedPct, dark }) {
  const [sort, setSort] = useState({ key: "status", dir: "desc" });

  const sorted = useMemo(() => {
    const value = (row) => {
      if (sort.key === "organization") return orgLabel(row.organization).toLowerCase();
      if (sort.key === "status") return STATUS_ORDER[row.status] ?? 0;
      return row[sort.key];
    };
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      // Missing values always go last, whichever way we sort.
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      if (typeof va === "string") return va.localeCompare(vb) * factor;
      return (va - vb) * factor;
    });
  }, [rows, sort, orgLabel]);

  const toggle = (key) =>
    setSort((current) =>
      current.key === key
        ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "organization" ? "asc" : "desc" },
    );

  return (
    <div className="data-table-wrap">
      <table className="data-table analytics-dad-table">
        <thead>
          <tr>
            {DAD_COLUMNS.map((column) => {
              const active = sort.key === column.key;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
                  className={column.num ? "text-right" : "text-left"}
                >
                  <button
                    type="button"
                    onClick={() => toggle(column.key)}
                    className="inline-flex items-center gap-1 font-inherit"
                  >
                    {column.label}
                    <span aria-hidden="true" className={active ? "" : "opacity-30"}>
                      {active ? (sort.dir === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => (
            <tr key={row.organization}>
              <td className="font-semibold" title={row.organization}>
                {orgLabel(row.organization)}
              </td>
              <td className="text-right" title={`GHS ${fmtFull(row.appropriation)}`}>
                {fmtCompact(row.appropriation)}
              </td>
              <td className="text-right" title={`GHS ${fmtFull(row.expenditure)}`}>
                {fmtCompact(row.expenditure)}
              </td>
              <td style={{ minWidth: 170 }}>
                {row.appropriation ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <PacingBar utilisationPct={row.utilisationPct} expectedPct={expectedPct} dark={dark} index={index} />
                    </div>
                    <span className="w-12 text-right text-xs tabular-nums">{fmtPct(row.utilisationPct)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500">No appropriation</span>
                )}
              </td>
              <td className="text-right">{fmtPct(row.pacePct, 0)}</td>
              <td className="text-right">
                {row.igfAttainmentPct === null ? (
                  <span className="text-slate-500" title="No IGF target entered">
                    —
                  </span>
                ) : (
                  fmtPct(row.igfAttainmentPct, 0)
                )}
              </td>
              <td className="text-right" title={`GHS ${fmtFull(row.unpaid)}`}>
                {fmtCompact(row.unpaid)}
              </td>
              <td>
                <StatusBadge status={row.status} dark={dark} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EconomicBreakdown({ rows, expectedPct, dark }) {
  if (!rows.length) return <EmptyState>No spending by economic classification for this selection.</EmptyState>;

  return (
    <ul className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
      {rows.map((row, index) => (
        <li key={row.classification}>
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-sm font-medium text-slate-800">{row.classification}</span>
            <StatusBadge status={row.spendStatus} dark={dark} />
          </div>
          <PacingBar utilisationPct={row.utilisationPct} expectedPct={expectedPct} dark={dark} index={index} />
          <p className="mt-1 text-xs tabular-nums text-slate-500">
            <span title={`GHS ${fmtFull(row.expenditure)}`}>{fmtCompact(row.expenditure)}</span> spent of{" "}
            <span title={`GHS ${fmtFull(row.appropriation)}`}>{fmtCompact(row.appropriation)}</span> ·{" "}
            {fmtPct(row.utilisationPct)} used · pace {fmtPct(row.pacePct, 0)}
          </p>
        </li>
      ))}
    </ul>
  );
}

// ---- IGF ---------------------------------------------------------------------------

export function IgfSection({ data, orgLabel, dark }) {
  const palette = getPalette(dark);
  const { igf, topIgfDads } = data;
  const hasTargets = igf.targetYear > 0;
  const chartHeight = Math.max(200, igf.byCategory.length * 56 + 40);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 @4xl:grid-cols-5">
      <Reveal className="@4xl:col-span-3">
      <Card
        className="h-full"
        title="IGF collected against target"
        insight={data.insights.igf}
        subtitle={hasTargets ? `Targets pro-rated to date from GHS ${fmtCompact(igf.targetYear)} a year` : null}
      >
        {igf.byCategory.length ? (
          <>
            <LegendDots
              items={[
                { label: "Collected", color: palette.brand },
                { label: "Target to date", color: palette.marker },
              ]}
            />
            <ChartMotion>
              {(motion) => (
            <ChartBox height={chartHeight}>
              <BarChart
                data={igf.byCategory}
                layout="vertical"
                margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                barGap={2}
                barCategoryGap="30%"
              >
                <CartesianGrid horizontal={false} stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatAxisTick} tickLine={false} axisLine={false} minTickGap={16} />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={108}
                  tickLine={false}
                  axisLine={false}
                  tick={<CategoryTick />}
                  interval={0}
                />
                <Tooltip cursor={{ fill: dark ? "rgba(57,255,136,0.06)" : "rgba(21,128,61,0.05)" }} content={<MoneyTooltip />} />
                <Bar dataKey="actual" name="Collected" fill={palette.brand} radius={[0, 4, 4, 0]} maxBarSize={14} {...motion} />
                <Bar dataKey="target" name="Target to date" fill={palette.marker} radius={[0, 4, 4, 0]} maxBarSize={14} {...motion} />
              </BarChart>
            </ChartBox>
              )}
            </ChartMotion>
            {!hasTargets ? (
              <p className="mt-2 text-[11px] text-slate-500">
                Targets come from the Budget Projections entered on revenue records. None are entered for this selection.
              </p>
            ) : null}
          </>
        ) : (
          <EmptyState>No IGF collections recorded for this selection.</EmptyState>
        )}
      </Card>
      </Reveal>

      <Reveal className="@4xl:col-span-2">
      <Card
        className="h-full"
        title="Who collects, and where it goes"
        insight={
          topIgfDads.length
            ? `The top ${Math.min(5, topIgfDads.length)} DADs bring in ${fmtPct(igf.topFiveSharePct, 0)} of all IGF.`
            : null
        }
      >
        {topIgfDads.length ? (
          <ul className="mb-5 space-y-2.5">
            {topIgfDads.map((dad, index) => (
              <li key={dad.organization} className="flex min-w-0 flex-col gap-1 @md:flex-row @md:items-center @md:gap-3">
                <span className="min-w-0 truncate text-sm text-slate-800 @md:w-36 @md:shrink-0" title={orgLabel(dad.organization)}>
                  {orgLabel(dad.organization)}
                </span>
                <div className="h-2.5 flex-1 rounded-full" style={{ backgroundColor: palette.track }}>
                  <IgfShareBar percent={dad.percent} color={palette.brand} index={index} />
                </div>
                <span className="w-11 shrink-0 text-right text-xs tabular-nums text-slate-500">
                  {fmtPct(dad.percent, 0)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState>No IGF collections recorded.</EmptyState>
        )}

        {igf.retained + igf.remitted > 0 ? (
          <>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Retained vs paid to the Consolidated Fund
            </p>
            <SplitBar
              dark={dark}
              left={{ label: `Retained (${fmtPct(igf.retentionSharePct, 0)})`, amount: igf.retained }}
              right={{ label: "Paid to Consolidated Fund", amount: igf.remitted }}
            />
          </>
        ) : null}
      </Card>
      </Reveal>
    </div>
  );
}

function IgfShareBar({ percent, color, index }) {
  const grown = useGrowPercent(Math.min(Number(percent) || 0, 100), index);
  return (
    <div
      className="analytics-grow h-full rounded-full"
      style={{ width: `${grown.width}%`, backgroundColor: color }}
    />
  );
}

// ---- Trends ------------------------------------------------------------------------

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** One point per month, so the curve is a smooth wave like the dashboard preview. */
function toMonthlySeries(points, period) {
  const totals = new Map();
  for (const point of points || []) {
    const key = point.date ? String(point.date).slice(0, 7) : "";
    if (!/^\d{4}-\d{2}$/.test(key)) continue;
    totals.set(key, (totals.get(key) || 0) + (Number(point.amount) || 0));
  }

  let startKey = period?.start ? String(period.start).slice(0, 7) : "";
  let endKey = period?.end ? String(period.end).slice(0, 7) : "";
  if (!startKey || !endKey) {
    const keys = [...totals.keys()].sort();
    if (!keys.length) return [];
    startKey = keys[0];
    endKey = keys[keys.length - 1];
  }

  const [startYear, startMonth] = startKey.split("-").map(Number);
  const [endYear, endMonth] = endKey.split("-").map(Number);
  if (!startYear || !startMonth || !endYear || !endMonth) return [];

  const rows = [];
  let year = startYear;
  let month = startMonth;
  while (year < endYear || (year === endYear && month <= endMonth)) {
    const key = `${year}-${String(month).padStart(2, "0")}`;
    rows.push({
      month: MONTH_LABELS[month - 1] || "",
      amount: Math.round((totals.get(key) || 0) * 100) / 100,
    });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return rows;
}

function TrendAreaChart({ data, name, dark, gradientId }) {
  const palette = getPalette(dark);
  const stroke = dark ? palette.brand : "#16a34a";
  const tick = { fill: dark ? "#94a3b8" : "#64748b", fontSize: 12 };

  if (!data.length) return <EmptyState>Nothing recorded for this selection.</EmptyState>;

  return (
    <ChartMotion>
      {(motion) => (
    <ChartBox height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.45} />
            <stop offset="55%" stopColor={stroke} stopOpacity={0.16} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={dark ? palette.grid : "#e5e7eb"} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={tick}
          minTickGap={18}
          padding={{ left: 4, right: 4 }}
        />
        <YAxis
          width={AXIS_WIDTH}
          tickFormatter={formatAxisTick}
          tickLine={false}
          axisLine={false}
          tick={tick}
          domain={[0, "auto"]}
        />
        <Tooltip content={<MoneyTooltip labelFormatter={(label) => label} />} />
        <Area
          type="bumpX"
          dataKey="amount"
          name={name}
          stroke={stroke}
          strokeWidth={2.5}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={{ r: 4, fill: stroke, stroke: palette.surface, strokeWidth: 2 }}
          {...motion}
        />
      </AreaChart>
    </ChartBox>
      )}
    </ChartMotion>
  );
}

export function TrendsSection({ data, dark }) {
  const igfTrend = toMonthlySeries(data.igfCollectionTrend, data.period);
  const expenditureTrend = toMonthlySeries(data.expenditureTrend, data.period);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 @4xl:grid-cols-2">
      <Card title="IGF collection, day by day" subtitle="GHS">
        <TrendAreaChart data={igfTrend} name="Collected" dark={dark} gradientId="igfTrendGradient" />
      </Card>
      <Card title="Expenditure, day by day" subtitle="GHS">
        <TrendAreaChart data={expenditureTrend} name="Spent" dark={dark} gradientId="expenditureTrendGradient" />
      </Card>
    </div>
  );
}

// ---- Cash & liquidity --------------------------------------------------------------

function Stat({ label, value, hint, title }) {
  return (
    <div className="min-w-0" title={title}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-slate-800">{value}</p>
      {hint ? <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}

export function LiquiditySection({ data, dark }) {
  const palette = getPalette(dark);
  const { liquidity, summary } = data;
  const currency = summary.cashCurrency;
  const chartData = liquidity.byCategory
    .map((row) => ({ category: row.category, amount: row[currency] || 0 }))
    .filter((row) => row.amount !== 0);

  const otherCurrencies = Object.entries(liquidity.totals).filter(
    ([code, amount]) => code !== "GHS" && amount !== 0,
  );

  return (
    <Reveal>
    <Card
      className="h-full"
      title="Cash position and liquidity"
      insight={data.insights.liquidity}
      subtitle={`Latest balance per account · chart in ${currency}`}
    >
      <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-3">
        <div className="grid grid-cols-2 content-start gap-5 @3xl:grid-cols-1">
          <Stat
            label="GHS cash on hand"
            value={`GHS ${fmtCompact(liquidity.ghsCash)}`}
            title={`GHS ${fmtFull(liquidity.ghsCash)}`}
          />
          <Stat
            label="Average monthly spend"
            value={liquidity.monthlyBurn === null ? "—" : `GHS ${fmtCompact(liquidity.monthlyBurn)}`}
            hint="Over the elapsed part of the period"
          />
          <Stat
            label="Months of cover"
            value={liquidity.months === null ? "—" : `${liquidity.months} months`}
            hint="GHS cash only. Other currencies are not converted."
          />
          {otherCurrencies.length ? (
            <div className="col-span-2 @3xl:col-span-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Foreign currency held</p>
              <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums text-slate-800">
                {otherCurrencies.map(([code, amount]) => (
                  <li key={code} title={`${code} ${fmtFull(amount)}`}>
                    <span className="text-slate-500">{code}</span> {fmtCompact(amount)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="@3xl:col-span-2">
          {chartData.length ? (
            <ChartMotion>
              {(motion) => (
            <ChartBox height={260}>
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={palette.grid} strokeDasharray="3 3" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                  minTickGap={12}
                  interval="preserveStartEnd"
                  angle={chartData.length > 3 ? -30 : 0}
                  textAnchor={chartData.length > 3 ? "end" : "middle"}
                  height={chartData.length > 3 ? 48 : 30}
                  tickFormatter={(value) => (String(value).length > 14 ? `${String(value).slice(0, 12)}…` : value)}
                />
                <YAxis width={AXIS_WIDTH} tickFormatter={formatAxisTick} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: dark ? "rgba(57,255,136,0.06)" : "rgba(21,128,61,0.05)" }}
                  content={<MoneyTooltip currency={currency} />}
                />
                <Bar dataKey="amount" name="Balance" fill={palette.brand} radius={[4, 4, 0, 0]} maxBarSize={44} {...motion} />
              </BarChart>
            </ChartBox>
              )}
            </ChartMotion>
          ) : (
            <EmptyState>No {currency} balances recorded for this selection.</EmptyState>
          )}
        </div>
      </div>
    </Card>
    </Reveal>
  );
}

// ---- Reallocation ------------------------------------------------------------------

export function ReallocationSection({ data, dark }) {
  const r = data.reallocation;
  const stages = [
    { stage: "Reallocated", amount: r.reallocatedAmount },
    { stage: "Released", amount: r.released },
    { stage: "Expenditure", amount: r.actualExpenditure },
    { stage: "Payment", amount: r.actualPayment },
  ];
  const empty = stages.every((s) => !s.amount);

  return (
    <Reveal>
    <Card
      className="h-full"
      title="Reallocation pipeline"
      insight={
        empty
          ? null
          : `${fmtPct(r.releaseRatePct, 0)} of reallocated funds are released, ${fmtPct(r.spendRatePct, 0)} of released funds are spent.`
      }
      subtitle="Tracked separately from the main expenditure figures"
    >
      {empty ? <EmptyState>No reallocations recorded for this selection.</EmptyState> : <FunnelBars stages={stages} dark={dark} />}
    </Card>
    </Reveal>
  );
}

