const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname,'..');
const SITEMAP = path.join(ROOT,'sitemap.xml');
const BASE = 'https://contreevidence.github.io/Esquisse/';
if (!fs.existsSync(SITEMAP)) process.exit(0);

const xml = fs.readFileSync(SITEMAP,'utf8');
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]).filter(u => u.startsWith(BASE));
let count = 0;
for (const url of urls) {
  let rel = url.slice(BASE.length) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  if (!rel.endsWith('.html')) continue;
  const file = path.join(ROOT,rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/<script\s+src=["'][^"']*assets\/analytics-loader\.js[^"']*["'][^>]*><\/script>\s*/gi,'');
  const nested = /^(articles|dossiers|themes)\//.test(rel);
  const src = `${nested ? '../' : ''}assets/analytics-loader.js?v=20260809-1`;
  if (/<\/body>/i.test(html)) {
    html = html.replace(/<\/body>/i,`<script src="${src}"></script></body>`);
    fs.writeFileSync(file,html,'utf8');
    count++;
  }
}
console.log(`Chargeur analytics préparé sur ${count} pages indexables.`);
