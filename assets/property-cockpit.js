(() => {
  'use strict';

  const KEY='ce.finance.cockpit.v1';
  const TYPES={
    home:'Résidence principale',
    rental:'Locatif résidentiel',
    commercialProperty:'Immobilier commercial',
    otherProperty:'Parking, garage ou autre immobilier direct'
  };
  const euro=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});
  const pct=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:1});

  function n(v){const x=Number(v);return Number.isFinite(x)?Math.max(0,x):0;}
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function id(){return globalThis.crypto?.randomUUID?.()||`p-${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  function blank(type='rental',label=''){return{id:id(),type,label,value:0,debt:0,grossIncome:0,vacancyPct:0,annualCosts:0,annualIncomeTax:0,annualHours:0,liquidity:'medium',options:''};}
  function read(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return s&&typeof s==='object'?s:{};}catch(_){return{};}}
  function list(){const s=read();return Array.isArray(s.properties)?s.properties:[];}
  function write(properties){try{const s=read();s.properties=properties;s.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));return true;}catch(_){return false;}}
  function money(v){const x=Number(v);return euro.format(Number.isFinite(x)?x:0);}
  function percent(v){return `${pct.format(Number.isFinite(v)?v:0)} %`;}
  function calc(p){
    const value=n(p.value),debt=n(p.debt),gross=n(p.grossIncome),vac=Math.min(100,n(p.vacancyPct)),costs=n(p.annualCosts),tax=n(p.annualIncomeTax);
    const collected=gross*(1-vac/100),noi=collected-costs,afterTax=noi-tax,equity=value-debt;
    return{value,debt,gross,vac,costs,tax,collected,noi,afterTax,equity,yield:value>0&&gross>0?noi/value*100:null,debtRatio:value>0?debt/value*100:null,hours:n(p.annualHours)};
  }
  function totals(properties){
    const out={value:0,debt:0,equity:0,gross:0,collected:0,noi:0,afterTax:0,hours:0,incomeValue:0};
    properties.forEach(p=>{const c=calc(p);for(const k of ['value','debt','equity','gross','collected','noi','afterTax','hours'])out[k]+=c[k];if(c.gross>0)out.incomeValue+=c.value;});
    out.yield=out.incomeValue>0?out.noi/out.incomeValue*100:null;return out;
  }
  function setStatus(text){const el=document.querySelector('[data-property-status]');if(!el)return;el.textContent=text;clearTimeout(el._t);el._t=setTimeout(()=>el.textContent='',2600);}

  function relabelDebt(){
    const input=document.querySelector('[data-fin-key="debts.rentalLoan"]');
    if(!input)return;
    input.setAttribute('aria-label','Crédits immobiliers hors résidence principale');
    const cell=input.closest('tr')?.querySelector('td:first-child');if(cell)cell.textContent='Crédits immobiliers hors résidence principale';
  }

  function card(p,index){
    const c=calc(p),label=p.label?.trim()||TYPES[p.type]||'Bien immobilier';
    return `<details class="pc-property" data-property-card="${index}" ${index===0?'open':''}>
      <summary><span><strong data-property-title="${index}">${esc(label)}</strong><small>${esc(TYPES[p.type]||'Immobilier direct')}</small></span><span class="pc-property-summary"><b data-property-equity="${index}">${money(c.equity)}</b><small>valeur nette</small></span></summary>
      <div class="pc-property-body">
        <div class="pc-grid pc-grid-head">
          <label>Nom du bien<input type="text" data-property-index="${index}" data-property-field="label" value="${esc(p.label||'')}" placeholder="Ex. Appartement centre-ville"></label>
          <label>Type<select data-property-index="${index}" data-property-field="type">${Object.entries(TYPES).map(([k,v])=>`<option value="${k}" ${p.type===k?'selected':''}>${esc(v)}</option>`).join('')}</select></label>
          <label>Valeur actuelle<input type="number" min="0" step="1000" inputmode="decimal" data-property-index="${index}" data-property-field="value" value="${n(p.value)||''}"></label>
          <label>Dette restante<input type="number" min="0" step="1000" inputmode="decimal" data-property-index="${index}" data-property-field="debt" value="${n(p.debt)||''}"></label>
        </div>
        <div class="pc-metrics">
          <div><span>Valeur nette</span><strong data-property-metric="equity" data-property-metric-index="${index}">${money(c.equity)}</strong></div>
          <div><span>Dette / valeur</span><strong data-property-metric="debtRatio" data-property-metric-index="${index}">${c.debtRatio===null?'—':percent(c.debtRatio)}</strong></div>
          <div><span>Rendement net avant impôt</span><strong data-property-metric="yield" data-property-metric-index="${index}">${c.yield===null?'—':percent(c.yield)}</strong></div>
          <div><span>Revenu net après impôt saisi</span><strong data-property-metric="afterTax" data-property-metric-index="${index}">${money(c.afterTax)}</strong></div>
        </div>
        <div class="pc-grid">
          <label>Recettes annuelles potentielles<input type="number" min="0" step="100" inputmode="decimal" data-property-index="${index}" data-property-field="grossIncome" value="${n(p.grossIncome)||''}"><small>Loyers ou recettes avant vacance et coûts.</small></label>
          <label>Vacance / pertes de recettes (%)<input type="number" min="0" max="100" step="0.5" inputmode="decimal" data-property-index="${index}" data-property-field="vacancyPct" value="${n(p.vacancyPct)||0}"></label>
          <label>Coûts annuels propriétaire<input type="number" min="0" step="100" inputmode="decimal" data-property-index="${index}" data-property-field="annualCosts" value="${n(p.annualCosts)||''}"><small>Taxe foncière, assurance, charges non récupérables, entretien, gestion…</small></label>
          <label>Fiscalité annuelle estimée du revenu<input type="number" min="0" step="100" inputmode="decimal" data-property-index="${index}" data-property-field="annualIncomeTax" value="${n(p.annualIncomeTax)||''}"><small>Facultatif : gardé séparé des coûts d’exploitation.</small></label>
          <label>Temps de gestion annuel (h)<input type="number" min="0" step="1" inputmode="decimal" data-property-index="${index}" data-property-field="annualHours" value="${n(p.annualHours)||''}"></label>
          <label>Liquidité estimée<select data-property-index="${index}" data-property-field="liquidity"><option value="high" ${p.liquidity==='high'?'selected':''}>Plutôt élevée</option><option value="medium" ${!p.liquidity||p.liquidity==='medium'?'selected':''}>Moyenne</option><option value="low" ${p.liquidity==='low'?'selected':''}>Faible</option></select></label>
          <label class="pc-wide">Options et usages crédibles<textarea rows="3" data-property-index="${index}" data-property-field="options" placeholder="Habiter, louer une partie, meublé, colocation, division, changement d’usage, revente…">${esc(p.options||'')}</textarea><small>Notez seulement les options techniquement et juridiquement plausibles. Elles ne sont pas valorisées automatiquement.</small></label>
        </div>
        <div class="pc-actions-row"><button type="button" class="fc-btn subtle" data-property-delete="${index}">Supprimer ce bien</button><a class="fc-btn subtle" href="simulateur-comparer-strategies-immobilieres.html">Comparer une stratégie alternative</a></div>
      </div>
    </details>`;
  }

  function renderSummary(properties){
    const host=document.querySelector('[data-property-summary]');if(!host)return;
    const t=totals(properties);
    if(!properties.length){host.innerHTML='<div class="space-empty"><strong>Aucun bien détaillé.</strong><br>Vous pouvez conserver la saisie agrégée du cockpit ou détailler uniquement les biens pour lesquels une analyse plus fine est utile.</div>';return;}
    host.innerHTML=`<div><span>Valeur immobilière détaillée</span><strong>${money(t.value)}</strong></div><div><span>Dette immobilière détaillée</span><strong>${money(t.debt)}</strong></div><div><span>Valeur nette</span><strong>${money(t.equity)}</strong></div><div><span>Revenu net d’exploitation</span><strong>${money(t.noi)}/an</strong></div><div><span>Rendement net des biens à revenu</span><strong>${t.yield===null?'—':percent(t.yield)}</strong></div><div><span>Temps de gestion</span><strong>${pct.format(t.hours)} h/an</strong></div>`;
  }

  function refreshMetrics(properties){
    properties.forEach((p,index)=>{
      const c=calc(p),label=p.label?.trim()||TYPES[p.type]||'Bien immobilier';
      const title=document.querySelector(`[data-property-title="${index}"]`);if(title)title.textContent=label;
      const equity=document.querySelector(`[data-property-equity="${index}"]`);if(equity)equity.textContent=money(c.equity);
      const values={equity:money(c.equity),debtRatio:c.debtRatio===null?'—':percent(c.debtRatio),yield:c.yield===null?'—':percent(c.yield),afterTax:money(c.afterTax)};
      Object.entries(values).forEach(([k,v])=>{const el=document.querySelector(`[data-property-metric="${k}"][data-property-metric-index="${index}"]`);if(el)el.textContent=v;});
      const detail=document.querySelector(`[data-property-card="${index}"] summary small`);if(detail)detail.textContent=TYPES[p.type]||'Immobilier direct';
    });
    renderSummary(properties);
  }

  function render(){
    const properties=list(),host=document.querySelector('[data-property-list]');if(!host)return;
    host.innerHTML=properties.length?properties.map(card).join(''):'<div class="space-empty"><strong>Vous pouvez rester en vue agrégée.</strong><br>Le détail par bien est facultatif. Ajoutez un bien lorsque vous voulez suivre sa dette, son revenu, son coût, son temps de gestion et ses options séparément.</div>';
    renderSummary(properties);
  }

  function seedFromAggregates(){
    if(list().length){setStatus('Le détail existe déjà : aucun doublon créé.');return;}
    const s=read(),a=s.assets||{},d=s.debts||{};
    const seeded=[];
    if(n(a.home)>0)seeded.push({...blank('home','Résidence principale'),value:n(a.home),debt:n(d.homeLoan)});
    if(n(a.rental)>0)seeded.push({...blank('rental','Locatif résidentiel'),value:n(a.rental),debt:n(d.rentalLoan)});
    if(n(a.commercialProperty)>0)seeded.push({...blank('commercialProperty','Immobilier commercial'),value:n(a.commercialProperty)});
    if(n(a.otherProperty)>0)seeded.push({...blank('otherProperty','Autre immobilier direct'),value:n(a.otherProperty)});
    if(!seeded.length){setStatus('Aucun montant immobilier agrégé à convertir.');return;}
    write(seeded);render();setStatus(`${seeded.length} bien(s) créé(s) à partir des totaux actuels. Vérifiez les dettes avant de reporter.`);
  }

  function reportToCockpit(){
    const properties=list();if(!properties.length){setStatus('Ajoutez au moins un bien avant de reporter les totaux.');return;}
    const byType={home:0,rental:0,commercialProperty:0,otherProperty:0},debts={home:0,other:0};
    properties.forEach(p=>{byType[p.type]=(byType[p.type]||0)+n(p.value);if(p.type==='home')debts.home+=n(p.debt);else debts.other+=n(p.debt);});
    const updates={
      'assets.home':byType.home,'assets.rental':byType.rental,'assets.commercialProperty':byType.commercialProperty,'assets.otherProperty':byType.otherProperty,
      'debts.homeLoan':debts.home,'debts.rentalLoan':debts.other
    };
    let changed=0;
    Object.entries(updates).forEach(([key,value])=>{
      const input=document.querySelector(`[data-fin-key="${key}"]`);if(!input)return;input.value=String(Math.round(value));input.dispatchEvent(new Event('input',{bubbles:true}));changed++;
    });
    relabelDebt();setStatus(changed?'Totaux immobiliers reportés dans le cockpit. Les autres actifs et dettes n’ont pas été modifiés.':'Impossible de trouver les champs agrégés du cockpit.');
  }

  function install(){
    if(!document.body.classList.contains('finance-cockpit')||document.querySelector('[data-property-cockpit="1"]'))return;
    const readSection=document.querySelector('[aria-labelledby="lecture-title"]');if(!readSection)return;
    const section=document.createElement('section');
    section.className='fc-section pc-section';section.dataset.propertyCockpit='1';section.setAttribute('aria-labelledby','property-title');
    section.innerHTML=`<div class="fc-section-head"><div><div class="fc-eyebrow">1 bis · Mes biens immobiliers</div><h2 id="property-title">Passer du total immobilier au bien réel.</h2><p>Un même montant peut cacher une résidence principale, un locatif, un local ou un garage avec des dettes, revenus, coûts et options très différents. Cette vue détaillée reste facultative.</p></div></div>
      <div class="pc-bridge"><div><strong>Deux niveaux, sans double comptage.</strong><p>Le détail n’écrase jamais la vue agrégée tout seul. Lorsque les biens sont à jour, utilisez « Reporter les totaux » pour synchroniser explicitement leur valeur et leur dette avec le cockpit.</p></div><div class="pc-top-actions"><button type="button" class="fc-btn" data-property-add>Ajouter un bien</button><button type="button" class="fc-btn subtle" data-property-seed>Créer depuis mes totaux actuels</button><button type="button" class="fc-btn gold" data-property-report>Reporter les totaux</button></div></div>
      <div class="pc-summary" data-property-summary></div><div class="pc-list" data-property-list></div><div class="pc-status" data-property-status aria-live="polite"></div>`;
    readSection.before(section);relabelDebt();render();

    section.addEventListener('click',event=>{
      if(event.target.closest('[data-property-add]')){const p=list();p.push(blank());write(p);render();setStatus('Bien ajouté.');return;}
      if(event.target.closest('[data-property-seed]')){seedFromAggregates();return;}
      if(event.target.closest('[data-property-report]')){reportToCockpit();return;}
      const del=event.target.closest('[data-property-delete]');if(del){const p=list(),i=Number(del.dataset.propertyDelete);if(Number.isInteger(i)&&p[i]){p.splice(i,1);write(p);render();setStatus('Bien supprimé du détail. Les totaux agrégés n’ont pas été modifiés.');}}
    });
    const edit=event=>{
      const el=event.target.closest('[data-property-index][data-property-field]');if(!el)return;
      const p=list(),i=Number(el.dataset.propertyIndex),field=el.dataset.propertyField;if(!Number.isInteger(i)||!p[i])return;
      p[i][field]=el.type==='number'?n(el.value):el.value;write(p);refreshMetrics(p);
    };
    section.addEventListener('input',edit);section.addEventListener('change',edit);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
