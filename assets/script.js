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

  const loadCurrentNavigation = suffix => {
    const nav = document.createElement('script');
    nav.src = new URL(`navigation-v3.js?v=20260808-10${suffix || ''}`, currentScript?.src || window.location.href).href;
    nav.defer = true;
    document.head.appendChild(nav);
  };

  if (!document.documentElement.dataset.ceNavLoader20260808) {
    document.documentElement.dataset.ceNavLoader20260808 = '1';
    loadCurrentNavigation('');
  }

  if (/\/bibliotheque\.html$/.test(path) && !document.documentElement.dataset.ceLibraryReload20260808) {
    document.documentElement.dataset.ceLibraryReload20260808 = '1';
    document.title = 'Bibliothèque — Patrimoine et vie professionnelle | Contre-évidence';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = 'Recherchez les guides, dossiers et références de Contre-évidence par problème concret, en Patrimoine ou Vie professionnelle.';
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

  // Si un ancien article-v3.js est encore présent dans le cache du navigateur,
  // il peut recréer ses outils après le nouveau moteur et renommer les ancres.
  // On ne recharge le moteur courant que lorsqu'une régression est réellement détectée.
  window.addEventListener('load', () => {
    const legacy = document.querySelector('.article-tools, .reading-progress');
    const toc = document.querySelector('.ce-article-toc');
    const brokenToc = toc && [...toc.querySelectorAll('a[href^="#"]')].some(a => {
      const id = decodeURIComponent(a.getAttribute('href').slice(1));
      return id && !document.getElementById(id);
    });
    if (legacy || brokenToc) {
      document.querySelectorAll('.article-tools, .reading-progress').forEach(el => el.remove());
      delete document.documentElement.dataset.ceNavigation20260808;
      loadCurrentNavigation('&repair=1');
    }
  }, {once:true});
})();