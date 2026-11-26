// Population section: total population with a range switch, births, fertility, age structure, life expectancy.

import { figure, stat, rangeToggle } from '../ui/figure.js';
import { lineChart } from '../charts/line-chart.js';
import { columnChart, shareBar } from '../charts/bar-charts.js';
import { POPULATION_MILLIONS, BIRTHS_THOUSANDS, FERTILITY_RATE, AGE_SHARES_2023, LIFE_EXPECTANCY_2023 } from '../data/population.js';
import { num } from '../format.js';

export function renderPopulation(state) {
  const range = state.range['pop'] ?? 'all';
  const pop = range === '10y' ? POPULATION_MILLIONS.filter(([y]) => y >= 2014) : POPULATION_MILLIONS;
  return `
  <section class="page-head">
    <p class="kicker">Section 1</p>
    <h1>Population</h1>
    <p class="lede">Japan had 123.80 million residents on 1 October 2024, down about 550,000 in a year. Births fell to 686,000 and the fertility rate to 1.15.</p>
  </section>
  <div class="grid two">
    ${figure({
      id: 'pop',
      title: 'Total population',
      takeaway: range === '10y' ? 'Down 3.3 million since 2015.' : 'Peak in 2008, steady decline since 2011.',
      chart: lineChart({ series: [{ name: 'Population', values: pop }], format: (v) => `${v.toFixed(1)}m`, label: 'Population in millions' }),
      controls: rangeToggle('pop', range),
      source: 'sbj',
      year: 2024,
      csv: { header: ['year', 'population_millions'], rows: pop },
    })}
    ${figure({
      id: 'births',
      title: 'Births per year',
      takeaway: 'Fewer than 700,000 for the first time in 2024.',
      chart: columnChart({ values: BIRTHS_THOUSANDS, format: (v) => `${v}k`, highlight: 2024, label: 'Births in thousands' }),
      source: 'mhlw',
      year: 2024,
      csv: { header: ['year', 'births_thousands'], rows: BIRTHS_THOUSANDS },
    })}
    ${figure({
      id: 'tfr',
      title: 'Total fertility rate',
      takeaway: 'Children per woman; 2.07 would keep the population level.',
      chart: lineChart({ series: [{ name: 'TFR', values: FERTILITY_RATE }], format: (v) => v.toFixed(2), label: 'Total fertility rate' }),
      source: 'mhlw',
      year: 2024,
      csv: { header: ['year', 'total_fertility_rate'], rows: FERTILITY_RATE },
    })}
    ${figure({
      id: 'age',
      title: 'Age structure, 2023',
      takeaway: 'More than 29 in every 100 residents are 65 or older.',
      chart: shareBar({ parts: AGE_SHARES_2023, label: 'Population by age group' }),
      source: 'sbj',
      year: 2023,
      csv: { header: ['age_group', 'share_percent'], rows: AGE_SHARES_2023.map((a) => [a.label, a.value]) },
    })}
  </div>
  <section class="stats three" aria-label="Life expectancy">
    ${stat({ label: 'Life expectancy, women', value: LIFE_EXPECTANCY_2023.women.toFixed(2), unit: ' yrs', note: 'at birth, 2023', source: 'mhlw', year: 2023 })}
    ${stat({ label: 'Life expectancy, men', value: LIFE_EXPECTANCY_2023.men.toFixed(2), unit: ' yrs', note: 'at birth, 2023', source: 'mhlw', year: 2023 })}
    ${stat({ label: 'Births per day', value: num(686000 / 366), unit: '', note: '2024 average', source: 'mhlw', year: 2024 })}
  </section>`;
}
