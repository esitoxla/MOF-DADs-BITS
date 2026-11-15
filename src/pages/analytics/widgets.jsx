import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  getPalette,
  statusColors,
  STATUS_LABELS,
  fmtCompact,
  fmtFull,
  fmtPct,
  useCountUp,
  useGrowPercent,
  usePrefersReducedMotion,
} from "./theme";

const RevealContext = createContext(true);

export function useRevealShown() {
  return useContext(RevealContext);
}

// ---- Status --------------------------------------------------------------------

export function StatusIcon({ status, size = 12 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    className: "shrink-0",
  };
  if (status === "on_track") {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.2" />
        <path d="M5.2 8.2l1.9 1.9 3.7-4" />
      </svg>
    );
  }
  if (status === "watch") {
    return (
      <svg {...common}>
        <path d="M8 2.2l6 10.6H2z" />
        <path d="M8 6.6v3M8 11.6v.01" />
      </svg>
    );
  }
  if (status === "at_risk") {
    return (
      <svg {...common}>
        <circle cx="8" cy="8" r="6.2" />
        <path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M5.5 8h5" />
    </svg>
  );
}

export function StatusBadge({ status, dark }) {
  const { fg, bg } = statusColors(status, dark);
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{ color: fg, backgroundColor: bg }}
    >
      <StatusIcon status={status} size={11} />
      {STATUS_LABELS[status] || "—"}
    </span>
  );
}

// ---- Layout --------------------------------------------------------------------

export function Reveal({ children, className = "" }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const [shown, setShown] = useState(
    () => reduced || typeof IntersectionObserver === "undefined",
  );
  const [settled, setSettled] = useState(
    () => reduced || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (!shown || reduced) return undefined;
    const timer = window.setTimeout(() => setSettled(true), 600);
    return () => window.clearTimeout(timer);
  }, [shown, reduced]);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      setSettled(true);
      return undefined;
    }
    if (shown) return undefined;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => {
          if (!entry.isIntersecting) return false;
          const view = entry.rootBounds?.height || window.innerHeight;
          const tall = entry.boundingClientRect.height > view * 0.9;
          return tall || entry.intersectionRatio >= 0.15;
        });
        if (visible) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: [0, 0.15] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shown, reduced]);

  return (
    <div
      ref={ref}
      className={`analytics-reveal min-w-0 ${shown ? "is-shown" : ""} ${settled ? "is-settled" : ""} ${className}`.trim()}
      inert={shown ? undefined : true}
    >
      <RevealContext.Provider value={shown}>{children}</RevealContext.Provider>
    </div>
  );
}

export function SectionTitle({ kicker, title, blurb }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1 rounded-full bg-green-700" aria-hidden="true" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
          {kicker}
        </h2>
        <span className="h-px flex-1 bg-gray-100" aria-hidden="true" />
      </div>
      <p className="mt-1.5 text-lg font-semibold text-slate-800">{title}</p>
      {blurb ? <p className="text-xs text-slate-500">{blurb}</p> : null}
    </div>
  );
}

export function Card({ title, subtitle, insight, children, className = "" }) {
  return (
    <section
      className={`min-w-0 w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5 ${className}`}
    >
      <header className="mb-4 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          {insight ? <p className="mt-0.5 text-xs text-slate-500">{insight}</p> : null}
        </div>
        {subtitle ? <div className="text-xs text-slate-500">{subtitle}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function EmptyState({ children }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-gray-200 px-4 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}

export function LegendDots({ items }) {
  return (
    <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-1.5 text-xs text-slate-500">
          {item.line ? (
            <span
              className="h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: item.color }}
              aria-hidden="true"
            />
          ) : (
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
          )}
          {item.label}
        </li>
      ))}
    </ul>
  );
}

// ---- KPI -----------------------------------------------------------------------

