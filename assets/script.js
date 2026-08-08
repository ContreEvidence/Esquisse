(() => {
  'use strict';

  const currentScript = document.currentScript;
  const nested = /\/(articles|themes|dossiers)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';

  // Compatibilité avec les anciennes pages : toujours charger la navigation courante.
  if (!document.documentElement.dataset.ceNavLoader20260808) {
    document.documentElement.dataset.ceNavLoader20260808 = '1';
    const nav = document.createElement('script');
    nav.src = new URL('navigation-v3.js?v=20260808-10', currentScript?.src || window.location.href).href;
    nav.defer = true;
    document.head.appendChild(nav);
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

  // Les anciennes pages peuvent encore charger article-v3.js : le rendu moderne
  // est désormais entièrement géré par navigation-v3.js.
  document.documentElement.dataset.ceArticleUi = 'navigation-v3';
})();