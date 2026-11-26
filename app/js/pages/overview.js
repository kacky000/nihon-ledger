// Overview: the eight headline figures, each linking to its section, and the population curve.

import { stat, figure } from '../ui/figure.js';
import { lineChart } from '../charts/line-chart.js';
import { POPULATION_MILLIONS, BIRTHS_THOUSANDS, FERTILITY_RATE, AGE_SHARES_2023 } from '../data/population.js';
import { REAL_GDP_GROWTH, UNEMPLOYMENT_RATE, CPI_INFLATION } from '../data/economy.js';
import { VISITORS_MILLIONS } from '../data/trade-travel.js';
import { change, num } from '../format.js';
import { tileMap } from '../charts/tile-map.js';
import { PREFECTURES } from '../data/prefectures.js';

const last = (s) => s[s.length - 1];

export function renderOverview() {
  const pop = change(POPULATION_MILLIONS);
  const births = change(BIRTHS_THOUSANDS);
  const stats = [
    stat({ label: 'Population', value: num(last(POPULATION_MILLIONS)[1], 2), unit: ' m', note: '1 Oct 2024', source: 'sbj', year: 2024, trend: { dir: 'down', text: `${num(pop.delta * 1000, 0)}k in a year` } }),
    stat({ label: 'Aged 65 and over', value: AGE_SHARES_2023[2].value, unit: '%', note: '1 Oct 2023', source: 'sbj', year: 2023, trend: { dir: 'up', text: 'nearly 3 in 10' } }),
    stat({ label: 'Births', value: num(last(BIRTHS_THOUSANDS)[1]), unit: 'k', note: '2024, preliminary', source: 'mhlw', year: 2024, trend: { dir: 'down', text: `${births.pct.toFixed(1)}% on 2023` } }),
    stat({ label: 'Fertility rate', value: last(FERTILITY_RATE)[1].toFixed(2), unit: '', note: 'children per woman, 2024', source: 'mhlw', year: 2024, trend: { dir: 'down', text: 'record low' } }),
    stat({ label: 'Real GDP growth', value: last(REAL_GDP_GROWTH)[1].toFixed(1), unit: '%', note: 'calendar 2024', source: 'cao', year: 2024, trend: { dir: 'flat', text: 'after +1.5% in 2023' } }),
    stat({ label: 'Unemployment', value: last(UNEMPLOYMENT_RATE)[1].toFixed(1), unit: '%', note: '2024 average', source: 'sbj', year: 2024, trend: { dir: 'flat', text: 'steady since 2022' } }),
    stat({ label: 'Consumer prices', value: `+${last(CPI_INFLATION)[1].toFixed(1)}`, unit: '%', note: 'all items, 2024', source: 'sbj', year: 2024, trend: { dir: 'up', text: 'third year above 2%' } }),
    stat({ label: 'Foreign visitors', value: last(VISITORS_MILLIONS)[1].toFixed(1), unit: ' m', note: 'arrivals, 2024', source: 'jnto', year: 2024, trend: { dir: 'up', text: 'an all-time high' } }),
  ];
  const links = ['population', 'population', 'population', 'population', 'economy', 'work-prices', 'work-prices', 'trade-travel'];
  return `
  <section class="hero">
    <p class="kicker">Japan · official statistics, read plainly</p>
    <h1>A smaller, older Japan that keeps on working</h1>
    <p class="lede">Population has fallen every year since 2011 and births are at a record low, yet unemployment stays near 2.5% and visitors are back above their 2019 peak. Every figure below names its publisher and year.</p>
  </section>
  <section class="stats" aria-label="Headline figures">
    ${stats.map((s, i) => `<a class="stat-link" href="#/${links[i]}">${s}</a>`).join('')}
  </section>
  <div class="grid two">
    ${figure({
      id: 'ov-map',
      title: 'Where people live, 47 prefectures',
      takeaway: 'Darker means more people. Tap a prefecture to open it in the table.',
      chart: tileMap({ prefectures: PREFECTURES, label: 'Population by prefecture' }),
      source: 'sbj',
      year: 2023,
      csv: { header: ['prefecture', 'population_thousands'], rows: PREFECTURES.map((p) => [p.name, p.pop]) },
    })}
    ${figure({
      id: 'ov-pop',
      title: 'Population, 2000 to 2024',
      takeaway: 'Peaked at 128.08 million in 2008; 4.3 million fewer people since.',
      chart: lineChart({ series: [{ name: 'Population', values: POPULATION_MILLIONS }], format: (v) => `${v.toFixed(1)}m`, label: 'Population of Japan in millions' }),
      source: 'sbj',
      year: 2024,
      csv: { header: ['year', 'population_millions'], rows: POPULATION_MILLIONS },
    })}
  </div>
  <div class="grid two">
    <aside class="card guide">
      <h3>Find your figure</h3>
      <ul>
        <li><a href="#/population">How many people, births and how old</a></li>
        <li><a href="#/economy">GDP growth and size of the economy</a></li>
        <li><a href="#/work-prices">Jobs, unemployment and inflation</a></li>
        <li><a href="#/trade-travel">Exports, imports and tourism</a></li>
        <li><a href="#/prefectures">All 47 prefectures, sortable</a></li>
        <li><a href="#/sources">Who publishes each number, and how</a></li>
      </ul>
      <p class="small">Every chart has a CSV download with the exact numbers shown.</p>
    </aside>
    <aside class="card guide">
      <h3>Latest releases used</h3>
      <ul>
        <li>Population estimates, 1 October 2024 · SBJ</li>
        <li>Vital statistics, 2024 preliminary · MHLW</li>
        <li>National accounts, calendar 2024 · Cabinet Office</li>
        <li>Labour Force Survey and CPI, 2024 averages · SBJ</li>
        <li>Trade statistics 2024 · MOF; visitor arrivals 2024 · JNTO</li>
      </ul>
    </aside>
  </div>`;
}