export function ChangeLine({ pct, label }) {
  if (pct === null || pct === undefined) {
    return <span className="text-slate-500">No prior data to compare</span>;
  }
  const up = pct >= 0;
  return (
    <span className="text-slate-500">
      <span aria-hidden="true">{up ? "▲" : "▼"}</span>{" "}
      <span className="font-semibold text-slate-800">{Math.abs(pct).toFixed(1)}%</span> {label}
    </span>
  );
}

export function KpiCard({ label, value, amount, currency, status, lines = [], title, dark, index = 0 }) {
  const palette = getPalette(dark);
  const accent = status ? statusColors(status, dark).fg : palette.brand;
  const animated = useCountUp(amount, { duration: 600 });
  const showStatus = status && status !== "no_data" && status !== "no_target";

  return (
    <div
      className="analytics-kpi h-full min-w-0"
      style={{ animationDelay: `${index * 60}ms` }}
      title={title}
    >
      <div
        className="analytics-kpi-face relative flex h-full min-w-0 flex-col rounded-2xl border border-gray-100 border-l-4 bg-white p-3.5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-900/10"
        style={{ borderLeftColor: accent }}
      >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase leading-4 tracking-wide text-slate-500">
          {label}
        </span>
        {showStatus ? (
          <span
            className={status === "at_risk" ? "analytics-risk-pulse" : undefined}
            style={{ color: accent }}
            title={STATUS_LABELS[status]}
          >
            <StatusIcon status={status} size={14} />
            <span className="sr-only">{STATUS_LABELS[status]}</span>
          </span>
        ) : null}
      </div>
      <p className="mt-2 flex min-w-0 items-baseline gap-1.5">
        {currency ? (
          <span className="shrink-0 text-[11px] font-semibold text-slate-500">{currency}</span>
        ) : null}
        <span
          className="min-w-0 text-xl font-bold leading-tight tracking-tight text-slate-800 tabular-nums"
          aria-hidden="true"
        >
          {animated}
        </span>
        <span className="sr-only">{value}</span>
      </p>
      <div className="mt-auto space-y-0.5 pt-2 text-[11px] leading-snug">
        {lines.map((line, lineIndex) => (
          <p key={lineIndex} className="text-slate-500">
            {line}
          </p>
        ))}
      </div>
      </div>
    </div>
  );
}

// ---- Bars ----------------------------------------------------------------------

/**
 * Spend against appropriation, with a tick for where spending should be by now.
 * The tick is the same "fiscal clock" shown in the page header.
 */
export function PacingBar({ utilisationPct, expectedPct, dark, height = 8, index = 0 }) {
  const palette = getPalette(dark);
  const util = Number(utilisationPct) || 0;
  const used = Math.max(0, Math.min(util, 100));
  const expected = Math.max(0, Math.min(Number(expectedPct) || 0, 100));
  const grown = useGrowPercent(used, index);

  return (
    <div
      className="relative w-full"
      style={{ height: height + 6 }}
      role="img"
      aria-label={`${fmtPct(util)} of appropriation spent. ${fmtPct(expected)} expected by now.`}
    >
      <div
        className="absolute inset-x-0 rounded-full"
        style={{ top: 3, height, backgroundColor: palette.track }}
      />
      <div
        className="analytics-grow absolute left-0 rounded-full"
        style={{
          top: 3,
          height,
          width: `${grown.width}%`,
          backgroundColor: util > 100 ? palette.danger : palette.brand,
        }}
      />
      <div
        className={`analytics-marker absolute rounded-full${grown.settled ? " is-in" : ""}`}
        style={{
          left: `${expected}%`,
          top: 0,
          width: 2,
          height: height + 6,
          backgroundColor: palette.marker,
          transform: "translateX(-1px)",
        }}
      />
    </div>
  );
}

