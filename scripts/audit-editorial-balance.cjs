'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js','assets/tools-catalog.js']){
  const full=path.join(ROOT,rel);if(fs.existsSync(full))vm.runInContext(fs.readFileSync(full,'utf8'),ctx,{filename:rel});
}
const editorial=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const tools=Array.isArray(ctx.window.CE_TOOLS_CATALOG)?ctx.window.CE_TOOLS_CATALOG:[];
const domain=x=>String(x?.d||'').includes('vie-pro')?'Vie professionnelle':String(x?.d||'').includes('patrimoine')?'Patrimoine':'Autre';
const countBy=(items,get)=>items.reduce((m,x)=>{const k=get(x);m[k]=(m[k]||0)+1;return m;},{});
const domainEditorial=countBy(editorial,domain);
const domainTools=countBy(tools,domain);
const categories=countBy(editorial,x=>`${domain(x)} · ${x.c||'Sans catégorie'}`);
const warnings=[];
const totalEditorial=editorial.length||1;
for(const [d,n] of Object.entries(domainEditorial))if(d!=='Autre'&&n/totalEditorial>.65)warnings.push(`${d} représente ${(n/totalEditorial*100).toFixed(1)} % des contenus éditoriaux de référence.`);
const pTools=domainTools['Patrimoine']||0,vTools=domainTools['Vie professionnelle']||0;
if(pTools>=vTools*2&&vTools>0)warnings.push(`Les outils restent nettement plus nombreux en Patrimoine (${pTools}) qu’en Vie professionnelle (${vTools}).`);
const jobCards=editorial.filter(x=>x.c==='Fiche métier');
if(jobCards.length&&jobCards.length<8)warnings.push(`La collection Fiches métiers reste un échantillon initial (${jobCards.length} fiches) : éviter de la présenter comme représentative du marché du travail.`);

const sortedCategories=Object.entries(categories).sort((a,b)=>b[1]-a[1]);
const report=`# Audit d’équilibre éditorial — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Volumes\n- Guides et dossiers de référence : ${editorial.length}\n- Outils : ${tools.length}\n- Patrimoine — éditorial : ${domainEditorial['Patrimoine']||0}\n- Vie professionnelle — éditorial : ${domainEditorial['Vie professionnelle']||0}\n- Patrimoine — outils : ${pTools}\n- Vie professionnelle — outils : ${vTools}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun déséquilibre majeur détecté par les seuils automatiques.'}\n\n## Catégories les plus fournies\n${sortedCategories.slice(0,15).map(([k,n])=>`- ${k}: ${n}`).join('\n')}\n\n## Règles de lecture\n- un volume élevé n’est pas un défaut si la demande et la profondeur du sujet le justifient ;\n- l’audit sert à repérer une dérive, pas à imposer une symétrie artificielle ;\n- un nouveau contenu doit justifier sa valeur par rapport aux dossiers existants ;\n- les fonctions interactives ne doivent pas faire croire que le niveau « avancé » est le vrai point d’entrée du site.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-equilibre-editorial.md'),report,'utf8');
console.log(report);
