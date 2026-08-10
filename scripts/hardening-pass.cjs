'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SITE_VERSION = require('./site-version.cjs');

function file(rel) { return path.join(ROOT, rel); }
function patch(rel, transform) {
  const full = file(rel);
  if (!fs.existsSync(full)) return false;
  const before = fs.readFileSync(full, 'utf8');
  const after = transform(before);
  if (after === before) return false;
  fs.writeFileSync(full, after, 'utf8');
  console.log(`Durci: ${rel}`);
  return true;
}

let changed = 0;

changed += patch('assets/personal-space.js', code =>
  code.replace('(articles|themes|dossiers)', '(articles|themes|dossiers|fiches-metiers)')
) ? 1 : 0;

changed += patch('assets/longform.js', code => {
  code = code.replace(
    "    if (!document.body.classList.contains('article-body')) return;\n    const main = document.querySelector('main');",
    "    const prose = document.querySelector('main article.prose');\n    if (!document.body.classList.contains('article-body') && !prose) return;\n    const main = document.querySelector('main');"
  );
  code = code.replace(
    "    const sections = [...main.querySelectorAll(':scope > section')].filter(s => s !== hero && !s.classList.contains('ce-related'));\n    const h2s = sections.map(s => s.querySelector('h2')).filter(Boolean);\n    if (h2s.length < 4) return;\n\n    const readingText = sections.map(s => s.textContent || '').join(' ');",
    "    const sections = [...main.querySelectorAll(':scope > section')].filter(s => s !== hero && !s.classList.contains('ce-related'));\n    const h2s = prose ? [...prose.querySelectorAll(':scope > h2')] : sections.map(s => s.querySelector('h2')).filter(Boolean);\n    if (h2s.length < 4) return;\n\n    const readingText = prose ? (prose.textContent || '') : sections.map(s => s.textContent || '').join(' ');"
  );
  return code;
}) ? 1 : 0;

changed += patch('assets/navigation-v3.js', code =>
  code.replace(/const VERSION = '[^']+';/, `const VERSION = '${SITE_VERSION}';`)
) ? 1 : 0;

changed += patch('assets/ux-retention.css', css => {
  css = css.replace(
    '.ce-start-link,.ce-space-header-link{display:none!important}',
    '.ce-start-link,.ce-space-header-link,.ce-flat-actions>.ce-follow-trigger{display:none!important}'
  );
  if (!css.includes('/* Accessibilité : mouvement réduit */')) {
    css += `\n\n/* Accessibilité : mouvement réduit */\n@media (prefers-reduced-motion: reduce){\n  html{scroll-behavior:auto!important}\n  *,*::before,*::after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}\n  .ce-reading-progress{display:none!important}\n}\n`;
  }
  return css;
}) ? 1 : 0;

changed += patch('assets/navigation.css', css => {
  css = css.replace(/\/\* ===== Navigation V3 : menus déroulants accessibles ===== \*\/[\s\S]*?(?=\.library-search\{)/, '/* Ancien système de menus retiré : navigation-v3.js + ux-retention.css font désormais autorité. */\n');
  css = css.replace('.theme-icon,.track-label,.number,.kicker{color:#9a711e!important}', '.theme-icon,.track-label,.number,.kicker{color:#75591e!important}');
  return css;
}) ? 1 : 0;

changed += patch('scripts/consolidate-site.cjs', code => {
  code = code.replace(
    /function ensureCanonical\(html, url\) \{[\s\S]*?\n\}/,
    `function ensureCanonical(html, url) {\n  const canonical = /<link\\b(?=[^>]*\\brel=[\"']canonical[\"'])[^>]*>/gi;\n  html = html.replace(canonical, '');\n  return html.replace(/<\\/head>/i, \`<link rel=\"canonical\" href=\"\${url}\"/></head>\`);\n}`
  );
  return code;
}) ? 1 : 0;

changed += patch('scripts/add-ux-layer.cjs', code => {
  if (!code.includes("require('./site-version.cjs')")) {
    code = code.replace("const ROOT = path.resolve(__dirname,'..');\n", "const ROOT = path.resolve(__dirname,'..');\nconst SITE_VERSION = require('./site-version.cjs');\n");
  }
  code = code.replace(/const UX_VERSION = '[^']+';\nconst NAV_VERSION = '[^']+';\nconst ORIENTATION_VERSION = '[^']+';\nconst LONGFORM_VERSION = '[^']+';\nconst FOLLOW_VERSION = '[^']+';/,
    'const UX_VERSION = SITE_VERSION;\nconst NAV_VERSION = SITE_VERSION;\nconst ORIENTATION_VERSION = SITE_VERSION;\nconst LONGFORM_VERSION = SITE_VERSION;\nconst FOLLOW_VERSION = SITE_VERSION;');
  return code;
}) ? 1 : 0;

