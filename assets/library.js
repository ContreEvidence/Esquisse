(() => {
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

  const wall = document.createElement('div');
  wall.className = 'library-wallpaper-strip';
  wall.innerHTML = '<strong>Fonds d’écran</strong><a href="assets/hors-cadre/wallpaper-001.svg" download><img src="assets/hors-cadre/wallpaper-001.svg" alt="Édition 001"></a><a href="assets/hors-cadre/wallpaper-002.svg" download><img src="assets/hors-cadre/wallpaper-002.svg" alt="Édition 002"></a><a href="assets/hors-cadre/wallpaper-003.svg" download><img src="assets/hors-cadre/wallpaper-003.svg" alt="Édition 003"></a><a href="assets/hors-cadre/wallpaper-004.svg" download><img src="assets/hors-cadre/wallpaper-004.svg" alt="Édition 004"></a><a class="btn btn-ghost" href="hors-cadre-images.html">Voir la galerie</a>';
  wall.style.cssText = 'display:flex;align-items:center;gap:.65rem;overflow-x:auto;padding:.7rem 0 1rem;margin-bottom:1rem';
  wall.querySelector('strong').style.cssText = 'flex:0 0 auto;margin-right:.2rem';
  wall.querySelectorAll('a:not(.btn)').forEach(link => { link.style.cssText = 'flex:0 0 auto;display:block'; });
  wall.querySelectorAll('img').forEach(img => { img.style.cssText = 'display:block;width:76px;height:135px;object-fit:cover;border-radius:8px;border:1px solid #ded9ce;background:#0b0e11'; });
  wall.querySelector('.btn').style.cssText = 'flex:0 0 auto;white-space:nowrap';
  tools.parentNode.insertBefore(wall, tools);

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
