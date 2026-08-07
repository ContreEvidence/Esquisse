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
