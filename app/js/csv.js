// Turns a figure's rows into a CSV file the visitor can save (built in the page, no download from elsewhere).

export function toCsv(header, rows) {
  const cell = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  return [header, ...rows].map((r) => r.map(cell).join(',')).join('\n') + '\n';
}

export function saveCsv(name, header, rows) {
  const blob = new Blob([toCsv(header, rows)], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}.csv`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 0);
}
