(() => {
  'use strict';

  const KEY='ce.finance.cockpit.v1';
  const VERSION=1;
  const euro=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
  const pct=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});
  const currentYear=new Date().getFullYear();

  const defaults=()=>({
    version:VERSION,
    budget:{income:0,fixed:0,variable:0,loans:0,saving:0},
    assets:{home:0,rental:0,otherProperty:0,cash:0,equities:0,bonds:0,other:0},
    debts:{homeLoan:0,rentalLoan:0,consumer:0,other:0},
    goals:{year:Math.max(2030,currentYear+5),financialTarget:0,monthlyContribution:0,returnRate:5,inflation:2,incomeShock:80,target:{home:0,rental:0,otherProperty:0,cash:0,equities:0,bonds:0,other:0}},
    snapshots:[],updatedAt:null
  });

  function merge(base,src){
    if(!src||typeof src!=='object')return base;
    for(const [k,v] of Object.entries(src)){
      if(v&&typeof v==='object'&&!Array.isArray(v)&&base[k]&&typeof base[k]==='object'&&!Array.isArray(base[k])) merge(base[k],v);
      else base[k]=v;
    }
    return base;
  }
  function read(){
    try{return merge(defaults(),JSON.parse(localStorage.getItem(KEY)||'null'));}catch(_){return defaults();}
  }
  function write(state){
    try{state.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(state));return true;}catch(_){return false;}
  }
  function n(v){const x=Number(v);return Number.isFinite(x)?x:0;}
  function get(obj,path){return path.split('.').reduce((o,k)=>o?.[k],obj);}
  function set(obj,path,value){const parts=path.split('.');let cur=obj;parts.slice(0,-1).forEach(k=>{if(!cur[k]||typeof cur[k]!=='object')cur[k]={};cur=cur[k];});cur[parts.at(-1)]=value;}
  function money(v){return euro.format(Number.isFinite(v)?v:0);}
  function percent(v){return `${pct.format(Number.isFinite(v)?v:0)} %`;}
  function sum(obj,keys){return keys.reduce((a,k)=>a+n(obj[k]),0);}

  const assetKeys=['home','rental','otherProperty','cash','equities','bonds','other'];
  const targetLabels={home:'Résidence principale',rental:'Immobilier locatif',otherProperty:'Autre immobilier',cash:'Liquidités',equities:'Actions & ETF',bonds:'Obligations',other:'Autres actifs'};

  function derive(state){
    const property=sum(state.assets,['home','rental','otherProperty']);
    const financial=sum(state.assets,['cash','equities','bonds','other']);
    const gross=property+financial;
    const debt=sum(state.debts,['homeLoan','rentalLoan','consumer','other']);
    const net=gross-debt;
    const spend=n(state.budget.fixed)+n(state.budget.variable)+n(state.budget.loans);
    const margin=n(state.budget.income)-spend;
    const afterSaving=margin-n(state.budget.saving);
    const reserveMonths=spend>0?n(state.assets.cash)/spend:0;
    const savingRate=n(state.budget.income)>0?n(state.budget.saving)/n(state.budget.income)*100:0;
    const propertyShare=gross>0?property/gross*100:0;
    const cashShare=gross>0?n(state.assets.cash)/gross*100:0;
    const debtShare=gross>0?debt/gross*100:0;
    const targetTotal=assetKeys.reduce((a,k)=>a+n(state.goals.target[k]),0);
    return{property,financial,gross,debt,net,spend,margin,afterSaving,reserveMonths,savingRate,propertyShare,cashShare,debtShare,targetTotal};
  }

  function fv(initial,monthly,annualPct,months){
    const annual=n(annualPct)/100;
    if(annual<=-1)return NaN;
    const r=Math.pow(1+annual,1/12)-1;
    if(Math.abs(r)<1e-10)return initial+monthly*months;
    const f=Math.pow(1+r,months);
    return initial*f+monthly*(f-1)/r;
  }
  function requiredMonthly(initial,target,annualPct,months){
    if(target<=0||months<=0)return 0;
    const annual=n(annualPct)/100;if(annual<=-1)return NaN;
    const r=Math.pow(1+annual,1/12)-1;
    if(Math.abs(r)<1e-10)return Math.max(0,(target-initial)/months);
    const f=Math.pow(1+r,months),annuity=(f-1)/r;
    return Math.max(0,(target-initial*f)/annuity);
  }

  function bindFields(){
    const state=read();
    document.querySelectorAll('[data-fin-key]').forEach(el=>{
      const value=get(state,el.dataset.finKey);
      if(value!==undefined&&value!==null)el.value=value;
      el.addEventListener('input',()=>{
        const s=read();set(s,el.dataset.finKey,el.type==='number'?n(el.value):el.value);write(s);render(s);flashSaved();
      });
      el.addEventListener('change',()=>{
        const s=read();set(s,el.dataset.finKey,el.type==='number'?n(el.value):el.value);write(s);render(s);flashSaved();
      });
    });
  }

  function flashSaved(){
    const el=document.querySelector('[data-fin-save-state]');if(!el)return;
    el.textContent='Enregistré sur cet appareil';clearTimeout(el._t);el._t=setTimeout(()=>el.textContent='Enregistrement automatique',1600);
  }

  function renderKpis(state,d){
    const vals={net:money(d.net),gross:money(d.gross),financial:money(d.financial),margin:money(d.margin),reserve:d.spend>0?`${pct.format(d.reserveMonths)} mois`:'—'};
    Object.entries(vals).forEach(([k,v])=>{const el=document.querySelector(`[data-fin-kpi="${k}"]`);if(el)el.textContent=v;});
    const notes={net:d.debt?`${money(d.debt)} de dettes déduites`:'Actifs moins dettes',gross:`Immobilier ${percent(d.propertyShare)} des actifs`,financial:`Liquidités + placements financiers`,margin:`Avant épargne programmée : ${money(d.afterSaving)} après épargne`,reserve:d.spend>0?`Sur la base des dépenses mensuelles saisies`:'Renseignez vos dépenses mensuelles'};
    Object.entries(notes).forEach(([k,v])=>{const el=document.querySelector(`[data-fin-kpi-note="${k}"]`);if(el)el.textContent=v;});
  }

  function renderBars(state,d){
    const host=document.querySelector('[data-fin-allocation]');if(!host)return;
    if(d.gross<=0){host.innerHTML='<div class="space-empty">Renseignez vos actifs pour voir la répartition de votre patrimoine.</div>';return;}
    host.innerHTML=assetKeys.map(k=>{
      const current=n(state.assets[k])/d.gross*100,target=n(state.goals.target[k]);
      return `<div class="fc-bar-row"><div class="fc-bar-label">${targetLabels[k]}</div><div class="fc-bar-track"><span style="width:${Math.min(100,Math.max(0,current))}%"></span>${target>0?`<em style="left:${Math.min(100,Math.max(0,target))}%" title="Objectif ${pct.format(target)} %"></em>`:''}</div><div class="fc-bar-value">${pct.format(current)} %${target>0?` → ${pct.format(target)} %`:''}</div></div>`;
    }).join('')+`<div class="fc-target-note">Le trait doré représente votre objectif lorsqu’il est renseigné. Aucun objectif d’allocation n’est imposé par le site.</div>`;
  }

  function renderObservations(state,d){
    const host=document.querySelector('[data-fin-observations]');if(!host)return;
    if(d.gross<=0&&n(state.budget.income)<=0){host.innerHTML='<div class="space-empty"><strong>Commencez par votre situation réelle.</strong><br>Quelques montants suffisent pour que les premiers indicateurs deviennent utiles.</div>';return;}
    const obs=[];
    if(d.spend>0)obs.push(`<div class="fc-observation"><strong>Réserve liquide : ${pct.format(d.reserveMonths)} mois de dépenses</strong><p>Ce chiffre mesure seulement la durée théorique couverte par les liquidités saisies. La bonne réserve dépend de la stabilité des revenus, des projets et des risques à absorber.</p><a href="dossiers/liquidites-reserve-securite.html">Comprendre la réserve de sécurité →</a></div>`);
    if(d.gross>0)obs.push(`<div class="fc-observation"><strong>Immobilier : ${pct.format(d.propertyShare)} % des actifs bruts</strong><p>Plus cette part est élevée, plus l’évolution du patrimoine dépend d’une même classe d’actifs et d’un marché local.</p><a href="dossiers/finances-immobilier-patrimoine.html">Lire le dossier concentration immobilière →</a></div>`);
    if(d.debt>0)obs.push(`<div class="fc-observation"><strong>Dette : ${pct.format(d.debtShare)} % des actifs bruts</strong><p>Le ratio ne dit pas à lui seul si la dette est soutenable : durée, taux, mensualités, revenus et liquidité comptent aussi.</p><a href="dossiers/finances-credit-endettement.html">Analyser l’endettement →</a></div>`);
    if(n(state.budget.income)>0)obs.push(`<div class="fc-observation"><strong>Épargne programmée : ${pct.format(d.savingRate)} % du revenu</strong><p>Après dépenses et épargne saisies, la marge mensuelle restante ressort à ${money(d.afterSaving)}.</p><a href="dossiers/audit-budget-60-minutes.html">Auditer les flux →</a></div>`);
    host.innerHTML=obs.slice(0,4).join('');
  }

  function renderProjection(state,d){
    const host=document.querySelector('[data-fin-projection]');if(!host)return;
    const years=Math.max(0,n(state.goals.year)-currentYear),months=Math.round(years*12);
    const contribution=n(state.goals.monthlyContribution)||n(state.budget.saving);
    const projected=fv(d.financial,contribution,n(state.goals.returnRate),months);
    const real=projected/Math.pow(1+n(state.goals.inflation)/100,years||0);
    const target=n(state.goals.financialTarget);
    const req=requiredMonthly(d.financial,target,n(state.goals.returnRate),months);
    const gap=target>0?projected-target:0;
    host.innerHTML=`<div class="fc-scenario-output"><div class="fc-output"><span>Capital financier projeté</span><strong>${money(projected)}</strong><small>${years} an(s), ${pct.format(n(state.goals.returnRate))} %/an</small></div><div class="fc-output"><span>Valeur en euros d’aujourd’hui</span><strong>${money(real)}</strong><small>Avec ${pct.format(n(state.goals.inflation))} % d’inflation</small></div><div class="fc-output"><span>Versement mensuel utilisé</span><strong>${money(contribution)}</strong><small>Objectif ou épargne programmée</small></div><div class="fc-output"><span>${target>0?'Écart à l’objectif':'Versement requis'}</span><strong>${target>0?(gap>=0?`+${money(gap)}`:money(gap)):'—'}</strong><small>${target>0?`Pour ${money(target)} en ${state.goals.year} · requis ≈ ${money(req)}/mois`:'Renseignez un capital cible pour calculer l’effort requis'}</small></div></div>`;
  }

  function renderStress(state,d){
    const host=document.querySelector('[data-fin-stress]');if(!host)return;
    const shock=Math.max(0,n(state.goals.incomeShock));
    const shocked=n(state.budget.income)*shock/100;
    const margin=shocked-d.spend;
    const runway=margin<0&&n(state.assets.cash)>0?n(state.assets.cash)/Math.abs(margin):Infinity;
    host.innerHTML=`<div class="fc-scenario-output"><div class="fc-output"><span>Revenu simulé</span><strong>${money(shocked)}</strong><small>${pct.format(shock)} du revenu actuel</small></div><div class="fc-output"><span>Marge après dépenses</span><strong>${money(margin)}</strong><small>Dépenses saisies : ${money(d.spend)}/mois</small></div><div class="fc-output"><span>Durée de la réserve</span><strong>${Number.isFinite(runway)?`${pct.format(runway)} mois`:'Pas de ponction'}</strong><small>${margin<0?'Si le déficit mensuel reste identique':'Le revenu simulé couvre les dépenses saisies'}</small></div><div class="fc-output"><span>Épargne programmée</span><strong>${money(n(state.budget.saving))}</strong><small>${margin>=n(state.budget.saving)?'Compatible avec ce scénario':'À réexaminer dans ce scénario'}</small></div></div>`;
  }

  function renderGap(state,d){
    const host=document.querySelector('[data-fin-gap]');if(!host)return;
    if(d.gross<=0){host.innerHTML='<div class="space-empty">Renseignez d’abord vos actifs.</div>';return;}
    const rows=assetKeys.map(k=>{
      const cur=n(state.assets[k])/d.gross*100,t=n(state.goals.target[k]),pp=t-cur,amount=d.gross*pp/100;
      return `<div class="fc-gap-row"><strong>${targetLabels[k]}</strong><span>${pct.format(cur)} %</span><span>${t?`${pct.format(t)} %`:'—'}</span><span class="${pp>=0?'fc-gap-positive':'fc-gap-negative'}">${t?(amount>=0?'+':'')+money(amount):'—'}</span></div>`;
    }).join('');
    const warning=Math.abs(d.targetTotal-100)>.1&&d.targetTotal>0?`<div class="fc-gap-warning">Vos objectifs totalisent ${pct.format(d.targetTotal)} %. Ajustez-les à 100 % si vous voulez comparer une allocation complète.</div>`:'';
    host.innerHTML=`<div class="fc-gap-row head"><span>Classe d’actifs</span><span>Actuel</span><span>Objectif</span><span>Écart en €*</span></div>${rows}${warning}<div class="fc-target-note">* Écart théorique à patrimoine brut constant. Ce n’est pas une recommandation de transaction.</div>`;
  }

  function snapshotData(state,d){return{date:new Date().toISOString().slice(0,10),net:d.net,gross:d.gross,debt:d.debt,property:d.property,cash:n(state.assets.cash),equities:n(state.assets.equities),bonds:n(state.assets.bonds),financial:d.financial};}
  function saveSnapshot(){const s=read(),d=derive(s),shot=snapshotData(s,d);s.snapshots=(s.snapshots||[]).filter(x=>x.date!==shot.date);s.snapshots.push(shot);s.snapshots.sort((a,b)=>a.date.localeCompare(b.date));write(s);render(s);flashSaved();}

  function chartSvg(items){
    if(items.length<2)return '<div class="fc-chart-empty">Enregistrez au moins deux photographies pour visualiser l’évolution.</div>';
    const w=720,h=220,pad=28,vals=items.map(x=>n(x.net)),min=Math.min(...vals),max=Math.max(...vals),span=Math.max(max-min,1),lo=min-span*.12,hi=max+span*.12;
    const x=i=>pad+i*(w-pad*2)/(items.length-1),y=v=>h-pad-(v-lo)*(h-pad*2)/(hi-lo);
    const pts=items.map((it,i)=>`${x(i).toFixed(1)},${y(n(it.net)).toFixed(1)}`).join(' ');
    const circles=items.map((it,i)=>`<circle cx="${x(i)}" cy="${y(n(it.net))}" r="4"><title>${it.date} · ${money(n(it.net))}</title></circle>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Évolution du patrimoine net"><line x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}" stroke="rgba(16,24,32,.16)"/><polyline points="${pts}" fill="none" stroke="#101820" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${circles}<text x="${pad}" y="18" font-size="12" fill="#657078">${money(max)}</text><text x="${pad}" y="${h-6}" font-size="12" fill="#657078">${items[0].date}</text><text x="${w-pad}" y="${h-6}" text-anchor="end" font-size="12" fill="#657078">${items.at(-1).date}</text></svg>`;
  }
  function renderSnapshots(state){
    const chart=document.querySelector('[data-fin-chart]'),list=document.querySelector('[data-fin-snapshots]');const items=[...(state.snapshots||[])].sort((a,b)=>a.date.localeCompare(b.date));
    if(chart)chart.innerHTML=chartSvg(items);
    if(list){
      list.innerHTML=items.slice().reverse().slice(0,8).map(s=>`<div class="fc-snapshot" data-shot="${s.date}"><strong>${s.date.split('-').reverse().join('/')}</strong><span>${money(n(s.net))}</span><button type="button" data-delete-shot>Supprimer</button></div>`).join('')||'<div class="space-empty">Aucune photographie enregistrée.</div>';
      list.querySelectorAll('[data-delete-shot]').forEach(btn=>btn.addEventListener('click',e=>{const date=e.target.closest('[data-shot]').dataset.shot,s=read();s.snapshots=s.snapshots.filter(x=>x.date!==date);write(s);render(s);}));
    }
  }

  function renderInputs(state){document.querySelectorAll('[data-fin-key]').forEach(el=>{if(document.activeElement===el)return;const v=get(state,el.dataset.finKey);if(v!==undefined&&String(el.value)!==String(v))el.value=v;});}
  function render(state=read()){const d=derive(state);renderInputs(state);renderKpis(state,d);renderBars(state,d);renderObservations(state,d);renderProjection(state,d);renderStress(state,d);renderGap(state,d);renderSnapshots(state);}

  function loadExample(){
    const s=defaults();
    s.budget={income:3000,fixed:1050,variable:760,loans:520,saving:450};
    s.assets={home:230000,rental:0,otherProperty:20000,cash:24000,equities:48000,bonds:8000,other:0};
    s.debts={homeLoan:142000,rentalLoan:0,consumer:0,other:0};
    s.goals={...s.goals,year:2035,financialTarget:150000,monthlyContribution:450,returnRate:5,inflation:2,incomeShock:70,target:{home:55,rental:0,otherProperty:5,cash:8,equities:27,bonds:5,other:0}};
    write(s);render(s);flashSaved();
  }
  function clearFinance(){if(!confirm('Effacer toutes les données financières enregistrées sur cet appareil ?'))return;localStorage.removeItem(KEY);render(defaults());}
  function exportFinance(){const data=read(),blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`contre-evidence-pilotage-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);}
  function importFinance(file){
    if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const parsed=JSON.parse(String(reader.result||''));const s=merge(defaults(),parsed);write(s);render(s);flashSaved();}catch(_){alert('Ce fichier ne contient pas un export financier valide.');}};reader.readAsText(file);
  }

  function bindActions(){
    document.querySelectorAll('[data-fin-snapshot]').forEach(btn=>btn.addEventListener('click',saveSnapshot));
    document.querySelectorAll('[data-fin-example]').forEach(btn=>btn.addEventListener('click',loadExample));
    document.querySelectorAll('[data-fin-clear]').forEach(btn=>btn.addEventListener('click',clearFinance));
    document.querySelectorAll('[data-fin-export]').forEach(btn=>btn.addEventListener('click',exportFinance));
    const input=document.querySelector('[data-fin-import-file]');
    document.querySelectorAll('[data-fin-import]').forEach(btn=>btn.addEventListener('click',()=>input?.click()));
    input?.addEventListener('change',()=>{importFinance(input.files?.[0]);input.value='';});
  }

  function run(){if(!document.body.classList.contains('space-page'))return;bindFields();bindActions();render(read());}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
