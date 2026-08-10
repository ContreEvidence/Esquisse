'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js']){
  const full=path.join(ROOT,rel);if(fs.existsSync(full))vm.runInContext(fs.readFileSync(full,'utf8'),ctx,{filename:rel});
}
const items=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const errors=[];
const warnings=[];
const read=rel=>fs.existsSync(path.join(ROOT,rel))?fs.readFileSync(path.join(ROOT,rel),'utf8'):'';
const strip=html=>String(html).replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&[a-z0-9#]+;/gi,' ').replace(/\s+/g,' ').trim();
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const tokens=s=>new Set(norm(s).split(/\s+/).filter(x=>x.length>3&&!['avec','pour','dans','sans','avant','apres','comment','comprendre','dossier','guide'].includes(x)));
const jac=(a,b)=>{const A=tokens(a),B=tokens(b);if(!A.size||!B.size)return 0;let i=0;for(const x of A)if(B.has(x))i++;return i/(A.size+B.size-i);};

const titleSeen=new Map();
for(const item of items){
  const html=read(item.h);
  if(!html){errors.push(`${item.h}: fichier de référence absent.`);continue;}
  const title=norm(item.n);
  if(titleSeen.has(title))errors.push(`Titres éditoriaux identiques: ${item.h} et ${titleSeen.get(title)}.`);else titleSeen.set(title,item.h);
  const plain=strip(html);
  const words=plain.split(/\s+/).filter(Boolean).length;
  if(item.t==='dossier'&&words<650)warnings.push(`${item.h}: dossier court (${words} mots) — vérifier qu’il mérite un dossier autonome plutôt qu’une fusion.`);
  if(item.t==='guide'&&words<450)warnings.push(`${item.h}: guide court (${words} mots) — vérifier que la méthode est suffisamment exécutable.`);

  // On classe la sensibilité à partir du sujet visible, pas des tags techniques :
  // « crédit privé » dans un panorama d’actifs ne doit pas transformer tout le panorama en dossier juridique de crédit.
  const visibleSignals=norm(`${item.c} ${item.n}`);
  const highStakes=/fiscal|jurid|droit|succession|transmission|sante|securite au travail|credit et endettement|rembourser.*credit|capacite.*emprunt|meuble.*tourisme|courte duree|copropriete/.test(visibleSignals);
  if(highStakes){
    const sourceLinks=[...html.matchAll(/<div\s+class=["'][^"']*source-note[^"']*["'][^>]*>[\s\S]*?<a\s+[^>]*href=["']https?:\/\/[^"']+["']/gi)];
    if(!sourceLinks.length)warnings.push(`${item.h}: sujet sensible sans bloc de source externe détecté.`);
  }

  // Alerte uniquement sur une injonction financière réellement adressée au lecteur.
  const personalPrescription=/\bvous devez\b|\bvous devriez\b|\bil faut\s+(?:acheter|vendre|investir|allouer|rembourser)\b|\b(?:achetez|vendez|investissez|allouez|remboursez)\b/i.test(plain);
  const financial=/invest|placement|allocation|action|etf|immobilier|credit|patrimoine/.test(norm(`${item.c} ${item.n}`));
  if(personalPrescription&&financial)warnings.push(`${item.h}: injonction financière potentiellement personnalisante à relire.`);
}

const near=[];
for(let i=0;i<items.length;i++)for(let j=i+1;j<items.length;j++){
  const a=items[i],b=items[j];
  if(a.d!==b.d)continue;
  const score=Math.max(jac(a.n,b.n),jac(`${a.n} ${a.x}`,`${b.n} ${b.x}`));
  if(score>=0.48)near.push({a:a.h,b:b.h,score});
}
near.sort((x,y)=>y.score-x.score);

const report=`# Audit qualité éditoriale — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Erreurs (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Proximités éditoriales à revoir (${near.length})\n${near.length?near.slice(0,25).map(x=>`- ${(x.score*100).toFixed(0)} % — ${x.a} ↔ ${x.b}`).join('\n'):'- Aucune proximité forte détectée par le filtre lexical.'}\n\n## Interprétation\n- un contenu court n’est pas automatiquement faible : il déclenche une revue de fusion ;\n- un sujet sensible sans bloc de source détecté doit être contrôlé manuellement ;\n- une alerte prescriptive vise désormais les injonctions adressées au lecteur, pas chaque emploi pédagogique du verbe « devoir » ;\n- la proximité lexicale sert à repérer des doublons potentiels, pas à interdire deux angles réellement différents ;\n- l’audit ne remplace jamais la relecture du raisonnement, des calculs et des sources.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-qualite-editoriale.md'),report,'utf8');
console.log(report);
if(errors.length)process.exit(1);
