const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');
const ROOT=path.resolve(__dirname,'..');
const DATA='assets/editorial-data.json';
const OUT='editorial/data-freshness.md';

const bindings={
  markets:['articles/choisir-etf-mondial-debutant.html','articles/investir-grosse-somme-dun-coup-ou-progressivement.html'],
  managedPortfolios:['dossiers/gestion-pilotee-comparer-performances.html','articles/frais-fiscalite-rendement-net.html'],
  savings:['articles/comparatif-produits-bancaires.html'],
  credit:['dossiers/finances-credit-endettement.html'],
  secureProducts:['articles/comparatif-produits-bancaires.html'],
  labourMarket:['articles/tester-metier-avant-investir.html','dossiers/experience-devient-risque-recruteur.html'],
  realEstate:['dossiers/finances-residence-principale.html','dossiers/finances-investissement-locatif.html'],
  tax2026:['dossiers/finances-enveloppes-fiscalite.html'],
  retirement2026:['dossiers/finances-retraite-decumulation.html'],
  transmission2026:['dossiers/finances-transmission-patrimoine.html'],
  training2026:['dossiers/formation-vaut-elle-le-cout.html'],
  wages2024:['dossiers/negocier-salaire-responsabilites.html'],
  business2026:['dossiers/tresorerie-bfr-entreprise.html'],
  insurance2025:['dossiers/assurer-ou-autoassurer-risques.html'],
  subcontracting2026:['dossiers/embaucher-ou-sous-traiter.html'],
  automationExamples:['dossiers/automatiser-ou-non-processus.html'],
  careerDecision2026:['dossiers/quitter-emploi-stable-ou-rester.html'],
  editorialExamplesWave4:['dossiers/quitter-emploi-stable-ou-rester.html','dossiers/devenir-manager-premiere-fois.html','dossiers/ameliorer-processus-sans-degrader-service.html','dossiers/decider-sans-tourner-en-rond.html']
};

const DOCUMENTATION_KEYS=new Set(['source','sources','sourceLabel','sourceNote','status','note','providerReported']);
function substantive(value){
  if(Array.isArray(value)) return value.map(substantive);
  if(!value||typeof value!=='object') return value;
  const out={};
  for(const key of Object.keys(value).sort()){
    if(DOCUMENTATION_KEYS.has(key)) continue;
    out[key]=substantive(value[key]);
  }
  return out;
}
function fingerprint(value){return JSON.stringify(substantive(value));}
function git(args){return execFileSync('git',args,{cwd:ROOT,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}
function commitTimeForFile(file){
  try{const v=git(['log','-1','--format=%ct','--',file]);return Number(v)||0;}catch{return 0;}
}
function sectionAt(commit,key){
  try{const raw=git(['show',`${commit}:${DATA}`]);const obj=JSON.parse(raw);return fingerprint(obj[key]);}catch{return null;}
}
function sectionChangeInfo(key,current){
  let commits=[];
  try{commits=git(['log','--format=%H|%ct','--',DATA]).split(/\r?\n/).filter(Boolean).map(line=>{const [hash,ts]=line.split('|');return {hash,ts:Number(ts)};});}catch{}
  if(!commits.length)return {ts:0,hash:null};
  const target=fingerprint(current);
  let oldestMatching=null;
  for(const c of commits){
    const value=sectionAt(c.hash,key);
    if(value===target){oldestMatching=c;continue;}
    if(oldestMatching)break;
  }
  // Si la valeur substantielle courante n'existe encore dans aucun commit,
  // elle a été modifiée dans le workspace : on force une revue avant publication.
  if(!oldestMatching)return {ts:Math.floor(Date.now()/1000),hash:null};
  return {ts:oldestMatching.ts,hash:oldestMatching.hash};
}
function fmt(ts){return ts?new Date(ts*1000).toISOString():'inconnue';}

const data=JSON.parse(fs.readFileSync(path.join(ROOT,DATA),'utf8'));
const issues=[],rows=[];
for(const [key,pages] of Object.entries(bindings)){
  if(!(key in data)){issues.push(`Section absente du référentiel : ${key}`);continue;}
  const change=sectionChangeInfo(key,data[key]);
  for(const page of pages){
    const full=path.join(ROOT,page);
    if(!fs.existsSync(full)){issues.push(`${key} : dossier lié absent — ${page}`);continue;}
    const pageTs=commitTimeForFile(page);
    const fresh=!change.ts||pageTs>=change.ts;
    rows.push({key,page,dataTs:change.ts,pageTs,fresh});
    if(!fresh)issues.push(`${page} n’a pas été revu depuis la dernière modification substantielle de ${key} (${fmt(change.ts)}).`);
  }
}

const structural=[];
function inspect(node,keyPath=[]){
  if(!node||typeof node!=='object'||Array.isArray(node))return;
  if(typeof node.status==='string'&&!/illustrative|user-replaceable/.test(node.status)){
    const hasSource=typeof node.source==='string'||Array.isArray(node.sources);
    if(!hasSource) structural.push(`${keyPath.join('.')} : statut ${node.status} sans source/sources au même niveau.`);
  }
  for(const [k,v] of Object.entries(node))if(v&&typeof v==='object'&&!Array.isArray(v))inspect(v,[...keyPath,k]);
}
inspect(data,[]);

const report=`# Fraîcheur du référentiel chiffré — Contre-Évidence\n\nGénéré le ${new Date().toISOString()}\n\n## Dossiers en retard sur leurs données (${issues.length})\n${issues.length?issues.map(x=>`- ${x}`).join('\n'):'- Aucun.'}\n\n## Liaisons contrôlées (${rows.length})\n${rows.map(r=>`- ${r.fresh?'✓':'✗'} **${r.key}** → \`${r.page}\` · données substantielles ${fmt(r.dataTs)} · dossier ${fmt(r.pageTs)}`).join('\n')}\n\n## Sources à revoir dans le référentiel (${structural.length})\n${structural.length?structural.map(x=>`- ${x}`).join('\n'):'- Aucun signal.'}\n\n## Principe\nUne famille de données observées ou réglementaires ne doit pas être modifiée sans que les dossiers qui l’utilisent soient revus au même moment ou après. Les changements purement documentaires de source, de libellé ou de statut ne sont pas confondus avec un changement de chiffre. Les exemples explicitement illustratifs restent séparés des données observées.\n`;
fs.mkdirSync(path.join(ROOT,'editorial'),{recursive:true});fs.writeFileSync(path.join(ROOT,OUT),report,'utf8');
console.log(report);
if(issues.length&&!process.argv.includes('--report-only'))process.exit(1);
