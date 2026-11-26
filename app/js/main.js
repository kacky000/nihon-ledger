// Boot and hash router: renders a section into #view, keeps the nav in step,
// and wires the controls (range switches, CSV buttons, prefecture filters).

import { renderNav, bindMenu, SECTIONS } from './ui/shell.js';
import { csvFor } from './ui/figure.js';
import { saveCsv } from './csv.js';
import { renderOverview } from './pages/overview.js';
import { renderPopulation } from './pages/population.js';
import { renderEconomy } from './pages/economy.js';
import { renderWorkPrices } from './pages/work-prices.js';
import { renderTradeTravel } from './pages/trade-travel.js';
import { renderPrefectures, prefectureRows, visiblePrefectures, PREF_CSV } from './pages/prefectures.js';
import { renderSources } from './pages/sources.js';

const PAGES = {
  '': renderOverview,
  population: renderPopulation,
  economy: renderEconomy,
  'work-prices': renderWorkPrices,
  'trade-travel': renderTradeTravel,
  prefectures: renderPrefectures,
  sources: renderSources,
};

const state = { range: {}, prefQuery: '', prefRegion: 'all', prefSort: 'big' };
const view = document.getElementById('view');
const nav = document.getElementById('site-nav');

function currentPath() {
  const p = location.hash.replace(/^#\/?/, '').split('?')[0];
  return p in PAGES ? p : '';
}

function render(keepScroll = false) {
  const path = currentPath();
  view.innerHTML = PAGES[path](state);
  nav.innerHTML = renderNav(path);
  const title = SECTIONS.find((s) => s.path === path)?.label ?? 'Overview';
  document.title = `${title} · Nihon Ledger`;
  if (!keepScroll) window.scrollTo(0, 0);
  if (path === 'prefectures') bindPrefectureFilters();
}

function refreshPrefectures() {
  document.getElementById('pref-rows').innerHTML = prefectureRows(state);
  document.getElementById('pref-count').textContent = `${visiblePrefectures(state).length} of 47`;
}

function bindPrefectureFilters() {
  document.getElementById('pref-q').addEventListener('input', (e) => {
    state.prefQuery = e.target.value;
    refreshPrefectures();
  });
  document.getElementById('pref-region').addEventListener('change', (e) => {
    state.prefRegion = e.target.value === 'All regions' ? 'all' : e.target.value;
    refreshPrefectures();
  });
  document.getElementById('pref-sort').addEventListener('change', (e) => {
    state.prefSort = e.target.value;
    refreshPrefectures();
  });
}

view.addEventListener('click', (e) => {
  const range = e.target.closest('[data-range]');
  if (range) {
    const [id, value] = range.dataset.range.split(':');
    state.range[id] = value;
    render(true);
    return;
  }
  const csv = e.target.closest('[data-csv]');
  if (csv) {
    const id = csv.dataset.csv;
    const data = id === 'prefs' ? PREF_CSV : csvFor(id);
    if (data) saveCsv(`nihon-ledger-${id}`, data.header, data.rows);
  }
});

// Screenshot helper: ?q=…&region=… pre-fills the prefecture filters.
const params = new URLSearchParams(location.search);
if (params.get('q')) state.prefQuery = params.get('q');
if (params.get('region')) state.prefRegion = params.get('region');
if (params.get('range')) state.range.pop = params.get('range');

bindMenu();
window.addEventListener('hashchange', () => render());
render();
document.documentElement.dataset.ready = '1';
