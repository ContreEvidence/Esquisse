const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const BASE='https://contreevidence.github.io/Esquisse/';
const ctx={window:{}};vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js','assets/tools-catalog.js']){
  if(fs.existsSync(path.join(ROOT,rel)))vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),ctx,{filename:rel});
}
const editorial=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const tools=Array.isArray(ctx.window.CE_TOOLS_CATALOG)?ctx.window.CE_TOOLS_CATALOG:[];
const catalog=[...editorial,...tools];
const editorialPaths=new Set(editorial.map(x=>x.h).filter(Boolean));
const toolPaths=new Set(tools.map(x=>x.h).filter(Boolean));
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
const htmlSet=new Set(htmls);
function isTemplate(raw=''){return /\$\{|\{\{|['"]\s*\+|\+\s*['"]/.test(raw);}
function resolveLocal(from,raw){
  if(!raw||isTemplate(raw)||/^(https?:|mailto:|tel:|javascript:|data:|#)/i.test(raw))return null;
  let clean=raw.split('#')[0].split('?')[0];if(!clean)return null;
  try{clean=decodeURIComponent(clean);}catch(_){}
  if(clean.startsWith('/Esquisse/'))clean=clean.slice('/Esquisse/'.length);
  else if(clean.startsWith('/'))return null;
  return path.normalize(path.join(path.dirname(from),clean)).replace(/\\/g,'/');
}
function targetExists(from,raw){
  const rel=resolveLocal(from,raw);if(rel===null)return true;
  const full=path.join(ROOT,rel);return fs.existsSync(full)||fs.existsSync(path.join(full,'index.html'));
}
function isNoindex(html){return /<meta\s+name="robots"\s+content="[^"]*noindex/i.test(html);}
function anchorExists(targetRel,anchor){
  if(!anchor||!targetRel||!targetRel.toLowerCase().endsWith('.html')||!htmlSet.has(targetRel))return true;
  const html=fs.readFileSync(path.join(ROOT,targetRel),'utf8');
  const safe=anchor.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp(`(?:id|name)=["']${safe}["']`,'i').test(html);
}

for(const rel of htmls){
  const html=fs.readFileSync(path.join(ROOT,rel),'utf8');
  const noindex=isNoindex(html);
  const indexable=!noindex&&!['404.html','merci.html'].includes(rel);
  if(indexable&&!/<title>[^<]+<\/title>/i.test(html))errors.push(`${rel}: titre manquant ou vide`);
  if(indexable&&!/<meta\s+name="description"\s+content="[^"]+"/i.test(html))warnings.push(`${rel}: meta description absente`);
  const c=html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if(indexable&&!c)warnings.push(`${rel}: canonical absent`);
  if(editorialPaths.has(rel)){
    const expected=new URL(rel,BASE).href;
    if(!c)errors.push(`${rel}: contenu éditorial de référence sans canonical`);
    else if(c[1]!==expected)errors.push(`${rel}: canonical éditorial différent de son URL (${c[1]})`);
    for(const needed of ['og:title','og:description','og:image'])if(!html.includes(`property="${needed}"`))warnings.push(`${rel}: ${needed} absent`);
    if(!/data-ce-seo="main"/.test(html))warnings.push(`${rel}: données structurées principales absentes`);
  }
  if(toolPaths.has(rel)&&!/data-ce-seo="main"/.test(html))warnings.push(`${rel}: données structurées outil absentes`);

  for(const m of html.matchAll(/(?:href|src)="([^"]+)"/gi)){
    const raw=m[1];
    if(!targetExists(rel,raw)){
      const msg=`${rel}: lien/ressource introuvable → ${raw}`;
      (noindex?warnings:errors).push(msg);
      continue;
    }
    if(raw.includes('#')&&!raw.startsWith('#')&&!/^(https?:|mailto:|tel:|javascript:|data:)/i.test(raw)&&!isTemplate(raw)){
      const [basePart,anchor]=raw.split('#');
      const target=resolveLocal(rel,basePart||rel);
      if(target&&!anchorExists(target,anchor)){
        const msg=`${rel}: ancre introuvable → ${raw}`;
        (noindex?warnings:errors).push(msg);
      }
    }
  }
  if(editorialPaths.has(rel)&&/class="source-note"/i.test(html)&&!/class="source-note"[^>]*>[\s\S]*?<a\s+href="https?:\/\//i.test(html))warnings.push(`${rel}: bloc source sans lien externe détecté`);
}

const seen=new Set();
for(const item of catalog){
  if(!item?.h)continue;
  if(seen.has(item.h))errors.push(`Catalogue: entrée dupliquée ${item.h}`);seen.add(item.h);
  if(!fs.existsSync(path.join(ROOT,item.h)))errors.push(`Catalogue: fichier absent ${item.h}`);
  if(!item.n||!item.x)warnings.push(`Catalogue: métadonnées incomplètes ${item.h}`);
}

let sitemap='';const sitemapPath=path.join(ROOT,'sitemap.xml');if(fs.existsSync(sitemapPath))sitemap=fs.readFileSync(sitemapPath,'utf8');
for(const item of editorial)if(item?.h&&!sitemap.includes(new URL(item.h,BASE).href))errors.push(`Sitemap: contenu éditorial absent ${item.h}`);
for(const loc of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)){
  const url=loc[1];if(!url.startsWith(BASE))continue;
  const rel=decodeURIComponent(url.slice(BASE.length))||'index.html';
  if(rel&&!fs.existsSync(path.join(ROOT,rel)))errors.push(`Sitemap: URL sans fichier → ${url}`);
}

const privacy=fs.existsSync(path.join(ROOT,'confidentialite.html'))?fs.readFileSync(path.join(ROOT,'confidentialite.html'),'utf8'):'';
const codeFiles=['assets/navigation-v3.js','assets/follow.js','assets/script.js'].filter(x=>fs.existsSync(path.join(ROOT,x))).map(x=>fs.readFileSync(path.join(ROOT,x),'utf8')).join('\n');
if(/utilise\s+<strong>Cloudflare Web Analytics|utilise\s+Cloudflare Web Analytics/i.test(privacy)&&!/cloudflareinsights\.com|beacon\.min\.js/i.test(codeFiles))errors.push('Confidentialité: Analytics déclaré actif mais aucun script détecté');

if(!errors.length)ok.push('Aucune erreur critique détectée dans les liens, catalogues, canonicals de référence et sitemap.');
const report=`# Audit technique automatique — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Erreurs critiques (${errors.length})\n${errors.length?errors.map(x=>`- ${x}`).join('\n'):'- Aucune.'}\n\n## Avertissements (${warnings.length})\n${warnings.length?warnings.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Contrôles validés\n${ok.length?ok.map(x=>`- ${x}`).join('\n'):'- Des erreurs critiques restent à corriger.'}\n\n## Règles\n- les pages éditoriales du catalogue sont les références indexables ;\n- les anciennes pages en noindex peuvent conserver un canonical vers un dossier principal ;\n- les outils peuvent volontairement canoniser vers le dossier qui explique le raisonnement ;\n- les variables JavaScript ne sont pas interprétées comme des liens ;\n- un exemple chiffré illustratif n'est pas obligé d'avoir une source externe ;\n- les liens, ancres, fichiers du catalogue et URLs du sitemap sont contrôlés.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});fs.writeFileSync(path.join(ROOT,'editorial/audit-technique-site.md'),report,'utf8');
console.log(report);if(errors.length&&!process.argv.includes('--report-only'))process.exit(1);
