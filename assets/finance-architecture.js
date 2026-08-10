(() => {
  'use strict';

  const KEY='ce.finance.cockpit.v1';
  const euro=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
  const pct=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});

  const assetKeys=['home','rental','commercialProperty','otherProperty','cash','euroFund','bonds','privateCredit','equities','scpi','listedProperty','privateEquity','infrastructure','gold','commodities','crypto','other'];
  const assetLabels={
    home:'Résidence principale',rental:'Immobilier locatif résidentiel',commercialProperty:'Immobilier commercial direct',otherProperty:'Autre immobilier direct',
    cash:'Liquidités & monétaire',euroFund:'Fonds euros / capital garanti',bonds:'Obligations',privateCredit:'Crédit privé / dette non cotée',equities:'Actions & ETF actions',
    scpi:'SCPI / OPCI',listedProperty:'Foncières cotées / REIT',privateEquity:'Private equity / entreprise non cotée',infrastructure:'Infrastructures',
    gold:'Or & métaux précieux',commodities:'Matières premières',crypto:'Crypto-actifs',other:'Autres / objets de collection'
  };

  const families=[
    {id:'liquidity',label:'Liquidité & capital garanti',keys:['cash','euroFund'],note:'Disponibilité immédiate et supports dont la fonction première est la stabilité du capital.'},
    {id:'rates',label:'Taux & crédit',keys:['bonds','privateCredit'],note:'Créances exposées au niveau des taux, à la durée, au crédit et au défaut.'},
    {id:'equities',label:'Actions cotées',keys:['equities'],note:'Capital d’entreprises coté : croissance, profits, valorisations et volatilité de marché.'},
    {id:'property',label:'Immobilier total',keys:['home','rental','commercialProperty','otherProperty','scpi','listedProperty'],note:'Usage, loyers, valeur foncière et cycle immobilier, en direct ou via des véhicules.'},
    {id:'private',label:'Capital non coté',keys:['privateEquity'],note:'Participation dans des entreprises ou fonds non cotés, avec valorisation et liquidité spécifiques.'},
    {id:'real',label:'Actifs réels hors immobilier',keys:['infrastructure','gold','commodities'],note:'Infrastructures, métaux et matières premières : moteurs économiques distincts des actions et du crédit.'},
    {id:'other',label:'Alternatifs & autres',keys:['crypto','other'],note:'Poches qui doivent rester visibles sans être assimilées automatiquement aux classes traditionnelles.'}
  ];

  const arbitrageFamilies=[
    {id:'liquidity',label:'Liquidité & capital garanti',keys:['cash','euroFund']},
    {id:'rates',label:'Taux & crédit',keys:['bonds','privateCredit']},
    {id:'equities',label:'Actions cotées',keys:['equities']},
    {id:'property',label:'Immobilier hors résidence principale',keys:['rental','commercialProperty','otherProperty','scpi','listedProperty']},
    {id:'private',label:'Capital non coté',keys:['privateEquity']},
    {id:'real',label:'Actifs réels hors immobilier',keys:['infrastructure','gold','commodities']},
    {id:'other',label:'Alternatifs & autres',keys:['crypto','other']}
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
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(_){return {};}}
  function write(state){try{state.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(_){return false;}}

  function ensureGlobalLabels(){
    const title=document.getElementById('objectifs-title');
    const section=title?.closest('.fc-section');
    if(!section)return;
    const cards=[...section.querySelectorAll('.fc-card')];
    const targetCard=cards.find(card=>card.querySelector('[data-fin-key^="goals.target."]'));
    if(!targetCard)return;
    const h3=targetCard.querySelector('h3');
    if(h3)h3.textContent='Répartition cible globale';
    if(!targetCard.querySelector('[data-global-target-note]')){
      const note=document.createElement('div');
      note.className='fc-card-note';
      note.dataset.globalTargetNote='1';
      note.innerHTML='<strong>Vue globale :</strong> cette cible porte sur 100 % des actifs bruts, résidence principale comprise. Une poche à 0 % reste un choix explicite dès qu’une cible complète est renseignée. La vue d’arbitrage affichée plus bas exclut la résidence principale et possède sa propre cible.';
      targetCard.appendChild(note);
    }
  }

  function ensureShell(){
    ensureGlobalLabels();
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
        <p>Les classes détaillées sont regroupées en familles économiques exclusives. Cette vue totalise donc bien 100 % des actifs bruts, résidence principale comprise, et permet de comparer l’allocation actuelle à votre cible globale.</p>
        <div class="fc-architecture" data-fin-architecture></div>
      </div>
      <div class="fc-card fc-lenses-card">
        <div class="fc-eyebrow">Vue transversale · les rôles se chevauchent</div>
        <h3>Fonctions du patrimoine</h3>
        <p>Un même euro peut répondre à plusieurs questions. Ces indicateurs ne s’additionnent donc pas : ils servent à regarder la liquidité, la croissance, l’immobilier ou le non-coté sous plusieurs angles.</p>
        <div class="fc-lenses" data-fin-lenses></div>
        <div class="fc-card-note"><a href="dossiers/classes-actifs-allocation-patrimoine.html">Comprendre classes, véhicules, enveloppes et fonctions →</a></div>
      </div>
      <div class="fc-card fc-arbitrage-card">
        <div class="fc-eyebrow">Vue d’arbitrage · résidence principale exclue</div>
        <h3>Allocation hors résidence principale</h3>
        <p>Cette seconde lecture retire uniquement la résidence principale du dénominateur. Elle permet de fixer une cible distincte pour le patrimoine que vous pouvez envisager de réallouer à terme, sans prétendre que tous ces actifs sont liquides ou vendables immédiatement.</p>
        <div class="fc-arbitrage-summary" data-fin-arbitrage-summary></div>
        <div class="fc-arbitrage" data-fin-arbitrage></div>
        <div class="fc-lens-note"><strong>Vue d’arbitrage ≠ liquidité.</strong> Un bien locatif, une SCPI, du private equity ou certains autres actifs peuvent rester longs ou difficiles à céder. Cette vue sert à raisonner sur la structure, pas à simuler une vente instantanée.</div>
      </div>`;
    section.appendChild(block);
  }

  function renderGlobalDetailed(state,gross){
    const assets=state.assets||{},targets=state.goals?.target||{};
    const targetTotal=assetKeys.reduce((total,key)=>total+n(targets[key]),0);
    const hasTarget=targetTotal>0;
    const visible=assetKeys.filter(key=>n(assets[key])>0||n(targets[key])>0);
    const allocation=document.querySelector('[data-fin-allocation]');
    if(allocation&&gross>0){
      allocation.innerHTML=visible.map(key=>{
        const current=n(assets[key])/gross*100,target=n(targets[key]);
        return `<div class="fc-bar-row"><div class="fc-bar-label">${assetLabels[key]}</div><div class="fc-bar-track"><span style="width:${Math.min(100,Math.max(0,current))}%"></span>${hasTarget?`<em style="left:${Math.min(100,Math.max(0,target))}%" title="Objectif ${pct.format(target)} %"></em>`:''}</div><div class="fc-bar-value">${pct.format(current)} %${hasTarget?` → ${pct.format(target)} %`:''}</div></div>`;
      }).join('')+`<div class="fc-target-note">La cible globale est lue comme un ensemble : lorsqu’elle existe, une classe à 0 % est affichée comme une cible à 0 %, pas comme une donnée manquante.</div>`;
    }
    const gap=document.querySelector('[data-fin-gap]');
    if(!gap||gross<=0)return;
    const rows=visible.map(key=>{
      const current=n(assets[key])/gross*100,target=n(targets[key]);
      const diff=target-current,amount=gross*diff/100;
      return `<div class="fc-gap-row"><strong>${assetLabels[key]}</strong><span>${pct.format(current)} %</span><span>${hasTarget?`${pct.format(target)} %`:'—'}</span><span class="${diff>=0?'fc-gap-positive':'fc-gap-negative'}">${hasTarget?`${amount>=0?'+':''}${money(amount)}`:'—'}</span></div>`;
    }).join('');
    const warning=hasTarget&&Math.abs(targetTotal-100)>.1?`<div class="fc-gap-warning">Vos objectifs globaux totalisent ${percent(targetTotal)} %. Ajustez-les à 100 % pour comparer une allocation complète.</div>`:'';
    gap.innerHTML=`<div class="fc-gap-row head"><span>Classe d’actifs</span><span>Actuel</span><span>Objectif</span><span>Écart en €*</span></div>${rows}${warning}<div class="fc-target-note">* Écart théorique à patrimoine brut constant. Une cible de 0 % est un choix explicite. Ce n’est pas une recommandation de transaction.</div>`;
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
        <div class="fc-architecture-meter" aria-hidden="true"><span style="width:${Math.min(100,Math.max(0,share))}%"></span>${hasTarget?`<em style="left:${Math.min(100,Math.max(0,target))}%"></em>`:''}</div>
        <div class="fc-architecture-numbers"><strong>${percent(share)}</strong>${hasTarget?`<small>Cible ${percent(target)}</small>`:'<small>Cible non définie</small>'}</div>
      </div>`;
    }).join('')+`<div class="fc-target-note">Chaque classe détaillée n’entre que dans une seule famille de cette vue. Le trait doré indique la cible globale agrégée lorsqu’elle existe.</div>`;
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

  function renderArbitrage(state){
    const host=document.querySelector('[data-fin-arbitrage]');
    const summary=document.querySelector('[data-fin-arbitrage-summary]');
    if(!host||!summary)return;
    const assets=state.assets||{};
    const gross=sum(assets,assetKeys);
    const home=n(assets.home);
    const base=Math.max(0,gross-home);
    const targets=state.goals?.targetArbitrableFamilies||{};
    const validIds=new Set(arbitrageFamilies.map(f=>f.id));
    const hasTarget=Object.keys(targets).some(id=>validIds.has(id));
    const targetTotal=arbitrageFamilies.reduce((total,f)=>total+n(targets[f.id]),0);
    summary.innerHTML=`<div><span>Actifs bruts</span><strong>${money(gross)}</strong></div><div><span>Résidence principale exclue</span><strong>${money(home)}</strong></div><div><span>Base hors résidence principale</span><strong>${money(base)}</strong></div><div><span>Total de la cible</span><strong>${hasTarget?percent(targetTotal):'Non définie'}</strong></div>`;
    if(base<=0){host.innerHTML='<div class="space-empty">Renseignez au moins un actif hors résidence principale pour utiliser cette vue.</div>';return;}
    const rows=arbitrageFamilies.map(f=>{
      const amount=sum(assets,f.keys),share=amount/base*100;
      const defined=Object.prototype.hasOwnProperty.call(targets,f.id);
      const target=n(targets[f.id]);
      const gap=defined?base*(target-share)/100:null;
      return `<div class="fc-arbitrage-row">
        <div class="fc-arbitrage-copy"><strong>${f.label}</strong><small>${money(amount)}</small></div>
        <div class="fc-arbitrage-current"><span>Actuel</span><strong>${percent(share)}</strong></div>
        <label class="fc-arbitrage-target"><span>Cible %</span><input type="number" min="0" max="100" step="0.1" inputmode="decimal" data-fin-arbitrage-target="${f.id}" value="${defined?target:''}" placeholder="—" aria-label="Cible hors résidence principale — ${f.label}"/></label>
        <div class="fc-arbitrage-gap"><span>Écart théorique</span><strong>${gap===null?'—':`${gap>=0?'+':''}${money(gap)}`}</strong></div>
      </div>`;
    }).join('');
    const warning=hasTarget&&Math.abs(targetTotal-100)>.1?`<div class="fc-gap-warning">Votre cible hors résidence principale totalise ${percent(targetTotal)} %. Ajustez-la à 100 % pour comparer une allocation complète.</div>`:'';
    host.innerHTML=rows+warning+`<div class="fc-target-note">Les écarts sont calculés à base hors résidence principale constante. Une cible de 0 % est un choix explicite lorsqu’elle est saisie. Les écarts décrivent une direction théorique d’allocation, pas des ordres d’achat ou de vente.</div>`;
  }

  function render(){
    ensureShell();
    ensureGlobalLabels();
    const state=read(),assets=state.assets||{};
    const gross=sum(assets,assetKeys);
    renderGlobalDetailed(state,gross);
    renderFamilies(state,gross);
    renderLenses(state,gross);
    renderArbitrage(state);
  }

  function persistArbitrageTarget(el){
    const state=read();
    state.goals=state.goals||{};
    state.goals.targetArbitrableFamilies=state.goals.targetArbitrableFamilies||{};
    state.goals.targetArbitrableFamilies[el.dataset.finArbitrageTarget]=Math.min(100,Math.max(0,n(el.value)));
    write(state);
    render();
  }

  function bind(){
    document.addEventListener('input',e=>{
      if(e.target?.matches?.('[data-fin-arbitrage-target]'))return;
      if(e.target?.matches?.('[data-fin-key]'))queueMicrotask(render);
    });
    document.addEventListener('change',e=>{
      if(e.target?.matches?.('[data-fin-arbitrage-target]')){persistArbitrageTarget(e.target);return;}
      if(e.target?.matches?.('[data-fin-key],[data-fin-import-file]'))setTimeout(render,0);
    });
    document.addEventListener('click',e=>{if(e.target?.closest?.('[data-fin-example],[data-fin-clear],[data-fin-import],[data-fin-snapshot]'))setTimeout(render,0);});
  }

  function run(){if(!document.body.classList.contains('finance-cockpit'))return;ensureShell();bind();render();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();