changed += patch('scripts/add-personal-space.cjs', code => {
  if (!code.includes("require('./site-version.cjs')")) {
    code = code.replace("const ROOT=path.resolve(__dirname,'..');\n", "const ROOT=path.resolve(__dirname,'..');\nconst SITE_VERSION=require('./site-version.cjs');\n");
  }
  return code;
}) ? 1 : 0;

changed += patch('scripts/generate-rss.cjs', code => {
  if (!code.includes("require('./site-version.cjs')")) {
    code = code.replace("const ROOT = path.resolve(__dirname, '..');\n", "const ROOT = path.resolve(__dirname, '..');\nconst SITE_VERSION = require('./site-version.cjs');\n");
  }
  code = code.replace(/const tag = `<script src="\$\{src\}\?v=[^"]+"><\/script>`;/, 'const tag = `<script src="${src}?v=${SITE_VERSION}"></script>`;');
  return code;
}) ? 1 : 0;

changed += patch('assets/tools-catalog.js', code =>
  code.replace('proposer une allocation et tester concentration, liquidité et stress.', 'saisir et tester votre propre allocation, puis observer concentration, liquidité et stress.')
) ? 1 : 0;

changed += patch('outil-repartir-grosse-somme.html', html => {
  html = html.replace(/proposer une allocation/gi, 'saisir et tester votre propre allocation');
  html = html.replace(/Allocation proposée restant à affecter/g, 'Allocation saisie restant à affecter');
  html = html.replace(/Nouvelle allocation proposée/g, 'Nouvelle allocation saisie');
  html = html.replace(/nouvelle allocation proposée/g, 'nouvelle allocation saisie');
  html = html.replace(/Part du montant reçue encore libre/g, 'Part du montant reçu encore libre');
  html = html.replace("['stocks','Actions individuelles / concentrées'],", '');
  html = html.replace("['bonds','Obligations / fonds obligataires'],", "['bonds','Obligations / fonds obligataires'],['privateCredit','Crédit privé / dette non cotée'],");
  html = html.replace("['listedProperty','Foncières cotées'],", "['listedProperty','Foncières cotées / REIT'],['privateEquity','Private equity / entreprise non cotée'],['infrastructure','Infrastructures'],");
  html = html.replace("['gold','Or'],['other','Autres actifs']", "['gold','Or & métaux précieux'],['commodities','Matières premières'],['crypto','Crypto-actifs'],['other','Autres actifs']");
  if (!html.includes('data-ce-mobile-allocation="1"')) {
    const mobile=`<style data-ce-mobile-allocation="1">@media(max-width:760px){.alloc-table{min-width:0!important}.alloc-table thead{display:none}.alloc-table,.alloc-table tbody,.alloc-table tr,.alloc-table td{display:block;width:100%}.alloc-table tr{margin:0 0 .85rem;padding:.75rem .8rem;border:1px solid rgba(16,24,32,.12);border-radius:12px;background:#fff}.alloc-table td{display:grid;grid-template-columns:minmax(130px,.9fr) minmax(0,1.1fr);gap:.65rem;align-items:center;padding:.42rem 0!important;border:0!important;text-align:left!important}.alloc-table td:first-child{display:block;padding-bottom:.65rem!important;border-bottom:1px solid rgba(16,24,32,.1)!important;font-size:1rem}.alloc-table td:not(:first-child)::before{font-size:.7rem;line-height:1.25;font-weight:900;text-transform:uppercase;letter-spacing:.05em;color:#75591e}.alloc-table td:nth-child(2)::before{content:'Patrimoine actuel'}.alloc-table td:nth-child(3)::before{content:'Nouvelle allocation'}.alloc-table td:nth-child(4)::before{content:'Poids avant'}.alloc-table td:nth-child(5)::before{content:'Poids après'}.alloc-table td:nth-child(6)::before{content:'Choc à tester'}.alloc-table td:nth-child(7)::before{content:'Valeur après choc'}.alloc-table input{width:100%!important;max-width:none!important;min-width:0!important}}</style>`;
    html=html.replace(/<\/head>/i,`${mobile}</head>`);
  }
  return html;
}) ? 1 : 0;

