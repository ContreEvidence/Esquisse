const fs=require('fs');
const path=require('path');
const vm=require('vm');
const ROOT=path.resolve(__dirname,'..');
const SITE_VERSION=require('./site-version.cjs');

for(const rel of ['assets/personal-space.js','assets/finance-cockpit.js','assets/finance-architecture.js','assets/cockpit-progressive.js','assets/property-cockpit.js','assets/portfolio-cockpit.js']){
  if(fs.existsSync(path.join(ROOT,rel)))new vm.Script(fs.readFileSync(path.join(ROOT,rel),'utf8'),{filename:rel});
}

function htmlFiles(dir=ROOT,prefix=''){const out=[];for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name.startsWith('.')||e.name==='node_modules'||e.name==='publications')continue;const rel=path.join(prefix,e.name),full=path.join(dir,e.name);if(e.isDirectory())out.push(...htmlFiles(full,rel));else if(e.isFile()&&e.name.toLowerCase().endsWith('.html'))out.push(rel.replace(/\\/g,'/'));}return out;}

let count=0;
for(const rel of htmlFiles()){
  const file=path.join(ROOT,rel);let html=fs.readFileSync(file,'utf8');if(!/<head[\s>]/i.test(html)||!/<\/body>/i.test(html))continue;
  const nested=/^(articles|dossiers|themes|fiches-metiers)\//.test(rel),p=nested?'../':'';
  const css=`<link rel="stylesheet" href="${p}assets/personal-space.css?v=${SITE_VERSION}"/>`;
  const js=`<script src="${p}assets/personal-space.js?v=${SITE_VERSION}"></script>`;
  if(/assets\/personal-space\.css(?:\?[^"']*)?/i.test(html)) html=html.replace(/<link\s+rel="stylesheet"\s+href="(?:\.\.\/)?assets\/personal-space\.css(?:\?[^"']*)?"\s*\/?>/i,css); else html=html.replace(/<\/head>/i,`${css}</head>`);
  if(/assets\/personal-space\.js(?:\?[^"']*)?/i.test(html)) html=html.replace(/<script\s+src="(?:\.\.\/)?assets\/personal-space\.js(?:\?[^"']*)?"\s*><\/script>/i,js); else html=html.replace(/<\/body>/i,`${js}</body>`);
  if(/class="ce-fallback-header"/i.test(html)&&!/<a[^>]+data-ce-space-link=/i.test(html)) html=html.replace(/(<div class="ce-fallback-header"[\s\S]*?<nav>[\s\S]*?)(<\/nav>)/i,`$1<a href="${p}mon-espace.html" data-ce-space-link="1">Mon espace</a>$2`);

  if(rel==='mon-espace.html'){
    const architectureCss=`<link rel="stylesheet" href="assets/finance-architecture.css?v=${SITE_VERSION}"/>`;
    const progressiveCss=`<link rel="stylesheet" href="assets/cockpit-progressive.css?v=${SITE_VERSION}"/>`;
    const propertyCss=`<link rel="stylesheet" href="assets/property-cockpit.css?v=${SITE_VERSION}"/>`;
    const portfolioCss=`<link rel="stylesheet" href="assets/portfolio-cockpit.css?v=${SITE_VERSION}"/>`;
    const architectureJs=`<script src="assets/finance-architecture.js?v=${SITE_VERSION}"></script>`;
    const progressiveJs=`<script src="assets/cockpit-progressive.js?v=${SITE_VERSION}"></script>`;
    const propertyJs=`<script src="assets/property-cockpit.js?v=${SITE_VERSION}"></script>`;
    const portfolioJs=`<script src="assets/portfolio-cockpit.js?v=${SITE_VERSION}"></script>`;
    const guardrail='<section class="fc-section" data-ce-finance-legal="1" aria-label="Cadre du cockpit"><div class="fc-section-head"><div><div class="fc-eyebrow">Cadre d’utilisation</div><h2>Des calculs et des scénarios, pas une recommandation personnalisée.</h2><p>Le cockpit décrit votre allocation, vos flux et la sensibilité de scénarios à vos propres hypothèses. Il ne recommande aucun instrument financier précis, aucune transaction, aucun ordre d’achat ou de vente et aucune composition de portefeuille présentée comme adaptée à votre situation.</p></div></div></section>';

    html=html.replace(/<link\s+rel="stylesheet"\s+href="assets\/finance-cockpit\.css(?:\?[^"']*)?"\s*\/?>/i,`<link rel="stylesheet" href="assets/finance-cockpit.css?v=${SITE_VERSION}"/>`);
    html=html.replace(/<script\s+src="assets\/finance-cockpit\.js(?:\?[^"']*)?"\s*><\/script>/i,`<script src="assets/finance-cockpit.js?v=${SITE_VERSION}"></script>`);
    for(const asset of ['finance-architecture','cockpit-progressive','property-cockpit','portfolio-cockpit']){
      html=html.replace(new RegExp(`<link\\s+rel="stylesheet"\\s+href="assets\\/${asset}\\.css(?:\\?[^"']*)?"\\s*\\/?>`,'i'),'');
      html=html.replace(new RegExp(`<script\\s+src="assets\\/${asset}\\.js(?:\\?[^"']*)?"\\s*><\\/script>`,'i'),'');
    }
    html=html.replace(/<section\s+class="fc-section"\s+data-ce-finance-legal="1"[\s\S]*?<\/section>/i,'');
    html=html.replace(/<\/head>/i,`${architectureCss}${progressiveCss}${propertyCss}${portfolioCss}</head>`);
    html=html.replace(/<div class="fc-shell">/i,`<div class="fc-shell">${guardrail}`);
    html=html.replace(/<\/body>/i,`${architectureJs}${progressiveJs}${propertyJs}${portfolioJs}</body>`);
  }
  fs.writeFileSync(file,html,'utf8');count++;
}
console.log(`Mon espace intégré à ${count} pages ; cockpit en divulgation progressive avec détail immobilier et portefeuille, version ${SITE_VERSION}.`);
