(() => {
  'use strict';

  const KEY = 'ce.space.v1';
  const VERSION = 1;
  const rootPath = /\/(articles|themes|dossiers|fiches-metiers)\//.test(location.pathname) ? '../' : '';
  const spaceHref = `${rootPath}mon-espace.html`;
  const now = () => new Date().toISOString();
  const uid = (prefix='id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const cleanUrl = (value=location.href) => { try { const u = new URL(value, location.href); u.hash=''; u.search=''; return u.href; } catch (_) { return value; } };
  const formatDate = iso => { try { return new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'short',year:'numeric'}).format(new Date(iso)); } catch (_) { return ''; } };
  const escapeHtml = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');

  function blankState(){ return {version:VERSION, readings:{}, favorites:{}, simulations:{}, decisions:[], recent:[]}; }
  function readState(){
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!parsed || typeof parsed !== 'object') return blankState();
      return {
        version:VERSION,
        readings: parsed.readings && typeof parsed.readings==='object' ? parsed.readings : {},
        favorites: parsed.favorites && typeof parsed.favorites==='object' ? parsed.favorites : {},
        simulations: parsed.simulations && typeof parsed.simulations==='object' ? parsed.simulations : {},
        decisions: Array.isArray(parsed.decisions) ? parsed.decisions : [],
        recent: Array.isArray(parsed.recent) ? parsed.recent : []
      };
    } catch (_) { return blankState(); }
  }
  function writeState(state){ try { localStorage.setItem(KEY, JSON.stringify(state)); return true; } catch (_) { return false; } }

  function pageTitle(){ return (document.querySelector('main h1')?.textContent || document.title.split('|')[0].split('—')[0] || 'Contre-Évidence').trim(); }
  function pageDomain(){
    const p = `${location.pathname} ${document.title} ${document.querySelector('.kicker')?.textContent || ''}`.toLowerCase();
    if (/hors-cadre|fenêtres|fenetres/.test(p)) return 'Hors cadre';
    if (/vie professionnelle|emploi|carrière|carriere|formation|reconversion|manager|entrepren/.test(p)) return 'Vie professionnelle';
    if (/patrimoine|immobilier|invest|inflation|budget|épargne|epargne|crédit|credit|retraite|transmission|voiture|assurance/.test(p)) return 'Patrimoine';
    return 'Autre';
  }
  function pageItem(type='page'){ return {type,id:cleanUrl(),url:cleanUrl(),title:pageTitle(),domain:pageDomain()}; }

  function toast(message){
    let el = document.querySelector('.ce-space-toast');
    if (!el) { el=document.createElement('div'); el.className='ce-space-toast'; el.setAttribute('role','status'); document.body.appendChild(el); }
    el.textContent=message; el.classList.add('is-visible'); clearTimeout(el._ceTimer); el._ceTimer=setTimeout(()=>el.classList.remove('is-visible'),2600);
  }

  function ensureDialog(){
    let dlg=document.querySelector('#ce-space-dialog');
    if (dlg) return dlg;
    dlg=document.createElement('dialog'); dlg.id='ce-space-dialog'; dlg.className='ce-space-dialog';
    dlg.innerHTML='<div class="ce-space-dialog-inner" data-ce-dialog-body></div>';
    document.body.appendChild(dlg);
    dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });
    return dlg;
  }
  function openDialog(html,onSubmit){
    const dlg=ensureDialog(), body=dlg.querySelector('[data-ce-dialog-body]'); body.innerHTML=html;
    body.querySelector('[data-ce-cancel]')?.addEventListener('click',()=>dlg.close());
    body.querySelector('form')?.addEventListener('submit',e=>{ e.preventDefault(); onSubmit?.(new FormData(e.currentTarget),dlg); });
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open','');
    return dlg;
  }

  function attachItemDialog(item){
    const state=readState();
    const options=state.decisions.map(d=>`<label style="display:flex;gap:.55rem;align-items:flex-start;padding:.5rem 0"><input type="radio" name="decision" value="${escapeHtml(d.id)}"><span><strong>${escapeHtml(d.title)}</strong><br><small>${escapeHtml(d.status || 'En cours')}</small></span></label>`).join('');
    const html=`<form><div class="space-eyebrow">Mes décisions</div><h2>Ajouter à une décision</h2><p>Reliez ce contenu à une question que vous voulez suivre dans le temps.</p>${options ? `<div class="ce-space-field"><label>Décision existante</label>${options}</div>` : ''}<div class="ce-space-field"><label for="ce-new-decision">Ou créer une nouvelle décision</label><input id="ce-new-decision" name="newDecision" placeholder="Ex. Acheter mon logement" maxlength="90"></div><div class="ce-space-dialog-actions"><button type="button" class="space-btn" data-ce-cancel>Annuler</button><button class="space-btn gold" type="submit">Ajouter</button></div></form>`;
    openDialog(html,(form,dlg)=>{
      const data=readState();
      const newTitle=String(form.get('newDecision')||'').trim();
      let decision=data.decisions.find(d=>d.id===form.get('decision'));
      if (newTitle) { decision={id:uid('decision'),title:newTitle,domain:item.domain||pageDomain(),status:'En cours',createdAt:now(),updatedAt:now(),items:[]}; data.decisions.unshift(decision); }
      if (!decision) { toast('Choisissez ou créez une décision.'); return; }
      decision.items=Array.isArray(decision.items)?decision.items:[];
      const ref={type:item.type||'page',id:item.id||item.url,url:item.url,title:item.title||item.label||'Élément enregistré',label:item.label||'',addedAt:now()};
      if (!decision.items.some(x=>x.type===ref.type && x.id===ref.id)) decision.items.unshift(ref);
      decision.updatedAt=now(); writeState(data); dlg.close(); toast('Ajouté à votre décision.'); renderDashboard();
    });
  }

  function addHeaderLink(){
    const add=()=>{
      const actions=document.querySelector('.ce-flat-actions');
      if (actions && !actions.querySelector('.ce-space-header-link')) {
        const a=document.createElement('a'); a.className='ce-space-header-link'; a.href=spaceHref; a.textContent='Mon espace';
        const start=actions.querySelector('.ce-start-link'); actions.insertBefore(a,start || actions.firstChild);
      }
      const fallback=document.querySelector('.ce-fallback-header nav');
      if (fallback && !fallback.querySelector('[data-ce-space-link]')) { const a=document.createElement('a'); a.href=spaceHref; a.dataset.ceSpaceLink='1'; a.textContent='Mon espace'; fallback.appendChild(a); }
    };
    add(); setTimeout(add,0); setTimeout(add,250);
  }

  function rememberRecent(item){ const state=readState(); state.recent=state.recent.filter(x=>x.url!==item.url); state.recent.unshift({...item,viewedAt:now()}); state.recent=state.recent.slice(0,12); writeState(state); }

  function trackReading(){
    if (document.body.classList.contains('space-page')) return;
    const path=location.pathname.toLowerCase();
    if (!/\/(dossiers|articles)\//.test(path) && !document.querySelector('article.prose') && !document.body.classList.contains('article-body')) return;
    const root=document.querySelector('article.prose') || (document.body.classList.contains('article-body') ? document.querySelector('main') : null);
    if (!root) return;
    const item=pageItem('reading'); rememberRecent(item);
    let ticking=false;
    const sync=()=>{
      ticking=false;
      const start=window.scrollY + root.getBoundingClientRect().top;
      const span=Math.max(root.offsetHeight-window.innerHeight,1);
      const progress=Math.max(0,Math.min(1,(window.scrollY-start)/span));
      if (progress<.02) return;
      const state=readState(); state.readings[item.url]={...item,progress:Math.round(progress*100),lastViewed:now()}; writeState(state);
    };
    window.addEventListener('scroll',()=>{ if(!ticking){ ticking=true; requestAnimationFrame(sync); } },{passive:true});
    window.addEventListener('pagehide',sync); setTimeout(sync,600);
  }

  function toggleFavorite(button){
    const item=pageItem('favorite'), state=readState();
    if (state.favorites[item.url]) { delete state.favorites[item.url]; button.classList.remove('is-saved'); button.textContent='☆ Enregistrer'; toast('Retiré de vos favoris.'); }
    else { state.favorites[item.url]={...item,savedAt:now()}; button.classList.add('is-saved'); button.textContent='✓ Enregistré'; toast('Enregistré dans Mon espace.'); }
    writeState(state); renderDashboard();
  }

  function addPageActions(){
    if (document.body.classList.contains('space-page')) return;
    const path=location.pathname.toLowerCase();
    if (!/\/(dossiers|articles)\//.test(path) && !/hors-cadre-(cuisine|decouvertes|images)\.html$/.test(path)) return;
    const host=document.querySelector('.article-hero .container, .article-body .hero .container, main > .hero .container');
    if (!host || host.querySelector('.ce-space-quick-actions')) return;
    const state=readState(), item=pageItem('favorite');
    const wrap=document.createElement('div'); wrap.className='ce-space-quick-actions';
    const fav=document.createElement('button'); fav.type='button'; fav.className='ce-space-btn';
    if(state.favorites[item.url]){fav.classList.add('is-saved'); fav.textContent='✓ Enregistré';} else fav.textContent='☆ Enregistrer';
    fav.addEventListener('click',()=>toggleFavorite(fav));
    const decision=document.createElement('button'); decision.type='button'; decision.className='ce-space-btn'; decision.textContent='+ Ma décision'; decision.addEventListener('click',()=>attachItemDialog(pageItem('page')));
    wrap.append(fav,decision); host.appendChild(wrap);
  }

  function collectFormValues(){
    const values={};
    document.querySelectorAll('main input, main select, main textarea').forEach(el=>{
      const key=el.id || el.name; if(!key || ['button','submit','reset','file','password','hidden'].includes((el.type||'').toLowerCase())) return;
      values[key]={tag:el.tagName.toLowerCase(),type:(el.type||'').toLowerCase(),value:el.value,checked:Boolean(el.checked)};
    });
    return values;
  }
  function restoreFormValues(sim){
    if (!sim?.values) return;
    Object.entries(sim.values).forEach(([key,saved])=>{
      const escaped=window.CSS?.escape ? CSS.escape(key) : key.replace(/(["'\\.#:[\]()])/g,'\\$1');
      const el=document.getElementById(key) || document.querySelector(`[name="${escaped}"]`); if(!el) return;
      if(saved.type==='checkbox' || saved.type==='radio') el.checked=Boolean(saved.checked); else el.value=saved.value;
      el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true}));
    });
    toast(`Scénario « ${sim.label || sim.title} » restauré.`);
  }

  function saveSimulationDialog(){
    const title=pageTitle();
    const defaultLabel=`Scénario du ${new Intl.DateTimeFormat('fr-FR',{day:'numeric',month:'long'}).format(new Date())}`;
    const html=`<form><div class="space-eyebrow">Simulation</div><h2>Enregistrer ce scénario</h2><p>Les hypothèses restent dans ce navigateur. Vous pourrez revenir exactement à ces valeurs depuis Mon espace.</p><div class="ce-space-field"><label for="ce-sim-label">Nom du scénario</label><input id="ce-sim-label" name="label" value="${escapeHtml(defaultLabel)}" maxlength="80" required></div><div class="ce-space-dialog-actions"><button type="button" class="space-btn" data-ce-cancel>Annuler</button><button class="space-btn gold" type="submit">Enregistrer</button></div></form>`;
    openDialog(html,(form,dlg)=>{
      const state=readState(), id=uid('sim');
      const sim={id,url:cleanUrl(),title,label:String(form.get('label')||title).trim()||title,domain:pageDomain(),values:collectFormValues(),savedAt:now(),updatedAt:now()};
      state.simulations[id]=sim; writeState(state); dlg.close(); toast('Scénario enregistré dans Mon espace.'); renderDashboard();
    });
  }

  function addToolSave(){
    if (document.body.classList.contains('space-page')) return;
    if (!/(^|\/)(simulateur|outil)[^/]*\.html$/i.test(location.pathname)) return;
    rememberRecent(pageItem('tool'));
    const shell=document.querySelector('.tool-shell') || document.querySelector('main .container'); if(!shell || shell.querySelector('.ce-space-tool-save')) return;
    const box=document.createElement('div'); box.className='ce-space-tool-save';
    box.innerHTML='<div><strong>Gardez ce scénario pour plus tard</strong><span>Vos hypothèses sont enregistrées uniquement dans ce navigateur.</span></div><button type="button" class="ce-space-btn primary">Enregistrer ce scénario</button>';
    box.querySelector('button').addEventListener('click',saveSimulationDialog);
    const privacy=shell.querySelector('.tool-privacy'); if(privacy) privacy.insertAdjacentElement('afterend',box); else shell.insertBefore(box,shell.firstChild);
    const id=new URLSearchParams(location.search).get('ce-scenario');
    if(id){ const sim=readState().simulations[id]; if(sim && cleanUrl(sim.url)===cleanUrl()) setTimeout(()=>restoreFormValues(sim),120); }
  }

  function decisionOptions(selected=''){ return ['À explorer','En cours','Décidé','À revoir'].map(v=>`<option${v===selected?' selected':''}>${v}</option>`).join(''); }
  function createDecisionDialog(){
    const html=`<form><div class="space-eyebrow">Nouvelle décision</div><h2>Qu’est-ce que vous essayez de décider ?</h2><p>Une formulation concrète suffit. Vous pourrez y rattacher ensuite lectures, favoris et simulations.</p><div class="ce-space-field"><label for="ce-decision-title">Décision</label><input id="ce-decision-title" name="title" placeholder="Ex. Acheter ou louer mon prochain logement" maxlength="90" required></div><div class="ce-space-field"><label for="ce-decision-domain">Domaine</label><select id="ce-decision-domain" name="domain"><option>Patrimoine</option><option>Vie professionnelle</option><option>Autre</option></select></div><div class="ce-space-dialog-actions"><button type="button" class="space-btn" data-ce-cancel>Annuler</button><button class="space-btn gold" type="submit">Créer la décision</button></div></form>`;
    openDialog(html,(form,dlg)=>{ const state=readState(); state.decisions.unshift({id:uid('decision'),title:String(form.get('title')).trim(),domain:String(form.get('domain')),status:'En cours',createdAt:now(),updatedAt:now(),items:[]}); writeState(state); dlg.close(); renderDashboard(); toast('Décision créée.'); });
  }

  function renderResume(state){
    const host=document.querySelector('[data-space-resume]'); if(!host) return;
    const entries=Object.values(state.readings).filter(r=>r.progress>=3 && r.progress<98).sort((a,b)=>String(b.lastViewed).localeCompare(String(a.lastViewed)));
    const r=entries[0];
    if(!r){host.innerHTML='<div class="space-empty"><strong>Rien à reprendre pour l’instant.</strong><br>Commencez un dossier : votre progression apparaîtra ici automatiquement.</div>'; return;}
    host.innerHTML=`<a class="space-resume" href="${escapeHtml(r.url)}"><div><div class="space-eyebrow">Dernière lecture</div><h3>${escapeHtml(r.title)}</h3><p>Reprenez là où vous vous êtes arrêté.</p><div class="space-progress" aria-label="${r.progress}% lus"><span style="width:${Math.max(3,Math.min(100,r.progress))}%"></span></div><div class="space-resume-meta"><span>${r.progress}% lus</span><span>${escapeHtml(r.domain||'')}</span><span>${formatDate(r.lastViewed)}</span></div></div><span class="space-resume-go">Continuer →</span></a>`;
  }

  function renderStats(state){
    const host=document.querySelector('[data-space-stats]'); if(!host) return;
    const inProgress=Object.values(state.readings).filter(r=>r.progress>=3 && r.progress<98).length;
    host.innerHTML=`<div class="space-stat"><strong>${state.decisions.length}</strong><span>Décisions suivies</span></div><div class="space-stat"><strong>${inProgress}</strong><span>Lectures en cours</span></div><div class="space-stat"><strong>${Object.keys(state.simulations).length}</strong><span>Scénarios enregistrés</span></div><div class="space-stat"><strong>${Object.keys(state.favorites).length}</strong><span>Favoris</span></div>`;
  }

  function renderDecisions(state){
    const host=document.querySelector('[data-space-decisions]'); if(!host) return;
    if(!state.decisions.length){host.innerHTML='<div class="space-empty"><strong>Aucune décision suivie.</strong><br>Créez une décision uniquement lorsqu’un sujet mérite d’être revu dans le temps.</div>'; return;}
    host.innerHTML=state.decisions.map(d=>{
      const items=(Array.isArray(d.items)?d.items:[]).slice(0,3).map(i=>`<a href="${escapeHtml(i.url||'#')}"><span>${escapeHtml(i.label||i.title||'Élément enregistré')}</span><span>→</span></a>`).join('');
      return `<article class="space-decision" data-decision="${escapeHtml(d.id)}"><div class="space-decision-top"><div><div class="space-eyebrow">${escapeHtml(d.domain||'Décision')}</div><h3>${escapeHtml(d.title)}</h3><div class="space-decision-meta"><span>${(d.items||[]).length} élément(s)</span><span>Mis à jour ${formatDate(d.updatedAt||d.createdAt)}</span></div></div><select class="space-status" data-decision-status aria-label="Statut de la décision">${decisionOptions(d.status||'En cours')}</select></div>${items?`<div class="space-decision-items">${items}</div>`:''}<div class="space-decision-actions"><button class="space-btn subtle" type="button" data-decision-delete>Supprimer</button></div></article>`;
    }).join('');
    host.querySelectorAll('[data-decision-status]').forEach(sel=>sel.addEventListener('change',e=>{ const card=e.target.closest('[data-decision]'), data=readState(), d=data.decisions.find(x=>x.id===card.dataset.decision); if(d){d.status=e.target.value;d.updatedAt=now();writeState(data);renderDashboard();} }));
    host.querySelectorAll('[data-decision-delete]').forEach(btn=>btn.addEventListener('click',e=>{ const id=e.target.closest('[data-decision]').dataset.decision, data=readState(); data.decisions=data.decisions.filter(d=>d.id!==id); writeState(data); renderDashboard(); toast('Décision supprimée.'); }));
  }

  function attachButton(item){ const b=document.createElement('button'); b.type='button'; b.className='space-btn'; b.textContent='Lier à une décision'; b.addEventListener('click',()=>attachItemDialog(item)); return b; }

  function renderSimulations(state){
    const host=document.querySelector('[data-space-simulations]'); if(!host) return;
    const sims=Object.values(state.simulations).sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
    if(!sims.length){host.innerHTML='<div class="space-empty"><strong>Aucun scénario enregistré.</strong><br>Sur un simulateur, utilisez « Enregistrer ce scénario » pour retrouver vos hypothèses ici.</div>'; return;}
    host.innerHTML='';
    sims.forEach(sim=>{
      const row=document.createElement('div'); row.className='space-item'; row.innerHTML=`<div><h3>${escapeHtml(sim.label||sim.title)}</h3><p>${escapeHtml(sim.title)} · ${formatDate(sim.savedAt)}</p></div><div class="space-item-actions"><a class="space-btn primary" href="${escapeHtml(sim.url)}?ce-scenario=${encodeURIComponent(sim.id)}">Reprendre</a></div>`;
      row.querySelector('.space-item-actions').appendChild(attachButton({type:'simulation',id:sim.id,url:`${sim.url}?ce-scenario=${encodeURIComponent(sim.id)}`,title:sim.title,label:sim.label,domain:sim.domain}));
      const del=document.createElement('button'); del.type='button'; del.className='space-btn subtle'; del.textContent='Supprimer'; del.addEventListener('click',()=>{const data=readState();delete data.simulations[sim.id];writeState(data);renderDashboard();toast('Scénario supprimé.');}); row.querySelector('.space-item-actions').appendChild(del); host.appendChild(row);
    });
  }

  function renderFavorites(state){
    const host=document.querySelector('[data-space-favorites]'); if(!host) return;
    const favs=Object.values(state.favorites).sort((a,b)=>String(b.savedAt).localeCompare(String(a.savedAt)));
    if(!favs.length){host.innerHTML='<div class="space-empty"><strong>Rien de côté pour l’instant.</strong><br>Le bouton « Enregistrer » des dossiers ajoutera ici les contenus que vous voulez retrouver.</div>'; return;}
    host.innerHTML='';
    favs.forEach(f=>{ const row=document.createElement('div'); row.className='space-item'; row.innerHTML=`<div><h3><a href="${escapeHtml(f.url)}" style="text-decoration:none">${escapeHtml(f.title)}</a></h3><p>${escapeHtml(f.domain||'')} · enregistré ${formatDate(f.savedAt)}</p></div><div class="space-item-actions"><a class="space-btn primary" href="${escapeHtml(f.url)}">Lire</a></div>`; row.querySelector('.space-item-actions').appendChild(attachButton(f)); const del=document.createElement('button');del.type='button';del.className='space-btn subtle';del.textContent='Retirer';del.addEventListener('click',()=>{const data=readState();delete data.favorites[f.url];writeState(data);renderDashboard();});row.querySelector('.space-item-actions').appendChild(del);host.appendChild(row); });
  }

  function renderRecent(state){
    const host=document.querySelector('[data-space-recent]'); if(!host) return;
    if(!state.recent.length){host.innerHTML='<div class="space-empty">Votre historique récent apparaîtra ici au fil de la navigation.</div>'; return;}
    host.innerHTML=state.recent.slice(0,6).map(r=>`<div class="space-item"><div><h3><a href="${escapeHtml(r.url)}" style="text-decoration:none">${escapeHtml(r.title)}</a></h3><p>${escapeHtml(r.domain||'')} · ${formatDate(r.viewedAt)}</p></div><div class="space-item-actions"><a class="space-btn" href="${escapeHtml(r.url)}">Ouvrir</a></div></div>`).join('');
  }

  function exportState(){
    const data=readState(); const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`contre-evidence-mon-espace-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function clearStateDialog(){
    const html=`<form><div class="space-eyebrow">Données locales</div><h2>Effacer Mon espace ?</h2><p>Lectures, favoris, décisions et simulations enregistrés sur cet appareil seront supprimés. Cette action est irréversible sur ce navigateur.</p><div class="ce-space-dialog-actions"><button type="button" class="space-btn" data-ce-cancel>Annuler</button><button class="space-btn danger" type="submit">Tout effacer</button></div></form>`;
    openDialog(html,(_,dlg)=>{try{localStorage.removeItem(KEY);}catch(_){}dlg.close();renderDashboard();toast('Mon espace a été effacé sur cet appareil.');});
  }

  function bindDashboard(){ document.querySelector('[data-new-decision]')?.addEventListener('click',createDecisionDialog); document.querySelector('[data-space-export]')?.addEventListener('click',exportState); document.querySelector('[data-space-clear]')?.addEventListener('click',clearStateDialog); }
  function renderDashboard(){ if(!document.body.classList.contains('space-page')) return; const state=readState(); renderResume(state); renderStats(state); renderDecisions(state); renderSimulations(state); renderFavorites(state); renderRecent(state); }

  const run=()=>{ addHeaderLink(); trackReading(); addPageActions(); addToolSave(); if(document.body.classList.contains('space-page')){bindDashboard();renderDashboard();} };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true}); else run();
})();
