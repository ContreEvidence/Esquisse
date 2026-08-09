const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname,'..');
const BASE = 'https://contreevidence.github.io/Esquisse/';

function tracked(raw,source,medium='social') {
  try {
    const u = new URL(raw);
    if (!u.href.startsWith(BASE)) return raw;
    u.searchParams.set('utm_source',source);
    u.searchParams.set('utm_medium',medium);
    u.searchParams.set('utm_campaign','editorial');
    return u.toString();
  } catch { return raw; }
}

const mdPath = path.join(ROOT,'publications/a-publier.md');
if (fs.existsSync(mdPath)) {
  let md = fs.readFileSync(mdPath,'utf8');
  const sections = [
    ['Facebook — post avec lien','facebook'],
    ['YouTube — Short','youtube']
  ];
  for (const [label,source] of sections) {
    const re = new RegExp(`(### ${label.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}[\\s\\S]*?)(?=\\n### |\\n---|$)`,'g');
    md = md.replace(re, block => block.replace(/https:\/\/contreevidence\.github\.io\/Esquisse\/[^\s)]+/g, url => tracked(url,source)));
  }
  fs.writeFileSync(mdPath,md,'utf8');
}

const pkgPath = path.join(ROOT,'publications/social-package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath,'utf8'));
  const clean = pkg?.item?.link;
  if (clean) {
    pkg.trackedLinks = {
      facebook: tracked(clean,'facebook'),
      instagram: tracked(clean,'instagram'),
      tiktok: tracked(clean,'tiktok'),
      youtube: tracked(clean,'youtube')
    };
    if (pkg.facebook?.message) pkg.facebook.message = pkg.facebook.message.split(clean).join(pkg.trackedLinks.facebook);
    if (pkg.youtube?.description) pkg.youtube.description = pkg.youtube.description.split(clean).join(pkg.trackedLinks.youtube);
  }
  fs.writeFileSync(pkgPath,JSON.stringify(pkg,null,2)+'\n','utf8');
}
console.log('Attribution UTM appliquée aux liens de diffusion disponibles.');
