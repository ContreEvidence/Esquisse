(() => {
  'use strict';

  const catalog = Array.isArray(window.CE_LIBRARY_CATALOG) ? window.CE_LIBRARY_CATALOG : [];
  const list = document.querySelector('.articles');
  const tools = document.querySelector('.library-tools');
  if (!list || !tools || !catalog.length) return;

  const normalise = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9€]+/g,' ').trim();
  const seen = new Set();
  const items = catalog.filter(item => item.h && !seen.has(item.h) && seen.add(item.h));

  list.innerHTML = items.map((item,index) => `<article class="article-card filter-card" data-domain="${item.d}" data-content-type="${item.t}" data-tags="${item.k || ''}" data-original-order="${index}"><div><div class="card-meta"><span class="level-badge">${item.t === 'guide' ? 'Guide pratique' : 'Dossier'}</span><span class="theme-chip">${item.c}</span></div><h3>${item.n}</h3><p>${item.x}</p></div><a href="${item.h}">${item.t === 'guide' ? 'Ouvrir le guide' : 'Lire le dossier'} →</a></article>`).join('');

  tools.innerHTML = `<label class="library-search"><span class="filter-label">Rechercher :</span><input type="search" placeholder="Ex. formation rentable, vendre un bien, manager une équipe…" aria-label="Rechercher dans la bibliothèque"></label><div class="filter-group domain-filters"><span class="filter-label">Domaine :</span><button aria-pressed="true" class="filter-btn" data-domain="all">Tous</button><button aria-pressed="false" class="filter-btn" data-domain="patrimoine">Patrimoine</button><button aria-pressed="false" class="filter-btn" data-domain="vie-pro">Vie professionnelle</button></div><div class="results-count" data-results-count></div>`;

  const style = document.createElement('style');
  style.textContent = `.library-tools{display:grid;gap:.75rem;margin-bottom:1.2rem}.library-search{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}.library-search input{min-width:min(560px,82vw);padding:.72rem .82rem;border:1px solid rgba(16,24,32,.2);border-radius:10px;font:inherit}.filter-card.is-hidden{display:none!important}.results-count{font-weight:800;color:#657078}`;
  document.head.appendChild(style);

  const params = new URLSearchParams(location.search);
  const state = {domain:params.get('domain') || 'all',query:params.get('q') || ''};
  const aliases = {
    emploi:'candidature cv entretien recrutement recruteur travail poste',candidature:'emploi cv recrutement recruteur entretien',reconversion:'formation métier compétences emploi orientation immersion',formation:'reconversion métier diplôme compétences orientation débouchés roi vae',vae:'diplôme certification expérience formation compétences référentiel',diplome:'formation vae certification filtre recrutement qualification',
    salaire:'augmentation rémunération négociation responsabilités promotion carrière surqualification',augmentation:'salaire rémunération négociation responsabilités promotion',responsabilites:'salaire augmentation promotion périmètre carrière',promotion:'salaire responsabilités augmentation carrière visibilité',manager:'management équipe délégation responsable encadrement feedback',management:'manager équipe délégation responsable encadrement processus indicateur',invisible:'visibilité reconnaissance preuve carrière résultat',visibilite:'reconnaissance preuve carrière résultat invisible',quitter:'emploi stable rester démission mobilité carrière',demission:'quitter emploi stable mobilité carrière',senior:'50 ans expérience surqualification recruteur adaptation',surqualifie:'expérience salaire stabilité hiérarchie recruteur 50 ans',surqualification:'expérience salaire stabilité hiérarchie recruteur 50 ans',
    budget:'dépenses épargne argent finances revenu sécurité',epargne:'budget investissement placement capital livret liquidités réserve',liquidites:'réserve sécurité épargne précaution cash urgence',reserve:'liquidités sécurité épargne précaution urgence',assurance:'protection risque prévoyance franchise patrimoine',prevoyance:'assurance protection revenu risque',
    investir:'investissement allocation etf actions pea placement capital crédit analyse',investissement:'investir allocation etf actions pea placement capital crédit analyse',credit:'dette remboursement emprunt taux investissement',rembourser:'crédit dette remboursement anticipé investir',
    immobilier:'logement résidence locatif crédit acheter louer travaux vendre conserver scpi foncière',logement:'immobilier résidence acheter louer crédit vendre',acheter:'immobilier logement résidence crédit',vendre:'immobilier bien conserver capital rendement',conserver:'immobilier bien vendre capital rendement',scpi:'immobilier indirect liquidité frais patrimoine',fonciere:'immobilier indirect bourse patrimoine',
    analyse:'macro fondamental valorisation technique risque investissement portefeuille',macro:'croissance inflation taux crédit régime marché',fondamental:'roic wacc fcf marge bilan entreprise',valorisation:'dcf reverse dcf multiple fcf yield prix',technique:'tendance support résistance momentum volume invalidation',sizing:'taille position risque portefeuille concentration',
    prix:'tarif marge rentabilité coût client devis facturer',marge:'prix tarif rentabilité coût point mort entreprise',entreprendre:'entreprise client offre prix marge vente',client:'entreprise offre vente dépendance concentration prospection problème validation',concentration:'client dépendance risque chiffre affaires portefeuille',tresorerie:'cash bfr encaissement délai paiement entreprise',bfr:'trésorerie cash besoin fonds roulement encaissement',planning:'capacité charge occupation mission délai entreprise',capacite:'planning charge occupation mission rentabilité embauche sous-traitance',refuser:'capacité mission planning prix marge',embaucher:'salarié recrutement sous-traiter capacité coût fixe',sous:'traitance embaucher capacité prestataire',
    automatiser:'automatisation processus workflow roi maintenance productivité',automatisation:'processus workflow roi maintenance productivité temps erreur',workflow:'automatisation processus maintenance productivité',processus:'procédure organisation flux qualité délai indicateur amélioration',procedure:'processus organisation flux contrôle indicateur amélioration',indicateur:'mesure cible qualité processus management service',
    ia:'intelligence artificielle chatgpt automatisation vérification source',retraite:'décumulation transmission patrimoine revenus long terme',
    biais:'décision contradiction preuve hypothèse vérification scénario',confirmation:'décision contradiction preuve hypothèse vérification',taux:'probabilité scénario base crédit rendement',base:'probabilité scénario décision analyse',
    irrecuperable:'décision formation investissement continuer abandonner coût',sunk:'décision investissement formation coût irrécupérable',opportunite:'décision alternative capital temps investissement emploi prix',option:'décision flexibilité liquidité réversible mobilité',reversible:'décision flexibilité coût erreur mobilité',irreversible:'décision coût erreur flexibilité',second:'décision conséquence processus incitation investissement',asymetrie:'risque scénario gain perte investissement décision',securite:'marge risque réserve scénario prudent patrimoine'
  };

  const search = tools.querySelector('input[type="search"]');
  const domainButtons = [...tools.querySelectorAll('[data-domain]')];
  const count = tools.querySelector('[data-results-count]');
  const cards = [...list.querySelectorAll('.filter-card')];
  search.value = state.query;

  const queryTokens = query => {
    const base = normalise(query).split(/\s+/).filter(Boolean), expanded=[...base];
    base.forEach(token=>{if(aliases[token]) expanded.push(...normalise(aliases[token]).split(/\s+/));});
    return [...new Set(expanded)];
  };

  function scoreCard(card,query){
    if(!query.trim())return 0;
    const title=normalise(card.querySelector('h3')?.textContent),chip=normalise(card.querySelector('.theme-chip')?.textContent),desc=normalise(card.querySelector('p')?.textContent),tags=normalise(card.dataset.tags),phrase=normalise(query),tokens=queryTokens(query);
    let score=0;
    if(title===phrase)score+=180;else if(title.startsWith(phrase))score+=130;else if(title.includes(phrase))score+=90;
    if(chip.includes(phrase))score+=45;if(tags.includes(phrase))score+=45;if(desc.includes(phrase))score+=30;
    tokens.forEach(token=>{if(title.includes(token))score+=24;if(chip.includes(token))score+=12;if(tags.includes(token))score+=14;if(desc.includes(token))score+=7;});
    if(card.dataset.contentType==='guide')score+=20;else score+=9;
    return score;
  }

  function sync(){domainButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.domain===state.domain)));}
  function updateURL(){const next=new URLSearchParams();if(state.domain!=='all')next.set('domain',state.domain);if(state.query.trim())next.set('q',state.query.trim());history.replaceState(null,'',next.toString()?`?${next}`:location.pathname);}
  function apply(){
    const hasQuery=Boolean(state.query.trim());let visible=0;const ranked=[];
    cards.forEach(card=>{const domains=(card.dataset.domain||'').split(/\s+/),domainOK=state.domain==='all'||domains.includes(state.domain),score=scoreCard(card,state.query),queryOK=!hasQuery||score>0,show=domainOK&&queryOK;card.classList.toggle('is-hidden',!show);if(show){visible++;ranked.push({card,score,typePriority:card.dataset.contentType==='guide'?0:1,order:Number(card.dataset.originalOrder||0)});}});
    ranked.sort((a,b)=>hasQuery?(b.score-a.score||a.typePriority-b.typePriority||a.order-b.order):(a.typePriority-b.typePriority||a.order-b.order));
    ranked.forEach(x=>list.appendChild(x.card));
    count.textContent=`${visible} contenu${visible>1?'s':''}`;
    sync();updateURL();
  }

  domainButtons.forEach(b=>b.addEventListener('click',()=>{state.domain=b.dataset.domain;apply();}));
  search.addEventListener('input',()=>{state.query=search.value;apply();});
  apply();
})();