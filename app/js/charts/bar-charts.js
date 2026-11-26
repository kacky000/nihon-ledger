// Column charts for yearly counts, horizontal bars for rankings, and a
// single stacked bar for shares that add up to 100.

const W = 640;

export function columnChart({ values, format = (v) => v, highlight, label = 'Chart', negative = false }) {
  const H = 240;
  const pad = { l: 12, r: 12, t: 22, b: 30 };
  const max = Math.max(...values.map((v) => Math.abs(v[1])));
  const min = negative ? -max : 0;
  const bw = (W - pad.l - pad.r) / values.length;
  const sy = (y) => pad.t + ((max - y) / (max - min)) * (H - pad.t - pad.b);
  const bars = values
    .map(([year, v], i) => {
      const x = pad.l + i * bw + bw * 0.15;
      const top = sy(Math.max(v, 0));
      const h = Math.abs(sy(v) - sy(0));
      const cls = v < 0 ? 'neg' : year === highlight ? 'hi' : '';
      const ty = v < 0 ? sy(v) + 13 : top - 5;
      return `<rect class="${cls}" x="${x}" y="${top}" width="${bw * 0.7}" height="${Math.max(1, h)}"><title>${year}: ${format(v)}</title></rect>
        <text class="val" x="${x + bw * 0.35}" y="${ty}" text-anchor="middle">${format(v)}</text>
        <text class="axis" x="${x + bw * 0.35}" y="${H - 9}" text-anchor="middle">${values.length > 9 ? `’${String(year).slice(-2)}` : year}</text>`;
    })
    .join('');
  const base = `<line class="grid zero" x1="${pad.l}" x2="${W - pad.r}" y1="${sy(0)}" y2="${sy(0)}"/>`;
  return `<svg class="chart columns" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${base}${bars}</svg>`;
}

export function rankBars({ items, format = (v) => v, label = 'Ranking', max }) {
  const top = max ?? Math.max(...items.map((d) => d.value));
  const rows = items
    .map(
      (d) => `<li class="${d.hi ? 'hi' : ''}"><span class="name">${d.label}</span>
      <span class="track"><span class="fill" style="width:${((d.value / top) * 100).toFixed(1)}%"></span></span>
      <span class="v">${format(d.value)}</span></li>`,
    )
    .join('');
  return `<ol class="rank" aria-label="${label}">${rows}</ol>`;
}

export function shareBar({ parts, label = 'Shares' }) {
  const segs = parts
    .map((p, i) => `<span class="seg c${i}" style="width:${p.value}%"><b>${p.value}%</b></span>`)
    .join('');
  const keys = parts.map((p, i) => `<li><i class="c${i}"></i>${p.label} <b>${p.value}%</b></li>`).join('');
  return `<div class="share" role="img" aria-label="${label}"><div class="bar">${segs}</div><ul class="key">${keys}</ul></div>`;
}

export function groupedTradeChart({ rows, label = 'Trade' }) {
  const H = 250;
  const pad = { l: 40, r: 12, t: 18, b: 30 };
  const max = Math.ceil(Math.max(...rows.flatMap((r) => [r.exports, r.imports])) / 20) * 20;
  const gw = (W - pad.l - pad.r) / rows.length;
  const sy = (v) => H - pad.b - (v / max) * (H - pad.t - pad.b);
  let out = '';
  for (let t = 0; t <= max; t += 40) out += `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${sy(t)}" y2="${sy(t)}"/><text class="axis" x="${pad.l - 6}" y="${sy(t) + 4}" text-anchor="end">${t}</text>`;
  rows.forEach((r, i) => {
    const x = pad.l + i * gw + gw * 0.12;
    const bw = gw * 0.36;
    out += `<rect class="exp" x="${x}" y="${sy(r.exports)}" width="${bw}" height="${sy(0) - sy(r.exports)}"><title>${r.year} exports ¥${r.exports} tn</title></rect>`;
    out += `<rect class="imp" x="${x + bw + 2}" y="${sy(r.imports)}" width="${bw}" height="${sy(0) - sy(r.imports)}"><title>${r.year} imports ¥${r.imports} tn</title></rect>`;
    out += `<text class="axis" x="${x + bw}" y="${H - 9}" text-anchor="middle">${r.year}</text>`;
  });
  return `<svg class="chart trade" viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}">${out}</svg>`;
}
