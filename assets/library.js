(() => {
  'use strict';

  const terrainEntries = [
    {domain:'vie-pro', theme:'travail', level:'1', type:'dossier', chip:'Recherche d’emploi', title:'50 candidatures, zéro réponse : avant d’en envoyer 50 de plus', desc:'Quand presque rien ne revient, multiplier les mêmes candidatures peut simplement multiplier ce qui ne fonctionne déjà pas.', tags:'emploi candidature cv recrutement réponse', href:'articles/50-candidatures-zero-reponse.html'},
    {domain:'vie-pro', theme:'travail', level:'1', type:'dossier', chip:'Entretien', title:'Vous décrochez des entretiens mais jamais le poste : où ça bloque ?', desc:'Si le CV ouvre la porte, cherchez le doute précis qui reste dans la tête du recruteur.', tags:'emploi entretien recruteur candidature risque', href:'articles/entretien-rate-ce-qui-bloque.html'},
    {domain:'vie-pro', theme:'travail', level:'1', type:'dossier', chip:'Retour à l’emploi', title:'Quand on veut retravailler vite : faut-il accepter n’importe quel poste ?', desc:'Un poste peut remettre les comptes à l’équilibre, mais aussi consommer le temps ou les options nécessaires pour rebondir.', tags:'emploi transition salaire chômage travail', href:'articles/accepter-nimporte-quel-poste-retour-emploi.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'dossier', chip:'Épargne', title:'Vous avez 50 000 € de côté mais vous n’osez rien en faire', desc:'Avant de chercher le meilleur placement, séparez sécurité, projets proches et capital réellement disponible à long terme.', tags:'épargne investir placement allocation livret 50000', href:'articles/50000-euros-livret-peur-investir.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'dossier', chip:'Budget', title:'Vous gagnez plus qu’avant mais vous n’épargnez toujours rien', desc:'Quand chaque hausse de revenu disparaît, regardez ce qui s’est installé dans les dépenses avant de chercher un meilleur placement.', tags:'budget dépenses épargne revenu finances personnelles', href:'articles/gagner-plus-epargner-moins.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'1', type:'dossier', chip:'Entrepreneuriat', title:'Tout le monde trouve votre idée intéressante, mais personne n’achète', desc:'Un compliment ne paie pas une facture : testez un prix réel et observez ce que les clients sont prêts à sacrifier.', tags:'entreprise client offre vente marché prix', href:'articles/clients-interesses-personne-nachete.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'1', type:'dossier', chip:'Prix & marge', title:'Vous travaillez beaucoup mais il ne reste presque rien', desc:'Un agenda plein n’est pas forcément rentable : temps invisible, déplacements, prix et marge peuvent détruire le résultat.', tags:'tarif prix marge rentabilité entrepreneur coûts', href:'articles/travailler-beaucoup-gagner-peu-prix.html'},
    {domain:'vie-pro patrimoine', theme:'ia', level:'1', type:'dossier', chip:'IA appliquée', title:'L’IA vous répond avec aplomb… et se trompe', desc:'Une réponse fluide et précise peut être fausse. Plus la décision coûte cher, plus la preuve redevient importante.', tags:'ia intelligence artificielle chatgpt erreur vérification source', href:'articles/ia-reponse-convaincante-fausse.html'},
    {domain:'vie-pro', theme:'ia', level:'1', type:'dossier', chip:'Organisation du travail', title:'Vous avez passé 30 minutes à automatiser une tâche de 5 minutes', desc:'Automatiser n’est utile que si le gain futur dépasse le temps de mise en place, la maintenance et la complexité ajoutée.', tags:'ia automatisation productivité temps travail', href:'articles/automatiser-tache-5-minutes-perdre-30.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'1', type:'dossier', chip:'Décision', title:'Vous hésitez depuis trois semaines entre deux options presque équivalentes', desc:'Quand deux choix restent proches après une vraie comparaison, le coût de ne pas décider peut dépasser leur différence.', tags:'décision choix hésitation comparaison options', href:'articles/hesiter-trois-semaines-deux-options.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'1', type:'dossier', chip:'Psychologie appliquée', title:'Vous continuez surtout parce que vous avez déjà trop investi', desc:'Ce qui a déjà coûté du temps ou de l’argent sert à apprendre ; cela ne justifie pas automatiquement la prochaine dépense.', tags:'coût irrécupérable sunk cost investissement décision biais', href:'articles/continuer-parce-quon-a-deja-trop-investi.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'dossier', chip:'Démarches', title:'On vous demande un document que vous ne pouvez pas fournir : que faire ?', desc:'Quand la procédure tourne en rond, cherchez ce que la pièce est censée prouver et qui peut accepter une preuve équivalente.', tags:'administratif démarche justificatif procédure blocage', href:'articles/justificatif-impossible-procedure-bloquee.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'dossier', chip:'Management', title:'Le compteur monte, le service se dégrade', desc:'Une équipe peut améliorer tous ses chiffres et pourtant rendre un moins bon service lorsque l’indicateur devient l’objectif.', tags:'management indicateur kpi qualité service objectif', href:'articles/indicateur-monte-service-se-degrade.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'dossier', chip:'Organisation', title:'Cette règle paraît absurde : avant de la contourner, cherchez ce qu’elle protège', desc:'Une mauvaise règle peut répondre à un vrai risque. Comprendre sa fonction permet de simplifier sans recréer le problème.', tags:'organisation procédure règle risque système travail', href:'articles/regle-absurde-logique-cachee.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'guide', chip:'Budget', title:'Où part votre argent ? Faire l’audit de son budget en 60 minutes', desc:'Trois mois de relevés, quatre nombres, un tableau à recopier et trois corrections maximum pour rendre le budget réellement pilotable.', tags:'budget relevés dépenses épargne finances audit', href:'dossiers/audit-budget-60-minutes.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'2', type:'guide', chip:'Économie d’activité', title:'Quel prix minimum facturer pour gagner réellement de l’argent ?', desc:'Capacité facturable, coûts fixes et variables, marge contributive, point mort, coût d’opportunité, concentration client et scénarios de sensibilité.', tags:'prix tarif marge rentabilité seuil point mort client entreprise devis', href:'dossiers/calculer-prix-minimum-rentable.html'},
    {domain:'vie-pro', theme:'travail', level:'2', type:'guide', chip:'Recherche d’emploi', title:'30 jours pour relancer une recherche d’emploi qui tourne en rond', desc:'Segmenter le marché, construire les preuves, suivre l’entonnoir de conversion, tester deux versions et traiter le risque perçu en entretien.', tags:'emploi cv candidature recrutement entretien recherche chômage', href:'dossiers/plan-30-jours-recherche-emploi.html'},
    {domain:'vie-pro patrimoine', theme:'ia', level:'1', type:'guide', chip:'IA appliquée', title:'Avant de croire une réponse IA : le protocole de vérification en 10 minutes', desc:'Classer le risque, isoler le fait central, hiérarchiser les sources, chercher la contradiction et décider du niveau de confiance.', tags:'ia intelligence artificielle source vérifier hallucination chatgpt', href:'dossiers/protocole-verifier-reponse-ia.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'2', type:'guide', chip:'Décision', title:'Prendre une décision importante sans tourner en rond', desc:'Taux de base, coût d’erreur, valeur de l’option, coûts irrécupérables, biais de confirmation, effets de second ordre et pré-mortem.', tags:'décision choix matrice risque option pré mortem biais', href:'dossiers/decider-sans-tourner-en-rond.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'guide', chip:'Démarches', title:'Démarche bloquée : comment sortir d’une boucle administrative', desc:'Identifier ce que la pièce cherche à prouver, construire une chronologie, obtenir un motif écrit, proposer une preuve équivalente et escalader proprement.', tags:'administratif démarche blocage justificatif recours procédure', href:'dossiers/debloquer-demarche-administrative.html'}
  ];

  const conceptPaths = new Set([
    'articles/majorite-peut-se-tromper.html','articles/bonnes-questions.html','articles/comprendre-avant-agir.html','articles/biais-confirmation.html','articles/penser-en-probabilites.html','articles/effet-de-cadrage.html','articles/modeles-mentaux.html','articles/decisions-reversibles-irreversibles.html','articles/risque-incertitude.html','articles/taux-de-base.html','articles/asymetrie.html','articles/strategie-barbell.html','articles/effets-second-ordre.html','articles/incitations-gouvernent.html','articles/boucles-retroaction.html','articles/mesure-devient-cible.html','articles/dependance-au-sentier.html','articles/probleme-symptome-cause.html','articles/contraintes-innovation.html','articles/information-comprehension.html','articles/simplifier-sans-trahir.html','articles/effets-de-reseau.html','articles/effet-de-levier.html'
  ]);
  const dualDomainPaths = new Set([
    'articles/decision-difficile-options-imparfaites.html','articles/majorite-peut-se-tromper.html','articles/bonnes-questions.html','articles/comprendre-avant-agir.html','articles/biais-confirmation.html','articles/penser-en-probabilites.html','articles/effet-de-cadrage.html','articles/modeles-mentaux.html','articles/decisions-reversibles-irreversibles.html','articles/risque-incertitude.html','articles/taux-de-base.html','articles/information-comprehension.html','articles/simplifier-sans-trahir.html','articles/continuer-parce-quon-a-deja-trop-investi.html','articles/hesiter-trois-semaines-deux-options.html','articles/ia-reponse-convaincante-fausse.html','dossiers/protocole-verifier-reponse-ia.html','dossiers/decider-sans-tourner-en-rond.html'
  ]);

  const list = document.querySelector('.articles');
  const tools = document.querySelector('.library-tools');
  if (!list || !tools) return;

  const existing = new Set([...list.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
  const fresh = terrainEntries.filter(item => !existing.has(item.href));
  if (fresh.length) {
    list.insertAdjacentHTML('afterbegin', fresh.map(item => `<article class="article-card filter-card" data-level="${item.level}" data-theme="${item.theme}" data-domain="${item.domain}" data-content-type="${item.type}" data-tags="${item.tags}"><div><div class="card-meta"><span class="level-badge level-1">${item.type === 'guide' ? 'Guide pratique' : 'Dossier'}</span><span class="theme-chip">${item.chip}</span></div><h3>${item.title}</h3><p>${item.desc}</p></div><a href="${item.href}">${item.type === 'guide' ? 'Ouvrir le guide' : 'Lire le dossier'} →</a></article>`).join(''));
  }

  const normalise = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9€]+/g,' ').trim();
  const cards = [...list.querySelectorAll('.filter-card')];

  cards.forEach((card, index) => {
    card.dataset.originalOrder = String(index);
    const href = card.querySelector('a[href]')?.getAttribute('href') || '';
    const theme = card.dataset.theme || '';
    if (!card.dataset.domain) {
      if (theme === 'argent') card.dataset.domain = 'patrimoine';
      else if (theme === 'travail' || theme === 'entreprendre') card.dataset.domain = 'vie-pro';
      else if (dualDomainPaths.has(href)) card.dataset.domain = 'vie-pro patrimoine';
      else card.dataset.domain = 'vie-pro';
    }
    if (conceptPaths.has(href)) card.dataset.contentType = 'reference';
    else if (!card.dataset.contentType) card.dataset.contentType = 'dossier';

    const badge = card.querySelector('.level-badge');
    const link = card.querySelector(':scope > a[href], div + a[href]') || card.querySelector('a[href]');
    if (card.dataset.contentType === 'reference') {
      card.classList.add('support-note');
      if (badge) badge.textContent = 'Référence';
      const chip = card.querySelector('.theme-chip');
      if (chip) chip.textContent = 'Notion d’appui';
      if (link) link.textContent = 'Approfondir →';
    } else if (card.dataset.contentType === 'guide') {
      if (badge) badge.textContent = 'Guide pratique';
      if (link) link.textContent = 'Ouvrir le guide →';
    } else {
      if (badge) badge.textContent = 'Dossier';
      if (link) link.textContent = 'Lire le dossier →';
    }
  });

  const hero = document.querySelector('.article-hero');
  if (hero) {
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    if (h1) h1.textContent = 'Trouvez le dossier qui répond à votre situation.';
    if (p) p.textContent = 'Recherchez directement un problème ou filtrez par domaine. Les références conceptuelles restent disponibles sans encombrer les résultats principaux.';
  }

  const oldGroups = [...tools.querySelectorAll('.filter-group')];
  oldGroups.forEach(group => group.remove());
  tools.querySelector('.library-search')?.remove();

  const searchWrap = document.createElement('label');
  searchWrap.className = 'library-search';
  searchWrap.innerHTML = '<span class="filter-label">Rechercher :</span><input type="search" placeholder="Ex. acheter un logement, changer de métier, fixer mes prix…" aria-label="Rechercher dans la bibliothèque">';
  tools.prepend(searchWrap);

  const domainGroup = document.createElement('div');
  domainGroup.className = 'filter-group';
  domainGroup.innerHTML = '<span class="filter-label">Domaine :</span><button aria-pressed="true" class="filter-btn" data-domain="all">Tous</button><button aria-pressed="false" class="filter-btn" data-domain="patrimoine">Patrimoine</button><button aria-pressed="false" class="filter-btn" data-domain="vie-pro">Vie professionnelle</button>';
  searchWrap.insertAdjacentElement('afterend', domainGroup);

  const referenceControl = document.createElement('div');
  referenceControl.className = 'library-reference-control';
  referenceControl.innerHTML = '<button type="button" class="filter-btn reference-toggle" aria-pressed="false">Afficher les références et notions</button><span>Les guides et dossiers restent prioritaires.</span>';
  domainGroup.insertAdjacentElement('afterend', referenceControl);

  const style = document.createElement('style');
  style.textContent = '.library-reference-control{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap;margin:.45rem 0 .2rem}.library-reference-control span{font-size:.82rem;color:#657078}.filter-card.is-hidden{display:none!important}.filter-card.support-note{background:#faf9f5}.library-tools .library-search{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}.library-tools .library-search input{min-width:min(520px,80vw);padding:.7rem .8rem;border:1px solid rgba(16,24,32,.2);border-radius:10px;font:inherit}.results-count{margin-top:.55rem}';
  document.head.appendChild(style);

  const params = new URLSearchParams(location.search);
  const legacyTheme = params.get('theme');
  const legacyDomain = legacyTheme === 'argent' ? 'patrimoine' : ['travail','entreprendre','ia','decisions','systemes'].includes(legacyTheme) ? 'vie-pro' : 'all';
  const state = {
    domain: params.get('domain') || legacyDomain,
    query: params.get('q') || '',
    showReferences: params.get('references') === '1'
  };

  const search = searchWrap.querySelector('input');
  const domainButtons = [...domainGroup.querySelectorAll('[data-domain]')];
  const referenceButton = referenceControl.querySelector('.reference-toggle');
  const count = tools.querySelector('[data-results-count]');
  search.value = state.query;

  const aliases = {
    'emploi':'candidature cv entretien recrutement recruteur travail poste',
    'candidature':'emploi cv recrutement recruteur entretien',
    'reconversion':'formation métier compétences emploi orientation',
    'formation':'reconversion métier diplôme compétences orientation',
    'budget':'dépenses épargne argent finances revenu',
    'epargne':'budget investissement placement capital livret',
    'investir':'investissement allocation etf actions pea placement capital',
    'investissement':'investir allocation etf actions pea placement capital',
    'immobilier':'logement résidence locatif crédit acheter louer travaux',
    'logement':'immobilier résidence acheter louer crédit',
    'acheter':'immobilier logement résidence crédit',
    'prix':'tarif marge rentabilité coût client devis facturer',
    'marge':'prix tarif rentabilité coût point mort entreprise',
    'entreprendre':'entreprise client offre prix marge vente',
    'ia':'intelligence artificielle chatgpt automatisation vérification source',
    'retraite':'décumulation transmission patrimoine revenus long terme'
  };

  function queryTokens(query) {
    const base = normalise(query).split(/\s+/).filter(Boolean);
    const expanded = [...base];
    base.forEach(token => {
      const alias = aliases[token];
      if (alias) expanded.push(...normalise(alias).split(/\s+/));
    });
    return [...new Set(expanded)];
  }

  function scoreCard(card, query) {
    if (!query.trim()) return 0;
    const title = normalise(card.querySelector('h3')?.textContent);
    const chip = normalise(card.querySelector('.theme-chip')?.textContent);
    const desc = normalise(card.querySelector('p')?.textContent);
    const tags = normalise(card.dataset.tags);
    const phrase = normalise(query);
    const tokens = queryTokens(query);
    let score = 0;
    if (title === phrase) score += 180;
    else if (title.startsWith(phrase)) score += 130;
    else if (title.includes(phrase)) score += 90;
    if (chip.includes(phrase)) score += 45;
    if (tags.includes(phrase)) score += 45;
    if (desc.includes(phrase)) score += 30;
    tokens.forEach(token => {
      if (title.includes(token)) score += 24;
      if (chip.includes(token)) score += 12;
      if (tags.includes(token)) score += 14;
      if (desc.includes(token)) score += 7;
    });
    if (card.dataset.contentType === 'guide') score += 18;
    else if (card.dataset.contentType === 'dossier') score += 8;
    else if (card.dataset.contentType === 'reference') score -= 12;
    return score;
  }

  function syncControls() {
    domainButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.domain === state.domain)));
    referenceButton.setAttribute('aria-pressed', String(state.showReferences));
    referenceButton.textContent = state.showReferences ? 'Masquer les références et notions' : 'Afficher les références et notions';
  }

  function updateURL() {
    const next = new URLSearchParams();
    if (state.domain !== 'all') next.set('domain', state.domain);
    if (state.query.trim()) next.set('q', state.query.trim());
    if (state.showReferences) next.set('references','1');
    history.replaceState(null,'',next.toString() ? `?${next}` : location.pathname);
  }

  function applyFilters() {
    const hasQuery = Boolean(state.query.trim());
    let visible = 0;
    const ranked = [];
    cards.forEach(card => {
      const domains = (card.dataset.domain || '').split(/\s+/);
      const domainOK = state.domain === 'all' || domains.includes(state.domain);
      const isReference = card.dataset.contentType === 'reference';
      const score = scoreCard(card, state.query);
      const queryOK = !hasQuery || score > 0;
      const referenceOK = !isReference || state.showReferences || hasQuery;
      const show = domainOK && queryOK && referenceOK;
      card.classList.toggle('is-hidden', !show);
      if (show) {
        visible += 1;
        const typePriority = card.dataset.contentType === 'guide' ? 0 : card.dataset.contentType === 'dossier' ? 1 : 2;
        ranked.push({card, score, typePriority, order:Number(card.dataset.originalOrder || 0)});
      }
    });

    ranked.sort((a,b) => hasQuery ? (b.score-a.score || a.typePriority-b.typePriority || a.order-b.order) : (a.typePriority-b.typePriority || a.order-b.order));
    ranked.forEach(item => list.appendChild(item.card));
    if (count) count.textContent = `${visible} contenu${visible > 1 ? 's' : ''}`;
    syncControls();
    updateURL();
  }

  domainButtons.forEach(button => button.addEventListener('click', () => { state.domain = button.dataset.domain; applyFilters(); }));
  referenceButton.addEventListener('click', () => { state.showReferences = !state.showReferences; applyFilters(); });
  search.addEventListener('input', () => { state.query = search.value; applyFilters(); });
  syncControls();
  applyFilters();
})();