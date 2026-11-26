// Publishers behind every figure on the site, keyed for citation lines.

export const SOURCES = {
  sbj: { name: 'Statistics Bureau of Japan', short: 'SBJ', what: 'Population estimates (1 October), Labour Force Survey, Consumer Price Index' },
  mhlw: { name: 'Ministry of Health, Labour and Welfare', short: 'MHLW', what: 'Vital statistics (births, fertility), abridged life tables' },
  cao: { name: 'Cabinet Office, Economic and Social Research Institute', short: 'Cabinet Office', what: 'National accounts (GDP)' },
  mof: { name: 'Ministry of Finance, Trade Statistics', short: 'MOF', what: 'Exports and imports, customs clearance basis' },
  jnto: { name: 'Japan National Tourism Organization', short: 'JNTO', what: 'Visitor arrivals' },
};

export const METHOD_NOTES = [
  'Figures are rounded for reading. Annual series use calendar years unless a chart says otherwise.',
  'Population is the 1 October estimate; census years (2000 to 2020) use the census count.',
  'GDP growth is real, chained, year on year; publishers revise recent years, so the newest values may move.',
  'Trade is the customs clearance basis in trillions of yen; tourism counts arrivals of foreign visitors.',
  'Births and fertility for the newest year are the preliminary release.',
];

export function cite(key, year) {
  const s = SOURCES[key];
  return `${s.short}, ${year}`;
}
