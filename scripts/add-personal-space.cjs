const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
new vm.Script(fs.readFileSync(path.join(ROOT,'assets/personal-space.js'),'utf8'),{filename:'assets/personal-space.js'});
function htmlFiles(dir=ROOT,prefix=''){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='node_modules'||e.name==='publications')continue;const rel=path.join(prefix,e.name),full=path.join(dir,e.name);if(e.isDirectory())out.push(...htmlFiles(full,rel));else if(e.isFile()&&e.name.toLowerCase().endsWith('.html'))out.push(rel.replace(/\\/g,'/'));}return out;}
let count=0;
for(const rel of htmlFiles()){
  const file=path.join(ROOT,rel);let html=fs.readFileSync(file,'utf8');if(!/<head[\s>]/i.test(html)||!/<\/body>/i.test(html))continue;
  const nested=/^(articles|dossiers|themes)\//.test(rel),p=nested?'../':'';
  const css=`<link rel="stylesheet" href="${p}assets/personal-space.css?v=20260810-1"/>`;
  const js=`<script src="${p}assets/personal-space.js?v=20260810-2"></script>`;
  if(/assets\/personal-space\.css(?:\?[^"']*)?/i.test(html)) html=html.replace(/<link\s+rel="stylesheet"\s+href="(?:\.\.\/)?assets\/personal-space\.css(?:\?[^"']*)?"\s*\/?>/i,css); else html=html.replace(/<\/head>/i,`${css}</head>`);
  if(/assets\/personal-space\.js(?:\?[^"']*)?/i.test(html)) html=html.replace(/<script\s+src="(?:\.\.\/)?assets\/personal-space\.js(?:\?[^"']*)?"\s*><\/script>/i,js); else html=html.replace(/<\/body>/i,`${js}</body>`);
  if(/class="ce-fallback-header"/i.test(html)&&!/<a[^>]+data-ce-space-link=/i.test(html)) html=html.replace(/(<div class="ce-fallback-header"[\s\S]*?<nav>[\s\S]*?)(<\/nav>)/i,`$1<a href="${p}mon-espace.html" data-ce-space-link="1">Mon espace</a>$2`);
  fs.writeFileSync(file,html,'utf8');count++;
}
console.log(`Mon espace intégré à ${count} pages.`);
