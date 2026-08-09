const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://contreevidence.github.io/Esquisse/';
const SOCIAL_IMAGE = `${BASE}assets/og-cover-brand.png`;
const ctx = { window: {} };
vm.createContext(ctx);

for (const rel of ['assets/library-catalog.js','assets/library-inflation.js','assets/library-daily-money.js','assets/tools-catalog.js']) {
  if (!fs.existsSync(path.join(ROOT, rel))) continue;
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), ctx, { filename: rel });
}

const editorial = Array.isArray(ctx.window.CE_LIBRARY_CATALOG) ? ctx.window.CE_LIBRARY_CATALOG : [];
const tools = Array.isArray(ctx.window.CE_TOOLS_CATALOG) ? ctx.window.CE_TOOLS_CATALOG : [];
const byHref = new Map();
for (const item of [...editorial, ...tools]) if (item?.h && item?.n) byHref.set(item.h, item);
const items = [...byHref.values()];

const gitCache = new Map();
function gitDates(rel) {
  if (gitCache.has(rel)) return gitCache.get(rel);
  const out = { published: '2026-08-08', modified: '2026-08-08' };
  try {
    const all = execFileSync('git',['log','--follow','--format=%cI','--',rel],{cwd:ROOT,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim().split(/\r?\n/).filter(Boolean);
    if (all.length) {
      out.modified = all[0].slice(0,10);
      out.published = all[all.length - 1].slice(0,10);
    }
  } catch (_) {}
  gitCache.set(rel, out);
  return out;
}

function esc(s='') { return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function abs(rel) { return new URL(rel, BASE).href; }
function domainInfo(d='') {
  const domains = String(d).split(/\s+/).filter(Boolean);
  if (domains.includes('patrimoine') && !domains.includes('vie-pro')) return { name:'Patrimoine', href:'themes/argent.html' };
  if (domains.includes('vie-pro') && !domains.includes('patrimoine')) return { name:'Vie professionnelle', href:'parcours-vie-professionnelle.html' };
  return { name:'Bibliothèque', href:'bibliotheque.html' };
}

function replaceMeta(html, regex) { return html.replace(regex, ''); }
function enrichSeo(rel, item) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) return false;
  let html = fs.readFileSync(file, 'utf8');
  if (!/<head[\s>]/i.test(html)) return false;
  const dates = gitDates(rel);
  const title = item.n;
  const desc = item.x || 'Contenu Contre-Évidence.';
  const url = abs(rel);
  const isTool = item.t === 'outil';
  const domain = domainInfo(item.d);

  html = replaceMeta(html, /<meta\s+(?:property|name)="(?:og:[^"]+|twitter:[^"]+|dateModified|article:published_time|article:modified_time|article:section)"[^>]*>\s*/gi);
  html = replaceMeta(html, /<script\s+type="application\/ld\+json"\s+data-ce-seo="[^"]+">[\s\S]*?<\/script>\s*/gi);

  const og = [
    `<meta property="og:type" content="${isTool ? 'website' : 'article'}"/>`,
    `<meta property="og:title" content="${esc(title)}"/>`,
    `<meta property="og:description" content="${esc(desc)}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${SOCIAL_IMAGE}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${esc(title)}"/>`,
    `<meta name="twitter:description" content="${esc(desc)}"/>`,
    `<meta name="twitter:image" content="${SOCIAL_IMAGE}"/>`,
    `<meta name="dateModified" content="${dates.modified}"/>`,
    !isTool ? `<meta property="article:published_time" content="${dates.published}"/>` : '',
    !isTool ? `<meta property="article:modified_time" content="${dates.modified}"/>` : '',
    item.c ? `<meta property="article:section" content="${esc(item.c)}"/>` : ''
  ].filter(Boolean).join('');

  const mainLd = isTool ? {
    '@context':'https://schema.org','@type':'WebApplication',name:title,url,description:desc,
    applicationCategory:'EducationalApplication',operatingSystem:'Web',isAccessibleForFree:true,
    publisher:{'@type':'Organization',name:'Contre-Évidence',url:BASE}
  } : {
    '@context':'https://schema.org','@type':'Article',headline:title,description:desc,url,image:SOCIAL_IMAGE,
    datePublished:dates.published,dateModified:dates.modified,
    author:{'@type':'Organization',name:'Contre-Évidence',url:BASE},
    publisher:{'@type':'Organization',name:'Contre-Évidence',url:BASE,logo:{'@type':'ImageObject',url:`${BASE}assets/logo.png`}},
    articleSection:item.c || undefined,
    isAccessibleForFree:true
  };
  const breadcrumb = {
    '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Accueil',item:BASE},
      {'@type':'ListItem',position:2,name:domain.name,item:abs(domain.href)},
      {'@type':'ListItem',position:3,name:title,item:url}
    ]
  };
  const ld = `<script type="application/ld+json" data-ce-seo="main">${JSON.stringify(mainLd)}</script><script type="application/ld+json" data-ce-seo="breadcrumb">${JSON.stringify(breadcrumb)}</script>`;
  html = html.replace(/<\/head>/i, `${og}${ld}</head>`);

  if (!isTool && /<section class="article-hero"/i.test(html) && !/data-ce-review=/i.test(html) && !/class="ce-update-meta"/i.test(html)) {
    const note = `<div class="ce-update-meta" data-ce-review="1"><span>Mis à jour le ${dates.modified.split('-').reverse().join('/')} · Sources et hypothèses précisées dans le dossier</span></div>`;
    html = html.replace(/<\/div><\/section><article/i, `${note}</div></section><article`);
  }

  fs.writeFileSync(file, html, 'utf8');
  return true;
}

