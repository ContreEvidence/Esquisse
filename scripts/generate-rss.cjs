const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://contreevidence.github.io/Esquisse/';
const MAIN_FEED_NAME = 'rss.xml';
const FEED_URL = `${BASE_URL}${MAIN_FEED_NAME}`;
const AUTODISCOVERY = `<link rel="alternate" type="application/rss+xml" title="Contre-Évidence — nouveautés" href="${FEED_URL}"/>`;
const KNOWN_DOMAINS = ['patrimoine', 'vie-pro', 'hors-cadre', 'ia-tech'];

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

function slug(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'general';
}

function typeLabel(type) {
  if (type === 'outil') return 'Outil';
  if (type === 'dossier') return 'Dossier';
  return 'Guide';
}

function domainLabel(domain) {
  if (domain === 'patrimoine') return 'Patrimoine';
  if (domain === 'vie-pro') return 'Vie professionnelle';
  if (domain === 'hors-cadre') return 'Hors cadre';
  if (domain === 'ia-tech') return 'IA & Tech';
  return domain || 'Contre-Évidence';
}

function itemDomains(value = '') {
  const raw = String(value).trim();
  if (!raw) return ['general'];
  const normalized = raw.toLowerCase();
  const found = KNOWN_DOMAINS.filter(domain => normalized.includes(domain));
  return found.length ? found : [raw];
}

function ensureAutodiscovery(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return;
  let html = fs.readFileSync(fullPath, 'utf8');
  if (html.includes('type="application/rss+xml"')) return;

  const canonical = /<link\s+rel="canonical"[^>]*\/>/i;
  if (canonical.test(html)) {
    html = html.replace(canonical, match => `${match}\n${AUTODISCOVERY}`);
  } else {
    html = html.replace('</head>', `${AUTODISCOVERY}\n</head>`);
  }
  fs.writeFileSync(fullPath, html, 'utf8');
}

function ensureFollowScript(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) return false;
  let html = fs.readFileSync(fullPath, 'utf8');
  if (!/<\/body>/i.test(html) || /assets\/follow\.js/i.test(html)) return false;

  let src = path.relative(path.dirname(relativePath), 'assets/follow.js').replace(/\\/g, '/');
  if (!src.startsWith('.')) src = `./${src}`;
  const tag = `<script src="${src}?v=20260809-1"></script>`;
  html = html.replace(/<\/body>/i, `${tag}\n</body>`);
  fs.writeFileSync(fullPath, html, 'utf8');
  return true;
}

function htmlFiles(dir = ROOT, prefix = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'publications') continue;
    const rel = path.join(prefix, entry.name);
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full, rel));
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) out.push(rel.replace(/\\/g, '/'));
  }
  return out;
}

const byHref = new Map();
for (const item of [...editorial, ...tools]) {
  if (!item || !item.h || !item.n) continue;
  byHref.set(item.h, item);
}

const items = [...byHref.values()]
  .map(item => ({ ...item, published: publicationDate(item.h) }))
  .sort((a, b) => b.published - a.published);

function renderItems(feedItems) {
  return feedItems.map(item => {
    const link = new URL(item.h, BASE_URL).href;
    const description = item.x || 'Nouveau contenu Contre-Évidence.';
    const domainCategories = itemDomains(item.d).map(domain => `      <category>${xml(domainLabel(domain))}</category>\n`).join('');
    return `    <item>\n` +
      `      <title>${xml(item.n)}</title>\n` +
      `      <link>${xml(link)}</link>\n` +
      `      <guid isPermaLink="true">${xml(link)}</guid>\n` +
      `      <pubDate>${item.published.toUTCString()}</pubDate>\n` +
      `      <category>${xml(typeLabel(item.t))}</category>\n` +
      domainCategories +
      (item.c ? `      <category>${xml(item.c)}</category>\n` : '') +
      `      <description>${xml(description)}</description>\n` +
      `    </item>`;
  }).join('\n');
}

function buildFeed({ filename, title, description, feedItems }) {
  const selfUrl = `${BASE_URL}${filename}`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n` +
    `  <channel>\n` +
    `    <title>${xml(title)}</title>\n` +
    `    <link>${BASE_URL}</link>\n` +
    `    <description>${xml(description)}</description>\n` +
    `    <language>fr-FR</language>\n` +
    `    <lastBuildDate>${now.toUTCString()}</lastBuildDate>\n` +
    `    <ttl>60</ttl>\n` +
    `    <generator>Contre-Évidence / GitHub Actions</generator>\n` +
    `    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml"/>\n` +
    `    <image>\n` +
    `      <url>${BASE_URL}assets/logo.png</url>\n` +
    `      <title>Contre-Évidence</title>\n` +
    `      <link>${BASE_URL}</link>\n` +
    `    </image>\n` +
    `${renderItems(feedItems)}\n` +
    `  </channel>\n` +
    `</rss>\n`;
}

const mainRss = buildFeed({
  filename: MAIN_FEED_NAME,
  title: 'Contre-Évidence — nouveautés',
  description: 'Nouveaux guides, dossiers et outils de Contre-Évidence : patrimoine, vie professionnelle et décisions concrètes.',
  feedItems: items
});
fs.writeFileSync(path.join(ROOT, MAIN_FEED_NAME), mainRss, 'utf8');

const byDomain = new Map();
for (const item of items) {
  for (const domain of itemDomains(item.d)) {
    if (!byDomain.has(domain)) byDomain.set(domain, []);
    byDomain.get(domain).push(item);
  }
}

const thematicFeeds = [];
for (const [domain, domainItems] of [...byDomain.entries()].sort(([a], [b]) => a.localeCompare(b, 'fr'))) {
  if (domain === 'general') continue;
  const label = domainLabel(domain);
  const filename = `rss-${slug(domain)}.xml`;
  const rss = buildFeed({
    filename,
    title: `Contre-Évidence — ${label}`,
    description: `Nouveaux guides, dossiers et outils Contre-Évidence consacrés à ${label}.`,
    feedItems: domainItems
  });
  fs.writeFileSync(path.join(ROOT, filename), rss, 'utf8');
  thematicFeeds.push({ domain, label, filename, count: domainItems.length });
}

const desiredFeedFiles = new Set(thematicFeeds.map(feed => feed.filename));
for (const filename of fs.readdirSync(ROOT)) {
  if (!/^rss-.+\.xml$/i.test(filename)) continue;
  if (!desiredFeedFiles.has(filename)) fs.unlinkSync(path.join(ROOT, filename));
}

const manifest = {
  version: 1,
  generatedAt: now.toISOString(),
  main: { title: 'Contre-Évidence — nouveautés', url: FEED_URL, count: items.length },
  thematic: thematicFeeds.map(feed => ({
    domain: feed.domain,
    label: feed.label,
    url: `${BASE_URL}${feed.filename}`,
    count: feed.count
  }))
};
fs.writeFileSync(path.join(ROOT, 'rss-feeds.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');

ensureAutodiscovery('index.html');
ensureAutodiscovery('bibliotheque.html');

let followInjected = 0;
for (const relativePath of htmlFiles()) {
  if (ensureFollowScript(relativePath)) followInjected++;
}

console.log(`rss.xml généré avec ${items.length} éléments.`);
console.log(`${thematicFeeds.length} flux thématiques générés : ${thematicFeeds.map(feed => `${feed.filename} (${feed.count})`).join(', ')}.`);
console.log(`Module Suivre ajouté à ${followInjected} page(s) HTML.`);
