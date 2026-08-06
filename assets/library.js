(() => {
  const cards = [...document.querySelectorAll('.filter-card')];
  const buttons = [...document.querySelectorAll('.filter-btn')];
  const count = document.querySelector('[data-results-count]');
  if (!cards.length || !buttons.length) return;

  const state = { theme: 'all', level: 'all' };

  function applyFilters() {
    let visible = 0;
    cards.forEach(card => {
      const themeOK = state.theme === 'all' || card.dataset.theme === state.theme;
      const levelOK = state.level === 'all' || card.dataset.level === state.level;
      const show = themeOK && levelOK;
      card.classList.toggle('is-hidden', !show);
      if (show) visible += 1;
    });
    if (count) count.textContent = `${visible} article${visible > 1 ? 's' : ''}`;
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.filterGroup;
      const value = button.dataset.filterValue;
      state[group] = value;
      buttons
        .filter(item => item.dataset.filterGroup === group)
        .forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      applyFilters();
    });
  });

  applyFilters();
})();