function FunnelRow({ stage, index, stages, max, palette, valueFormatter }) {
  const amount = Number(stage.amount) || 0;
  const target = max ? Math.max((amount / max) * 100, amount > 0 ? 1.5 : 0) : 0;
  const grown = useGrowPercent(target, index);
  const previous = index > 0 ? Number(stages[index - 1].amount) || 0 : null;
  const share = previous ? (amount / previous) * 100 : null;

  return (
    <li title={`${stage.stage}: GHS ${fmtFull(amount)}`}>
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
        <span className="font-medium text-slate-800">{stage.stage}</span>
        <span className="min-w-0 tabular-nums text-slate-500">
          <span className="font-semibold text-slate-800">{valueFormatter(amount)}</span>
          {share !== null ? (
            <span className="ml-2">
              {share.toFixed(0)}% of {stages[index - 1].stage.toLowerCase()}
            </span>
          ) : null}
        </span>
      </div>
      <div className="h-2.5 rounded-full" style={{ backgroundColor: palette.track }}>
        <div
          className="analytics-grow h-full rounded-full"
          style={{
            width: `${grown.width}%`,
            backgroundColor: palette.sequence[index % palette.sequence.length],
          }}
        />
      </div>
    </li>
  );
}

/** Stages stepping down. Each shows its size and how much of the previous stage it is. */
export function FunnelBars({ stages, dark, valueFormatter = fmtCompact }) {
  const palette = getPalette(dark);
  const max = Math.max(...stages.map((s) => Number(s.amount) || 0), 0);

  return (
    <ol className="space-y-3">
      {stages.map((stage, index) => (
        <FunnelRow
          key={stage.stage}
          stage={stage}
          index={index}
          stages={stages}
          max={max}
          palette={palette}
          valueFormatter={valueFormatter}
        />
      ))}
    </ol>
  );
}

/** Two segments with a 2px gap, for "kept" versus "paid onward". */
export function SplitBar({ left, right, dark }) {
  const palette = getPalette(dark);
  const total = (Number(left.amount) || 0) + (Number(right.amount) || 0);
  const leftPct = total ? ((Number(left.amount) || 0) / total) * 100 : 0;
  const grown = useGrowPercent(leftPct, 0);

  return (
    <div>
      <div className="flex h-3 gap-0.5" role="img" aria-label={`${left.label} ${fmtPct(leftPct)}, ${right.label} ${fmtPct(100 - leftPct)}`}>
        {total ? (
          <>
            <div
              className="analytics-grow rounded-l-full"
              style={{ width: `${grown.width}%`, backgroundColor: palette.sequence[3] }}
            />
            <div
              className="flex-1 rounded-r-full"
              style={{ backgroundColor: palette.sequence[0] }}
            />
          </>
        ) : (
          <div className="flex-1 rounded-full" style={{ backgroundColor: palette.track }} />
        )}
      </div>
      <dl className="mt-3 grid grid-cols-1 gap-3 text-xs min-[420px]:grid-cols-2">
        {[
          { item: left, color: palette.sequence[3] },
          { item: right, color: palette.sequence[0] },
        ].map(({ item, color }) => (
          <div key={item.label} className="min-w-0">
            <dt className="flex min-w-0 items-start gap-1.5 text-slate-500">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="mt-0.5 font-semibold tabular-nums text-slate-800" title={`GHS ${fmtFull(item.amount)}`}>
              GHS {fmtCompact(item.amount)}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---- Chart tooltip ---------------------------------------------------------------

export function MoneyTooltip({ active, payload, label, currency = "GHS", labelFormatter }) {
  if (!active || !payload?.length) return null;
  const heading = labelFormatter ? labelFormatter(label, payload) : label;

  return (
    <div className="rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg">
      {heading ? <p className="mb-1 font-semibold">{heading}</p> : null}
      {payload.map((entry) => (
        <p key={entry.dataKey || entry.name} className="flex items-center gap-2 tabular-nums">
          <span
            className="h-2 w-2 shrink-0 rounded-sm"
            style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
            aria-hidden="true"
          />
          <span className="text-gray-300">{entry.name}</span>
          <span className="ml-auto pl-3 font-semibold">
            {currency} {fmtFull(entry.value)}
          </span>
        </p>
      ))}
    </div>
  );
}
