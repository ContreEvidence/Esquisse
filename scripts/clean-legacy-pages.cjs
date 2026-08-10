const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const ctx={window:{}};vm.createContext(ctx);
for(const rel of ['assets/library-catalog.js','assets/library-daily-money.js','assets/library-work-foundations.js','assets/tools-catalog.js']){
  if(fs.existsSync(path.join(ROOT,rel)))vm.runInContext(fs.readFileSync(path.join(ROOT,rel),'utf8'),ctx,{filename:rel});
}
const editorial=Array.isArray(ctx.window.CE_LIBRARY_CATALOG)?ctx.window.CE_LIBRARY_CATALOG:[];
const keep=new Set(editorial.map(x=>x.h).filter(Boolean));

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

const replacements=[
  [/\.\.\/index\.html#articles/g,'../bibliotheque.html'],
  [/\bindex\.html#articles/g,'bibliotheque.html'],
  [/\.\.\/index\.html#methode/g,'../methode-sources.html'],
  [/\bindex\.html#methode/g,'methode-sources.html'],
  [/\.\.\/index\.html#newsletter/g,'../index.html'],
  [/\bindex\.html#newsletter/g,'index.html'],
  [/\.\.\/themes\/entreprendre\.html#offre/g,'../themes/entreprendre.html'],
  [/\.\.\/themes\/entreprendre\.html#marge/g,'../themes/entreprendre.html'],
  [/themes\/entreprendre\.html#offre/g,'themes/entreprendre.html'],
  [/themes\/entreprendre\.html#marge/g,'themes/entreprendre.html']
];

let archived=0, restored=0, repaired=0;
for(const rel of htmlFiles()){
  const file=path.join(ROOT,rel);let html=fs.readFileSync(file,'utf8');const before=html;
  for(const [re,to] of replacements)html=html.replace(re,to);
  if(html!==before)repaired++;

  const isEditorialPath=/^(articles|dossiers|fiches-metiers)\//.test(rel);
  if(isEditorialPath){
    const noindex=/<meta\s+name="robots"\s+content="noindex,follow"\s*\/?>/i;
    if(keep.has(rel)){
      if(noindex.test(html)){html=html.replace(noindex,'');restored++;}
    }else if(!noindex.test(html)){
      html=html.replace(/<head>/i,'<head><meta name="robots" content="noindex,follow"/>');
      archived++;
    }
  }
  fs.writeFileSync(file,html,'utf8');
}
console.log(`${archived} page(s) historique(s) passées en noindex,follow ; ${restored} page(s) du catalogue remises en index ; ${repaired} page(s) avec liens historiques réparés.`);
