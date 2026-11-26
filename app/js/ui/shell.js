// The page frame: masthead, section navigation (a menu button on phones) and footer.

export const SECTIONS = [
  { path: '', label: 'Overview' },
  { path: 'population', label: 'Population' },
  { path: 'economy', label: 'Economy' },
  { path: 'work-prices', label: 'Work & prices' },
  { path: 'trade-travel', label: 'Trade & travel' },
  { path: 'prefectures', label: 'Prefectures' },
  { path: 'sources', label: 'Sources' },
];

export function renderNav(current) {
  return SECTIONS.map(
    (s) => `<a href="#/${s.path}" class="${s.path === current ? 'on' : ''}" ${s.path === current ? 'aria-current="page"' : ''}>${s.label}</a>`,
  ).join('');
}

export function bindMenu() {
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('site-nav');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) nav.classList.remove('open');
  });
}