function htmlFiles(dir=ROOT, prefix='') {
  const out=[];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    if (e.name.startsWith('.') || e.name==='node_modules' || e.name==='publications') continue;
    const rel=path.join(prefix,e.name), full=path.join(dir,e.name);
    if (e.isDirectory()) out.push(...htmlFiles(full,rel));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(rel.replace(/\\/g,'/'));
  }
  return out;
}

function ensureFallbackHeader(rel) {
  const file=path.join(ROOT,rel); let html=fs.readFileSync(file,'utf8');
  if (!html.includes('<header id="site-header"></header>')) return false;
  const nested=/^(articles|dossiers|themes)\//.test(rel); const p=nested?'../':'';
  const fallback=`<header id="site-header"><div class="ce-fallback-header" aria-label="Navigation principale"><a class="ce-fallback-brand" href="${p}index.html">Contre-Évidence</a><nav><a href="${p}themes/argent.html">Patrimoine</a><a href="${p}parcours-vie-professionnelle.html">Vie professionnelle</a><a href="${p}hors-cadre.html">Hors cadre</a><a href="${p}bibliotheque.html">Bibliothèque</a></nav></div></header>`;
  html=html.replace('<header id="site-header"></header>',fallback); fs.writeFileSync(file,html,'utf8'); return true;
}

for (const item of items) enrichSeo(item.h,item);
for (const rel of htmlFiles()) ensureFallbackHeader(rel);

const structural = [
  'index.html','themes/argent.html','parcours-argent.html','marches-analyses-avancees.html','parcours-vie-professionnelle.html',
  'themes/travail.html','themes/entreprendre.html','hors-cadre.html','hors-cadre-cuisine.html','hors-cadre-decouvertes.html','hors-cadre-images.html',
  'bibliotheque.html','parcours-de-vie.html','a-propos.html','methode-sources.html','contact.html'
].filter(rel=>fs.existsSync(path.join(ROOT,rel)));
const sitemapPaths = [...new Set([...structural, ...editorial.map(x=>x.h).filter(Boolean)])];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map(rel=>`  <url><loc>${abs(rel==='index.html'?'':rel)}</loc><lastmod>${gitDates(rel).modified}</lastmod></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT,'sitemap.xml'),sitemap,'utf8');

console.log(`Consolidation terminée : ${items.length} contenus enrichis, ${sitemapPaths.length} URLs dans le sitemap.`);
