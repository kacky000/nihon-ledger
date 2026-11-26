// Economy section: real growth by year and the size of the economy in yen.

import { figure, stat } from '../ui/figure.js';
import { lineChart } from '../charts/line-chart.js';
import { columnChart } from '../charts/bar-charts.js';
import { REAL_GDP_GROWTH, NOMINAL_GDP_TRILLION_YEN } from '../data/economy.js';
import { POPULATION_MILLIONS } from '../data/population.js';
import { num } from '../format.js';

export function renderEconomy() {
  const gdp = NOMINAL_GDP_TRILLION_YEN[NOMINAL_GDP_TRILLION_YEN.length - 1][1];
  const pop = POPULATION_MILLIONS[POPULATION_MILLIONS.length - 1][1];
  return `
  <section class="page-head">
    <p class="kicker">Section 2</p>
    <h1>Economy</h1>
    <p class="lede">Nominal GDP passed ¥600 trillion for the first time in 2024, lifted mostly by prices; real growth was close to zero.</p>
  </section>
  <section class="stats three">
    ${stat({ label: 'Nominal GDP', value: `¥${num(gdp, 1)}`, unit: ' tn', note: 'calendar 2024', source: 'cao', year: 2024 })}
    ${stat({ label: 'GDP per resident', value: `¥${num((gdp * 1e12) / (pop * 1e6) / 1e6, 2)}`, unit: ' m', note: 'nominal GDP ÷ population', source: 'cao', year: 2024 })}
    ${stat({ label: 'Real growth', value: `+${REAL_GDP_GROWTH[REAL_GDP_GROWTH.length - 1][1].toFixed(1)}`, unit: '%', note: 'calendar 2024', source: 'cao', year: 2024 })}
  </section>
  <div class="grid two">
    ${figure({
      id: 'gdp-growth',
      title: 'Real GDP growth, % a year',
      takeaway: 'The 2020 fall of 4.2% was won back by 2023.',
      chart: columnChart({ values: REAL_GDP_GROWTH, format: (v) => `${v > 0 ? '+' : ''}${v.toFixed(1)}`, negative: true, highlight: 2024, label: 'Real GDP growth' }),
      source: 'cao',
      year: 2024,
      csv: { header: ['year', 'real_gdp_growth_percent'], rows: REAL_GDP_GROWTH },
    })}
    ${figure({
      id: 'gdp-size',
      title: 'Nominal GDP, ¥ trillion',
      takeaway: 'Up 13% from 2019 in yen, much of it inflation.',
      chart: lineChart({ series: [{ name: 'GDP', values: NOMINAL_GDP_TRILLION_YEN }], format: (v) => `¥${Math.round(v)}`, label: 'Nominal GDP in trillion yen' }),
      source: 'cao',
      year: 2024,
      csv: { header: ['year', 'nominal_gdp_trillion_yen'], rows: NOMINAL_GDP_TRILLION_YEN },
    })}
  </div>`;
}
