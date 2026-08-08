(() => {
  const terrainEntries = [
    {domain:'vie-pro', theme:'travail', level:'1', type:'terrain', chip:'Recherche d’emploi', title:'50 candidatures, zéro réponse : avant d’en envoyer 50 de plus', desc:'Quand presque rien ne revient, multiplier les mêmes candidatures peut simplement multiplier ce qui ne fonctionne déjà pas.', href:'articles/50-candidatures-zero-reponse.html'},
    {domain:'vie-pro', theme:'travail', level:'1', type:'terrain', chip:'Entretien', title:'Vous décrochez des entretiens mais jamais le poste : où ça bloque ?', desc:'Si le CV ouvre la porte, cherchez le doute précis qui reste dans la tête du recruteur.', href:'articles/entretien-rate-ce-qui-bloque.html'},
    {domain:'vie-pro', theme:'travail', level:'1', type:'terrain', chip:'Retour à l’emploi', title:'Quand on veut retravailler vite : faut-il accepter n’importe quel poste ?', desc:'Un poste peut remettre les comptes à l’équilibre, mais aussi consommer le temps ou les options nécessaires pour rebondir.', href:'articles/accepter-nimporte-quel-poste-retour-emploi.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'terrain', chip:'Épargne', title:'Vous avez 50 000 € de côté mais vous n’osez rien en faire', desc:'Avant de chercher le meilleur placement, séparez sécurité, projets proches et capital réellement disponible à long terme.', href:'articles/50000-euros-livret-peur-investir.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'terrain', chip:'Budget', title:'Vous gagnez plus qu’avant mais vous n’épargnez toujours rien', desc:'Quand chaque hausse de revenu disparaît, regardez ce qui s’est installé dans les dépenses avant de chercher un meilleur placement.', href:'articles/gagner-plus-epargner-moins.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'1', type:'terrain', chip:'Entrepreneuriat', title:'Tout le monde trouve votre idée intéressante, mais personne n’achète', desc:'Un compliment ne paie pas une facture : testez un prix réel et observez ce que les clients sont prêts à sacrifier.', href:'articles/clients-interesses-personne-nachete.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'1', type:'terrain', chip:'Prix & marge', title:'Vous travaillez beaucoup mais il ne reste presque rien', desc:'Un agenda plein n’est pas forcément rentable : temps invisible, déplacements, prix et marge peuvent détruire le résultat.', href:'articles/travailler-beaucoup-gagner-peu-prix.html'},
    {domain:'vie-pro patrimoine', theme:'ia', level:'1', type:'terrain', chip:'IA appliquée', title:'L’IA vous répond avec aplomb… et se trompe', desc:'Une réponse fluide et précise peut être fausse. Plus la décision coûte cher, plus la preuve redevient importante.', href:'articles/ia-reponse-convaincante-fausse.html'},
    {domain:'vie-pro', theme:'ia', level:'1', type:'terrain', chip:'Organisation du travail', title:'Vous avez passé 30 minutes à automatiser une tâche de 5 minutes', desc:'Automatiser n’est utile que si le gain futur dépasse le temps de mise en place, la maintenance et la complexité ajoutée.', href:'articles/automatiser-tache-5-minutes-perdre-30.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'1', type:'terrain', chip:'Décision appliquée', title:'Vous hésitez depuis trois semaines entre deux options presque équivalentes', desc:'Quand deux choix restent proches après une vraie comparaison, le coût de ne pas décider peut dépasser leur différence.', href:'articles/hesiter-trois-semaines-deux-options.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'1', type:'terrain', chip:'Psychologie appliquée', title:'Vous continuez surtout parce que vous avez déjà trop investi', desc:'Ce qui a déjà coûté du temps ou de l’argent sert à apprendre ; cela ne justifie pas automatiquement la prochaine dépense.', href:'articles/continuer-parce-quon-a-deja-trop-investi.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'terrain', chip:'Démarches', title:'On vous demande un document que vous ne pouvez pas fournir : que faire ?', desc:'Quand la procédure tourne en rond, cherchez ce que la pièce est censée prouver et qui peut accepter une preuve équivalente.', href:'articles/justificatif-impossible-procedure-bloquee.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'terrain', chip:'Management', title:'Le compteur monte, le service se dégrade', desc:'Une équipe peut améliorer tous ses chiffres et pourtant rendre un moins bon service lorsque l’indicateur devient l’objectif.', href:'articles/indicateur-monte-service-se-degrade.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'terrain', chip:'Organisation', title:'Cette règle paraît absurde : avant de la contourner, cherchez ce qu’elle protège', desc:'Une mauvaise règle peut répondre à un vrai risque. Comprendre sa fonction permet de simplifier sans recréer le problème.', href:'articles/regle-absurde-logique-cachee.html'},
    {domain:'patrimoine', theme:'argent', level:'1', type:'guide', chip:'Budget', title:'Où part votre argent ? Faire l’audit de son budget en 60 minutes', desc:'Trois mois de relevés, quatre nombres, un tableau à recopier et trois corrections maximum pour rendre le budget réellement pilotable.', href:'dossiers/audit-budget-60-minutes.html'},
    {domain:'vie-pro', theme:'entreprendre', level:'1', type:'guide', chip:'Prix & marge', title:'Quel prix minimum facturer pour ne pas travailler à perte ?', desc:'Calculer le temps total, les coûts invisibles, la marge de risque et le prix plancher d’une prestation avec une méthode reproductible.', href:'dossiers/calculer-prix-minimum-rentable.html'},
    {domain:'vie-pro', theme:'travail', level:'1', type:'guide', chip:'Recherche d’emploi', title:'30 jours pour relancer une recherche d’emploi qui tourne en rond', desc:'Un plan en quatre semaines avec ciblage, tableau exigence/preuve, deux séries de candidatures, suivi des conversions et préparation d’entretien.', href:'dossiers/plan-30-jours-recherche-emploi.html'},
    {domain:'vie-pro patrimoine', theme:'ia', level:'1', type:'guide', chip:'IA appliquée', title:'Avant de croire une réponse IA : le protocole de vérification en 10 minutes', desc:'Classer le risque, isoler le fait central, hiérarchiser les sources, chercher la contradiction et décider du niveau de confiance.', href:'dossiers/protocole-verifier-reponse-ia.html'},
    {domain:'vie-pro patrimoine', theme:'decisions', level:'1', type:'guide', chip:'Décision appliquée', title:'Prendre une décision importante sans tourner en rond', desc:'Cinq critères, coût d’erreur, réversibilité, hypothèses à tester, pré-mortem, matrice et journal de décision.', href:'dossiers/decider-sans-tourner-en-rond.html'},
    {domain:'vie-pro', theme:'systemes', level:'1', type:'guide', chip:'Démarches', title:'Démarche bloquée : comment sortir d’une boucle administrative', desc:'Identifier ce que la pièce cherche à prouver, construire une chronologie, obtenir un motif écrit, proposer une preuve équivalente et escalader proprement.', href:'dossiers/debloquer-demarche-administrative.html'}
  ];

  const list = document.querySelector('.articles');
  if (list) {
    const existing = new Set([...list.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    const fresh = terrainEntries.filter(item => !existing.has(item.href));
    if (fresh.length) {
      const html = fresh.map(item => {
        const label = item.type === 'guide' ? 'Guide pratique' : 'Dossier terrain';
        return `<article class="article-card filter-card" data-level="${item.level}" data-theme="${item.theme}" data-domain="${item.domain}" data-terrain="true"><div><div class="card-meta"><span class="level-badge level-1">${label}</span><span class="theme-chip">${item.chip}</span></div><h3>${item.title}</h3><p>${item.desc}</p></div><a href="${item.href}">${item.type === 'guide' ? 'Ouvrir le guide' : 'Lire le dossier'} →</a></article>`;
      }).join('');
      list.insertAdjacentHTML('afterbegin', html);
    }
  }

  const dualDomainPaths = new Set([
    'articles/decision-difficile-options-imparfaites.html','articles/majorite-peut-se-tromper.html','articles/bonnes-questions.html','articles/comprendre-avant-agir.html','articles/biais-confirmation.html','articles/penser-en-probabilites.html','articles/effet-de-cadrage.html','articles/modeles-mentaux.html','articles/decisions-reversibles-irreversibles.html','articles/risque-incertitude.html','articles/taux-de-base.html','articles/information-comprehension.html','articles/simplifier-sans-trahir.html','articles/continuer-parce-quon-a-deja-trop-investi.html','articles/hesiter-trois-semaines-deux-options.html','articles/ia-reponse-convaincante-fausse.html','dossiers/protocole-verifier-reponse-ia.html','dossiers/decider-sans-tourner-en-rond.html'
  ]);

  const cards = [...document.querySelectorAll('.filter-card')];
  cards.forEach(card => {
    if (card.dataset.domain) return;
    const theme = card.dataset.theme;
    const href = card.querySelector('a[href]')?.getAttribute('href') || '';
    if (theme === 'argent') card.dataset.domain = 'patrimoine';
    else if (theme === 'travail' || theme === 'entreprendre') card.dataset.domain = 'vie-pro';
    else if (dualDomainPaths.has(href)) card.dataset.domain = 'vie-pro patrimoine';
    else if (theme === 'ia' || theme === 'decisions' || theme === 'systemes') card.dataset.domain = 'vie-pro';
    else card.dataset.domain = 'vie-pro';
  });

  const buttons = [...document.querySelectorAll('.filter-btn')];
  const count = document.querySelector('[data-results-count]');
  const tools = document.querySelector('.library-tools');
  if (!cards.length || !tools) return;

  const hero = document.querySelector('.article-hero');
  if (hero) {
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    if (h1) h1.textContent = 'Tous les contenus, rangés selon leur terrain d’application.';
    if (p) p.textContent = 'Patrimoine ou vie professionnelle. Les contenus de psychologie, IA, décisions et systèmes sont intégrés là où ils servent réellement.';
  }

  const themeGroup = tools.querySelector('[data-filter-group="theme"]')?.closest('.filter-group');
  if (themeGroup) themeGroup.innerHTML = '<span class="filter-label">Domaine :</span><button aria-pressed="true" class="filter-btn" data-filter-group="domain" data-filter-value="all">Tous</button><button aria-pressed="false" class="filter-btn" data-filter-group="domain" data-filter-value="patrimoine">Patrimoine</button><button aria-pressed="false" class="filter-btn" data-filter-group="domain" data-filter-value="vie-pro">Vie professionnelle</button>';
  const levelLabel = [...tools.querySelectorAll('.filter-label')].find(el => el.textContent.trim().startsWith('Niveau'));
  if (levelLabel) levelLabel.textContent = 'Profondeur :';

  const filterButtons = [...tools.querySelectorAll('.filter-btn')];
  const params = new URLSearchParams(location.search);
  const legacyTheme = params.get('theme');
  const legacyDomain = legacyTheme === 'argent' ? 'patrimoine' : (legacyTheme === 'travail' || legacyTheme === 'entreprendre' || legacyTheme === 'ia' || legacyTheme === 'decisions' || legacyTheme === 'systemes') ? 'vie-pro' : 'all';
  const state = {
    domain: params.get('domain') || legacyDomain,
    level: params.get('level') || 'all',
    query: params.get('q') || ''
  };

  const searchWrap = document.createElement('label');
  searchWrap.className = 'library-search';
  searchWrap.innerHTML = '<span class="filter-label">Rechercher :</span><input type="search" placeholder="Problème, situation ou mot-clé" aria-label="Rechercher dans la bibliothèque">';
  tools.prepend(searchWrap);
  const search = searchWrap.querySelector('input');
  search.value = state.query;

  function syncButtons() {
    filterButtons.forEach(button => {
      const group = button.dataset.filterGroup;
      button.setAttribute('aria-pressed', String(state[group] === button.dataset.filterValue));
    });
  }

  function updateURL() {
    const next = new URLSearchParams();
    if (state.domain !== 'all') next.set('domain', state.domain);
    if (state.level !== 'all') next.set('level', state.level);
    if (state.query) next.set('q', state.query);
    history.replaceState(null, '', next.toString() ? `?${next}` : location.pathname);
  }

  function applyFilters() {
    const needle = state.query.trim().toLocaleLowerCase('fr');
    let visible = 0;
    cards.forEach(card => {
      const domains = (card.dataset.domain || '').split(/\s+/);
      const domainOK = state.domain === 'all' || domains.includes(state.domain);
      const levelOK = state.level === 'all' || card.dataset.level === state.level;
      const textOK = !needle || card.innerText.toLocaleLowerCase('fr').includes(needle);
      const show = domainOK && levelOK && textOK;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} contenu${visible > 1 ? 's' : ''}`;
    syncButtons();
    updateURL();
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    state[button.dataset.filterGroup] = button.dataset.filterValue;
    applyFilters();
  }));
  search.addEventListener('input', () => { state.query = search.value; applyFilters(); });
  syncButtons();
  applyFilters();
})();