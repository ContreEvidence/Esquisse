const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname,'..');
const SITE_VERSION = require('./site-version.cjs');
const UX_VERSION = SITE_VERSION;
const NAV_VERSION = SITE_VERSION;
const ORIENTATION_VERSION = SITE_VERSION;
const LONGFORM_VERSION = SITE_VERSION;
const FOLLOW_VERSION = SITE_VERSION;

for (const rel of ['assets/navigation-v3.js','assets/orientation.js','assets/longform.js','assets/library.js','assets/library-work-foundations.js','assets/follow.js']) {
  new vm.Script(fs.readFileSync(path.join(ROOT,rel),'utf8'), {filename:rel});
}

function htmlFiles(dir=ROOT,prefix='') {
  const out=[];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'publications') continue;
    const rel=path.join(prefix,e.name), full=path.join(dir,e.name);
    if (e.isDirectory()) out.push(...htmlFiles(full,rel));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(rel.replace(/\\/g,'/'));
  }
  return out;
}

function stableHeader(prefix='') {
  const u = p => `${prefix}${p}`;
  return `<header id="site-header"><div class="ce-fallback-header" aria-label="Navigation principale"><a class="ce-fallback-brand" href="${u('index.html')}">CONTRE-ÉVIDENCE</a><nav><a href="${u('themes/argent.html')}">Patrimoine</a><a href="${u('parcours-vie-professionnelle.html')}">Vie professionnelle</a><a href="${u('hors-cadre.html')}">Fenêtres</a><a href="${u('bibliotheque.html?type=outil')}">Outils</a><a href="${u('bibliotheque.html')}">Bibliothèque</a></nav></div></header>`;
}

function divBlock(html,className) {
  const start = html.indexOf(`<div class="${className}"`);
  if (start < 0) return null;
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = start;
  let depth = 0, match;
  while ((match = re.exec(html))) {
    if (/^<div\b/i.test(match[0])) depth++;
    else depth--;
    if (depth === 0) return {start,end:re.lastIndex,text:html.slice(start,re.lastIndex)};
  }
  return null;
}

function stabilizePatrimoine(html) {
  const foundation = divBlock(html,'foundation');
  const pillars = divBlock(html,'pillar-grid');
  if (!foundation || !pillars || foundation.start > pillars.start) return html;
  html = html.slice(0,foundation.start) + html.slice(foundation.end);
  const movedPillars = divBlock(html,'pillar-grid');
  if (!movedPillars) return html;
  return html.slice(0,movedPillars.end) + foundation.text + html.slice(movedPillars.end);
}

let changed=0;
for (const rel of htmlFiles()) {
  const file=path.join(ROOT,rel);
  let html=fs.readFileSync(file,'utf8');
  const before=html;
  if (!/<head[\s>]/i.test(html) || !/<\/body>/i.test(html)) continue;
  const nested=/^(articles|dossiers|themes|fiches-metiers)\//.test(rel);
  const p=nested?'../':'';

  if (rel === 'themes/argent.html') html = stabilizePatrimoine(html);

  html=html.replace(/<link\s+[^>]*href=["'](?:\.\.\/)?assets\/ux-retention\.css(?:\?[^"']*)?["'][^>]*>\s*/gi,'');
  html=html.replace(/<script\s+src=["'](?:\.\.\/)?assets\/longform\.js(?:\?[^"']*)?["'][^>]*><\/script>\s*/gi,'');
  html=html.replace(/<script\s+src=["'](?:\.\.\/)?assets\/orientation\.js(?:\?[^"']*)?["'][^>]*><\/script>\s*/gi,'');
  html=html.replace(/<script\s+src=["'](?:\.\.\/)?assets\/navigation-v3\.js(?:\?[^"']*)?["'][^>]*><\/script>\s*/gi,'');
  html=html.replace(/(<script\s+src=["'](?:\.\.\/|\.\/)?assets\/follow\.js)(?:\?[^"']*)?(["'][^>]*><\/script>)/gi,`$1?v=${FOLLOW_VERSION}$2`);
  html=html.replace(/<\/head>/i,`<link rel="stylesheet" href="${p}assets/ux-retention.css?v=${UX_VERSION}"/></head>`);

  if (/<header\s+id=["']site-header["'][^>]*>[\s\S]*?<\/header>/i.test(html)) {
    html=html.replace(/<header\s+id=["']site-header["'][^>]*>[\s\S]*?<\/header>/i,stableHeader(p));
  }

  const scripts=`<script src="${p}assets/navigation-v3.js?v=${NAV_VERSION}"></script><script src="${p}assets/orientation.js?v=${ORIENTATION_VERSION}"></script><script src="${p}assets/longform.js?v=${LONGFORM_VERSION}"></script>`;
  html=html.replace(/<\/body>/i,`${scripts}</body>`);

  if (html !== before) {
    fs.writeFileSync(file,html,'utf8');
    changed++;
  }
}
console.log(`Couche UX stable appliquée à ${changed} page(s), module de suivi sans collecte forcé en version ${FOLLOW_VERSION}.`);
