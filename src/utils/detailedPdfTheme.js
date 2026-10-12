// src/utils/detailedPdfTheme.js
// Shared look for the client-side (jsPDF + autoTable) detailed reports.
// Mirrors the backend summary PDFs: green band, flag stripe, crest tile, footer.

export const THEME = {
  green: [3, 56, 30],
  greenLine: [11, 79, 44],
  tint: [232, 245, 233],
  zebra: [247, 250, 247],
  red: [206, 17, 38],
  gold: [200, 162, 74],
  flagGreen: [0, 107, 63],
  ink: [17, 24, 39],
  muted: [107, 114, 128],
  line: [209, 213, 219],
  bandText: [209, 250, 229],
};

export const MARGIN = 28;

// 12,020,998.64 ; zero / empty -> "-"
export const fmtAmount = (v) => {
  const n = typeof v === "string" ? Number(v.replace(/,/g, "")) : Number(v);
  return Number.isFinite(n) && n !== 0
    ? n.toLocaleString("en-GH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "-";
};

// Fit an image inside maxW x maxH keeping its aspect ratio; detect its real format.
function fitImage(doc, img, maxW, maxH) {
  const p = doc.getImageProperties(img);
  const s = Math.min(maxW / p.width, maxH / p.height);
  return { w: p.width * s, h: p.height * s, type: p.fileType };
}

export function drawWatermark(doc, logo, size = 300, opacity = 0.04) {
  if (!logo) return;
  try {
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    const { w, h, type } = fitImage(doc, logo, size, size);
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity }));
    doc.addImage(logo, type, (pw - w) / 2, (ph - h) / 2, w, h);
    doc.restoreGraphicsState();
  } catch (e) {
    console.warn("Watermark failed:", e.message);
  }
}

// Green title band + flag stripe + crest tile. Returns the y where the table should start.
export function drawReportHeader(
  doc,
  { title, lines = [], logo, margin = MARGIN },
) {
  const pw = doc.internal.pageSize.getWidth();
  const tile = 56;
  const textW = pw - margin * 2 - tile - 16;

  doc.setFont("helvetica", "bold").setFontSize(15);
  const titleLines = doc.splitTextToSize(title, textW);

  const titleY = 14 + 12;
  const infoY = titleY + (titleLines.length - 1) * 18 + 16;
  const bandH = Math.max(76, infoY + Math.max(lines.length - 1, 0) * 12 + 14);

  doc.setFillColor(...THEME.green);
  doc.rect(0, 0, pw, bandH, "F");

  const seg = pw / 3;
  [THEME.red, THEME.gold, THEME.flagGreen].forEach((c, i) => {
    doc.setFillColor(...c);
    doc.rect(seg * i, bandH, seg, 4, "F");
  });

  const tx = pw - margin - tile;
  const ty = (bandH - tile) / 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(tx, ty, tile, tile, 5, 5, "F");
  if (logo) {
    try {
      const { w, h, type } = fitImage(doc, logo, tile - 8, tile - 8);
      doc.addImage(logo, type, tx + (tile - w) / 2, ty + (tile - h) / 2, w, h);
    } catch (e) {
      console.warn("Logo failed:", e.message);
    }
  }

  doc.setTextColor(255, 255, 255).setFont("helvetica", "bold").setFontSize(15);
  doc.text(titleLines, margin, titleY, { lineHeightFactor: 1.2 });

  doc
    .setFont("helvetica", "normal")
    .setFontSize(9)
    .setTextColor(...THEME.bandText);
  lines.forEach((l, i) => doc.text(l, margin, infoY + i * 12));

  doc.setTextColor(...THEME.ink);
  return bandH + 4 + 28;
}

// Call once after the table is finished: "label | Generated ..." and "Page X of N" on every page.
export function drawFooters(doc, label, margin = MARGIN) {
  const total = doc.internal.getNumberOfPages();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const generated = new Date().toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    const y = ph - 20;
    doc.setDrawColor(...THEME.line).setLineWidth(0.5);
    doc.line(margin, y - 8, pw - margin, y - 8);
    doc
      .setFont("helvetica", "normal")
      .setFontSize(8)
      .setTextColor(...THEME.muted);
    doc.text(`${label}  |  Generated ${generated}`, margin, y);
    doc.text(`Page ${i} of ${total}`, pw - margin, y, { align: "right" });
  }
  doc.setTextColor(...THEME.ink);
}

// Shared autoTable options. Spread into your autoTable call, then add head/body/foot.
//   numericCols: column indexes to right-align (headers stay centered)
//   columnStyles: per-column overrides, e.g. { 0: { cellWidth: 22 } }
export function tableOptions(
  doc,
  { logo, margin = MARGIN, startY, columnStyles = {}, numericCols = [] } = {},
) {
  const cs = { ...columnStyles };
  numericCols.forEach((i) => {
    cs[i] = { halign: "right", ...(cs[i] || {}) };
  });

  return {
    startY,
    margin: { top: 36, bottom: 40, left: margin, right: margin },
    theme: "grid",
    showHead: "everyPage",
    styles: {
      font: "helvetica",
      fontSize: 8,
      cellPadding: 4,
      textColor: THEME.ink,
      lineColor: THEME.line,
      lineWidth: 0.4,
      valign: "middle",
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: THEME.green,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      lineColor: THEME.greenLine,
    },
    footStyles: {
      fillColor: THEME.green,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "right",
    },
    alternateRowStyles: { fillColor: THEME.zebra },
    columnStyles: cs,
    // Runs before each page's table content, so the watermark sits behind the rows.
    willDrawPage: () => drawWatermark(doc, logo),
    didParseCell: (d) => {
      if (d.section === "head") d.cell.styles.halign = "center";
      if (d.section === "body" && d.cell.raw === "-") {
        d.cell.styles.textColor = THEME.muted;
      }
    },
  };
}
