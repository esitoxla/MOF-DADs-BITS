import { useEffect, useRef, useState } from "react";

export const AXIS_WIDTH = 64;

export function useDarkTheme() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
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

/**
 * One palette, two modes. Green is the brand and carries magnitude (one hue, light to dark).
 * Amber is reserved for "benchmark": expected pace, targets.
 * Red / amber / green status colours always ship with an icon and a word.
 */
export function getPalette(dark) {
  return dark
    ? {
        brand: "#39FF88",
        brandSoft: "#2a9d62",
        // Sequence for funnels: strongest stage first
        sequence: ["#39FF88", "#2fd47a", "#27aa63", "#20854f", "#1a6a40"],
        marker: "#fbbf24",
        danger: "#f87171",
        track: "#1d2b4f",
        surface: "#121b36",
        grid: "rgba(57,255,136,0.16)",
        brandText: "#39FF88",
      }
    : {
        brand: "#15803d",
        brandSoft: "#86efac",
        sequence: ["#14532d", "#166534", "#15803d", "#22a05a", "#5cc58a"],
        marker: "#b45309",
        danger: "#dc2626",
        track: "#e2e8f0",
        surface: "#ffffff",
        grid: "#e2e8f0",
        brandText: "#166534",
      };
}

export const STATUS_LABELS = {
  on_track: "On track",
  watch: "Watch",
  at_risk: "At risk",
  no_data: "No data",
  no_target: "No target",
};

export function statusColors(status, dark) {
  const map = dark
    ? {
        on_track: { fg: "#39FF88", bg: "rgba(57,255,136,0.14)" },
        watch: { fg: "#fbbf24", bg: "rgba(251,191,36,0.14)" },
        at_risk: { fg: "#f87171", bg: "rgba(248,113,113,0.16)" },
        neutral: { fg: "#a9b8c9", bg: "#182444" },
      }
    : {
        on_track: { fg: "#166534", bg: "#dcfce7" },
        watch: { fg: "#92400e", bg: "#fef3c7" },
        at_risk: { fg: "#b91c1c", bg: "#fee2e2" },
        neutral: { fg: "#475569", bg: "#f1f5f9" },
      };
  return map[status] || map.neutral;
}

// ---- Formatters ------------------------------------------------------------

const trimZeros = (text) => (text.includes(".") ? text.replace(/\.?0+$/, "") : text);

/** 4,671,886,737 -> "4.67B". Use fmtFull for the exact figure in tooltips. */
export const fmtCompact = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return "—";
  const abs = Math.abs(num);
  const units = [
    [1e9, "B"],
    [1e6, "M"],
    [1e3, "K"],
  ];
  for (const [size, suffix] of units) {
    if (abs >= size) {
      const scaled = num / size;
      const digits = Math.abs(scaled) >= 100 ? 0 : Math.abs(scaled) >= 10 ? 1 : 2;
      return `${trimZeros(scaled.toFixed(digits))}${suffix}`;
    }
  }
  return trimZeros(num.toFixed(2));
};

export const fmtFull = (value) =>
  Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtPct = (value, digits = 1) =>
  value === null || value === undefined || !Number.isFinite(Number(value))
    ? "—"
    : `${Number(value).toFixed(digits)}%`;

export const formatAxisTick = (value) => {
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
  if (abs >= 1_000_000_000) return compact(1_000_000_000, "B");
  if (abs >= 1_000_000) return compact(1_000_000, "M");
  if (abs >= 1_000) return compact(1_000, "K");
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return undefined;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}

const easeOut = (t) => 1 - (1 - t) ** 3;

/**
 * Counts a raw number, then formats each frame with fmtCompact.
 * First run starts at 0. Later runs start at the previous displayed value.
 * The last frame is always fmtCompact of the exact target.
 */
