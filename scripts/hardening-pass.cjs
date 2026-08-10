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
  code.replace(/\/\\\/(articles\|themes\|dossiers)\\\//, '/\\/(articles|themes|dossiers|fiches-metiers)\\//')
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
  code = code.replace('`<link rel="stylesheet" href="${p}assets/personal-space.css?v=20260810-1"/>`', '`<link rel="stylesheet" href="${p}assets/personal-space.css?v=${SITE_VERSION}"/>`');
  code = code.replace('`<script src="${p}assets/personal-space.js?v=20260810-2"></script>`', '`<script src="${p}assets/personal-space.js?v=${SITE_VERSION}"></script>`');
  code = code.replace("const architectureCss='<link rel=\"stylesheet\" href=\"assets/finance-architecture.css?v=20260810-2\"/>';", "const architectureCss=`<link rel=\"stylesheet\" href=\"assets/finance-architecture.css?v=${SITE_VERSION}\"/>`;");
  code = code.replace("const architectureJs='<script src=\"assets/finance-architecture.js?v=20260810-2\"></script>';", "const architectureJs=`<script src=\"assets/finance-architecture.js?v=${SITE_VERSION}\"></script>`;");
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

changed += patch('outil-repartir-grosse-somme.html', html =>
  html.replace(/proposer une allocation/gi, 'saisir et tester votre propre allocation')
) ? 1 : 0;

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

for (const rel of htmlFiles()) {
  changed += patch(rel, html => {
    const re = /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi;
    const matches = html.match(re) || [];
    if (matches.length <= 1) return html;
    const keep = matches[0];
    html = html.replace(re, '');
    return html.replace(/<\/head>/i, `${keep}</head>`);
  }) ? 1 : 0;
}

console.log(`Passe de durcissement terminée : ${changed} modification(s). Version front ${SITE_VERSION}.`);
