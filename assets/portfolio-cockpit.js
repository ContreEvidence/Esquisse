(() => {
  'use strict';

  const KEY='ce.finance.cockpit.v1';
  const portfolioKeys=['cash','euroFund','bonds','privateCredit','equities','scpi','listedProperty','privateEquity','infrastructure','gold','commodities','crypto','other'];
  const LABELS={
    cash:'Liquidités & monétaire',
    euroFund:'Fonds euros / capital garanti',
    bonds:'Obligations',
    privateCredit:'Crédit privé / dette non cotée',
    equities:'Actions & ETF actions',
    scpi:'SCPI / OPCI',
    listedProperty:'Foncières cotées / REIT',
    privateEquity:'Private equity / entreprise non cotée',
    infrastructure:'Infrastructures',
    gold:'Or & métaux précieux',
    commodities:'Matières premières',
    crypto:'Crypto-actifs',
    other:'Autres / objets de collection'
  };
  const LIQUIDITY={immediate:'Immédiate',high:'Plutôt élevée',medium:'Moyenne',low:'Faible'};
  const euro=new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR',maximumFractionDigits:0});

  function n(v){const x=Number(v);return Number.isFinite(x)?Math.max(0,x):0;}
  function esc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function id(){return globalThis.crypto?.randomUUID?.()||`a-${Date.now()}-${Math.random().toString(16).slice(2)}`;}
  function blank(assetClass='equities',label=''){return{id:id(),assetClass,label,value:0,account:'',liquidity:'high',role:''};}
  function read(){try{const s=JSON.parse(localStorage.getItem(KEY)||'{}');return s&&typeof s==='object'?s:{};}catch(_){return{};}}
  function list(){const s=read();return Array.isArray(s.portfolioPositions)?s.portfolioPositions:[];}
  function write(positions){try{const s=read();s.portfolioPositions=positions;s.updatedAt=new Date().toISOString();localStorage.setItem(KEY,JSON.stringify(s));return true;}catch(_){return false;}}
  function money(v){const x=Number(v);return euro.format(Number.isFinite(x)?x:0);}
  function aggregateState(){const s=read();return s.assets&&typeof s.assets==='object'?s.assets:{};}
  function classTotals(positions){const out=Object.fromEntries(portfolioKeys.map(k=>[k,0]));positions.forEach(p=>{if(portfolioKeys.includes(p.assetClass))out[p.assetClass]+=n(p.value);});return out;}
  function totalValue(positions){return positions.reduce((a,p)=>a+n(p.value),0);}
  function represented(positions){return portfolioKeys.filter(k=>positions.some(p=>p.assetClass===k));}
  function setStatus(text){const el=document.querySelector('[data-portfolio-status]');if(!el)return;el.textContent=text;clearTimeout(el._t);el._t=setTimeout(()=>el.textContent='',3000);}

  function lineCard(p,index){
    const label=p.label?.trim()||LABELS[p.assetClass]||'Actif';
    const meta=[LABELS[p.assetClass]||'Classe non reconnue',p.account?.trim()].filter(Boolean).join(' · ');
    return `<details class="pf-position" data-portfolio-card="${index}" ${index===0?'open':''}>
      <summary><span><strong data-portfolio-title="${index}">${esc(label)}</strong><small data-portfolio-meta="${index}">${esc(meta)}</small></span><span class="pf-position-value"><b data-portfolio-value="${index}">${money(n(p.value))}</b><small>valeur actuelle</small></span></summary>
      <div class="pf-position-body">
        <div class="pf-grid">
          <label>Nom de la ligne<input type="text" data-portfolio-index="${index}" data-portfolio-field="label" value="${esc(p.label||'')}" placeholder="Ex. ETF Monde, Livret A, SCPI A…"></label>
          <label>Classe d’actifs<select data-portfolio-index="${index}" data-portfolio-field="assetClass">${portfolioKeys.map(k=>`<option value="${k}" ${p.assetClass===k?'selected':''}>${esc(LABELS[k])}</option>`).join('')}</select></label>
          <label>Valeur actuelle<input type="number" min="0" step="100" inputmode="decimal" data-portfolio-index="${index}" data-portfolio-field="value" value="${n(p.value)||''}"></label>
          <label>Compte / enveloppe<input type="text" data-portfolio-index="${index}" data-portfolio-field="account" value="${esc(p.account||'')}" placeholder="Ex. PEA, assurance-vie, livret, CTO…"><small>L’enveloppe décrit où l’actif est détenu ; elle ne change pas sa classe économique.</small></label>
          <label>Liquidité estimée<select data-portfolio-index="${index}" data-portfolio-field="liquidity">${Object.entries(LIQUIDITY).map(([k,v])=>`<option value="${k}" ${p.liquidity===k?'selected':''}>${esc(v)}</option>`).join('')}</select></label>
          <label class="pf-wide">Rôle / note<input type="text" data-portfolio-index="${index}" data-portfolio-field="role" value="${esc(p.role||'')}" placeholder="Ex. réserve, croissance, revenu, diversification, projet à 3 ans…"><small>Ce rôle est votre propre lecture de la ligne ; le site ne lui attribue pas de score ni de recommandation.</small></label>
        </div>
        <div class="pf-actions-row"><button type="button" class="fc-btn subtle" data-portfolio-delete="${index}">Supprimer cette ligne</button><a class="fc-btn subtle" href="dossiers/classes-actifs-allocation-patrimoine.html">Revoir les classes d’actifs</a></div>
      </div>
    </details>`;
  }

  function renderSummary(positions){
    const host=document.querySelector('[data-portfolio-summary]');if(!host)return;
    if(!positions.length){host.innerHTML='<div class="space-empty"><strong>Aucune ligne détaillée.</strong><br>Vous pouvez continuer à utiliser uniquement les montants agrégés du cockpit. Le détail devient utile lorsque plusieurs comptes, supports ou lignes composent une même classe d’actifs.</div>';return;}
    const total=totalValue(positions),classes=represented(positions),liquid=positions.filter(p=>['immediate','high'].includes(p.liquidity)).reduce((a,p)=>a+n(p.value),0);
    host.innerHTML=`<div><span>Valeur détaillée</span><strong>${money(total)}</strong></div><div><span>Lignes suivies</span><strong>${positions.length}</strong></div><div><span>Classes représentées</span><strong>${classes.length}</strong></div><div><span>Liquidité immédiate / élevée*</span><strong>${money(liquid)}</strong></div>`;
  }

  function renderBridge(positions){
    const host=document.querySelector('[data-portfolio-bridge-table]');if(!host)return;
    const totals=classTotals(positions),assets=aggregateState(),classes=represented(positions);
    if(!classes.length){host.innerHTML='';return;}
    host.innerHTML=`<div class="pf-compare-head"><span>Classe</span><span>Détail</span><span>Cockpit</span><span>Écart</span></div>${classes.map(k=>{
      const detailed=totals[k],aggregate=n(assets[k]),delta=detailed-aggregate;
      return `<div class="pf-compare-row"><strong>${esc(LABELS[k])}</strong><span>${money(detailed)}</span><span>${money(aggregate)}</span><span class="${Math.abs(delta)<1?'ok':'delta'}">${delta>0?'+':''}${money(delta)}</span></div>`;
    }).join('')}`;
  }

  function refresh(positions){
    positions.forEach((p,index)=>{
      const label=p.label?.trim()||LABELS[p.assetClass]||'Actif';
      const meta=[LABELS[p.assetClass]||'Classe non reconnue',p.account?.trim()].filter(Boolean).join(' · ');
      const title=document.querySelector(`[data-portfolio-title="${index}"]`);if(title)title.textContent=label;
      const metaEl=document.querySelector(`[data-portfolio-meta="${index}"]`);if(metaEl)metaEl.textContent=meta;
      const value=document.querySelector(`[data-portfolio-value="${index}"]`);if(value)value.textContent=money(n(p.value));
    });
    renderSummary(positions);renderBridge(positions);
  }

  function render(){
    const positions=list(),host=document.querySelector('[data-portfolio-list]');if(!host)return;
    host.innerHTML=positions.length?positions.map(lineCard).join(''):'<div class="space-empty"><strong>Le détail est facultatif.</strong><br>Ajoutez plusieurs lignes lorsque vous voulez distinguer, par exemple, plusieurs ETF, actions, SCPI, livrets ou contrats tout en conservant une seule allocation globale.</div>';
    renderSummary(positions);renderBridge(positions);
  }

  function seedFromAggregates(){
    if(list().length){setStatus('Le portefeuille détaillé existe déjà : aucun doublon créé.');return;}
    const assets=aggregateState(),positions=[];
    portfolioKeys.forEach(k=>{const value=n(assets[k]);if(value>0)positions.push({...blank(k,LABELS[k]),value});});
    if(!positions.length){setStatus('Aucun montant financier agrégé à convertir.');return;}
    write(positions);render();setStatus(`${positions.length} ligne(s) créée(s) à partir des totaux actuels. Vous pouvez maintenant les scinder en plusieurs supports.`);
  }

  function reportToCockpit(){
    const positions=list();if(!positions.length){setStatus('Ajoutez au moins une ligne avant de reporter les totaux.');return;}
    const totals=classTotals(positions),classes=represented(positions);let changed=0;
    classes.forEach(k=>{
      const input=document.querySelector(`[data-fin-key="assets.${k}"]`);if(!input)return;
      input.value=String(Math.round(totals[k]));input.dispatchEvent(new Event('input',{bubbles:true}));changed++;
    });
    setStatus(changed?`${changed} classe(s) mise(s) à jour dans le cockpit. Les classes non détaillées et l’immobilier direct n’ont pas été modifiés.`:'Impossible de trouver les champs agrégés du cockpit.');
    renderBridge(positions);
  }

  function install(){
    if(!document.body.classList.contains('finance-cockpit')||document.querySelector('[data-portfolio-cockpit="1"]'))return;
    const readSection=document.querySelector('[aria-labelledby="lecture-title"]');if(!readSection)return;
    const section=document.createElement('section');
    section.className='fc-section pf-section';section.dataset.portfolioCockpit='1';section.setAttribute('aria-labelledby','portfolio-title');
    section.innerHTML=`<div class="fc-section-head"><div><div class="fc-eyebrow">1 ter · Mon portefeuille détaillé</div><h2 id="portfolio-title">Plusieurs lignes par classe d’actifs, sans perdre la vue d’ensemble.</h2><p>La vue agrégée reste suffisante pour commencer. Ce niveau facultatif sert à distinguer les supports réellement détenus : plusieurs ETF, actions, livrets, contrats, SCPI ou autres actifs au sein d’une même classe.</p></div></div>
      <div class="pf-bridge"><div><strong>Une ligne n’est pas une nouvelle classe d’actifs.</strong><p>Un ETF Monde et une action individuelle restent tous deux dans « Actions & ETF actions ». Un PEA, une assurance-vie ou un CTO décrit l’enveloppe, pas l’exposition économique. Le détail n’écrase jamais les totaux automatiquement.</p></div><div class="pf-top-actions"><button type="button" class="fc-btn" data-portfolio-add>Ajouter une ligne</button><button type="button" class="fc-btn subtle" data-portfolio-seed>Créer depuis mes totaux actuels</button><button type="button" class="fc-btn gold" data-portfolio-report>Reporter les totaux</button></div></div>
      <div class="pf-summary" data-portfolio-summary></div><div class="pf-compare" data-portfolio-bridge-table></div><div class="pf-list" data-portfolio-list></div><div class="pf-note">* La liquidité est déclarative et ne tient pas compte automatiquement des délais de vente, de la fiscalité ou des conditions propres à chaque support. Les classes non représentées dans le détail ne sont jamais remises à zéro lors d’un report.</div><div class="pf-status" data-portfolio-status aria-live="polite"></div>`;
    readSection.before(section);render();

    section.addEventListener('click',event=>{
      if(event.target.closest('[data-portfolio-add]')){const p=list();p.push(blank());write(p);render();setStatus('Ligne ajoutée.');return;}
      if(event.target.closest('[data-portfolio-seed]')){seedFromAggregates();return;}
      if(event.target.closest('[data-portfolio-report]')){reportToCockpit();return;}
      const del=event.target.closest('[data-portfolio-delete]');if(del){const p=list(),i=Number(del.dataset.portfolioDelete);if(Number.isInteger(i)&&p[i]){p.splice(i,1);write(p);render();setStatus('Ligne supprimée du détail. Le total agrégé n’a pas été modifié.');}}
    });
    const edit=event=>{
      const el=event.target.closest('[data-portfolio-index][data-portfolio-field]');if(!el)return;
      const p=list(),i=Number(el.dataset.portfolioIndex),field=el.dataset.portfolioField;if(!Number.isInteger(i)||!p[i])return;
      p[i][field]=el.type==='number'?n(el.value):el.value;write(p);refresh(p);
    };
    section.addEventListener('input',edit);section.addEventListener('change',edit);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
