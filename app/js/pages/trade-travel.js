// Trade & travel section: exports against imports with the balance table, and visitor arrivals.

import { figure } from '../ui/figure.js';
import { groupedTradeChart, columnChart } from '../charts/bar-charts.js';
import { TRADE_TRILLION_YEN, VISITORS_MILLIONS } from '../data/trade-travel.js';

export function renderTradeTravel() {
  const rows = TRADE_TRILLION_YEN.map(
    (r) => `<tr><td>${r.year}</td><td>¥${r.exports.toFixed(1)} tn</td><td>¥${r.imports.toFixed(1)} tn</td>
      <td class="${r.exports >= r.imports ? 'pos' : 'neg'}">${r.exports >= r.imports ? '+' : '−'}¥${Math.abs(r.exports - r.imports).toFixed(1)} tn</td></tr>`,
  ).join('');
  return `
  <section class="page-head">
    <p class="kicker">Section 4</p>
    <h1>Trade &amp; travel</h1>
    <p class="lede">Exports reached a record ¥107.9 trillion in 2024 but imports were larger again. Visitors hit 36.9 million, beating 2019 by 5 million.</p>
  </section>
  <div class="grid two">
    ${figure({
      id: 'trade',
      title: 'Goods exports and imports, ¥ trillion',
      takeaway: 'A deficit every year since 2021, widest when energy prices spiked in 2022.',
      chart: `${groupedTradeChart({ rows: TRADE_TRILLION_YEN, label: 'Exports and imports' })}
        <p class="legend"><i class="exp"></i>Exports <i class="imp"></i>Imports</p>
        <table class="data"><thead><tr><th>Year</th><th>Exports</th><th>Imports</th><th>Balance</th></tr></thead><tbody>${rows}</tbody></table>`,
      source: 'mof',
      year: 2024,
      csv: { header: ['year', 'exports_trillion_yen', 'imports_trillion_yen'], rows: TRADE_TRILLION_YEN.map((r) => [r.year, r.exports, r.imports]) },
    })}
    ${figure({
      id: 'visitors',
      title: 'Foreign visitor arrivals, millions',
      takeaway: 'From 0.25 million in 2021 to a record 36.9 million in 2024.',
      chart: columnChart({ values: VISITORS_MILLIONS, format: (v) => (v < 1 ? v.toFixed(2) : v.toFixed(1)), highlight: 2024, label: 'Visitor arrivals' }),
      source: 'jnto',
      year: 2024,
      csv: { header: ['year', 'visitors_millions'], rows: VISITORS_MILLIONS },
    })}
  </div>`;
}
