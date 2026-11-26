// Tile map of Japan: one square per prefecture, laid out roughly where it sits,
// shaded by population on a log scale. Tiles carry data-pref so a click can filter the table.

const TILES = {
  Hokkaido: [12, 0], Aomori: [12, 1], Akita: [11, 2], Iwate: [12, 2], Yamagata: [11, 3], Miyagi: [12, 3],
  Ishikawa: [8, 4], Toyama: [9, 4], Niigata: [10, 4], Fukushima: [11, 4],
  Fukui: [7, 5], Gifu: [8, 5], Nagano: [9, 5], Gunma: [10, 5], Tochigi: [11, 5], Ibaraki: [12, 5],
  Shimane: [3, 6], Tottori: [4, 6], Hyogo: [5, 6], Kyoto: [6, 6], Shiga: [7, 6], Aichi: [8, 6], Yamanashi: [9, 6], Saitama: [10, 6], Tokyo: [11, 6], Chiba: [12, 6],
  Fukuoka: [1, 7], Yamaguchi: [2, 7], Hiroshima: [3, 7], Okayama: [4, 7], Osaka: [5, 7], Nara: [6, 7], Mie: [7, 7], Shizuoka: [9, 7], Kanagawa: [11, 7],
  Nagasaki: [0, 8], Saga: [1, 8], Oita: [2, 8], Ehime: [3, 8], Kagawa: [4, 8], Wakayama: [6, 8],
  Kumamoto: [1, 9], Miyazaki: [2, 9], Kochi: [3, 9], Tokushima: [4, 9],
  Okinawa: [0, 10], Kagoshima: [1, 10],
};

// Short labels that keep look-alike names apart (three Yama-, three Fuku-, two Miya-…).
const ABBR = {
  Fukushima: 'Fks', Fukui: 'Fki', Fukuoka: 'Fko', Yamagata: 'Ygt', Yamanashi: 'Ynn', Yamaguchi: 'Ygc',
  Shimane: 'Smn', Shiga: 'Sga', Shizuoka: 'Szk', Saga: 'Sag', Nagasaki: 'Ngs', Nagano: 'Ngn',
  Miyagi: 'Myg', Miyazaki: 'Myz', Kagawa: 'Kgw', Kagoshima: 'Kgs', Tokyo: 'Tky', Tokushima: 'Tks',
  Tochigi: 'Tcg', Toyama: 'Tym', Tottori: 'Ttr', Okayama: 'Oky', Okinawa: 'Okn', Osaka: 'Osk',
};

const STEPS =['#e9e6f3', '#c7cbe8', '#9aa3d6', '#6a78c0', '#3f4fa3', '#22307a'];

function shade(pop, min, max) {
  const t = (Math.log(pop) - Math.log(min)) / (Math.log(max) - Math.log(min));
  return STEPS[Math.min(STEPS.length - 1, Math.floor(t * STEPS.length))];
}

export function tileMap({ prefectures, selected = '', label = 'Map of prefectures' }) {
  const size = 40;
  const gap = 4;
  const pops = prefectures.map((p) => p.pop);
  const min = Math.min(...pops);
  const max = Math.max(...pops);
  const tiles = prefectures
    .map((p) => {
      const [c, r] = TILES[p.name];
      const x = c * (size + gap);
      const y = r * (size + gap);
      const fill = shade(p.pop, min, max);
      const dark = STEPS.indexOf(fill) >= 3;
      return `<g class="tile${p.name === selected ? ' sel' : ''}" data-pref="${p.name}" tabindex="0" role="button" aria-label="${p.name}">
        <rect x="${x}" y="${y}" width="${size}" height="${size}" rx="5" fill="${fill}"/>
        <text x="${x + size / 2}" y="${y + 17}" class="${dark ? 'on-dark' : ''}">${ABBR[p.name] ?? p.name.slice(0, 3)}</text>
        <text x="${x + size / 2}" y="${y + 31}" class="n ${dark ? 'on-dark' : ''}">${p.pop >= 1000 ? (p.pop / 1000).toFixed(1) + 'm' : p.pop + 'k'}</text>
        <title>${p.name}: ${p.pop.toLocaleString('en-GB')} thousand</title></g>`;
    })
    .join('');
  const w = 13 * (size + gap);
  const h = 11 * (size + gap);
  const legend = STEPS.map((c, i) => `<rect x="${i * 30}" y="${h - 22}" width="30" height="10" fill="${c}"/>`).join('');
  return `<svg class="chart tilemap" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
    ${tiles}
    <g transform="translate(${w - 190},0)">${legend}<text class="axis" x="0" y="${h - 28}">fewer people</text><text class="axis" x="180" y="${h - 28}" text-anchor="end">more</text></g>
  </svg>`;
}
