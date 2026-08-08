(() => {
  'use strict';

  const currentScript = document.currentScript;
  const path = window.location.pathname;
  const nested = /\/(articles|themes|dossiers)\//.test(path);
  const prefix = nested ? '../' : '';

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  // Compatibilité avec les anciennes pages : toujours charger la navigation courante.
  if (!document.documentElement.dataset.ceNavLoader20260808) {
    document.documentElement.dataset.ceNavLoader20260808 = '1';
    const nav = document.createElement('script');
    nav.src = new URL('navigation-v3.js?v=20260808-10', currentScript?.src || window.location.href).href;
    nav.defer = true;
    document.head.appendChild(nav);
  }

  if (/\/bibliotheque\.html$/.test(path) && !document.documentElement.dataset.ceLibraryReload20260808) {
    document.documentElement.dataset.ceLibraryReload20260808 = '1';
    document.title = 'Bibliothèque — Patrimoine et vie professionnelle | Contre-évidence';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Recherchez les guides, dossiers et références de Contre-évidence par problème concret, en Patrimoine ou Vie professionnelle.';
    // L'ancien HTML appelle encore une version antérieure : la version courante repasse après.
    setTimeout(() => {
      const library = document.createElement('script');
      library.src = new URL('library.js?v=20260808-10', currentScript?.src || window.location.href).href;
      document.body.appendChild(library);
    }, 0);
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  document.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') || '';
    if (/logo-ce|logo\.svg|avatar\.svg/.test(src)) {
      image.src = `${prefix}assets/logo.png`;
      image.alt = 'Logo Contre-évidence';
    }
  });

  document.documentElement.dataset.ceArticleUi = 'navigation-v3';
})();