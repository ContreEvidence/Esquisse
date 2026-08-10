(() => {
  'use strict';

  const run = () => {
    const path = window.location.pathname;
    const nested = /\/(articles|themes|dossiers|fiches-metiers)\//.test(path);
    const prefix = nested ? '../' : '';
    const toolsHref = `${prefix}bibliotheque.html?type=outil`;

    const renameText = (root = document.body) => {
      if (!root || root.dataset.ceLabelsRenamed) return;
      const replacements = new Map([
        ['Budget, consommation & sécurité financière', 'Argent au quotidien'],
        ['Budget, consommation & sécurité', 'Argent au quotidien'],
        ['Budget, consommation, sécurité financière, immobilier, investissement, retraite & transmission : entrez par la décision à comprendre.', 'Argent au quotidien, immobilier, investissement, retraite & transmission : entrez par la décision à comprendre.']
      ]);
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const trimmed = node.nodeValue.trim();
        if (!replacements.has(trimmed)) continue;
        node.nodeValue = node.nodeValue.replace(trimmed, replacements.get(trimmed));
      }
      root.dataset.ceLabelsRenamed = '1';
    };
    renameText();

    const foundation = document.querySelector('.patrimoine-hub .foundation');
    const pillars = document.querySelector('.patrimoine-hub .pillar-grid');
    if (foundation && pillars && !foundation.dataset.ceReordered) {
      pillars.insertAdjacentElement('afterend', foundation);
      foundation.dataset.ceReordered = '1';
    }

    const flatLinks = document.querySelector('.ce-flat-links');
    if (flatLinks && !flatLinks.querySelector('[data-key="outils"]')) {
      const link = document.createElement('a');
      link.className = 'ce-flat-link';
      link.dataset.key = 'outils';
      link.href = toolsHref;
      link.textContent = 'Outils';
      flatLinks.appendChild(link);
    }

    const fallbackNav = document.querySelector('.ce-fallback-header nav');
    if (!flatLinks && fallbackNav && !fallbackNav.querySelector('[data-ce-tools-link]') && ![...fallbackNav.links].some(a => /[?&]type=outil\b/.test(a.href))) {
      const link = document.createElement('a');
      link.href = toolsHref;
      link.dataset.ceToolsLink = '1';
      link.textContent = 'Outils';
      fallbackNav.appendChild(link);
    }

    const params = new URLSearchParams(window.location.search);
    const isTools = /\/(simulateur|outil)[^/]*\.html$/i.test(path) || (path.endsWith('/bibliotheque.html') && params.get('type') === 'outil');
    if (isTools && flatLinks) {
      flatLinks.querySelectorAll('.ce-flat-link.is-current').forEach(el => el.classList.remove('is-current'));
      flatLinks.querySelector('[data-key="outils"]')?.classList.add('is-current');
    }

    const header = document.querySelector('.ce-flat-header');
    if (header && !header.dataset.ceCompactBound) {
      header.dataset.ceCompactBound = '1';
      const syncCompact = () => header.classList.toggle('is-compact', window.innerWidth >= 1041 && window.scrollY > 150);
      window.addEventListener('scroll', syncCompact, { passive:true });
      window.addEventListener('resize', syncCompact);
      syncCompact();
    }

    /* Les anciennes règles génériques nav{display:none} couvrent encore 760–820px. */
    const flatNav = document.querySelector('.ce-flat-nav');
    if (flatNav && !flatNav.dataset.ceTabletBound) {
      flatNav.dataset.ceTabletBound = '1';
      const syncTablet = () => {
        if (window.innerWidth >= 760) flatNav.style.display = 'block';
        else flatNav.style.removeProperty('display');
      };
      window.addEventListener('resize', syncTablet);
      syncTablet();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once:true });
  else run();
  setTimeout(run, 0);
})();
