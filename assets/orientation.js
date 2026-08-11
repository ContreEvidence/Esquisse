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

    if (/\/parcours-vie-professionnelle\.html$/.test(path)) {
      const legacyTargets = {
        formation: 'a.situation-card[href="dossiers/quitter-travail-reconversion-sans-se-fragiliser.html"]',
        salariat: 'a.situation-card[href="dossiers/plan-30-jours-recherche-emploi.html"]',
        entrepreneuriat: 'a.situation-card[href="dossiers/lancer-activite-sans-quitter-emploi.html"]'
      };
      Object.entries(legacyTargets).forEach(([id, selector]) => {
        const target = document.querySelector(selector);
        if (target && !target.id) target.id = id;
      });
      const requested = window.location.hash.replace(/^#/, '');
      if (legacyTargets[requested]) {
        requestAnimationFrame(() => document.getElementById(requested)?.scrollIntoView({block:'start'}));
      }
    }

    /* Ponts dossier -> outil pour les intentions d'acquisition les plus fortes.
       Le bloc est ajouté près de la réponse courte sans remplacer le contenu éditorial. */
    const toolMap = {
      '/dossiers/combien-epargne-avant-demissionner.html': {
        href:'../simulateur-epargne-demission.html',
        title:'Calculez votre runway avec vos propres chiffres',
        text:'Dépenses essentielles, revenus certains, réserve protégée et scénario adverse : transformez votre épargne en mois de marge.'
      },
      '/dossiers/quitter-cdi-avec-credit-immobilier.html': {
        href:'../simulateur-epargne-demission.html',
        title:'Mesurez combien de mois le foyer peut réellement financer',
        text:'Le crédit entre dans vos dépenses essentielles : testez la marge créée par les revenus qui restent et les liquidités disponibles.'
      },
      '/dossiers/passer-80-pourcent-cout-reel.html': {
        href:'../simulateur-80-pourcent-cout-reel.html',
        title:'Calculez le prix réel de votre journée libérée',
        text:'Saisissez le revenu net attendu, les coûts de travail évités et les heures réellement récupérées.'
      },
      '/dossiers/travailler-moins-vivre-mieux.html': {
        href:'../simulateur-80-pourcent-cout-reel.html',
        title:'Testez ce que vous coûterait un passage à 80 %',
        text:'Comparez le coût net mensuel au nombre d’heures de vie réellement récupérées avant de comparer les autres options.'
      },
      '/dossiers/comparer-deux-offres-emploi.html': {
        href:'../outil-comparer-offres-emploi.html',
        title:'Mettez les deux offres sur la même base',
        text:'Revenu disponible et temps capturé sont calculés ; contrat, manager, risque, progression et inconnues restent séparés, sans faux score.'
      }
    };
    const tool = Object.entries(toolMap).find(([suffix]) => path.endsWith(suffix))?.[1];
    const prose = document.querySelector('main article.prose');
    if (tool && prose && !prose.querySelector('.ce-tool-bridge')) {
      const bridge = document.createElement('div');
      bridge.className = 'decision-box ce-tool-bridge';
      bridge.innerHTML = `<h3>Tester avec vos données</h3><p><strong>${tool.title}</strong><br>${tool.text}</p><p><a class="btn btn-primary" href="${tool.href}">Ouvrir l’outil →</a></p>`;
      const answer = prose.querySelector(':scope > .answer-box, :scope > .voice-note');
      if (answer) answer.insertAdjacentElement('afterend', bridge);
      else prose.insertAdjacentElement('afterbegin', bridge);
    }

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