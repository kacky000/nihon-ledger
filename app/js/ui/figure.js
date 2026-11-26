// A figure card: title, one-line takeaway, the chart, and a source line with
// the publisher and year, plus a button that saves the figure's data as CSV.

import { cite } from '../data/sources.js';

const registry = new Map();

export function figure({ id, title, takeaway, chart, source, year, csv, controls = '' }) {
  if (csv) registry.set(id, csv);
  return `<figure class="card fig" id="fig-${id}">
    <header><h3>${title}</h3>${controls}</header>
    <p class="takeaway">${takeaway}</p>
    <div class="plot">${chart}</div>
    <figcaption><span class="src">Source: ${cite(source, year)}</span>${csv ? `<button class="ghost" data-csv="${id}">Download CSV</button>` : ''}</figcaption>
  </figure>`;
}

export function csvFor(id) {
  return registry.get(id);
}

export function stat({ label, value, unit = '', note, source, year, trend }) {
  return `<div class="stat">
    <span class="label">${label}</span>
    <span class="value">${value}<small>${unit}</small></span>
    ${trend ? `<span class="trend ${trend.dir}">${trend.text}</span>` : ''}
    <span class="note">${note} · ${cite(source, year)}</span>
  </div>`;
}

export function rangeToggle(id, active) {
  return `<div class="seg-ctl" role="group" aria-label="Range">
    ${['10y', 'all'].map((r) => `<button data-range="${id}:${r}" class="${r === active ? 'on' : ''}">${r === '10y' ? 'Last 10 years' : 'All years'}</button>`).join('')}
  </div>`;
}
