const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RSS_PATH = path.join(ROOT, 'rss.xml');
const OUT_DIR = path.join(ROOT, 'publications');
const OUT_PATH = path.join(OUT_DIR, 'a-publier.md');

function decodeXml(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function tag(block, name) {
  const match = block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'));
  return match ? decodeXml(match[1].trim()) : '';
}

function categories(block) {
  return [...block.matchAll(/<category>([\s\S]*?)<\/category>/gi)]
    .map(match => decodeXml(match[1].trim()))
    .filter(Boolean);
}

function cleanSpace(value = '') {
  return value.replace(/\s+/g, ' ').trim();
}

function shorten(value, max) {
  const text = cleanSpace(value);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1).replace(/\s+\S*$/, '');
  return `${cut}…`;
}

function slugHash(value = '') {
  return value
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .slice(0, 28);
}

const hashtagMap = new Map([
  ['Patrimoine', '#Patrimoine'],
  ['Vie professionnelle', '#VieProfessionnelle'],
  ['Immobilier', '#Immobilier'],
  ['Investissement locatif', '#Immobilier'],
  ['Résidence principale', '#Immobilier'],
  ['Crédit', '#Credit'],
  ['Crédit immobilier', '#CreditImmobilier'],
  ['Crédit & investissement', '#Investissement'],
  ['Allocation', '#Investissement'],
  ['Comparaison & capitalisation', '#Investissement'],
  ['Budget', '#FinancesPersonnelles'],
  ['Sécurité financière', '#FinancesPersonnelles'],
  ['Éducation financière', '#FinancesPersonnelles'],
  ['Entrée d’argent', '#FinancesPersonnelles'],
  ['Recherche d’emploi', '#Emploi'],
  ['Formation', '#Formation'],
  ['Reconversion', '#Reconversion'],
  ['CV & entretien', '#Emploi'],
  ['CV & candidature', '#Emploi'],
  ['Candidature', '#Emploi'],
  ['Prix & rentabilité', '#Entrepreneuriat'],
  ['Trésorerie', '#Entrepreneuriat'],
  ['Outil', '#Outils'],
  ['Guide', '#Guide'],
  ['Dossier', '#Dossier']
]);

function hashtags(cats) {
  const tags = ['#ContreEvidence'];
  for (const cat of cats) {
    const mapped = hashtagMap.get(cat);
    if (mapped && !tags.includes(mapped)) tags.push(mapped);
  }
  if (tags.length < 3) {
    const fallback = cats.find(cat => !['Guide', 'Dossier', 'Outil'].includes(cat));
    if (fallback) {
      const candidate = `#${slugHash(fallback)}`;
      if (candidate.length > 1 && !tags.includes(candidate)) tags.push(candidate);
    }
  }
  return tags.slice(0, 5);
}

function visualHook(title) {
  const clean = cleanSpace(title);
  const q = clean.match(/^(.{1,95}\?)/);
  if (q) return q[1];
  if (/^(Pourquoi|Comment|Quand|Combien|Quelle|Quel|Quels|Quelles|Faut-il|Peut-on|Vous )/i.test(clean)) {
    return shorten(clean, 95);
  }
  return shorten(clean, 82);
}

if (!fs.existsSync(RSS_PATH)) {
  console.error('rss.xml introuvable. Générer le RSS avant les publications.');
  process.exit(1);
}

const rss = fs.readFileSync(RSS_PATH, 'utf8');
const blocks = [...rss.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(match => match[1]);
const items = blocks.map(block => ({
  title: tag(block, 'title'),
  link: tag(block, 'link'),
  description: tag(block, 'description'),
  pubDate: tag(block, 'pubDate'),
  cats: categories(block)
})).filter(item => item.title && item.link);

const selected = items.slice(0, 12);
const generated = new Date().toLocaleString('fr-FR', {
  timeZone: 'Europe/Paris',
  dateStyle: 'long',
  timeStyle: 'short'
});

let md = `# Publications à préparer\n\n`;
md += `Généré automatiquement à partir du flux RSS de Contre-Évidence le ${generated}.\n\n`;
md += `Ces textes sont des **brouillons prêts à copier** : rien n’est publié automatiquement. Relire avant diffusion et adapter le visuel au réseau.\n\n`;
md += `Ordre conseillé : ne pas diffuser tous les contenus d’un coup. Choisir un sujet, publier, puis laisser respirer avant le suivant.\n\n`;

selected.forEach((item, index) => {
  const desc = cleanSpace(item.description);
  const tags = hashtags(item.cats);
  const type = item.cats[0] || 'Contenu';
  const domain = item.cats[1] || '';
  const hook = visualHook(item.title);
  const tags2 = tags.slice(0, 3).join(' ');
  const tags5 = tags.join(' ');

  const fb = `${hook}\n\n${desc}\n\nÀ lire sur Contre-Évidence :\n${item.link}\n\n${tags2}`;
  const ig = `${hook}\n\n${shorten(desc, 300)}\n\nÀ retrouver sur Contre-Évidence.\n\n${tags5}`;
  const tt = `${hook}\n\n${shorten(desc, 150)}\n\n${tags5}`;
  const yt = `${hook}\n\n${desc}\n\nLire sur Contre-Évidence : ${item.link}\n\n${tags2}`;

  md += `---\n\n`;
  md += `## ${index + 1}. ${item.title}\n\n`;
  md += `**Type :** ${type}${domain ? ` · ${domain}` : ''}  \n`;
  md += `**Lien :** ${item.link}  \n`;
  if (item.pubDate) md += `**Publication du contenu :** ${item.pubDate}  \n`;
  md += `**Accroche visuelle :** ${hook}\n\n`;

  md += `### Facebook\n\n\`\`\`text\n${fb}\n\`\`\`\n\n`;
  md += `### Instagram\n\n\`\`\`text\n${ig}\n\`\`\`\n\n`;
  md += `### TikTok\n\n\`\`\`text\n${tt}\n\`\`\`\n\n`;
  md += `### YouTube — post / description courte\n\n\`\`\`text\n${yt}\n\`\`\`\n\n`;
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, md, 'utf8');
console.log(`publications/a-publier.md généré avec ${selected.length} contenus.`);
