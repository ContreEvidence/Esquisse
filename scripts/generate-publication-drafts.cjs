const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const RSS_PATH = path.join(ROOT, 'rss.xml');
const OUT_DIR = path.join(ROOT, 'publications');
const OUT_PATH = path.join(OUT_DIR, 'a-publier.md');
const BASE_URL = 'https://contreevidence.github.io/Esquisse/';

function decodeXml(value = '') {
  return String(value)
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function decodeHtml(value = '') {
  return String(value)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#x20ac;/gi, '€');
}

function stripHtml(value = '') {
  return cleanSpace(decodeHtml(String(value).replace(/<[^>]*>/g, ' ')));
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
  return String(value).replace(/\s+/g, ' ').trim();
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
  ['Dépenses récurrentes', '#FinancesPersonnelles'],
  ['Automobile', '#BudgetAuto'],
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

function localPathFromLink(link = '') {
  try {
    const url = new URL(link);
    const base = new URL(BASE_URL);
    if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) return '';
    return decodeURIComponent(url.pathname.slice(base.pathname.length));
  } catch (_) {
    return '';
  }
}

function extractArticleData(link) {
  const relative = localPathFromLink(link);
  if (!relative) return { headings: [], numbers: [], callout: '', hero: '' };
  const filePath = path.join(ROOT, relative);
  if (!fs.existsSync(filePath) || !filePath.endsWith('.html')) return { headings: [], numbers: [], callout: '', hero: '' };

  const html = fs.readFileSync(filePath, 'utf8');
  const headings = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map(m => stripHtml(m[1]))
    .filter(Boolean)
    .slice(0, 7);

  const numbers = [...html.matchAll(/<div[^>]*class=["'][^"']*number[^"']*["'][^>]*>[\s\S]*?<span[^>]*>([\s\S]*?)<\/span>[\s\S]*?<strong[^>]*>([\s\S]*?)<\/strong>[\s\S]*?<\/div>/gi)]
    .map(m => ({ label: stripHtml(m[1]), value: stripHtml(m[2]) }))
    .filter(x => x.label && x.value)
    .slice(0, 10);

  const calloutMatch = html.match(/<div[^>]*class=["'][^"']*callout[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const heroMatch = html.match(/<section[^>]*class=["'][^"']*hero[^"']*["'][^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);

  return {
    headings,
    numbers,
    callout: calloutMatch ? stripHtml(calloutMatch[1]) : '',
    hero: heroMatch ? stripHtml(heroMatch[1]) : ''
  };
}

function findNumber(data, labelPattern) {
  return data.numbers.find(x => labelPattern.test(x.label));
}

function genericCarousel(item, data) {
  const slides = [];
  slides.push(`SLIDE 1 — ${visualHook(item.title)}`);
  const numberSlides = data.numbers.slice(0, 3).map(x => `${x.label}\n${x.value}`);
  if (numberSlides.length) {
    numberSlides.forEach((text, i) => slides.push(`SLIDE ${i + 2} — ${text}`));
  } else {
    data.headings.slice(0, 3).forEach((text, i) => slides.push(`SLIDE ${i + 2} — ${shorten(text, 88)}`));
  }
  slides.push(`SLIDE ${slides.length + 1} — Le dossier complet est sur Contre-Évidence.`);
  return slides.join('\n\n');
}

function recurringExpensesPack(item, data, tags) {
  const before = findNumber(data, /avant audit/i);
  const saving = findNumber(data, /économie identifiée/i);
  const monthly = findNumber(data, /économie mensuelle/i);
  const threeYears = findNumber(data, /3 ans/i);
  const tags3 = tags.slice(0, 3).join(' ');
  const tags5 = tags.join(' ');

  const fb = `9,99 € par mois, ça paraît presque insignifiant.\nSur un an : près de 120 €.\n\nEt quand on additionne téléphone, streaming, cloud, banque, assurances, salle de sport, alarme… les petites lignes deviennent un vrai poste de dépenses.\n\n${before ? `Dans l’exemple du dossier : ${before.value}.\n` : ''}${saving ? `Après audit : ${saving.value} d’économies identifiées sur un an.\n` : ''}\nLe problème des dépenses récurrentes n’est pas qu’elles soient forcément inutiles. C’est qu’au bout d’un moment, on ne les décide plus.\n\nLire le dossier :\n${item.link}\n\n${tags3}`;

  const carousel = [
    'SLIDE 1 — 9,99 €/mois. Ça n’a l’air de rien.',
    'SLIDE 2 — 9,99 € × 12 = 119,88 €/an.',
    before ? `SLIDE 3 — 12 prélèvements anodins : ${before.value}.` : 'SLIDE 3 — Additionnez tous les prélèvements automatiques.',
    saving ? `SLIDE 4 — Après audit : ${saving.value} d’économies identifiées.` : 'SLIDE 4 — Cherchez : inutilisé, doublon, surdimensionné, renégociable.',
    monthly ? `SLIDE 5 — Cela représente ${monthly.value}.` : (threeYears ? `SLIDE 5 — Sur 3 ans : ${threeYears.value}.` : 'SLIDE 5 — Ramenez toujours la mensualité au coût annuel.'),
    'SLIDE 6 — Le but n’est pas de tout supprimer. Le but est de recommencer à décider.'
  ].join('\n\n');

  const igCaption = `Les prélèvements automatiques ont une drôle de propriété : au bout de quelques mois, on ne les voit plus.\n\nLes remettre en coût annuel change complètement la perception.\n\n${saving ? `Dans notre exemple, l’audit identifie ${saving.value} d’économies annuelles sans supprimer aveuglément les protections utiles.\n\n` : ''}Dossier complet sur Contre-Évidence — lien dans la bio.\n\n${tags5}`;

  const tiktok = `HOOK\n« Ton cerveau t’a encore arnaqué ! »\n\nPLAN 1\n« 9,99 € par mois ? Bof… »\nÀ l’écran : 9,99 €/mois\n\nPLAN 2\n« Ton cerveau : “C’est presque gratuit.” »\nÀ l’écran : × 12\n\nPLAN 3\n« Sauf que ça fait 119,88 € par an. »\nÀ l’écran : 119,88 €/an\n\nPLAN 4\n« Maintenant additionne téléphone, streaming, cloud, banque, salle de sport, assurances… »\n${before ? `À l’écran : ${before.value}\n` : ''}\nPLAN 5\n« Le problème ? Tu ne les achètes même plus. Ils se renouvellent tout seuls. »\n${saving ? `À l’écran : audit → ${saving.value} d’économies identifiées\n` : ''}\nCHUTE\n« Fais le total de tes prélèvements. Tu risques d’avoir une surprise. »\n\nLÉGENDE\n${tags5}`;

  const youtube = `SHORT — 35 à 45 s\n\n0–3 s — « 9,99 € par mois, presque gratuit ? »\n3–8 s — « Non : 119,88 € par an. »\n8–18 s — « Et ce n’est qu’une ligne. Téléphone, streaming, cloud, banque, salle de sport, assurances… »\n${before ? `18–25 s — « Dans notre exemple, on arrive à ${before.value}. »\n` : ''}${saving ? `25–32 s — « Un audit identifie ${saving.value} d’économies sur un an, sans couper les protections utiles. »\n` : ''}32–40 s — « Le vrai problème, c’est qu’une dépense automatique finit par ne plus être une décision. »\n\nDESCRIPTION\nLire le dossier complet : ${item.link}\n\n${tags3}`;

  return { fb, carousel, igCaption, tiktok, youtube };
}

function genericPack(item, data, tags) {
  const desc = cleanSpace(item.description);
  const hook = visualHook(item.title);
  const tags3 = tags.slice(0, 3).join(' ');
  const tags5 = tags.join(' ');
  const highlights = data.numbers.slice(0, 2).map(x => `${x.label} : ${x.value}`).join('\n');
  const fb = `${hook}\n\n${desc}${highlights ? `\n\nDeux repères du dossier :\n${highlights}` : ''}\n\nLire sur Contre-Évidence :\n${item.link}\n\n${tags3}`;
  const carousel = genericCarousel(item, data);
  const igCaption = `${hook}\n\n${shorten(desc, 320)}\n\nDossier complet sur Contre-Évidence — lien dans la bio.\n\n${tags5}`;
  const tiktok = `HOOK\n${item.cats.includes('Patrimoine') ? '« Ton cerveau t’a encore arnaqué ! »' : `« ${shorten(hook, 80)} »`}\n\nIDÉE\n${shorten(desc, 220)}\n\nDÉROULÉ\n1. Poser le problème en une situation concrète.\n2. Montrer un chiffre, une comparaison ou une conséquence du dossier.\n3. Donner le réflexe utile en une phrase.\n\nCHUTE\n« Le dossier complet est sur Contre-Évidence. »\n\n${tags5}`;
  const youtube = `SHORT — 35 à 50 s\n\nHOOK — ${hook}\n\nPROBLÈME — ${shorten(desc, 180)}\n\nDÉMONSTRATION — ${data.numbers.length ? data.numbers.slice(0, 2).map(x => `${x.label} : ${x.value}`).join(' / ') : shorten(data.headings[0] || 'Montrer l’exemple central du dossier.', 160)}\n\nCONCLUSION — Donner le réflexe ou la question de décision du dossier.\n\nDESCRIPTION\nLire sur Contre-Évidence : ${item.link}\n\n${tags3}`;
  return { fb, carousel, igCaption, tiktok, youtube };
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
md += `Le RSS sert de **déclencheur**. Le générateur lit ensuite le contenu réel de la page pour produire des formats différents selon le réseau.\n\n`;
md += `Rien n’est envoyé automatiquement aux plateformes tant qu’aucun compte de publication n’est connecté. Les sorties ci-dessous sont les fichiers maîtres à valider ou à transmettre à un outil de programmation.\n\n`;

selected.forEach((item, index) => {
  const tags = hashtags(item.cats);
  const type = item.cats[0] || 'Contenu';
  const domain = item.cats[1] || '';
  const data = extractArticleData(item.link);
  const recurring = /dépenses récurrentes|abonnements, assurances, forfaits/i.test(`${item.title} ${item.cats.join(' ')}`);
  const pack = recurring ? recurringExpensesPack(item, data, tags) : genericPack(item, data, tags);

  md += `---\n\n`;
  md += `## ${index + 1}. ${item.title}\n\n`;
  md += `**Type :** ${type}${domain ? ` · ${domain}` : ''}  \n`;
  md += `**Lien :** ${item.link}  \n`;
  if (item.pubDate) md += `**Publication du contenu :** ${item.pubDate}  \n`;
  if (data.numbers.length) md += `**Données récupérées dans la page :** ${data.numbers.slice(0, 4).map(x => `${x.label} = ${x.value}`).join(' · ')}  \n`;
  md += `\n`;

  md += `### Facebook — post avec lien\n\n\`\`\`text\n${pack.fb}\n\`\`\`\n\n`;
  md += `### Instagram — carousel\n\n\`\`\`text\n${pack.carousel}\n\`\`\`\n\n`;
  md += `### Instagram — légende\n\n\`\`\`text\n${pack.igCaption}\n\`\`\`\n\n`;
  md += `### TikTok — script vidéo\n\n\`\`\`text\n${pack.tiktok}\n\`\`\`\n\n`;
  md += `### YouTube — Short\n\n\`\`\`text\n${pack.youtube}\n\`\`\`\n\n`;
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_PATH, md, 'utf8');
console.log(`publications/a-publier.md généré avec ${selected.length} contenus et des formats sociaux différenciés.`);
