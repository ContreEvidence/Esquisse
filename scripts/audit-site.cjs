const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const BASE='https://contreevidence.github.io/Esquisse/';
const ctx={window:{}}; vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-inflation.js','assets/library-daily-money.js','assets/tools-catalog.js']){
  if(fs.existsSync(path.join(ROOT,rel))) vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),ctx,{filename:rel});
}
const editorial=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const tools=Array.isArray(ctx.window.CE_TOOLS_CATALOG)?ctx.window.CE_TOOLS_CATALOG:[];
const catalog=[...editorial,...tools];
const errors=[],warnings=[],ok=[];

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
const htmls=htmlFiles();
function targetExists(from,raw){
  if(!raw||/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(raw))return true;
  let clean=raw.split('#')[0].split('?')[0]; if(!clean)return true;
  try{clean=decodeURIComponent(clean);}catch(_){}
  if(clean.startsWith('/Esquisse/'))clean=clean.slice('/Esquisse/'.length);
  else if(clean.startsWith('/'))return true;
  const resolved=path.normalize(path.join(path.dirname(from),clean));
  const full=path.join(ROOT,resolved);
  if(fs.existsSync(full))return true;
  if(fs.existsSync(path.join(full,'index.html')))return true;
  return false;
}

const canonicals=new Map();
for(const rel of htmls){
  const html=fs.readFileSync(path.join(ROOT,rel),'utf8');
  if(!/<title>[^<]+<\/title>/i.test(html))warnings.push(`${rel}: titre manquant ou vide`);
  if(!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)&&!['404.html','merci.html'].includes(rel))warnings.push(`${rel}: meta description absente`);
  const c=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if(c){if(canonicals.has(c[1]))errors.push(`Canonical dupliqué: ${c[1]} (${canonicals.get(c[1])} et ${rel})`);else canonicals.set(c[1],rel);}
  else if(!['404.html','merci.html'].includes(rel))warnings.push(`${rel}: canonical absent`);
  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/gi)) if(!targetExists(rel,m[1])) errors.push(`${rel}: lien/ressource introuvable → ${m[1]}`);
  if(/CE_DATA_WAVE|class="source-note"/i.test(html)&&!/class="source-note"[^>]*>[\s\S]*?https?:\/\//i.test(html)&&!/<a\s+href="https?:\/\//i.test(html)) warnings.push(`${rel}: contenu chiffré sans lien de source externe détecté`);
}

const seen=new Set();
for(const item of catalog){
  if(!item?.h)continue;
  if(seen.has(item.h))warnings.push(`Catalogue: entrée dupliquée ${item.h}`); seen.add(item.h);
  if(!fs.existsSync(path.join(ROOT,item.h)))errors.push(`Catalogue: fichier absent ${item.h}`);
  if(!item.n||!item.x)warnings.push(`Catalogue: métadonnées incomplètes ${item.h}`);
}

let sitemap=''; const sitemapPath=path.join(ROOT,'sitemap.xml'); if(fs.existsSync(sitemapPath))sitemap=fs.readFileSync(sitemapPath,'utf8');
for(const item of editorial){if(item?.h&&!sitemap.includes(new URL(item.h,BASE).href))errors.push(`Sitemap: contenu éditorial absent ${item.h}`);}
if(!sitemap.includes(`${BASE}dossiers/inflation-comprendre-histoire-pouvoir-achat.html`))warnings.push('Sitemap: vérifier la présence du dossier inflation');

const privacy=fs.existsSync(path.join(ROOT,'confidentialite.html'))?fs.readFileSync(path.join(ROOT,'confidentialite.html'),'utf8'):'';
const allCode=htmls.map(rel=>fs.readFileSync(path.join(ROOT,rel),'utf8')).join('\n');
if(/Cloudflare Web Analytics/i.test(privacy)&&!/cloudflareinsights\.com|beacon\.min\.js/i.test(allCode))errors.push('Confidentialité: Cloudflare Web Analytics déclaré mais aucun script détecté');

if(!errors.length)ok.push('Aucune erreur critique détectée dans les liens, catalogues, canonicals et sitemap.');
const report=`# Audit technique automatique — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Erreurs critiques (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Contrôles validés\n${ok.length?ok.map(x=>`- ${x}`).join('\n'):'- Des erreurs critiques restent à corriger.'}\n\n## Périmètre\n- existence des fichiers du catalogue ;\n- liens et ressources locales ;\n- titres, descriptions et canonicals ;\n- doublons de canonical ;\n- présence des contenus éditoriaux dans le sitemap ;\n- cohérence de la déclaration Analytics ;\n- signalement des contenus chiffrés sans source détectable.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'editorial/audit-technique-site.md'),report,'utf8');
console.log(report);
if(errors.length&&!process.argv.includes('--report-only'))process.exit(1);
