'use strict';

const fs=require('fs');
const path=require('path');
const {spawnSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const OUT=path.join(ROOT,'editorial/site-diagnostic.md');
fs.mkdirSync(path.dirname(OUT),{recursive:true});

const stages=[
  ['Durcissement initial','node',['scripts/hardening-pass.cjs']],
  ['Nettoyage historique','node',['scripts/clean-legacy-pages.cjs']],
  ['Normalisation du référentiel','node',['scripts/normalize-editorial-data.cjs']],
  ['Consolidation SEO et sitemap','node',['scripts/consolidate-site.cjs']],
  ['Couche UX','node',['scripts/add-ux-layer.cjs']],
  ['Mon espace','node',['scripts/add-personal-space.cjs']],
  ['Durcissement post-build','node',['scripts/hardening-pass.cjs']],
  ['Syntaxe personal-space','node',['--check','assets/personal-space.js']],
  ['Syntaxe finance-cockpit','node',['--check','assets/finance-cockpit.js']],
  ['Syntaxe finance-architecture','node',['--check','assets/finance-architecture.js']],
  ['Syntaxe cockpit-progressive','node',['--check','assets/cockpit-progressive.js']],
  ['Syntaxe follow','node',['--check','assets/follow.js']],
  ['Syntaxe navigation','node',['--check','assets/navigation-v3.js']],
  ['Syntaxe longform','node',['--check','assets/longform.js']],
  ['Garde-fous juridiques','node',['scripts/audit-legal-guardrails.cjs']],
  ['Chargeur analytics','node',['scripts/add-analytics-loader.cjs']],
  ['Contenus liés','node',['scripts/add-related-content.cjs']],
  ['Index plein texte','node',['scripts/generate-search-index.cjs']],
  ['RSS','node',['scripts/generate-rss.cjs']],
  ['Fraîcheur','node',['scripts/check-editorial-data-freshness.cjs']],
  ['Audit technique report-only','node',['scripts/audit-site.cjs','--report-only']],
  ['Audit structurel','node',['scripts/audit-structure-site.cjs']],
  ['Audit modèle patrimonial','node',['scripts/audit-asset-model.cjs']],
  ['Audit équilibre','node',['scripts/audit-editorial-balance.cjs']],
  ['Audit qualité','node',['scripts/audit-editorial-quality.cjs']]
];

let report=`# Diagnostic du pipeline site\n\nExécuté le ${new Date().toISOString()}\n\n`;
let failures=0;
for(const [title,cmd,args] of stages){
  const r=spawnSync(cmd,args,{cwd:ROOT,encoding:'utf8',maxBuffer:5*1024*1024});
  const code=typeof r.status==='number'?r.status:999;
  if(code!==0)failures++;
  const output=`${r.stdout||''}${r.stderr||''}`.trim();
  const tail=output.split(/\r?\n/).slice(-100).join('\n');
  report+=`## ${title}\n\n- Code de sortie : \`${code}\`\n\n\`\`\`text\n${tail}\n\`\`\`\n\n`;
}
report+=`## Synthèse\n\n- Étapes en échec : ${failures}\n- Étapes exécutées : ${stages.length}\n`;
fs.writeFileSync(OUT,report,'utf8');
console.log(`Diagnostic terminé : ${failures} échec(s) sur ${stages.length} étapes.`);