export function useCountUp(value, { duration = 600 } = {}) {
  const reduced = usePrefersReducedMotion();
  const displayedRef = useRef(0);
  const hasRun = useRef(false);
  const frameRef = useRef(0);
  const [text, setText] = useState(() => fmtCompact(prefersReducedMotion() ? value : 0));

  useEffect(() => {
    const next = Number(value);
    const finite = Number.isFinite(next);

    if (reduced || !finite) {
      cancelAnimationFrame(frameRef.current);
      if (finite) displayedRef.current = next;
      hasRun.current = true;
      setText(fmtCompact(value));
      return undefined;
    }

    const from = hasRun.current ? displayedRef.current : 0;
    const ms = Math.min(hasRun.current ? 400 : duration, 790);
    hasRun.current = true;

    if (ms <= 0 || from === next) {
      displayedRef.current = next;
      setText(fmtCompact(next));
      return undefined;
    }

    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      if (t >= 1) {
        displayedRef.current = next;
        setText(fmtCompact(next));
        return;
      }
      const current = from + (next - from) * easeOut(t);
      displayedRef.current = current;
      setText(fmtCompact(current));
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, reduced, duration]);

  return text;
}

/** Width for a bar that grows in once, then eases to the next value. */
export function useGrowPercent(percent, index = 0) {
  const reduced = usePrefersReducedMotion();
  const target = Math.max(0, Number(percent) || 0);
  const [width, setWidth] = useState(() => (prefersReducedMotion() ? target : 0));
  const [settled, setSettled] = useState(() => prefersReducedMotion());
  const started = useRef(false);
  const settledRef = useRef(prefersReducedMotion());

  useEffect(() => {
    if (reduced) {
      started.current = true;
      settledRef.current = true;
      setWidth(target);
      setSettled(true);
      return undefined;
    }

    const first = !started.current;
    started.current = true;
    const delay = first ? Math.min(Math.max(index, 0), 5) * 40 : 0;
    const growTimer = window.setTimeout(() => setWidth(target), delay);
    let settleTimer;
    if (!settledRef.current) {
      settleTimer = window.setTimeout(() => {
        settledRef.current = true;
        setSettled(true);
      }, delay + 700);
    }

    return () => {
      window.clearTimeout(growTimer);
      window.clearTimeout(settleTimer);
    };
  }, [target, index, reduced]);

  return { width, settled };
}

/**
 * Recharts animation for the first paint of a chart only.
 * A ref (not state) keeps the flag on until the next real render,
 * so the intro is not cancelled before it finishes.
 */
export function useChartIntro() {
  const reduced = usePrefersReducedMotion();
  const played = useRef(false);
  const isAnimationActive = !reduced && !played.current;

  useEffect(() => {
    played.current = true;
  }, []);

  return {
    isAnimationActive,
    animationDuration: 700,
    animationEasing: "ease-out",
  };
}

export function periodLabel(period) {
  const quarters = period?.quarters || [];
  if (quarters.length === 4) return `${period.year} · Full year`;
  if (quarters.length === 1) return `${period.year} · Q${quarters[0]}`;
  if (quarters.length > 1) {
    return `${period.year} · Q${quarters[0]}–Q${quarters[quarters.length - 1]}`;
  }
  return String(period?.year || "");
}

// ---- react-select styling (unchanged from the previous dashboard) -------------

export function getSelectStyles(dark) {
  const border = dark ? "rgba(57, 255, 136, 0.35)" : "#e2e8f0";
  const focus = dark ? "#39FF88" : "#15803d";
  const bg = dark ? "#0b132b" : "#ffffff";
  const text = dark ? "#e8fff3" : "#1e293b";
  const muted = dark ? "#a9b8c9" : "#64748b";
  const menuBg = dark ? "#121b36" : "#ffffff";

  return {
    control: (base, state) => ({
      ...base,
      minHeight: 38,
      height: 38,
      borderRadius: 10,
      borderColor: state.isFocused ? focus : border,
      backgroundColor: bg,
      boxShadow: state.isFocused
        ? `0 0 0 3px ${dark ? "rgba(57,255,136,0.18)" : "rgba(21,128,61,0.12)"}`
        : "none",
      cursor: "pointer",
      transition: "border-color 150ms ease-out, background-color 150ms ease-out",
      "&:hover": { borderColor: focus },
    }),
    valueContainer: (base) => ({
      ...base,
      height: 38,
      padding: "0 10px",
      flexWrap: "nowrap",
      overflow: "hidden",
    }),
    indicatorsContainer: (base) => ({ ...base, height: 38 }),
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
    input: (base) => ({ ...base, margin: 0, padding: 0, color: text }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: menuBg,
      border: `1px solid ${border}`,
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.12)",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
