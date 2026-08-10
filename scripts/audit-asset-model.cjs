'use strict';

const fs=require('fs');
const path=require('path');
const ROOT=path.resolve(__dirname,'..');
const errors=[];
const warnings=[];
const read=rel=>fs.existsSync(path.join(ROOT,rel))?fs.readFileSync(path.join(ROOT,rel),'utf8'):'';

function parseKeys(code,name){
  const m=code.match(new RegExp(`const ${name}=\\[([^\\]]+)\\]`));
  if(!m)return [];
  return [...m[1].matchAll(/'([^']+)'/g)].map(x=>x[1]);
}

const cockpit=read('assets/finance-cockpit.js');
const architecture=read('assets/finance-architecture.js');
const portfolio=read('assets/portfolio-cockpit.js');
const monEspace=read('mon-espace.html');
const inheritance=read('outil-repartir-grosse-somme.html');
const cockpitKeys=parseKeys(cockpit,'assetKeys');
const architectureKeys=parseKeys(architecture,'assetKeys');
const portfolioKeys=parseKeys(portfolio,'portfolioKeys');
const directKeys=['home','rental','commercialProperty','otherProperty'];
const expectedPortfolio=cockpitKeys.filter(k=>!directKeys.includes(k));

if(!cockpitKeys.length)errors.push('finance-cockpit.js: assetKeys introuvable.');
if(!architectureKeys.length)errors.push('finance-architecture.js: assetKeys introuvable.');
if(JSON.stringify(cockpitKeys)!==JSON.stringify(architectureKeys))errors.push('Cockpit et architecture n’utilisent pas la même liste ordonnée de classes d’actifs.');
if(!portfolioKeys.length)errors.push('portfolio-cockpit.js: portfolioKeys introuvable.');
if(portfolioKeys.length&&JSON.stringify(portfolioKeys)!==JSON.stringify(expectedPortfolio))errors.push('Portefeuille détaillé: les classes suivies ne correspondent pas exactement aux classes non immobilières directes du cockpit.');

for(const key of cockpitKeys){
  if(!monEspace.includes(`data-fin-key="assets.${key}"`))errors.push(`Mon espace: champ actif manquant pour ${key}.`);
  if(!monEspace.includes(`data-fin-key="goals.target.${key}"`))warnings.push(`Mon espace: cible globale absente pour ${key}.`);
}

if(/Actions individuelles \/ concentrées/i.test(inheritance))errors.push('Outil grosse somme: les actions concentrées sont encore traitées comme une classe d’actifs distincte.');
for(const label of ['Crédit privé','Private equity','Infrastructures','Matières premières','Crypto-actifs']){
  if(!inheritance.includes(label))warnings.push(`Outil grosse somme: exposition manquante ou non nommée « ${label} ».`);
}

const report=`# Audit du modèle patrimonial — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Erreurs (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Référence actuelle\n${cockpitKeys.length?cockpitKeys.map(x=>`- ${x}`).join('\n'):'- Liste indisponible.'}\n\n## Portefeuille détaillé\n${portfolioKeys.length?portfolioKeys.map(x=>`- ${x}`).join('\n'):'- Liste indisponible.'}\n\n## Règle\nLes outils peuvent agréger certaines expositions pour simplifier une décision, mais ils ne doivent pas inventer une classe économique différente uniquement parce qu’un actif est concentré, détenu dans une enveloppe différente ou présenté sous un autre nom commercial. L’immobilier direct reste détaillé dans son module propre ; le portefeuille détaillé couvre les autres classes et remonte explicitement vers les mêmes agrégats.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-modele-patrimonial.md'),report,'utf8');
console.log(report);
if(errors.length)process.exit(1);
