const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const errors=[];
const warnings=[];
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
if(!/adresse IP/i.test(privacy)||!/GitHub Pages/i.test(privacy)||!/sécurité/i.test(privacy))errors.push('Confidentialité: les journaux techniques de l’hébergeur GitHub Pages ne sont pas explicitement distingués de la mesure d’audience propre au site.');
if(!/article 1-1, II/i.test(mentions)||!/seule existence d’un compte GitHub/i.test(mentions))errors.push('Mentions: condition d’anonymat LCEN insuffisamment explicite.');
if(!/doit être vérifié/i.test(mentions))warnings.push('Mentions: le statut pratique de la formalité d’identification auprès de l’hébergeur n’est pas présenté comme restant à vérifier.');
if(!/ne recommande pas/i.test(mentions)||!/Ligne rouge éditoriale/i.test(mentions))errors.push('Mentions: garde-fou finance/recommandations publiques absent.');
if(!/data-ce-finance-legal=["']1["']/i.test(cockpit)||!/aucun instrument financier précis/i.test(cockpit))errors.push('Cockpit: garde-fou contre la recommandation personnalisée absent.');
if(analytics.enabled!==false)errors.push('Analytics: la mesure d’audience est activée alors que le régime sans traceur optionnel est attendu.');

const report=`# Audit garde-fous juridiques et collecte\n\nGénéré le ${new Date().toISOString()}\n\n## Erreurs (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Périmètre\n- pas de formulaire de contact ou d’abonnement intégré ;\n- distinction entre stockage local, mesure d’audience propre et journaux techniques de l’hébergeur ;\n- anonymat LCEN présenté comme conditionnel tant que la formalité auprès de l’hébergeur n’est pas documentée ;\n- garde-fous contre la recommandation financière personnalisée ;\n- analytics optionnel maintenu désactivé.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-juridique-collecte.md'),report,'utf8');
console.log(report);
if(errors.length)process.exit(1);
