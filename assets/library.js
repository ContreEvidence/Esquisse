(() => {
  const terrainEntries = [
    {theme:'travail', level:'1', type:'terrain', chip:'Recherche d’emploi', title:'50 candidatures, zéro réponse : avant d’en envoyer 50 de plus', desc:'Quand presque rien ne revient, multiplier les mêmes candidatures peut simplement multiplier ce qui ne fonctionne déjà pas.', href:'articles/50-candidatures-zero-reponse.html'},
    {theme:'travail', level:'1', type:'terrain', chip:'Entretien', title:'Vous décrochez des entretiens mais jamais le poste : où ça bloque ?', desc:'Si le CV ouvre la porte, cherchez le doute précis qui reste dans la tête du recruteur.', href:'articles/entretien-rate-ce-qui-bloque.html'},
    {theme:'travail', level:'1', type:'terrain', chip:'Retour à l’emploi', title:'Quand on veut retravailler vite : faut-il accepter n’importe quel poste ?', desc:'Un poste peut remettre les comptes à l’équilibre, mais aussi consommer le temps, la santé ou les options nécessaires pour rebondir.', href:'articles/accepter-nimporte-quel-poste-retour-emploi.html'},
    {theme:'argent', level:'1', type:'terrain', chip:'Finances', title:'Vous avez 50 000 € de côté mais vous n’osez rien en faire', desc:'Avant de chercher le meilleur placement, séparez l’argent de sécurité, les projets proches et le capital réellement disponible à long terme.', href:'articles/50000-euros-livret-peur-investir.html'},
    {theme:'argent', level:'1', type:'terrain', chip:'Finances', title:'Vous gagnez plus qu’avant mais vous n’épargnez toujours rien', desc:'Quand chaque hausse de revenu disparaît, regardez ce qui s’est installé dans les dépenses avant de chercher un meilleur placement.', href:'articles/gagner-plus-epargner-moins.html'},
    {theme:'entreprendre', level:'1', type:'terrain', chip:'Entreprendre', title:'Tout le monde trouve votre idée intéressante, mais personne n’achète', desc:'Un compliment ne paie pas une facture : testez un prix réel et observez ce que les clients sont prêts à sacrifier.', href:'articles/clients-interesses-personne-nachete.html'},
    {theme:'entreprendre', level:'1', type:'terrain', chip:'Entreprendre', title:'Vous travaillez beaucoup mais il ne reste presque rien', desc:'Un agenda plein n’est pas forcément rentable : temps invisible, déplacements, prix et marge peuvent détruire le résultat.', href:'articles/travailler-beaucoup-gagner-peu-prix.html'},
    {theme:'ia', level:'1', type:'terrain', chip:'IA & technologie', title:'L’IA vous répond avec aplomb… et se trompe', desc:'Une réponse fluide et précise peut être fausse. Plus la décision coûte cher, plus la preuve redevient importante.', href:'articles/ia-reponse-convaincante-fausse.html'},
    {theme:'ia', level:'1', type:'terrain', chip:'IA & technologie', title:'Vous avez passé 30 minutes à automatiser une tâche de 5 minutes', desc:'Automatiser n’est utile que si le gain futur dépasse le temps de mise en place, la maintenance et la complexité ajoutée.', href:'articles/automatiser-tache-5-minutes-perdre-30.html'},
    {theme:'decisions', level:'1', type:'terrain', chip:'Décisions', title:'Vous hésitez depuis trois semaines entre deux options presque équivalentes', desc:'Quand deux choix restent proches après une vraie comparaison, le coût de ne pas décider peut dépasser leur différence.', href:'articles/hesiter-trois-semaines-deux-options.html'},
    {theme:'decisions', level:'1', type:'terrain', chip:'Décisions', title:'Vous continuez surtout parce que vous avez déjà trop investi', desc:'Ce qui a déjà coûté du temps ou de l’argent sert à apprendre ; cela ne justifie pas automatiquement la prochaine dépense.', href:'articles/continuer-parce-quon-a-deja-trop-investi.html'},
    {theme:'systemes', level:'1', type:'terrain', chip:'Systèmes', title:'On vous demande un document que vous ne pouvez pas fournir : que faire ?', desc:'Quand la procédure tourne en rond, cherchez ce que la pièce est censée prouver et qui peut accepter une preuve équivalente.', href:'articles/justificatif-impossible-procedure-bloquee.html'},
    {theme:'systemes', level:'1', type:'terrain', chip:'Systèmes', title:'Le compteur monte, le service se dégrade', desc:'Une équipe peut améliorer tous ses chiffres et pourtant rendre un moins bon service lorsque l’indicateur devient l’objectif.', href:'articles/indicateur-monte-service-se-degrade.html'},
    {theme:'systemes', level:'1', type:'terrain', chip:'Systèmes', title:'Cette règle paraît absurde : avant de la contourner, cherchez ce qu’elle protège', desc:'Une mauvaise règle peut répondre à un vrai risque. Comprendre sa fonction permet de simplifier sans recréer le problème.', href:'articles/regle-absurde-logique-cachee.html'},
    {theme:'argent', level:'1', type:'guide', chip:'Budget', title:'Où part votre argent ? Faire l’audit de son budget en 60 minutes', desc:'Trois mois de relevés, quatre nombres, un tableau à recopier et trois corrections maximum pour rendre le budget réellement pilotable.', href:'dossiers/audit-budget-60-minutes.html'},
    {theme:'entreprendre', level:'1', type:'guide', chip:'Prix & marge', title:'Quel prix minimum facturer pour ne pas travailler à perte ?', desc:'Calculer le temps total, les coûts invisibles, la marge de risque et le prix plancher d’une prestation avec une méthode reproductible.', href:'dossiers/calculer-prix-minimum-rentable.html'},
    {theme:'travail', level:'1', type:'guide', chip:'Recherche d’emploi', title:'30 jours pour relancer une recherche d’emploi qui tourne en rond', desc:'Un plan en quatre semaines avec ciblage, tableau exigence/preuve, deux séries de candidatures, suivi des conversions et préparation d’entretien.', href:'dossiers/plan-30-jours-recherche-emploi.html'},
    {theme:'ia', level:'1', type:'guide', chip:'Vérification', title:'Avant de croire une réponse IA : le protocole de vérification en 10 minutes', desc:'Classer le risque, isoler le fait central, hiérarchiser les sources, chercher la contradiction et décider du niveau de confiance.', href:'dossiers/protocole-verifier-reponse-ia.html'},
    {theme:'decisions', level:'1', type:'guide', chip:'Méthode de décision', title:'Prendre une décision importante sans tourner en rond', desc:'Cinq critères, coût d’erreur, réversibilité, hypothèses à tester, pré-mortem, matrice et journal de décision.', href:'dossiers/decider-sans-tourner-en-rond.html'},
    {theme:'systemes', level:'1', type:'guide', chip:'Démarches', title:'Démarche bloquée : comment sortir d’une boucle administrative', desc:'Identifier ce que la pièce cherche à prouver, construire une chronologie, obtenir un motif écrit, proposer une preuve équivalente et escalader proprement.', href:'dossiers/debloquer-demarche-administrative.html'}
  ];

  const list = document.querySelector('.articles');
  if (list) {
    const existing = new Set([...list.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    const fresh = terrainEntries.filter(item => !existing.has(item.href));
    if (fresh.length) {
      const html = fresh.map(item => {
        const label = item.type === 'guide' ? 'Guide pratique' : 'Dossier terrain';
        return `<article class="article-card filter-card" data-level="${item.level}" data-theme="${item.theme}" data-terrain="true"><div><div class="card-meta"><span class="level-badge level-1">${label}</span><span class="theme-chip">${item.chip}</span></div><h3>${item.title}</h3><p>${item.desc}</p></div><a href="${item.href}">${item.type === 'guide' ? 'Ouvrir le guide' : 'Lire le dossier'} →</a></article>`;
      }).join('');
      list.insertAdjacentHTML('afterbegin', html);
    }
  }

  const cards = [...document.querySelectorAll('.filter-card')];
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const count = document.querySelector('[data-results-count]');
  const tools = document.querySelector('.library-tools');
  if (!cards.length || !buttons.length || !tools) return;

  const params = new URLSearchParams(location.search);
  const state = {
    theme: params.get('theme') || 'all',
    level: params.get('level') || 'all',
    query: params.get('q') || ''
  };

  const searchWrap = document.createElement('label');
  searchWrap.className = 'library-search';
  searchWrap.innerHTML = '<span class="filter-label">Rechercher :</span><input type="search" placeholder="Titre, sujet ou mot-clé" aria-label="Rechercher dans la bibliothèque">';
  tools.prepend(searchWrap);
  const search = searchWrap.querySelector('input');
  search.value = state.query;

  function syncButtons() {
    buttons.forEach(button => {
      const group = button.dataset.filterGroup;
      button.setAttribute('aria-pressed', String(state[group] === button.dataset.filterValue));
    });
  }

  function updateURL() {
    const next = new URLSearchParams();
    if (state.theme !== 'all') next.set('theme', state.theme);
    if (state.level !== 'all') next.set('level', state.level);
    if (state.query) next.set('q', state.query);
    const suffix = next.toString() ? `?${next}` : location.pathname.split('/').pop();
    history.replaceState(null, '', next.toString() ? suffix : location.pathname);
  }

  function applyFilters() {
    const needle = state.query.trim().toLocaleLowerCase('fr');
    let visible = 0;
    cards.forEach(card => {
      const themeOK = state.theme === 'all' || card.dataset.theme === state.theme;
      const levelOK = state.level === 'all' || card.dataset.level === state.level;
      const textOK = !needle || card.innerText.toLocaleLowerCase('fr').includes(needle);
      const show = themeOK && levelOK && textOK;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} article${visible > 1 ? 's' : ''}`;
    syncButtons();
    updateURL();
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      state[button.dataset.filterGroup] = button.dataset.filterValue;
      applyFilters();
    });
  });
  search.addEventListener('input', () => {
    state.query = search.value;
    applyFilters();
  });
  syncButtons();
  applyFilters();
})();
