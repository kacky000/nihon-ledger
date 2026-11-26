// Responsive SVG line chart for yearly series, with gridlines, axis labels
// and the latest value called out at the end of each line.

const W = 640;
const H = 260;
const PAD = { l: 48, r: 70, t: 16, b: 30 };

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= step0);
  const ticks = [];
  for (let v = Math.floor(min / step) * step; v <= max + step * 0.01; v += step) ticks.push(+v.toFixed(6));
  return ticks;
}

export function lineChart({ series, format = (v) => v, zero = false, label = 'Chart' }) {
  const xs = series.flatMap((s) => s.values.map((p) => p[0]));
  const ys = series.flatMap((s) => s.values.map((p) => p[1]));
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  let y0 = Math.min(...ys);
  let y1 = Math.max(...ys);
  if (zero) y0 = Math.min(0, y0);
  const ticks = niceTicks(y0, y1);
  y0 = Math.min(y0, ticks[0]);
  y1 = Math.max(y1, ticks[ticks.length - 1]);
  const sx = (x) => PAD.l + ((x - x0) / (x1 - x0 || 1)) * (W - PAD.l - PAD.r);
  const sy = (y) => H - PAD.b - ((y - y0) / (y1 - y0 || 1)) * (H - PAD.t - PAD.b);
  const grid = ticks
    .map((t) => `<line class="grid${t === 0 ? ' zero' : ''}" x1="${PAD.l}" x2="${W - PAD.r}" y1="${sy(t)}" y2="${sy(t)}"/><text class="axis" x="${PAD.l - 8}" y="${sy(t) + 4}" text-anchor="end">${format(t)}</text>`)
    .join('');
  const years = [...new Set(xs)].sort((a, b) => a - b);
  const every = Math.ceil(years.length / 7);
  const xlabels = years
    .filter((y, i) => (i % every === 0 && i < years.length - every) || i === years.length - 1)
    .map((y) => `<text class="axis" x="${sx(y)}" y="${H - 8}" text-anchor="middle">${y}</text>`)
    .join('');
  const lines = series
    .map((s, i) => {
      const d = s.values.map((p, k) => `${k ? 'L' : 'M'}${sx(p[0]).toFixed(1)},${sy(p[1]).toFixed(1)}`).join('');
      const last = s.values[s.values.length - 1];
      const dots = s.values.map((p) => `<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="3"><title>${p[0]}: ${format(p[1])}</title></circle>`).join('');
      return `<g class="series s${i}"><path d="${d}"/>${dots}<text class="end" x="${sx(last[0]) + 8}" y="${sy(last[1]) + 4}">${format(last[1])}</text></g>`;
    })
    .join('');
  return `<svg class="chart line" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${grid}${xlabels}${lines}</svg>`;
}
