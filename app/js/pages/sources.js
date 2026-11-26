// Sources & methods: who publishes each series, how the site rounds and labels it, and a short glossary.

import { SOURCES, METHOD_NOTES } from '../data/sources.js';

const GLOSSARY = [
  ['Total fertility rate', 'The number of children a woman would have at this year’s birth rates for each age.'],
  ['Real GDP growth', 'Change in output after removing price changes, so it measures volume, not yen.'],
  ['Nominal GDP', 'Output valued at this year’s prices, in yen.'],
  ['Unemployment rate', 'People looking for work and able to start, as a share of the labour force.'],
  ['CPI', 'Consumer Price Index: the price of a fixed basket of household goods and services.'],
  ['Trade balance', 'Exports minus imports of goods; services are not included.'],
];

export function renderSources() {
  return `
  <section class="page-head">
    <p class="kicker">Section 6</p>
    <h1>Sources &amp; methods</h1>
    <p class="lede">Every number on this site comes from one of five public bodies. Each chart names its publisher and year under the plot.</p>
  </section>
  <div class="grid two">
    <section class="card">
      <h3>Publishers</h3>
      <table class="data"><thead><tr><th>Publisher</th><th>Used for</th></tr></thead>
      <tbody>${Object.values(SOURCES).map((s) => `<tr><td><b>${s.short}</b><span class="sub">${s.name}</span></td><td>${s.what}</td></tr>`).join('')}</tbody></table>
    </section>
    <section class="card">
      <h3>How to read the figures</h3>
      <ul class="notes">${METHOD_NOTES.map((n) => `<li>${n}</li>`).join('')}</ul>
      <h3>Glossary</h3>
      <dl class="glossary">${GLOSSARY.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl>
    </section>
  </div>`;
}
