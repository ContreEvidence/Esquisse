const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://contreevidence.github.io/Esquisse/';
const FEED_URL = `${BASE_URL}rss.xml`;

const context = { window: {} };
vm.createContext(context);

function runCatalog(relativePath) {
  const code = fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
  vm.runInContext(code, context, { filename: relativePath });
}

runCatalog('assets/library-catalog.js');
runCatalog('assets/library-daily-money.js');
runCatalog('assets/tools-catalog.js');

const editorial = Array.isArray(context.window.CE_LIBRARY_CATALOG)
  ? context.window.CE_LIBRARY_CATALOG
  : [];
const tools = Array.isArray(context.window.CE_TOOLS_CATALOG)
  ? context.window.CE_TOOLS_CATALOG
  : [];

const now = new Date();
const dateCache = new Map();

function publicationDate(relativePath) {
  if (dateCache.has(relativePath)) return dateCache.get(relativePath);
  let date = now;
  try {
    const output = execFileSync(
      'git',
      ['log', '--follow', '--format=%cI', '--reverse', '--', relativePath],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    const first = output.split(/\r?\n/).filter(Boolean)[0];
    if (first) date = new Date(first);
  } catch (_) {
    // Si l'historique Git n'est pas disponible, la date de génération reste un repli valide.
  }
  dateCache.set(relativePath, date);
  return date;
}

function xml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function typeLabel(type) {
  if (type === 'outil') return 'Outil';
  if (type === 'dossier') return 'Dossier';
  return 'Guide';
}

function domainLabel(domain) {
  if (domain === 'patrimoine') return 'Patrimoine';
  if (domain === 'vie-pro') return 'Vie professionnelle';
  return domain || 'Contre-Évidence';
}

const byHref = new Map();
for (const item of [...editorial, ...tools]) {
  if (!item || !item.h || !item.n) continue;
  byHref.set(item.h, item);
}

const items = [...byHref.values()]
  .map(item => ({ ...item, published: publicationDate(item.h) }))
  .sort((a, b) => b.published - a.published);

const rssItems = items.map(item => {
  const link = new URL(item.h, BASE_URL).href;
  const description = item.x || 'Nouveau contenu Contre-Évidence.';
  return `    <item>\n` +
    `      <title>${xml(item.n)}</title>\n` +
    `      <link>${xml(link)}</link>\n` +
    `      <guid isPermaLink="true">${xml(link)}</guid>\n` +
    `      <pubDate>${item.published.toUTCString()}</pubDate>\n` +
    `      <category>${xml(typeLabel(item.t))}</category>\n` +
    `      <category>${xml(domainLabel(item.d))}</category>\n` +
    (item.c ? `      <category>${xml(item.c)}</category>\n` : '') +
    `      <description>${xml(description)}</description>\n` +
    `    </item>`;
}).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
`  <channel>\n` +
`    <title>Contre-Évidence — nouveautés</title>\n` +
`    <link>${BASE_URL}</link>\n` +
`    <description>Nouveaux guides, dossiers et outils de Contre-Évidence : patrimoine, vie professionnelle et décisions concrètes.</description>\n` +
`    <language>fr-FR</language>\n` +
`    <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n` +
`    <ttl>60</ttl>\n` +
`    <generator>Contre-Évidence / GitHub Actions</generator>\n` +
`    <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>\n` +
`    <image>\n` +
`      <url>${BASE_URL}assets/logo.png</url>\n` +
`      <title>Contre-Évidence</title>\n` +
`      <link>${BASE_URL}</link>\n` +
`    </image>\n` +
`${rssItems}\n` +
`  </channel>\n` +
`</rss>\n`;

fs.writeFileSync(path.join(ROOT, 'rss.xml'), rss, 'utf8');
console.log(`rss.xml généré avec ${items.length} éléments.`);
