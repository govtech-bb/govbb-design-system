/*
 * Annotated grid diagrams for the govbb layout doc (SGDS-style): device
 * frame, column tracks, dimension badges over margins/gutters, and a
 * container measure line.
 *
 * Each diagram's viewBox hugs its own frame, and every annotation (font,
 * badges, ticks) is scaled by u = viewW/RENDER_W so text renders at the same
 * physical size whatever device width is drawn.
 */
import { writeFileSync } from 'node:fs';

const RENDER_W = 640; // the article column width the svg will render at
const TRACK = '#e5e9f2'; // blue-10
const TRACK_EDGE = '#99a8cc'; // blue-40
const INK = '#00267f'; // blue-100
const FRAME_EDGE = '#e0e4e9'; // grey-00
const BG = '#f8f9fa';

function diagram({
  frameW,
  frameH,
  margin,
  marginLabel,
  cols,
  gutter,
  containerLabel,
  stackedRows,
}) {
  const pad = 30 * (frameW / RENDER_W) + 20;
  const viewW = frameW + pad * 2;
  const u = viewW / RENDER_W; // annotation unit: 1 rendered px
  const font = 13 * u;
  const badgeH = 20 * u;
  const topBand = 44 * u; // badges + ticks above the frame
  const frameY = topBand + 14 * u;
  const viewH = frameY + frameH * 0.8; // frame clipped at the bottom, device-style
  const fx = pad;
  const contentX = fx + margin;
  const contentW = frameW - margin * 2;

  const badge = (cx, label, y) => {
    const w = Math.max(font * 1.6, label.length * font * 0.62 + font * 0.8);
    return (
      `<rect x="${(cx - w / 2).toFixed(1)}" y="${(y - badgeH / 2).toFixed(1)}" width="${w.toFixed(1)}" height="${badgeH.toFixed(1)}" rx="${(4 * u).toFixed(1)}" fill="${INK}"/>` +
      `<text x="${cx.toFixed(1)}" y="${(y + font * 0.36).toFixed(1)}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${font.toFixed(1)}" fill="#fff">${label}</text>`
    );
  };
  const tick = (x1, x2, y) =>
    `<path d="M${x1.toFixed(1)} ${(y - 4 * u).toFixed(1)}v${(8 * u).toFixed(1)}M${x1.toFixed(1)} ${y.toFixed(1)}H${x2.toFixed(1)}M${x2.toFixed(1)} ${(y - 4 * u).toFixed(1)}v${(8 * u).toFixed(1)}" stroke="${INK}" stroke-width="${u.toFixed(2)}" fill="none"/>`;

  const tickY = frameY - 8 * u;
  const badgeY = frameY - 30 * u;
  const measureY = frameY + frameH * 0.42;

  let svg = `<svg viewBox="0 0 ${viewW.toFixed(0)} ${viewH.toFixed(0)}" role="img" aria-label="Grid diagram" style="width:100%;height:auto;display:block;background:${BG};border:1px solid ${FRAME_EDGE};border-radius:8px" xmlns="http://www.w3.org/2000/svg">`;
  // device frame
  svg += `<rect x="${fx - 4 * u}" y="${(frameY - 4 * u).toFixed(1)}" width="${frameW + 8 * u}" height="${frameH}" rx="${24 * u}" stroke="${FRAME_EDGE}" stroke-width="${8 * u}" fill="none"/>`;
  svg += `<rect x="${fx}" y="${frameY.toFixed(1)}" width="${frameW}" height="${frameH}" rx="${20 * u}" fill="#fff"/>`;
  // tracks — vertical column stripes, or horizontal bars when the columns
  // stack (mobile): rows read as "columns on top of each other".
  const trackW = (contentW - gutter * (cols - 1)) / cols;
  if (stackedRows) {
    const rowGap = 16 * u;
    const rowH = 56 * u;
    for (let i = 0; i < stackedRows; i++) {
      const y = frameY + 24 * u + i * (rowH + rowGap);
      svg += `<rect x="${contentX.toFixed(1)}" y="${y.toFixed(1)}" width="${contentW}" height="${rowH.toFixed(1)}" rx="${3 * u}" fill="${TRACK}" stroke="${TRACK_EDGE}" stroke-opacity="0.5" stroke-width="${u.toFixed(2)}"/>`;
    }
  } else {
    for (let i = 0; i < cols; i++) {
      const x = contentX + i * (trackW + gutter);
      svg += `<rect x="${x.toFixed(1)}" y="${frameY.toFixed(1)}" width="${trackW.toFixed(1)}" height="${frameH}" fill="${TRACK}" stroke="${TRACK_EDGE}" stroke-opacity="0.5" stroke-width="${u.toFixed(2)}"/>`;
    }
  }
  // margin callouts
  svg +=
    badge(fx + margin / 2, marginLabel, badgeY) + tick(fx, contentX, tickY);
  svg +=
    badge(fx + frameW - margin / 2, marginLabel, badgeY) +
    tick(fx + frameW - margin, fx + frameW, tickY);
  // gutter callouts (skip when they would collide at render size)
  if (cols > 1) {
    const gapPx = (trackW + gutter) / u;
    const step = gapPx > 42 ? 1 : 2; // label every other gutter if crowded
    for (let i = 1; i < cols; i += step) {
      const gx = contentX + i * trackW + (i - 1) * gutter;
      svg +=
        badge(gx + gutter / 2, String(gutter), badgeY) +
        tick(gx, gx + gutter, tickY);
    }
  }
  // container measure
  const mcx = (contentX + contentX + contentW) / 2;
  const my = stackedRows
    ? frameY + 24 * u + stackedRows * (72 * u) + 16 * u
    : measureY;
  svg +=
    tick(contentX, contentX + contentW, my) + badge(mcx, containerLabel, my);
  return svg + '</svg>';
}

