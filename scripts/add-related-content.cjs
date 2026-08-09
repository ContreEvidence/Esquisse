const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const rel of ['assets/library-catalog.js','assets/library-daily-money.js']) {
  const file = path.join(ROOT, rel);
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file,'utf8'), ctx, { filename: rel });
}
const items = Array.isArray(ctx.window.CE_LIBRARY_CATALOG) ? ctx.window.CE_LIBRARY_CATALOG.filter(x => x?.h && x?.n) : [];

function tokens(s='') {
  return new Set(String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().split(/[^a-z0-9]+/).filter(x => x.length > 2));
}
function overlap(a,b) {
  let n=0;
  for (const x of a) if (b.has(x)) n++;
  return n;
}
function esc(s='') {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function hrefFrom(from,to) {
  const rel = path.posix.relative(path.posix.dirname(from), to);
  return rel || path.posix.basename(to);
}

const enriched = items.map(item => ({
  ...item,
  _tokens: tokens(`${item.n} ${item.c||''} ${item.k||''} ${item.x||''}`),
  _domains: new Set(String(item.d||'').split(/\s+/).filter(Boolean))
}));
let count=0;
for (const item of enriched) {
  const file = path.join(ROOT,item.h);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/<section class="ce-related" data-ce-related="1">[\s\S]*?<\/section>\s*/gi,'');
  if (!/<\/article>/i.test(html)) { fs.writeFileSync(file,html,'utf8'); continue; }

  const ranked = enriched.filter(other => other.h !== item.h).map(other => {
    const sameDomain = [...item._domains].some(d => other._domains.has(d));
    const sameCategory = item.c && other.c && item.c === other.c;
    const shared = overlap(item._tokens,other._tokens);
    const score = shared * 4 + (sameDomain ? 5 : 0) + (sameCategory ? 8 : 0) + (other.t === 'guide' ? 1 : 0);
    return {other,score};
  }).filter(x => x.score >= 7).sort((a,b) => b.score-a.score || a.other.n.localeCompare(b.other.n,'fr')).slice(0,3);

  if (!ranked.length) { fs.writeFileSync(file,html,'utf8'); continue; }
  const links = ranked.map(({other}) => `<a href="${esc(hrefFrom(item.h,other.h))}"><strong>${esc(other.n)}</strong><span>→</span></a>`).join('');
  const block = `<section class="ce-related" data-ce-related="1" aria-label="Pour continuer"><div class="kicker">Pour continuer</div><h2>Trois dossiers liés à cette décision.</h2><div class="ce-related-list">${links}</div></section>`;
  html = html.replace(/<\/article>/i,`${block}</article>`);
  fs.writeFileSync(file,html,'utf8');
  count++;
}
console.log(`Parcours éditoriaux ajoutés à ${count} contenus.`);
