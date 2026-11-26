// Number formatting shared by charts, tables and headline cards.

export function num(v, digits = 0) {
  return v.toLocaleString('en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function pct(v, digits = 1) {
  return `${v > 0 ? '+' : ''}${v.toFixed(digits)}%`;
}

export function change(series) {
  const a = series[series.length - 2][1];
  const b = series[series.length - 1][1];
  return { from: a, to: b, delta: b - a, pct: ((b - a) / a) * 100 };
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
