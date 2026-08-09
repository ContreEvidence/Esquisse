const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const RSS_PATH = path.join(ROOT, 'rss.xml');
const CONFIG_PATH = path.join(ROOT, 'publications', 'social-config.json');
const STATE_PATH = path.join(ROOT, 'publications', 'social-state.json');
const PACKAGE_PATH = path.join(ROOT, 'publications', 'social-package.json');
const BASE_URL = 'https://contreevidence.github.io/Esquisse/';
const RAW_BASE = 'https://raw.githubusercontent.com/ContreEvidence/Esquisse/main/';

function decodeXml(value = '') {
  return String(value)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&euro;/g, '€').replace(/&times;/g, '×');
}

function clean(value = '') {
  return decodeXml(String(value).replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function xml(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function tag(block, name) {
  const m = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return m ? decodeXml(m[1].trim()) : '';
}

function categories(block) {
  return [...block.matchAll(/<category>([\s\S]*?)<\/category>/gi)].map(m => decodeXml(m[1].trim())).filter(Boolean);
}

function shorten(value, max) {
  const text = clean(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, '');
  return `${cut}…`;
}

function slugFromUrl(url) {
  const name = new URL(url).pathname.split('/').filter(Boolean).pop() || 'contenu';
  return name.replace(/\.html?$/i, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function pagePath(url) {
  if (!url.startsWith(BASE_URL)) return null;
  return path.join(ROOT, decodeURIComponent(url.slice(BASE_URL.length)));
}

function wrap(value, maxChars) {
  const words = clean(value).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    if (!line) line = word;
    else if (`${line} ${word}`.length <= maxChars) line += ` ${word}`;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function textLines(lines, x, y, size, step, fill = '#ffffff', weight = 800) {
  return lines.map((line, i) => `<text x="${x}" y="${y + i * step}" fill="${fill}" font-family="Arial,Helvetica,sans-serif" font-size="${size}" font-weight="${weight}">${xml(line)}</text>`).join('');
}

function slideSvg(heading, sub, index, total) {
  const titleLines = wrap(heading, 24).slice(0, 5);
  const subLines = wrap(sub, 34).slice(0, 6);
  const titleY = 520;
  const titleStep = 96;
  const subY = titleY + Math.max(1, titleLines.length) * titleStep + 80;
  return `<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="g" cx="82%" cy="16%" r="75%"><stop offset="0" stop-color="#3b3020"/><stop offset="0.48" stop-color="#14191d"/><stop offset="1" stop-color="#080a0c"/></radialGradient></defs>
  <rect width="1080" height="1920" fill="url(#g)"/>
  <circle cx="930" cy="180" r="230" fill="#d4ab56" opacity="0.10"/>
  <rect x="72" y="118" width="12" height="92" rx="6" fill="#d4ab56"/>
  <text x="112" y="160" fill="#e8c979" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="900" letter-spacing="3">CONTRE-ÉVIDENCE</text>
  <text x="112" y="205" fill="#b9c2c8" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700">PATRIMOINE · DÉCISIONS DU QUOTIDIEN</text>
  ${textLines(titleLines, 82, titleY, 78, titleStep, '#ffffff', 900)}
  ${textLines(subLines, 84, subY, 45, 62, '#d9e0e4', 650)}
  <line x1="82" y1="1690" x2="998" y2="1690" stroke="#d4ab56" stroke-width="3" opacity="0.75"/>
  <text x="82" y="1760" fill="#e8c979" font-family="Arial,Helvetica,sans-serif" font-size="30" font-weight="800">Penser mieux pour voir juste.</text>
  <text x="82" y="1810" fill="#aeb8be" font-family="Arial,Helvetica,sans-serif" font-size="24">contreevidence.github.io/Esquisse</text>
  <text x="945" y="1810" fill="#e8c979" text-anchor="end" font-family="Arial,Helvetica,sans-serif" font-size="26" font-weight="800">${index}/${total}</text>
</svg>`;
}

function specialRecurring(item) {
  const link = item.link;
  return {
    slides: [
      ['Ton cerveau t’a encore arnaqué !', '9,99 € par mois ? « C’est presque rien. »'],
      ['9,99 € / mois', '= 119,88 € par an. La mensualité cache l’échelle réelle.'],
      ['12 prélèvements anodins', '= 3 963,84 € par an dans l’exemple du dossier.'],
      ['Après l’audit', '1 037,64 € d’économies identifiées sur un an, sans tout supprimer.'],
      ['Le vrai problème ?', 'Une dépense répétée finit par ne plus être une décision.'],
      ['Reprendre le contrôle', 'Ramener chaque prélèvement à son coût annuel, puis décider : garder, renégocier ou supprimer.']
    ],
    facebook: `9,99 € par mois, ça paraît presque insignifiant.\nSur un an : près de 120 €.\n\nEt quand on additionne téléphone, streaming, cloud, banque, assurances, salle de sport, alarme… les petites lignes deviennent un vrai poste de dépenses.\n\nDans l’exemple du dossier : 3 963,84 €/an.\nAprès audit : 1 037,64 €/an d’économies identifiées.\n\nLe problème des dépenses récurrentes n’est pas qu’elles soient forcément inutiles. C’est qu’au bout d’un moment, on ne les décide plus.\n\nLire le dossier :\n${link}\n\n#ContreEvidence #FinancesPersonnelles #Budget`,
    instagram: `9,99 € par mois paraît minuscule. Sur un an, c’est près de 120 €. Et quand les prélèvements s’empilent, la facture devient beaucoup moins invisible.\n\nDans l’exemple du dossier : 3 963,84 € par an avant audit, puis 1 037,64 € d’économies identifiées sans supprimer aveuglément les protections utiles.\n\nDossier complet sur Contre-Évidence.\n\n#ContreEvidence #FinancesPersonnelles #Budget #Patrimoine`,
    tiktok: `Ton cerveau t’a encore arnaqué ! 9,99 €/mois paraît petit. 119,88 €/an l’est déjà moins. Additionne les prélèvements et regarde le coût annuel. #ContreEvidence #FinancesPersonnelles #Budget`,
    youtubeTitle: `9,99 €/mois : le piège des dépenses récurrentes #Shorts`,
    youtubeDescription: `9,99 € par mois paraît petit. Le coût annuel raconte une autre histoire.\n\nDans l’exemple du dossier Contre-Évidence : 3 963,84 € de dépenses récurrentes par an, puis 1 037,64 € d’économies identifiées après audit.\n\nLire le dossier : ${link}\n\n#ContreEvidence #FinancesPersonnelles #Budget #Shorts`
  };
}

function genericContent(item, html) {
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => clean(m[1])).filter(Boolean);
  const first = headings[0] || item.description;
  const second = headings[1] || 'Comparer les options sur la même base avant de décider.';
  const third = headings[2] || 'Le détail et les hypothèses sont dans le dossier complet.';
  const tags = ['#ContreEvidence'];
  if (item.cats.includes('Patrimoine')) tags.push('#Patrimoine');
  if (item.cats.includes('Vie professionnelle')) tags.push('#VieProfessionnelle');
  const hashtagLine = tags.join(' ');
  return {
    slides: [
      [shorten(item.title, 95), shorten(item.description, 125)],
      [shorten(first, 105), 'Commencer par le problème concret, pas par la solution toute faite.'],
      [shorten(second, 105), 'Mettre les coûts, contraintes et conséquences sur une même échelle.'],
      [shorten(third, 105), 'Le bon choix dépend des hypothèses : les rendre visibles change la décision.'],
      ['Le réflexe Contre-Évidence', 'Comparer avant de conclure. Mesurer avant d’optimiser.']
    ],
    facebook: `${item.title}\n\n${item.description}\n\nLire sur Contre-Évidence :\n${item.link}\n\n${hashtagLine}`,
    instagram: `${item.title}\n\n${item.description}\n\nDossier complet sur Contre-Évidence.\n\n${hashtagLine}`,
    tiktok: `${item.cats.includes('Patrimoine') ? 'Ton cerveau t’a encore arnaqué ! ' : ''}${shorten(item.description, 180)} ${hashtagLine}`,
    youtubeTitle: shorten(`${item.title} #Shorts`, 98),
    youtubeDescription: `${item.description}\n\nLire sur Contre-Évidence : ${item.link}\n\n${hashtagLine} #Shorts`
  };
}

async function main() {
  if (!fs.existsSync(RSS_PATH)) throw new Error('rss.xml introuvable');
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const state = fs.existsSync(STATE_PATH) ? JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) : { version: 1, lastPublicationAt: null, items: {} };
  const rss = fs.readFileSync(RSS_PATH, 'utf8');
  const blocks = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m => m[1]);
  const items = blocks.map(block => ({
    title: tag(block, 'title'), link: tag(block, 'link'), description: tag(block, 'description'),
    pubDate: tag(block, 'pubDate'), cats: categories(block)
  })).filter(x => x.title && x.link);

  const after = new Date(config.autopublishAfter || 0);
  const eligible = items.filter(x => new Date(x.pubDate || 0) >= after).sort((a, b) => new Date(a.pubDate) - new Date(b.pubDate));
  let target = null;
  if (config.preferredFirstUrl && !state.items?.[config.preferredFirstUrl]?.complete) {
    target = eligible.find(x => x.link === config.preferredFirstUrl) || null;
  }
  if (!target) target = eligible.find(x => !state.items?.[x.link]?.complete) || null;
  if (!target) {
    console.log('Aucun contenu social en attente.');
    return;
  }

  const localPath = pagePath(target.link);
  const html = localPath && fs.existsSync(localPath) ? fs.readFileSync(localPath, 'utf8') : '';
  const content = target.link.includes('depenses-recurrentes-abonnements-assurances') ? specialRecurring(target) : genericContent(target, html);
  const slug = slugFromUrl(target.link);
  const mediaDir = path.join(ROOT, 'publications', 'media', slug);
  fs.mkdirSync(mediaDir, { recursive: true });

  const total = content.slides.length;
  const framePaths = [];
  for (let i = 0; i < total; i++) {
    const frame = path.join(mediaDir, `frame-${String(i + 1).padStart(2, '0')}.jpg`);
    await sharp(Buffer.from(slideSvg(content.slides[i][0], content.slides[i][1], i + 1, total)))
      .jpeg({ quality: 91, chromaSubsampling: '4:4:4' }).toFile(frame);
    framePaths.push(frame);
  }

  const concatPath = path.join(mediaDir, 'frames.txt');
  let concat = '';
  for (const frame of framePaths) concat += `file '${frame.replace(/'/g, "'\\''")}'\nduration 3.5\n`;
  concat += `file '${framePaths[framePaths.length - 1].replace(/'/g, "'\\''")}'\n`;
  fs.writeFileSync(concatPath, concat, 'utf8');

  const videoPath = path.join(mediaDir, 'social-vertical.mp4');
  execFileSync('ffmpeg', [
    '-y', '-f', 'concat', '-safe', '0', '-i', concatPath,
    '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=48000',
    '-shortest', '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-preset', 'medium', '-crf', '21',
    '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', videoPath
  ], { stdio: 'ignore' });
  fs.unlinkSync(concatPath);

  const relVideo = path.relative(ROOT, videoPath).replace(/\\/g, '/');
  const pkg = {
    version: 1,
    generatedAt: new Date().toISOString(),
    item: { ...target, slug },
    media: {
      localVideo: relVideo,
      rawVideoUrl: `${RAW_BASE}${relVideo}`,
      frames: framePaths.map(p => path.relative(ROOT, p).replace(/\\/g, '/'))
    },
    facebook: { message: content.facebook },
    instagram: { caption: content.instagram },
    tiktok: { title: content.tiktok },
    youtube: { title: content.youtubeTitle, description: content.youtubeDescription }
  };
  fs.writeFileSync(PACKAGE_PATH, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log(`Package social généré pour : ${target.title}`);
  console.log(`Vidéo : ${relVideo}`);
}

main().catch(err => { console.error(err); process.exit(1); });
