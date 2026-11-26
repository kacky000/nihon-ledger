// Work & prices section: unemployment with a range switch, and consumer price inflation.

import { figure, rangeToggle } from '../ui/figure.js';
import { lineChart } from '../charts/line-chart.js';
import { columnChart } from '../charts/bar-charts.js';
import { UNEMPLOYMENT_RATE, CPI_INFLATION } from '../data/economy.js';

export function renderWorkPrices(state) {
  const range = state.range['unemp'] ?? 'all';
  const unemp = range === '10y' ? UNEMPLOYMENT_RATE.filter(([y]) => y >= 2015) : UNEMPLOYMENT_RATE;
  return `
  <section class="page-head">
    <p class="kicker">Section 3</p>
    <h1>Work &amp; prices</h1>
    <p class="lede">Unemployment averaged 2.5% in 2024. Consumer prices rose 2.7%, the third year in a row above the 2% target after two decades near zero.</p>
  </section>
  <div class="grid two">
    ${figure({
      id: 'unemp',
      title: 'Unemployment rate, %',
      takeaway: 'Halved since 2010; barely moved in the pandemic.',
      chart: lineChart({ series: [{ name: 'Unemployment', values: unemp }], format: (v) => `${v.toFixed(1)}%`, zero: true, label: 'Unemployment rate' }),
      controls: rangeToggle('unemp', range),
      source: 'sbj',
      year: 2024,
      csv: { header: ['year', 'unemployment_percent'], rows: unemp },
    })}
    ${figure({
      id: 'cpi',
      title: 'Consumer prices, % change on a year',
      takeaway: 'Food and energy pushed inflation above 3% in 2023.',
      chart: columnChart({ values: CPI_INFLATION, format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`, negative: true, highlight: 2024, label: 'CPI inflation' }),
      source: 'sbj',
      year: 2024,
      csv: { header: ['year', 'cpi_change_percent'], rows: CPI_INFLATION },
    })}
  </div>`;
}
