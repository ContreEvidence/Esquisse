(() => {
  'use strict';

  const ADVANCED_KEYS = new Set([
    'assets.privateCredit','assets.privateEquity','assets.infrastructure','assets.commodities','assets.crypto','assets.other',
    'goals.target.privateCredit','goals.target.privateEquity','goals.target.infrastructure','goals.target.commodities','goals.target.crypto','goals.target.other'
  ]);

  function relevantRows(){
    return [...document.querySelectorAll('[data-fin-key]')]
      .filter(input => ADVANCED_KEYS.has(input.dataset.finKey))
      .map(input => input.closest('tr'))
      .filter(Boolean);
  }

  function hasStoredValue(rows){
    return rows.some(row => {
      const input=row.querySelector('[data-fin-key]');
      return input && Math.abs(Number(input.value)||0) > 0;
    });
  }

  function install(){
    if (!document.body.classList.contains('finance-cockpit')) return;
    const rows=relevantRows();
    if (!rows.length || document.querySelector('[data-fin-advanced-toggle]')) return;

    const assetCard=document.querySelector('.fc-assets-card');
    const table=assetCard?.querySelector('.fc-mini-table');
    if(!assetCard || !table) return;

    rows.forEach(row=>row.classList.add('fc-advanced-row'));
    let open=hasStoredValue(rows);

    const wrap=document.createElement('div');
    wrap.className='fc-advanced-toggle-wrap';
    wrap.innerHTML='<span><strong>Classes moins courantes.</strong> Crédit privé, private equity, infrastructures, matières premières, crypto et autres restent disponibles sans encombrer la saisie initiale.</span><button class="fc-advanced-toggle" type="button" data-fin-advanced-toggle aria-expanded="false"></button>';
    table.insertAdjacentElement('beforebegin',wrap);
    const button=wrap.querySelector('button');

    function render(){
      rows.forEach(row=>row.hidden=!open);
      button.setAttribute('aria-expanded',String(open));
      button.textContent=open?'Masquer les classes avancées':'Afficher les classes avancées';
    }
    button.addEventListener('click',()=>{open=!open;render();});
    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
