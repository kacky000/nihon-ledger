// Prefectures: all 47 with search, a region filter and sorting, plus population by region.

import { figure } from '../ui/figure.js';
import { rankBars } from '../charts/bar-charts.js';
import { tileMap } from '../charts/tile-map.js';
import { PREFECTURES, REGIONS, regionTotals } from '../data/prefectures.js';
import { num, escapeHtml } from '../format.js';

const TOTAL = PREFECTURES.reduce((s, p) => s + p.pop, 0);

export function visiblePrefectures(state) {
  const q = state.prefQuery.trim().toLowerCase();
  let list = PREFECTURES.filter((p) => (state.prefRegion === 'all' || p.region === state.prefRegion) && (!q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q)));
  const by = state.prefSort;
  list = [...list].sort((a, b) => (by === 'name' ? a.name.localeCompare(b.name) : by === 'small' ? a.pop - b.pop : b.pop - a.pop));
  return list;
}

export function prefectureRows(state) {
  const list = visiblePrefectures(state);
  const top = Math.max(...PREFECTURES.map((p) => p.pop));
  if (!list.length) return `<tr><td colspan="5" class="empty">No prefecture matches “${escapeHtml(state.prefQuery)}”.</td></tr>`;
  return list
    .map(
      (p) => `<tr><td><b>${p.name}</b><span class="sub">${p.capital}</span></td><td>${p.region}</td>
      <td class="num">${num(p.pop)}k</td><td class="num">${((p.pop / TOTAL) * 100).toFixed(1)}%</td>
      <td class="barcell"><span style="width:${((p.pop / top) * 100).toFixed(1)}%"></span></td></tr>`,
    )
    .join('');
}

export function renderPrefectures(state) {
  const regions = regionTotals().sort((a, b) => b.value - a.value);
  return `
  <section class="page-head">
    <p class="kicker">Section 5</p>
    <h1>Prefectures</h1>
    <p class="lede">Tokyo alone holds 11.3% of the population; the smallest prefecture, Tottori, has 537,000 people. Filter, search or sort all 47.</p>
  </section>
  <div class="grid wide">
    <figure class="card fig" id="fig-prefs">
      <header><h3>Population by prefecture, 1 Oct 2023</h3></header>
      <form class="filters" onsubmit="return false">
        <label>Search <input id="pref-q" type="search" placeholder="Prefecture or capital" value="${escapeHtml(state.prefQuery)}"></label>
        <label>Region <select id="pref-region"><option value="all">All regions</option>${REGIONS.map((r) => `<option ${r === state.prefRegion ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
        <label>Sort <select id="pref-sort">
          <option value="big" ${state.prefSort === 'big' ? 'selected' : ''}>Largest first</option>
          <option value="small" ${state.prefSort === 'small' ? 'selected' : ''}>Smallest first</option>
          <option value="name" ${state.prefSort === 'name' ? 'selected' : ''}>A to Z</option></select></label>
        <span class="count" id="pref-count">${visiblePrefectures(state).length} of 47</span>
      </form>
      <div class="table-wrap"><table class="data prefs"><thead><tr><th>Prefecture</th><th>Region</th><th>People</th><th>Share</th><th aria-label="Bar"></th></tr></thead>
      <tbody id="pref-rows">${prefectureRows(state)}</tbody></table></div>
      <figcaption><span class="src">Source: SBJ population estimates, 2023</span><button class="ghost" data-csv="prefs">Download CSV</button></figcaption>
    </figure>
    <div class="stack">
    ${figure({
      id: 'pref-map',
      title: 'Map: population by prefecture',
      takeaway: state.prefQuery ? `Showing ${escapeHtml(state.prefQuery)} in the table. Tap another tile to switch.` : 'Tap a tile to find it in the table.',
      chart: tileMap({ prefectures: PREFECTURES, selected: PREFECTURES.find((p) => p.name.toLowerCase() === state.prefQuery.trim().toLowerCase())?.name, label: 'Prefecture map' }),
      source: 'sbj',
      year: 2023,
    })}
    ${figure({
      id: 'regions',
      title: 'People by region, thousands',
      takeaway: 'Kanto, around Tokyo, is home to 35% of Japan.',
      chart: rankBars({ items: regions.map((r) => ({ ...r, hi: r.label === 'Kanto' })), format: (v) => num(v), label: 'Population by region' }),
      source: 'sbj',
      year: 2023,
      csv: { header: ['region', 'population_thousands'], rows: regions.map((r) => [r.label, r.value]) },
    })}
    </div>
  </div>`;
}

export const PREF_CSV = { header: ['prefecture', 'capital', 'region', 'population_thousands'], rows: PREFECTURES.map((p) => [p.name, p.capital, p.region, p.pop]) };
