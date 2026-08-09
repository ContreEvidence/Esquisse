const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.cwd();
const BASE = 'https://contreevidence.github.io/Esquisse/';
const OUT_MD = 'editorial/audit-complet-site-20260809.md';
const OUT_JSON = 'editorial/audit-complet-site-20260809.json';
const IGNORE_DIRS = new Set(['.git', 'node_modules']);

function walk(dir='.') {
  const out=[];
  for (const ent of fs.readdirSync(dir,{withFileTypes:true})) {
    if (IGNORE_DIRS.has(ent.name)) continue;
    const p=path.join(dir,ent.name).replace(/\\/g,'/');
    if(ent.isDirectory()) out.push(...walk(p)); else out.push(p.replace(/^\.\//,''));
  }
  return out;
}
function read(p){ return fs.readFileSync(p,'utf8'); }
function exists(p){ try{return fs.statSync(p).isFile();}catch{return false;} }
function esc(s=''){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
function attr(tag,name){ const m=tag.match(new RegExp('\\b'+esc(name)+'\\s*=\\s*["\\\']([^"\\\']*)["\\\']','i')); return m?m[1]:''; }
function first(re,s){const m=s.match(re);return m?String(m[1]||'').replace(/\s+/g,' ').trim():'';}
function textOnly(s){return s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/&amp;/g,'&').replace(/&[a-z]+;|&#\d+;/gi,' ').replace(/\s+/g,' ').trim();}
function words(s){const t=textOnly(s);return t?t.split(/\s+/).length:0;}
function normalizePath(p){ return path.posix.normalize(p).replace(/^\.\//,''); }
function resolveLocal(from, href){
  const clean=href.split('#')[0].split('?')[0];
  if(!clean) return from;
  if(clean.startsWith('/Esquisse/')) return normalizePath(clean.slice('/Esquisse/'.length));
  if(clean.startsWith('/')) return null; // autre racine
  const dir=path.posix.dirname(from);
  let p=normalizePath(path.posix.join(dir,clean));
  if(clean.endsWith('/')) p=path.posix.join(p,'index.html');
  return p;
}
function anchorOf(href){ const i=href.indexOf('#'); return i>=0?decodeURIComponent(href.slice(i+1).split('?')[0]):''; }
function hasAnchor(file,id){ if(!id) return true; if(!exists(file))return false; const s=read(file); return new RegExp('(?:id|name)\\s*=\\s*["\\\']'+esc(id)+'["\\\']','i').test(s); }
function getMeta(html,name,prop=false){
  const tags=html.match(/<meta\b[^>]*>/gi)||[];
  for(const tag of tags){ const key=attr(tag,prop?'property':'name'); if(key.toLowerCase()===name.toLowerCase()) return attr(tag,'content'); }
  return '';
}
function loadCatalog(file,varName){
  if(!exists(file)) return [];
  try{
    const context={window:{}}; vm.createContext(context); vm.runInContext(read(file),context,{timeout:1000});
    const v=context.window[varName]; return Array.isArray(v)?JSON.parse(JSON.stringify(v)):[];
  }catch(e){ return [{__error:String(e)}]; }
}

const files=walk();
const fileSet=new Set(files);
const htmlFiles=files.filter(f=>f.endsWith('.html'));
const assetFiles=files.filter(f=>/\.(css|js|png|jpe?g|webp|svg|gif|mp4|webmanifest)$/i.test(f));

const pages=[];
const broken=[];
const brokenAnchors=[];
const missingAssets=[];
const externalDomains=new Map();
const cssRefs=new Map(), jsRefs=new Map();

for(const file of htmlFiles){
  const html=read(file);
  const title=first(/<title[^>]*>([\s\S]*?)<\/title>/i,html);
  const description=getMeta(html,'description');
  const canonical=first(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i,html) || first(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i,html);
  const lang=first(/<html\b[^>]*lang=["']([^"']+)["']/i,html);
  const h1s=[...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>textOnly(m[1]));
  const imgs=html.match(/<img\b[^>]*>/gi)||[];
  const missingAlt=imgs.filter(t=>!(/\balt\s*=/.test(t))).length;
  const emptyAlt=imgs.filter(t=>/\balt\s*=\s*["']\s*["']/i.test(t)).length;
  const links=[...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]);
  const ids=new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>m[1]));
  let internalLinks=0, externalLinks=0;
  for(const u of links){
    if(!u || /^(mailto:|tel:|javascript:|data:)/i.test(u)) continue;
    if(/^https?:\/\//i.test(u)){
      if(u.startsWith(BASE)){
        internalLinks++;
        const rel=u.slice(BASE.length).split(/[?#]/)[0]||'index.html';
        const target=normalizePath(rel.endsWith('/')?rel+'index.html':rel);
        if(!fileSet.has(target)) broken.push({from:file,url:u,target});
        const a=anchorOf(u); if(a && fileSet.has(target) && !hasAnchor(target,a)) brokenAnchors.push({from:file,url:u,target,anchor:a});
      } else {
        externalLinks++;
        try{const d=new URL(u).hostname.replace(/^www\./,''); externalDomains.set(d,(externalDomains.get(d)||0)+1);}catch{}
      }
      continue;
    }
    if(u.startsWith('#')) { const a=anchorOf(u); if(a&&!ids.has(a)) brokenAnchors.push({from:file,url:u,target:file,anchor:a}); continue; }
    if(u.startsWith('//')) continue;
    internalLinks++;
    const target=resolveLocal(file,u);
    if(target && !fileSet.has(target)){
      broken.push({from:file,url:u,target});
      if(/\.(css|js|png|jpe?g|webp|svg|gif|mp4|webmanifest)$/i.test(target)) missingAssets.push({from:file,url:u,target});
    }
    const a=anchorOf(u); if(a && target && fileSet.has(target) && target.endsWith('.html') && !hasAnchor(target,a)) brokenAnchors.push({from:file,url:u,target,anchor:a});
  }
  for(const m of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)){ cssRefs.set(m[1],(cssRefs.get(m[1])||0)+1); }
  for(const m of html.matchAll(/<script\b[^>]*src=["']([^"']+)["']/gi)){ jsRefs.set(m[1],(jsRefs.get(m[1])||0)+1); }
  const extSourceLinks=[...html.matchAll(/<a\b[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>/gi)].map(m=>m[1]).filter(u=>!u.startsWith(BASE));
  pages.push({
    file,title,description,canonical,lang,h1Count:h1s.length,h1:h1s[0]||'',wordCount:words(html),imgCount:imgs.length,missingAlt,emptyAlt,
    viewport:!!getMeta(html,'viewport'),ogTitle:getMeta(html,'og:title',true),ogDescription:getMeta(html,'og:description',true),ogImage:getMeta(html,'og:image',true),
    twitterCard:getMeta(html,'twitter:card'),dateModified:getMeta(html,'dateModified'),skipLink:/class=["'][^"']*skip/.test(html),header:/id=["']site-header["']/.test(html),
    sourceNote:/source-note|source-list|Sources officielles|Sources :/i.test(html),externalSourceCount:extSourceLinks.length,
    caseStudies:(html.match(/class=["'][^"']*case-study/g)||[]).length,dataMarkers:(html.match(/CE_DATA_/g)||[]).length,internalLinks,externalLinks,
    inlineStyleBlocks:(html.match(/<style\b/gi)||[]).length,inlineStyleAttrs:(html.match(/\sstyle\s*=/gi)||[]).length,
    hasRSS:/application\/rss\+xml/i.test(html),hasFollow:/follow\.js/i.test(html),hasScriptMain:/assets\/script\.js/i.test(html),
    noindex:/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
  });
}

function duplicates(key){
  const map=new Map(); for(const p of pages){ const v=(p[key]||'').trim(); if(!v)continue; if(!map.has(v))map.set(v,[]); map.get(v).push(p.file); }
  return [...map.entries()].filter(([,a])=>a.length>1).map(([value,files])=>({value,files}));
}

let sitemap=[];
if(exists('sitemap.xml')) sitemap=[...read('sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const sitemapPaths=new Set(sitemap.map(u=>u.startsWith(BASE)?(u.slice(BASE.length)||'index.html'):u).map(p=>p.endsWith('/')?p+'index.html':p));
const sitemapMissing=sitemap.filter(u=>{ if(!u.startsWith(BASE))return false; let p=u.slice(BASE.length)||'index.html'; if(p.endsWith('/'))p+='index.html'; return !fileSet.has(p); });
const indexableHtml=pages.filter(p=>!p.noindex && !['404.html'].includes(p.file));
const htmlNotInSitemap=indexableHtml.filter(p=>!sitemapPaths.has(p.file)).map(p=>p.file);

const library=loadCatalog('assets/library-catalog.js','CE_LIBRARY_CATALOG');
const daily=loadCatalog('assets/library-daily-money.js','CE_LIBRARY_DAILY_MONEY');
const tools=loadCatalog('assets/tools-catalog.js','CE_TOOLS_CATALOG');
function catalogLinks(arr){return arr.filter(x=>x&&x.h).map(x=>x.h);}
const libraryLinks=[...catalogLinks(library),...catalogLinks(daily)];
const toolLinks=catalogLinks(tools);
const missingCatalogLinks=[...new Set([...libraryLinks,...toolLinks])].filter(p=>!fileSet.has(p));
const sitemapEditorialSet=new Set(sitemapPaths);
const catalogNotSitemap=[...new Set(libraryLinks)].filter(p=>!sitemapEditorialSet.has(p));
const sitemapContentNotCatalog=[...sitemapPaths].filter(p=>(p.startsWith('articles/')||p.startsWith('dossiers/'))&&!libraryLinks.includes(p));

const titleDup=duplicates('title'), descDup=duplicates('description'), canonicalDup=duplicates('canonical');
const missingTitle=pages.filter(p=>!p.title).map(p=>p.file);
const missingDesc=pages.filter(p=>!p.description).map(p=>p.file);
const missingCanonical=pages.filter(p=>!p.canonical).map(p=>p.file);
const badCanonical=pages.filter(p=>p.canonical && !p.canonical.startsWith(BASE)).map(p=>({file:p.file,canonical:p.canonical}));
const missingLang=pages.filter(p=>!p.lang).map(p=>p.file);
const badH1=pages.filter(p=>p.h1Count!==1).map(p=>({file:p.file,count:p.h1Count}));
const noViewport=pages.filter(p=>!p.viewport).map(p=>p.file);
const noSkip=pages.filter(p=>!p.skipLink).map(p=>p.file);
const noHeader=pages.filter(p=>!p.header).map(p=>p.file);
const pagesMissingAlt=pages.filter(p=>p.missingAlt>0).map(p=>({file:p.file,count:p.missingAlt}));
const longTitles=pages.filter(p=>p.title.length>65).map(p=>({file:p.file,n:p.title.length,title:p.title}));
const shortTitles=pages.filter(p=>p.title && p.title.length<25).map(p=>({file:p.file,n:p.title.length,title:p.title}));
const longDesc=pages.filter(p=>p.description.length>165).map(p=>({file:p.file,n:p.description.length}));
const shortDesc=pages.filter(p=>p.description && p.description.length<90).map(p=>({file:p.file,n:p.description.length}));
const noOG=pages.filter(p=>!p.ogTitle||!p.ogDescription||!p.ogImage).map(p=>p.file);
const relativeOgImages=pages.filter(p=>p.ogImage && !/^https?:\/\//i.test(p.ogImage)).map(p=>({file:p.file,ogImage:p.ogImage}));
const noRSS=pages.filter(p=>!p.hasRSS).map(p=>p.file);
const lowSourceLongPages=pages.filter(p=>p.wordCount>=900 && p.externalSourceCount===0 && (p.file.startsWith('articles/')||p.file.startsWith('dossiers/'))).map(p=>({file:p.file,words:p.wordCount}));
const thinPages=pages.filter(p=>p.wordCount<350 && !['404.html'].includes(p.file)).map(p=>({file:p.file,words:p.wordCount}));
const heavyInline=pages.filter(p=>p.inlineStyleBlocks>0||p.inlineStyleAttrs>5).map(p=>({file:p.file,styleBlocks:p.inlineStyleBlocks,styleAttrs:p.inlineStyleAttrs}));

const staticAssetVersions={
  css:[...cssRefs.entries()].sort((a,b)=>b[1]-a[1]),
  js:[...jsRefs.entries()].sort((a,b)=>b[1]-a[1])
};

let editorialData={}; try{ editorialData=JSON.parse(read('assets/editorial-data.json')); }catch{}
const dataAsOf=editorialData.lastChecked||editorialData.asOf||null;

const severity={critical:[],high:[],medium:[],low:[]};
if(broken.length) severity.critical.push(`${broken.length} référence(s) interne(s) pointent vers un fichier absent.`);
if(missingCatalogLinks.length) severity.critical.push(`${missingCatalogLinks.length} entrée(s) de catalogue pointent vers un fichier absent.`);
if(sitemapMissing.length) severity.high.push(`${sitemapMissing.length} URL(s) du sitemap ne correspondent pas à un fichier.`);
if(brokenAnchors.length) severity.high.push(`${brokenAnchors.length} ancre(s) interne(s) sont introuvables.`);
if(missingCanonical.length||badCanonical.length||canonicalDup.length) severity.high.push(`Problèmes de canonical détectés (manquants ${missingCanonical.length}, hors domaine ${badCanonical.length}, doublons ${canonicalDup.length}).`);
if(noOG.length) severity.high.push(`${noOG.length} page(s) n'ont pas un jeu Open Graph complet.`);
if(relativeOgImages.length) severity.medium.push(`${relativeOgImages.length} image(s) Open Graph utilisent une URL relative.`);
if(pagesMissingAlt.length) severity.high.push(`${pagesMissingAlt.length} page(s) contiennent des images sans attribut alt.`);
if(badH1.length) severity.high.push(`${badH1.length} page(s) n'ont pas exactement un H1.`);
if(htmlNotInSitemap.length) severity.medium.push(`${htmlNotInSitemap.length} page(s) indexables ne figurent pas dans le sitemap.`);
if(noRSS.length) severity.low.push(`${noRSS.length} page(s) ne déclarent pas le flux RSS dans leur <head>.`);
if(heavyInline.length) severity.medium.push(`${heavyInline.length} page(s) contiennent du CSS inline ou beaucoup de styles inline, source de dérive visuelle.`);
if(lowSourceLongPages.length) severity.medium.push(`${lowSourceLongPages.length} contenu(s) longs n'ont aucun lien externe source détecté.`);

function mdList(arr, fmt=x=>String(x), limit=30){ if(!arr.length)return '_Aucun._\n'; const shown=arr.slice(0,limit).map(x=>`- ${fmt(x)}`).join('\n'); return shown+(arr.length>limit?`\n- … ${arr.length-limit} autre(s)`:'')+'\n'; }
function table(headers,rows,limit=40){ if(!rows.length)return '_Aucun._\n'; const rs=rows.slice(0,limit); let s=`| ${headers.join(' | ')} |\n| ${headers.map(()=> '---').join(' | ')} |\n`; for(const r of rs)s+=`| ${r.map(v=>String(v??'').replace(/\|/g,'\\|').replace(/\n/g,' ')).join(' | ')} |\n`; if(rows.length>limit)s+=`\n_${rows.length-limit} lignes supplémentaires non affichées._\n`; return s; }

const avgWords=Math.round(pages.reduce((a,p)=>a+p.wordCount,0)/Math.max(1,pages.length));
const articlePages=pages.filter(p=>p.file.startsWith('articles/')||p.file.startsWith('dossiers/'));
const sourcedArticlePages=articlePages.filter(p=>p.externalSourceCount>0);
const numericEnriched=articlePages.filter(p=>p.dataMarkers>0||p.caseStudies>0);
const rssPages=pages.filter(p=>p.hasRSS).length;
const followPages=pages.filter(p=>p.hasFollow).length;

const report={generatedAt:new Date().toISOString(),counts:{files:files.length,html:htmlFiles.length,assets:assetFiles.length,sitemap:sitemap.length,library:library.length,daily:daily.length,tools:tools.length,articlePages:articlePages.length,sourcedArticlePages:sourcedArticlePages.length,numericEnriched:numericEnriched.length,rssPages,followPages,avgWords},severity,broken,brokenAnchors,missingCatalogLinks,sitemapMissing,htmlNotInSitemap,catalogNotSitemap,sitemapContentNotCatalog,missingTitle,missingDesc,missingCanonical,badCanonical,badH1,pagesMissingAlt,titleDup,descDup,canonicalDup,longTitles,shortTitles,longDesc,shortDesc,noOG,relativeOgImages,noRSS,lowSourceLongPages,thinPages,heavyInline,staticAssetVersions,dataAsOf};
fs.writeFileSync(OUT_JSON,JSON.stringify(report,null,2)+'\n');

let md=`# Audit complet du site Contre-Évidence — 9 août 2026\n\n`;
md+=`Audit automatique du dépôt **ContreEvidence/Esquisse**, complété par une lecture éditoriale. Le contrôle porte sur la structure statique du site ; il ne remplace pas un test Lighthouse dans un navigateur ni une vérification HTTP des liens externes.\n\n`;
md+=`## 1. Vue d’ensemble\n\n`;
md+=table(['Indicateur','Valeur'],[
 ['Fichiers du dépôt',files.length],['Pages HTML',htmlFiles.length],['Pages articles/dossiers',articlePages.length],['URLs sitemap',sitemap.length],['Entrées bibliothèque principale',library.length],['Entrées bibliothèque quotidienne',daily.length],['Outils catalogués',tools.length],['Articles/dossiers avec au moins une source externe',`${sourcedArticlePages.length}/${articlePages.length}`],['Articles/dossiers avec cas chiffré ou marqueur de données',`${numericEnriched.length}/${articlePages.length}`],['Pages déclarant le RSS',`${rssPages}/${pages.length}`],['Pages chargeant le système Suivre',`${followPages}/${pages.length}`],['Longueur moyenne brute des pages',`${avgWords} mots`],['Référentiel éditorial lastChecked/asOf',dataAsOf||'non détecté']
]);
md+=`## 2. Synthèse par gravité\n\n### Critique\n${mdList(severity.critical)}\n### Élevée\n${mdList(severity.high)}\n### Moyenne\n${mdList(severity.medium)}\n### Faible\n${mdList(severity.low)}\n`;
md+=`## 3. Intégrité des liens\n\n### Fichiers internes absents\n${table(['Depuis','Lien','Cible résolue'],broken.map(x=>[x.from,x.url,x.target]))}\n### Ancres introuvables\n${table(['Depuis','Lien','Cible','Ancre'],brokenAnchors.map(x=>[x.from,x.url,x.target,x.anchor]))}\n### Liens de catalogue absents\n${mdList(missingCatalogLinks)}\n`;
md+=`## 4. Sitemap et découvrabilité\n\n### URLs sitemap sans fichier\n${mdList(sitemapMissing)}\n### Pages indexables absentes du sitemap\n${mdList(htmlNotInSitemap)}\n### Contenus du catalogue éditorial absents du sitemap\n${mdList(catalogNotSitemap)}\n### Articles/dossiers du sitemap absents du catalogue éditorial\n${mdList(sitemapContentNotCatalog)}\n`;
md+=`## 5. SEO on-page\n\n`;
md+=`### Métadonnées manquantes\n- Titres manquants : **${missingTitle.length}**\n- Descriptions manquantes : **${missingDesc.length}**\n- Canonicals manquants : **${missingCanonical.length}**\n- Langue manquante : **${missingLang.length}**\n- Viewport manquant : **${noViewport.length}**\n\n`;
md+=`### H1 non conformes\n${table(['Page','Nombre de H1'],badH1.map(x=>[x.file,x.count]))}\n`;
md+=`### Titres longs (>65 caractères)\n${table(['Page','Longueur','Titre'],longTitles.map(x=>[x.file,x.n,x.title]))}\n`;
md+=`### Descriptions longues (>165 caractères)\n${table(['Page','Longueur'],longDesc.map(x=>[x.file,x.n]))}\n`;
md+=`### Doublons de titres\n${table(['Titre','Pages'],titleDup.map(x=>[x.value,x.files.join(', ')]))}\n`;
md+=`### Doublons de descriptions\n${table(['Description','Pages'],descDup.map(x=>[x.value,x.files.join(', ')]))}\n`;
md+=`### Open Graph incomplet\n${mdList(noOG)}\n### Images OG relatives\n${table(['Page','og:image'],relativeOgImages.map(x=>[x.file,x.ogImage]))}\n`;
md+=`## 6. Accessibilité statique\n\n- Pages sans lien d’évitement détecté : **${noSkip.length}**\n- Pages sans conteneur de navigation #site-header : **${noHeader.length}**\n- Pages avec image(s) sans alt : **${pagesMissingAlt.length}**\n\n${table(['Page','Images sans alt'],pagesMissingAlt.map(x=>[x.file,x.count]))}\n`;
md+=`## 7. Qualité éditoriale et preuves\n\n- Pages articles/dossiers : **${articlePages.length}**\n- Avec au moins un lien externe source : **${sourcedArticlePages.length}**\n- Avec cas chiffré ou marqueur CE_DATA : **${numericEnriched.length}**\n\n### Contenus longs (≥900 mots) sans source externe détectée\n${table(['Page','Mots'],lowSourceLongPages.map(x=>[x.file,x.words]))}\n### Pages minces (<350 mots)\n${table(['Page','Mots'],thinPages.map(x=>[x.file,x.words]))}\n`;
md+=`## 8. Cohérence technique et dette CSS/JS\n\n### Références CSS les plus utilisées\n${table(['Référence','Pages'],staticAssetVersions.css.slice(0,30))}\n### Références JS les plus utilisées\n${table(['Référence','Pages'],staticAssetVersions.js.slice(0,30))}\n### Pages avec CSS inline / styles inline nombreux\n${table(['Page','Blocs <style>','Attributs style'],heavyInline.map(x=>[x.file,x.styleBlocks,x.styleAttrs]))}\n`;
md+=`## 9. RSS et suivi\n\n- Déclaration RSS : **${rssPages}/${pages.length} pages**\n- Script de suivi : **${followPages}/${pages.length} pages**\n\n### Pages sans autodétection RSS\n${mdList(noRSS)}\n`;
md+=`## 10. Domaines de sources externes les plus cités\n\n${table(['Domaine','Occurrences'],[...externalDomains.entries()].sort((a,b)=>b[1]-a[1]).slice(0,30))}\n`;
md+=`## 11. Recommandations automatiques\n\n`;
md+=`1. Corriger d’abord toutes les références internes et ancres cassées.\n2. Mettre le sitemap à jour automatiquement à chaque modification d’un article/dossier, pas seulement lors de la création.\n3. Générer un jeu Open Graph complet pour chaque contenu et utiliser une URL absolue pour og:image.\n4. Uniformiser les versions de CSS/JS au lieu de multiplier les query strings différentes selon les pages.\n5. Étendre l’autodétection RSS à toutes les pages via le composant de navigation ou un gabarit commun.\n6. Continuer l’enrichissement chiffré, mais cibler en priorité les contenus longs sans source externe.\n7. Réduire progressivement le CSS inline en composants partagés pour éviter que l’identité visuelle dérive d’une page à l’autre.\n8. Conserver les outils secondaires dans les dossiers, mais rendre leur accès direct explicite dans la Bibliothèque si l’objectif est aussi l’usage récurrent.\n9. Ajouter un contrôle CI automatique de cet audit sur chaque modification de contenu importante.\n10. Compléter cet audit statique par Lighthouse mobile/desktop dès qu’un navigateur de test est disponible.\n`;
fs.writeFileSync(OUT_MD,md);
console.log(`Audit écrit dans ${OUT_MD} et ${OUT_JSON}`);
