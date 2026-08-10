const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const errors=[];
const read=rel=>fs.existsSync(path.join(ROOT,rel))?fs.readFileSync(path.join(ROOT,rel),'utf8'):'';

const contact=read('contact.html');
const privacy=read('confidentialite.html');
const mentions=read('mentions.html');
const follow=read('assets/follow.js');
const cockpit=read('mon-espace.html');
let analytics={};
try{analytics=JSON.parse(read('assets/analytics-config.json')||'{}');}catch{errors.push('Configuration analytics illisible.');}

if(/formsubmit\.co/i.test(contact)||/<form\b[^>]*id=["']contact-form/i.test(contact))errors.push('Contact: une collecte FormSubmit ou un formulaire intégré subsiste.');
if(/subscription-form|SUBSCRIBE_ENDPOINT|<input[^>]+type=["']email/i.test(follow))errors.push('Suivi: une saisie e-mail intégrée ou un endpoint de souscription directe subsiste.');
if(!/follow\.it\//i.test(follow)||!/rss-patrimoine\.xml/i.test(follow))errors.push('Suivi: le lien externe follow.it ou les flux RSS manquent.');
if(!/ne comporte plus de formulaire/i.test(privacy)||!/intérêt légitime/i.test(privacy)||!/CNIL/i.test(privacy))errors.push('Confidentialité: information minimale sur le contact éditorial ou les droits incomplète.');
if(!/article 1-1, II/i.test(mentions)||!/seule existence d’un compte GitHub/i.test(mentions))errors.push('Mentions: condition d’anonymat LCEN insuffisamment explicite.');
if(!/ne recommande pas/i.test(mentions)||!/Ligne rouge éditoriale/i.test(mentions))errors.push('Mentions: garde-fou finance/recommandations publiques absent.');
if(!/data-ce-finance-legal=["']1["']/i.test(cockpit)||!/aucun instrument financier précis/i.test(cockpit))errors.push('Cockpit: garde-fou contre la recommandation personnalisée absent.');
if(analytics.enabled!==false)errors.push('Analytics: la mesure d’audience est activée alors que le régime sans traceur optionnel est attendu.');

console.log(`# Audit garde-fous juridiques\n\nErreurs: ${errors.length}\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}`);
if(errors.length)process.exit(1);
