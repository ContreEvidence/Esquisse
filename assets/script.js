(() => {
  'use strict';

  const currentScript = document.currentScript;
  const path = window.location.pathname;
  const nested = /\/(articles|themes|dossiers)\//.test(path);
  const prefix = nested ? '../' : '';
  const version = '20260808-16';

  // Compatibilité pour les anciennes pages seulement : les pages modernes chargent
  // navigation-v3.js directement. On évite donc tout double chargement.
  const hasScript = name => [...document.scripts].some(s => (s.getAttribute('src') || '').includes(name));
  const loadScript = name => {
    const s = document.createElement('script');
    s.src = new URL(`${name}?v=${version}`, currentScript?.src || window.location.href).href;
    s.defer = true;
    document.head.appendChild(s);
  };

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  if (!hasScript('navigation-v3.js') && !document.documentElement.dataset.ceNavigation20260808) {
    loadScript('navigation-v3.js');
  }

  // Anciennes versions de la Bibliothèque pouvaient dépendre de script.js.
  // La Bibliothèque actuelle charge son catalogue et son moteur directement.
  if (/\/bibliotheque\.html$/.test(path)) {
    if (!hasScript('library-catalog.js')) loadScript('library-catalog.js');
    if (!hasScript('library.js')) loadScript('library.js');
  }

  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  // Remplace seulement les anciens logos encore présents dans des pages historiques.
  document.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') || '';
    if (/logo-ce|logo\.svg|avatar\.svg/.test(src)) {
      image.src = `${prefix}assets/logo.png`;
      image.alt = 'Logo Contre-évidence';
    }
  });

  document.documentElement.dataset.ceArticleUi = 'navigation-v3';
})();