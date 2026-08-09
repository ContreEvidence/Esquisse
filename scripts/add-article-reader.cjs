const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

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

function removeReader(rel) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  html = html.replace(/<link\s+[^>]*href=["'][^"']*article-reader\.css[^"']*["'][^>]*>\s*/gi, '');
  html = html.replace(/<script\s+[^>]*src=["'][^"']*article-reader\.js[^"']*["'][^>]*><\/script>\s*/gi, '');

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    return true;
  }
  return false;
}

let changed = 0;
for (const rel of htmlFiles()) if (removeReader(rel)) changed += 1;
console.log(`Lecture vocale retirée de ${changed} page(s).`);
