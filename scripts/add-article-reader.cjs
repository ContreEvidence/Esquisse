const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ctx = { window: {} };
vm.createContext(ctx);

for (const rel of ['assets/library-catalog.js', 'assets/library-daily-money.js']) {
  const file = path.join(ROOT, rel);
  if (fs.existsSync(file)) vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: rel });
}

const items = Array.isArray(ctx.window.CE_LIBRARY_CATALOG) ? ctx.window.CE_LIBRARY_CATALOG : [];
const paths = [...new Set(items.filter(item => item?.h && item.t !== 'outil').map(item => item.h))];

function relativeAsset(rel, asset) {
  const from = path.posix.dirname(rel);
  return path.posix.relative(from, asset) || path.posix.basename(asset);
}

function inject(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file) || !rel.toLowerCase().endsWith('.html')) return false;

  let html = fs.readFileSync(file, 'utf8');
  if (!/<head[\s>]/i.test(html) || !/<\/body>/i.test(html)) return false;

  const cssHref = relativeAsset(rel, 'assets/article-reader.css');
  const jsSrc = relativeAsset(rel, 'assets/article-reader.js');
  let changed = false;

  if (!/article-reader\.css/i.test(html)) {
    html = html.replace(/<\/head>/i, `<link rel="stylesheet" href="${cssHref}" data-ce-reader-asset="style"/></head>`);
    changed = true;
  }
  if (!/article-reader\.js/i.test(html)) {
    html = html.replace(/<\/body>/i, `<script defer src="${jsSrc}" data-ce-reader-asset="script"></script></body>`);
    changed = true;
  }

  if (changed) fs.writeFileSync(file, html, 'utf8');
  return changed;
}

let changed = 0;
for (const rel of paths) if (inject(rel)) changed += 1;
console.log(`Lecture vocale : ${changed} page(s) enrichie(s) sur ${paths.length} contenu(s) éditorial(aux).`);
