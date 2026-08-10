(() => {
  'use strict';

  const KEY='ce.finance.cockpit.v1';
  const euro=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
  const pct=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});

  const families=[
    {id:'liquidity',label:'Liquidité & capital garanti',keys:['cash','euroFund'],note:'Disponibilité immédiate et supports dont la fonction première est la stabilité du capital.'},
    {id:'rates',label:'Taux & crédit',keys:['bonds','privateCredit'],note:'Créances exposées au niveau des taux, à la durée, au crédit et au défaut.'},
    {id:'equities',label:'Actions cotées',keys:['equities'],note:'Capital d’entreprises coté : croissance, profits, valorisations et volatilité de marché.'},
    {id:'property',label:'Immobilier total',keys:['home','rental','commercialProperty','otherProperty','scpi','listedProperty'],note:'Usage, loyers, valeur foncière et cycle immobilier, en direct ou via des véhicules.'},
    {id:'private',label:'Capital non coté',keys:['privateEquity'],note:'Participation dans des entreprises ou fonds non cotés, avec valorisation et liquidité spécifiques.'},
    {id:'real',label:'Actifs réels hors immobilier',keys:['infrastructure','gold','commodities'],note:'Infrastructures, métaux et matières premières : moteurs économiques distincts des actions et du crédit.'},
    {id:'other',label:'Alternatifs & autres',keys:['crypto','other'],note:'Poches qui doivent rester visibles sans être assimilées automatiquement aux classes traditionnelles.'}
  ];

  const lenses=[
    {label:'Mobilisable immédiatement',keys:['cash'],note:'Liquidités & monétaire uniquement.'},
    {label:'Liquidité + fonds euros',keys:['cash','euroFund'],note:'Une lecture de la poche disponible ou stabilisée, sans présumer de votre horizon.'},
    {label:'Exposition immobilière totale',keys:['home','rental','commercialProperty','otherProperty','scpi','listedProperty'],note:'Direct + SCPI/OPCI + foncières cotées.'},
    {label:'Capital de croissance',keys:['equities','privateEquity'],note:'Actions cotées et capital non coté.'},
    {label:'Taux & crédit',keys:['bonds','privateCredit'],note:'Obligations et crédit privé.'},
    {label:'Actifs réels hors immobilier',keys:['infrastructure','gold','commodities'],note:'Infrastructures, or et matières premières.'},
    {label:'Valorisation moins continue*',keys:['home','rental','commercialProperty','otherProperty','scpi','privateCredit','privateEquity'],note:'* Indicateur structurel : la liquidité réelle dépend du véhicule, du marché et des conditions de sortie.'}
  ];

  function n(v){const x=Number(v);return Number.isFinite(x)?x:0;}
  function sum(obj,keys){return keys.reduce((total,key)=>total+n(obj?.[key]),0);}
  function money(v){return euro.format(n(v));}
  function percent(v){return `${pct.format(n(v))} %`;}
  function read(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){return {};}
  }

  function ensureShell(){
    if(document.querySelector('[data-fin-architecture-shell]'))return;
    const title=document.getElementById('lecture-title');
    const section=title?.closest('.fc-section');
    if(!section)return;
    const block=document.createElement('div');
    block.className='fc-architecture-block';
    block.dataset.finArchitectureShell='1';
    block.innerHTML=`
      <div class="fc-card fc-architecture-card">
        <div class="fc-eyebrow">Vue agrégée · sans double comptage</div>
        <h3>Architecture globale</h3>
        <p>Les classes détaillées sont regroupées en familles économiques exclusives. Cette vue totalise donc bien 100 % des actifs bruts et permet de comparer l’allocation actuelle à votre cible.</p>
        <div class="fc-architecture" data-fin-architecture></div>
      </div>
      <div class="fc-card fc-lenses-card">
        <div class="fc-eyebrow">Vue transversale · les rôles se chevauchent</div>
        <h3>Fonctions du patrimoine</h3>
        <p>Un même euro peut répondre à plusieurs questions. Ces indicateurs ne s’additionnent donc pas : ils servent à regarder la liquidité, la croissance, l’immobilier ou le non-coté sous plusieurs angles.</p>
        <div class="fc-lenses" data-fin-lenses></div>
        <div class="fc-card-note"><a href="dossiers/classes-actifs-allocation-patrimoine.html">Comprendre classes, véhicules, enveloppes et fonctions →</a></div>
      </div>`;
    section.appendChild(block);
  }

  function renderFamilies(state,gross){
    const host=document.querySelector('[data-fin-architecture]');if(!host)return;
    if(gross<=0){host.innerHTML='<div class="space-empty">Renseignez vos actifs pour construire l’architecture globale.</div>';return;}
    const assets=state.assets||{},targets=state.goals?.target||{};
    const hasTarget=Object.values(targets).some(v=>n(v)>0);
    host.innerHTML=families.map(f=>{
      const amount=sum(assets,f.keys),share=amount/gross*100,target=sum(targets,f.keys);
      return `<div class="fc-architecture-row">
        <div class="fc-architecture-copy"><strong>${f.label}</strong><span>${money(amount)}</span><small>${f.note}</small></div>
        <div class="fc-architecture-meter" aria-hidden="true"><span style="width:${Math.min(100,Math.max(0,share))}%"></span>${hasTarget&&target>0?`<em style="left:${Math.min(100,Math.max(0,target))}%"></em>`:''}</div>
        <div class="fc-architecture-numbers"><strong>${percent(share)}</strong>${hasTarget?`<small>Cible ${percent(target)}</small>`:'<small>Cible non définie</small>'}</div>
      </div>`;
    }).join('')+`<div class="fc-target-note">Chaque classe détaillée n’entre que dans une seule famille de cette vue. Le trait doré indique la cible agrégée lorsqu’elle existe.</div>`;
  }

  function renderLenses(state,gross){
    const host=document.querySelector('[data-fin-lenses]');if(!host)return;
    if(gross<=0){host.innerHTML='<div class="space-empty">Les fonctions apparaîtront lorsque des actifs auront été renseignés.</div>';return;}
    const assets=state.assets||{};
    const debt=sum(state.debts||{},['homeLoan','rentalLoan','consumer','other']);
    const items=lenses.map(l=>({label:l.label,note:l.note,amount:sum(assets,l.keys)}));
    items.push({label:'Dette / actifs bruts',note:'Levier global : ce ratio ne mesure ni la mensualité ni la soutenabilité du crédit.',amount:debt,isDebt:true});
    host.innerHTML=items.map(item=>{
      const share=item.amount/gross*100;
      return `<div class="fc-lens${item.isDebt?' debt':''}"><div><strong>${item.label}</strong><small>${item.note}</small></div><div class="fc-lens-value"><strong>${percent(share)}</strong><span>${money(item.amount)}</span></div></div>`;
    }).join('')+`<div class="fc-lens-note">Ces lentilles se chevauchent volontairement. Elles décrivent des fonctions ou contraintes différentes et ne doivent jamais être additionnées pour former une allocation.</div>`;
  }

  function render(){
    ensureShell();
    const state=read(),assets=state.assets||{};
    const allKeys=[...new Set(families.flatMap(f=>f.keys))];
    const gross=sum(assets,allKeys);
    renderFamilies(state,gross);
    renderLenses(state,gross);
  }

  function bind(){
    document.addEventListener('input',e=>{if(e.target?.matches?.('[data-fin-key]'))queueMicrotask(render);});
    document.addEventListener('change',e=>{if(e.target?.matches?.('[data-fin-key],[data-fin-import-file]'))setTimeout(render,0);});
    document.addEventListener('click',e=>{if(e.target?.closest?.('[data-fin-example],[data-fin-clear],[data-fin-import],[data-fin-snapshot]'))setTimeout(render,0);});
  }

  function run(){if(!document.body.classList.contains('finance-cockpit'))return;ensureShell();bind();render();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();