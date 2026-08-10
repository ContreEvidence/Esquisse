const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);
for (const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js']) {
  const file = path.join(ROOT, rel);
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file,'utf8'), ctx, { filename: rel });
}
const items = Array.isArray(ctx.window.CE_LIBRARY_CATALOG) ? ctx.window.CE_LIBRARY_CATALOG.filter(x => x?.h && x?.n) : [];

const preferredNext = new Map([
  ['dossiers/inflation-comprendre-histoire-pouvoir-achat.html','dossiers/prix-attendre-finances.html'],
  ['dossiers/prix-attendre-finances.html','dossiers/depenses-recurrentes-abonnements-assurances.html'],
  ['dossiers/depenses-recurrentes-abonnements-assurances.html','dossiers/cout-reel-voiture-achat-credit-loa-lld.html'],
  ['dossiers/cout-reel-voiture-achat-credit-loa-lld.html','dossiers/prix-attendre-finances.html'],
  ['dossiers/cout-complet-achat-immobilier.html','dossiers/audit-copropriete-avant-achat.html'],
  ['dossiers/audit-copropriete-avant-achat.html','dossiers/cout-complet-achat-immobilier.html'],
  ['dossiers/plan-30-jours-recherche-emploi.html','dossiers/experience-devient-risque-recruteur.html'],
  ['dossiers/experience-devient-risque-recruteur.html','dossiers/plan-30-jours-recherche-emploi.html'],
  ['dossiers/formation-vaut-elle-le-cout.html','articles/tester-metier-avant-investir.html'],
  ['articles/tester-metier-avant-investir.html','dossiers/formation-vaut-elle-le-cout.html'],
  ['dossiers/competences-qualification-employabilite.html','dossiers/apprendre-developper-competences.html'],
  ['dossiers/apprendre-developper-competences.html','dossiers/competences-qualification-employabilite.html'],
  ['dossiers/metiers-fonctions-organisation-entreprise.html','fiches-metiers.html'],
  ['dossiers/management-relations-conflits.html','dossiers/prejuges-biais-monde-professionnel.html'],
  ['dossiers/regles-responsabilites-fautes-travail.html','dossiers/sante-travail-equilibre-vie-pro-perso.html'],
  ['dossiers/sante-travail-equilibre-vie-pro-perso.html','dossiers/management-relations-conflits.html'],
  ['dossiers/prejuges-biais-monde-professionnel.html','dossiers/competences-qualification-employabilite.html']
]);

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
function sameDomain(a,b) {
  return [...a._domains].some(d => b._domains.has(d));
}
function sameCategory(a,b) {
  return Boolean(a.c && b.c && a.c === b.c);
}

const enriched = items.map(item => ({
  ...item,
  _tokens: tokens(`${item.n} ${item.c||''} ${item.k||''} ${item.x||''}`),
  _domains: new Set(String(item.d||'').split(/\s+/).filter(Boolean))
}));
const byHref = new Map(enriched.map(item => [item.h,item]));

let count=0;
for (const item of enriched) {
  const file = path.join(ROOT,item.h);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/<section\b(?=[^>]*\bclass="ce-related")(?=[^>]*\bdata-ce-related="1")[^>]*>[\s\S]*?<\/section>\s*/gi,'');

  const ranked = enriched.filter(other => other.h !== item.h).map(other => {
    const domain = sameDomain(item,other);
    const category = sameCategory(item,other);
    const shared = overlap(item._tokens,other._tokens);
    const score = shared * 4 + (domain ? 5 : 0) + (category ? 8 : 0) + (other.t === 'guide' ? 1 : 0);
    return {other,score,domain,category,shared};
  }).sort((a,b) => b.score-a.score || a.other.n.localeCompare(b.other.n,'fr'));

  const preferredHref = preferredNext.get(item.h);
  const preferredItem = preferredHref ? byHref.get(preferredHref) : null;
  const primary = preferredItem
    ? {other:preferredItem,score:999,domain:sameDomain(item,preferredItem),category:sameCategory(item,preferredItem),shared:overlap(item._tokens,preferredItem._tokens)}
    : ranked.find(x => x.score >= 7);
  if (!primary) { fs.writeFileSync(file,html,'utf8'); continue; }

  const used = new Set([primary.other.h]);
  const otherAngle = ranked.find(x => !used.has(x.other.h) && x.domain && !x.category && x.score >= 5)
    || ranked.find(x => !used.has(x.other.h) && x.domain && x.score >= 6)
    || ranked.find(x => !used.has(x.other.h) && x.score >= 7);
  if (otherAngle) used.add(otherAngle.other.h);

  const curiosity = ranked.find(x => !used.has(x.other.h) && !x.domain && x.shared >= 1)
    || ranked.find(x => !used.has(x.other.h) && !x.category && x.score >= 5)
    || ranked.find(x => !used.has(x.other.h) && x.score >= 7);

  const primaryHref = esc(hrefFrom(item.h,primary.other.h));
  const primaryDesc = esc(primary.other.x || 'Poursuivre le raisonnement avec un dossier directement lié à cette décision.');
  let inner = `<div class="kicker">À lire ensuite</div><h2>Continuez sans repartir de zéro.</h2>`;
  inner += `<a class="ce-related-primary" href="${primaryHref}"><div><span class="ce-related-label">Continuer ce raisonnement</span><strong>${esc(primary.other.n)}</strong></div><span class="ce-related-arrow">→</span><p>${primaryDesc}</p></a>`;

  const secondary=[];
  if (otherAngle) secondary.push(`<a href="${esc(hrefFrom(item.h,otherAngle.other.h))}"><div><span class="ce-related-label">Autre angle</span><strong>${esc(otherAngle.other.n)}</strong></div><span>→</span></a>`);
  if (curiosity) secondary.push(`<a href="${esc(hrefFrom(item.h,curiosity.other.h))}"><div><span class="ce-related-label">Vous n’étiez peut-être pas venu pour ça</span><strong>${esc(curiosity.other.n)}</strong></div><span>→</span></a>`);
  if (secondary.length) inner += `<div class="ce-related-secondary">${secondary.join('')}</div>`;

  const articleBlock = `<section class="ce-related" data-ce-related="1" aria-label="À lire ensuite">${inner}</section>`;
  const mainBlock = `<section class="ce-related" data-ce-related="1" aria-label="À lire ensuite"><div class="container">${inner}</div></section>`;

  if (/<\/article>/i.test(html)) html = html.replace(/<\/article>/i,`${articleBlock}</article>`);
  else if (/<\/main>/i.test(html)) html = html.replace(/<\/main>/i,`${mainBlock}</main>`);
  else { fs.writeFileSync(file,html,'utf8'); continue; }

  fs.writeFileSync(file,html,'utf8');
  count++;
}
console.log(`Carrefours éditoriaux ajoutés à ${count} contenus.`);