changed += patch('dossiers/rembourser-credit-ou-investir.html', html => {
  if (html.includes('data-ce-source-credit-investir="1"')) return html;
  const sources='<h2>Sources et repères officiels</h2><ul class="source-list" data-ce-source-credit-investir="1"><li><a href="https://www.economie.gouv.fr/particuliers/emprunter-et-sassurer/rembourser-son-credit-immobilier-avant-le-terme-comment-ca" rel="noopener">Ministère de l’Économie — Rembourser son crédit immobilier avant le terme</a> : modalités, information du prêteur et indemnités éventuelles.</li><li><a href="https://www.amf-france.org/fr/espace-epargnants/savoir-bien-investir/cadrer-son-projet/risques-et-rendements-des-placements" rel="noopener">AMF — Rendements et risques des placements financiers</a> : le rendement futur d’un placement risqué n’est pas garanti et doit être rapproché du risque pris.</li></ul><p class="source-note">Les conditions du contrat de crédit, la fiscalité et les caractéristiques du placement envisagé restent à vérifier au moment de la décision.</p>';
  if (/<h2>Ce que j’en retiens<\/h2>/i.test(html)) return html.replace(/<h2>Ce que j’en retiens<\/h2>/i,`${sources}<h2>Ce que j’en retiens</h2>`);
  return html;
}) ? 1 : 0;

function htmlFiles(dir = ROOT, prefix = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'publications') continue;
    const rel = path.join(prefix, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full, rel));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

const versionedAssets = [
  'navigation-v3.js','orientation.js','longform.js','follow.js','personal-space.js','personal-space.css','ux-retention.css',
  'finance-cockpit.js','finance-cockpit.css','finance-architecture.js','finance-architecture.css','cockpit-progressive.js','cockpit-progressive.css','property-cockpit.js','property-cockpit.css'
];

for (const rel of htmlFiles()) {
  changed += patch(rel, html => {
    const canonical = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi;
    const canonicals = html.match(canonical) || [];
    if (canonicals.length > 1) {
      const keep = canonicals[0];
      html = html.replace(canonical, '');
      html = html.replace(/<\/head>/i, `${keep}</head>`);
    }
    if (/data-ce-seo=["']main["']/i.test(html)) {
      html = html.replace(/<script\s+type=["']application\/ld\+json["'](?![^>]*data-ce-seo)[^>]*>([\s\S]*?)<\/script>\s*/gi,(match,json)=>{
        return /["']?@type["']?\s*:\s*["'](?:Article|WebApplication)["']/i.test(json) ? '' : match;
      });
    }
    for (const asset of versionedAssets) {
      const escaped=asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      html=html.replace(new RegExp(`((?:\\.\\.\\/|\\.\\/)?assets\\/${escaped})(?:\\?v=[^\"']*)?`,'gi'), `$1?v=${SITE_VERSION}`);
    }
    return html;
  }) ? 1 : 0;
}

console.log(`Passe de durcissement terminée : ${changed} modification(s). Version front ${SITE_VERSION}.`);
