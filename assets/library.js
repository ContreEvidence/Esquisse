(() => {
  const terrainEntries = [
    {theme:'travail', level:'1', chip:'Recherche d’emploi', title:'50 candidatures, zéro réponse : avant d’en envoyer 50 de plus', desc:'Quand presque rien ne revient, multiplier les mêmes candidatures peut simplement multiplier ce qui ne fonctionne déjà pas.', href:'articles/50-candidatures-zero-reponse.html'},
    {theme:'travail', level:'1', chip:'Entretien', title:'Vous décrochez des entretiens mais jamais le poste : où ça bloque ?', desc:'Si le CV ouvre la porte, cherchez le doute précis qui reste dans la tête du recruteur.', href:'articles/entretien-rate-ce-qui-bloque.html'},
    {theme:'travail', level:'1', chip:'Retour à l’emploi', title:'Quand on veut retravailler vite : faut-il accepter n’importe quel poste ?', desc:'Un poste peut remettre les comptes à l’équilibre, mais aussi consommer le temps, la santé ou les options nécessaires pour rebondir.', href:'articles/accepter-nimporte-quel-poste-retour-emploi.html'},
    {theme:'argent', level:'1', chip:'Finances', title:'Vous avez 50 000 € de côté mais vous n’osez rien en faire', desc:'Avant de chercher le meilleur placement, séparez l’argent de sécurité, les projets proches et le capital réellement disponible à long terme.', href:'articles/50000-euros-livret-peur-investir.html'},
    {theme:'argent', level:'1', chip:'Finances', title:'Vous gagnez plus qu’avant mais vous n’épargnez toujours rien', desc:'Quand chaque hausse de revenu disparaît, regardez ce qui s’est installé dans les dépenses avant de chercher un meilleur placement.', href:'articles/gagner-plus-epargner-moins.html'},
    {theme:'entreprendre', level:'1', chip:'Entreprendre', title:'Tout le monde trouve votre idée intéressante, mais personne n’achète', desc:'Un compliment ne paie pas une facture : testez un prix réel et observez ce que les clients sont prêts à sacrifier.', href:'articles/clients-interesses-personne-nachete.html'},
    {theme:'entreprendre', level:'1', chip:'Entreprendre', title:'Vous travaillez beaucoup mais il ne reste presque rien', desc:'Un agenda plein n’est pas forcément rentable : temps invisible, déplacements, prix et marge peuvent détruire le résultat.', href:'articles/travailler-beaucoup-gagner-peu-prix.html'},
    {theme:'ia', level:'1', chip:'IA & technologie', title:'L’IA vous répond avec aplomb… et se trompe', desc:'Une réponse fluide et précise peut être fausse. Plus la décision coûte cher, plus la preuve redevient importante.', href:'articles/ia-reponse-convaincante-fausse.html'},
    {theme:'ia', level:'1', chip:'IA & technologie', title:'Vous avez passé 30 minutes à automatiser une tâche de 5 minutes', desc:'Automatiser n’est utile que si le gain futur dépasse le temps de mise en place, la maintenance et la complexité ajoutée.', href:'articles/automatiser-tache-5-minutes-perdre-30.html'},
    {theme:'decisions', level:'1', chip:'Décisions', title:'Vous hésitez depuis trois semaines entre deux options presque équivalentes', desc:'Quand deux choix restent proches après une vraie comparaison, le coût de ne pas décider peut dépasser leur différence.', href:'articles/hesiter-trois-semaines-deux-options.html'},
    {theme:'decisions', level:'1', chip:'Décisions', title:'Vous continuez surtout parce que vous avez déjà trop investi', desc:'Ce qui a déjà coûté du temps ou de l’argent sert à apprendre ; cela ne justifie pas automatiquement la prochaine dépense.', href:'articles/continuer-parce-quon-a-deja-trop-investi.html'},
    {theme:'systemes', level:'1', chip:'Systèmes', title:'On vous demande un document que vous ne pouvez pas fournir : que faire ?', desc:'Quand la procédure tourne en rond, cherchez ce que la pièce est censée prouver et qui peut accepter une preuve équivalente.', href:'articles/justificatif-impossible-procedure-bloquee.html'},
    {theme:'systemes', level:'1', chip:'Systèmes', title:'Le compteur monte, le service se dégrade', desc:'Une équipe peut améliorer tous ses chiffres et pourtant rendre un moins bon service lorsque l’indicateur devient l’objectif.', href:'articles/indicateur-monte-service-se-degrade.html'},
    {theme:'systemes', level:'1', chip:'Systèmes', title:'Cette règle paraît absurde : avant de la contourner, cherchez ce qu’elle protège', desc:'Une mauvaise règle peut répondre à un vrai risque. Comprendre sa fonction permet de simplifier sans recréer le problème.', href:'articles/regle-absurde-logique-cachee.html'}
  ];

  const list = document.querySelector('.articles');
  if (list) {
    const existing = new Set([...list.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
    const fresh = terrainEntries.filter(item => !existing.has(item.href));
    if (fresh.length) {
      const html = fresh.map(item => `<article class="article-card filter-card" data-level="${item.level}" data-theme="${item.theme}" data-terrain="true"><div><div class="card-meta"><span class="level-badge level-1">Dossier terrain</span><span class="theme-chip">${item.chip}</span></div><h3>${item.title}</h3><p>${item.desc}</p></div><a href="${item.href}">Lire le dossier →</a></article>`).join('');
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
