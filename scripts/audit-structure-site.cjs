'use strict';

const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const SITE_VERSION=require('./site-version.cjs');
const errors=[];
const warnings=[];
const read=rel=>fs.existsSync(path.join(ROOT,rel))?fs.readFileSync(path.join(ROOT,rel),'utf8'):'';

const ctx={window:{}};vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js','assets/tools-catalog.js']){
  if(fs.existsSync(path.join(ROOT,rel)))vm.runInContext(read(rel),ctx,{filename:rel});
}
const editorial=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const tools=Array.isArray(ctx.window.CE_TOOLS_CATALOG)?ctx.window.CE_TOOLS_CATALOG:[];
const referencePaths=new Set([...editorial,...tools].map(x=>x?.h).filter(Boolean));

function htmlFiles(dir=ROOT,prefix=''){
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    if(e.name.startsWith('.')||e.name==='node_modules'||e.name==='publications')continue;
    const rel=path.join(prefix,e.name),full=path.join(dir,e.name);
    if(e.isDirectory())out.push(...htmlFiles(full,rel));
    else if(e.isFile()&&e.name.toLowerCase().endsWith('.html'))out.push(rel.replace(/\\/g,'/'));
  }
  return out;
}

function isNoindex(html){return /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);}
function canonicalTags(html){return html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi)||[];}
function coreVersion(html,asset){
  const esc=asset.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const m=html.match(new RegExp(`assets/${esc}(?:\\?v=([^\"']+))?`, 'i'));
  return m?m[1]||'':null;
}
function mainStructuredTypes(html){
  const types=[];
  for(const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){
    const raw=match[1];
    for(const t of raw.matchAll(/["']@type["']\s*:\s*["']([^"']+)["']/g)){
      if(['Article','WebApplication'].includes(t[1]))types.push(t[1]);
    }
  }
  return types;
}

for(const rel of htmlFiles()){
  const html=read(rel);
  const indexable=!isNoindex(html)&&!['404.html','merci.html'].includes(rel);
  const canonicals=canonicalTags(html);
  if(indexable&&canonicals.length!==1)errors.push(`${rel}: ${canonicals.length} canonical(s), une seule attendue.`);
  if(/<header\s+id=["']site-header["'][^>]*>\s*<\/header>/i.test(html))errors.push(`${rel}: header principal resté vide après consolidation.`);
  if(indexable&&!/assets\/navigation-v3\.js\?v=/i.test(html))errors.push(`${rel}: navigation-v3 absente.`);
  if(indexable&&!/assets\/ux-retention\.css\?v=/i.test(html))errors.push(`${rel}: couche UX stable absente.`);

  for(const asset of ['navigation-v3.js','orientation.js','longform.js','personal-space.js','follow.js','ux-retention.css']){
    const version=coreVersion(html,asset);
    if(version!==null&&version!==SITE_VERSION)errors.push(`${rel}: ${asset} version ${version||'sans version'} au lieu de ${SITE_VERSION}.`);
  }

  if(referencePaths.has(rel)){
    if(!/data-ce-seo=["']main["']/i.test(html))warnings.push(`${rel}: données structurées principales absentes.`);
    if(!/data-ce-seo=["']breadcrumb["']/i.test(html))warnings.push(`${rel}: breadcrumb structuré absent.`);
    if(!/assets\/personal-space\.js\?v=/i.test(html))warnings.push(`${rel}: Mon espace non injecté.`);
    if(!/assets\/follow\.js\?v=/i.test(html))warnings.push(`${rel}: module Suivre non injecté.`);
    if(!/assets\/longform\.js\?v=/i.test(html))warnings.push(`${rel}: couche lecture longue non injectée.`);
    const mainTypes=mainStructuredTypes(html);
    if(mainTypes.length>1)errors.push(`${rel}: plusieurs schémas principaux Article/WebApplication détectés (${mainTypes.join(', ')}).`);
  }
}

const personal=read('assets/personal-space.js');
if(!/fiches-metiers/.test(personal))errors.push('personal-space.js: le calcul du chemin ne connaît pas fiches-metiers/.');
const longform=read('assets/longform.js');
if(!/article\.prose/.test(longform))errors.push('longform.js: les dossiers article.prose ne sont pas reconnus comme lectures longues.');
const ux=read('assets/ux-retention.css');
if(!/prefers-reduced-motion/.test(ux))errors.push('ux-retention.css: aucune adaptation prefers-reduced-motion.');
if(!/ce-flat-actions>\.ce-follow-trigger/.test(ux))warnings.push('ux-retention.css: le bouton Suivre du header n’est pas explicitement masqué sur mobile.');
const navCss=read('assets/navigation.css');
if(/\.nav-trigger\b|\.dropdown-panel\b/.test(navCss))warnings.push('navigation.css: ancien système de menus encore présent.');
const toolsCatalog=read('assets/tools-catalog.js');
if(/proposer une allocation/i.test(toolsCatalog))errors.push('tools-catalog.js: vocabulaire « proposer une allocation » encore présent.');
const inheritance=read('outil-repartir-grosse-somme.html');
if(inheritance&&!/data-ce-mobile-allocation=["']1["']/.test(inheritance))warnings.push('Outil grosse somme: adaptation mobile en cartes non injectée.');
const cockpit=read('mon-espace.html');
for(const asset of ['finance-cockpit.css','finance-cockpit.js','finance-architecture.css','finance-architecture.js','cockpit-progressive.css','cockpit-progressive.js','property-cockpit.css','property-cockpit.js','portfolio-cockpit.css','portfolio-cockpit.js']){
  const version=coreVersion(cockpit,asset);
  if(version===null)errors.push(`Mon espace: ${asset} absent.`);
  else if(version!==SITE_VERSION)errors.push(`Mon espace: ${asset} version ${version||'sans version'} au lieu de ${SITE_VERSION}.`);
}
const propertyJs=read('assets/property-cockpit.js');
try{if(propertyJs)new vm.Script(propertyJs,{filename:'assets/property-cockpit.js'});else errors.push('property-cockpit.js: module absent.');}catch(err){errors.push(`property-cockpit.js: syntaxe invalide (${err.message}).`);}
if(propertyJs&&!/data-property-report/.test(propertyJs))errors.push('property-cockpit.js: synchronisation explicite vers les totaux absente.');
if(propertyJs&&!/s\.properties=properties/.test(propertyJs))errors.push('property-cockpit.js: stockage local des biens détaillés non détecté.');
const portfolioJs=read('assets/portfolio-cockpit.js');
try{if(portfolioJs)new vm.Script(portfolioJs,{filename:'assets/portfolio-cockpit.js'});else errors.push('portfolio-cockpit.js: module absent.');}catch(err){errors.push(`portfolio-cockpit.js: syntaxe invalide (${err.message}).`);}
if(portfolioJs&&!/data-portfolio-report/.test(portfolioJs))errors.push('portfolio-cockpit.js: synchronisation explicite vers les totaux absente.');
if(portfolioJs&&!/s\.portfolioPositions=positions/.test(portfolioJs))errors.push('portfolio-cockpit.js: stockage local des lignes détaillées non détecté.');
if(portfolioJs&&/assets\.(?:home|rental|commercialProperty|otherProperty)/.test(portfolioJs))errors.push('portfolio-cockpit.js: le portefeuille financier ne doit pas modifier directement les classes immobilières directes.');

const report=`# Audit structurel et UX automatique — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\nVersion front attendue : ${SITE_VERSION}\n\n## Erreurs (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Périmètre\n- canonical unique ;\n- header réellement consolidé ;\n- versions cohérentes des couches front ;\n- schéma principal Article/WebApplication unique sur les contenus de référence ;\n- navigation, UX, lecture longue, suivi et Mon espace sur les contenus de référence ;\n- support des fiches métiers dans les chemins locaux ;\n- mouvement réduit ;\n- retrait de l’ancien système de menus ;\n- cockpit en divulgation progressive et composants patrimoniaux versionnés ensemble ;\n- détail immobilier local, calcul par bien et synchronisation explicite vers les totaux ;\n- portefeuille détaillé multi-lignes par classe, stockage local et synchronisation explicite ;\n- adaptation mobile du grand tableau d’allocation ;\n- vocabulaire non prescriptif des outils patrimoniaux.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-structure-site.md'),report,'utf8');
console.log(report);
if(errors.length)process.exit(1);