/*
 * Screen-size ruler (SGDS breakpoint-page style): an axis from 320 to 1600
 * with dashed boundaries at the breakpoints, region badges, and labelled
 * stops for the design anchors.
 */
function ruler() {
  const viewW = 1280;
  const viewH = 345;
  const u = viewW / RENDER_W;
  const font = 13 * u;
  const AXIS_MIN = 280;
  const AXIS_MAX = 1620;
  const x = (px) => ((px - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * viewW;
  const axisY = viewH * 0.45;
  let svg = `<svg viewBox="0 0 ${viewW} ${viewH}" role="img" aria-label="Screen size breakpoint diagram" style="width:100%;height:auto;display:block;background:${BG};border:1px solid ${FRAME_EDGE};border-radius:8px" xmlns="http://www.w3.org/2000/svg">`;
  // dashed boundaries at the two breakpoints
  for (const bp of [800, 1440]) {
    svg += `<line x1="${x(bp).toFixed(1)}" y1="0" x2="${x(bp).toFixed(1)}" y2="${viewH}" stroke="${TRACK_EDGE}" stroke-width="${u.toFixed(2)}" stroke-dasharray="${2 * u} ${8 * u}"/>`;
  }
  // axis segments with a small gap at each boundary
  const seg = (a, b) =>
    `<line x1="${(x(a) + 3 * u).toFixed(1)}" y1="${axisY}" x2="${(x(b) - 3 * u).toFixed(1)}" y2="${axisY}" stroke="${INK}" stroke-width="${u.toFixed(2)}"/>`;
  svg += seg(AXIS_MIN, 800) + seg(800, 1440) + seg(1440, AXIS_MAX);
  // region badges centred in each range
  const region = (label, a, b) => {
    const cx = x((a + b) / 2);
    const w = label.length * font * 0.62 + font;
    return (
      `<rect x="${(cx - w / 2).toFixed(1)}" y="${(axisY - 42 * u).toFixed(1)}" width="${w.toFixed(1)}" height="${(20 * u).toFixed(1)}" rx="${4 * u}" fill="${INK}"/>` +
      `<text x="${cx.toFixed(1)}" y="${(axisY - 28 * u).toFixed(1)}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${font.toFixed(1)}" fill="#fff">${label}</text>`
    );
  };
  svg += region('mobile', AXIS_MIN, 800);
  svg += region('tablet', 800, 1440);
  svg += region('desktop', 1440, AXIS_MAX);
  // labelled stops
  const stop = (px, label, sub, bold, stagger = 0) => {
    const sx = x(px);
    const weight = bold ? 600 : 400;
    const drop = stagger * 38 * u;
    let s = `<line x1="${sx.toFixed(1)}" y1="${axisY}" x2="${sx.toFixed(1)}" y2="${(axisY + (10 + stagger * 32) * u).toFixed(1)}" stroke="#1a1a1a" stroke-width="${(bold ? 2 : 1) * u}"/>`;
    s += `<text x="${sx.toFixed(1)}" y="${(axisY + 30 * u + drop).toFixed(1)}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${font.toFixed(1)}" font-weight="${weight}" fill="#1a1a1a">${label}</text>`;
    if (sub)
      s += `<text x="${sx.toFixed(1)}" y="${(axisY + 48 * u + drop).toFixed(1)}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${font.toFixed(1)}" font-weight="${weight}" fill="#1a1a1a">${sub}</text>`;
    return s;
  };
  svg += stop(375, '375', '(mobile frame)', true);
  svg += stop(560, '560', '', false);
  svg += stop(800, '800', '(--tablet)', true);
  svg += stop(1024, '1024', '', false);
  svg += stop(1280, '1280', '', false);
  svg += stop(1440, '1440', '(--desktop)', true);
  svg += stop(1512, '1512', '(cap)', true, 1);
  return svg + '</svg>';
}

const gutterAt = (w) => Math.min(Math.max(0.0985 * w - 20.96, 16), 128);

const out = {
  mobile: diagram({
    frameW: 375,
    frameH: 340,
    margin: 16,
    marginLabel: '16',
    cols: 1,
    gutter: 0,
    containerLabel: 'fluid',
    stackedRows: 3,
  }),
  ruler: ruler(),
  tablet: diagram({
    frameW: 1000,
    frameH: 640,
    margin: Math.round(gutterAt(1000)),
    marginLabel: 'fluid',
    cols: 12,
    gutter: 32,
    containerLabel: 'fluid',
  }),
  desktop: diagram({
    frameW: 1512,
    frameH: 860,
    margin: 128,
    marginLabel: '128',
    cols: 12,
    gutter: 32,
    containerLabel: '1256',
  }),
};

for (const [name, svg] of Object.entries(out)) {
  writeFileSync(new URL(`grid-${name}.svg`, import.meta.url), svg);
}
console.log('generated', Object.keys(out).join(', '));
