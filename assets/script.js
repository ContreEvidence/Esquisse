(() => {
  'use strict';
  const currentScript = document.currentScript;
  if (!document.documentElement.dataset.ceNavLoader) {
    document.documentElement.dataset.ceNavLoader = '29';
    const navScript = document.createElement('script');
    navScript.src = new URL('navigation-v3.js?v=20260807-29', currentScript?.src || window.location.href).href;
    navScript.defer = true;
    document.head.appendChild(navScript);
  }

  const nested = /\/(articles|themes|dossiers)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';

  document.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') || '';
    if (/logo-ce|logo\.svg|avatar\.svg/.test(src)) {
      image.src = `${prefix}assets/logo.png`;
      image.alt = 'Logo Contre-évidence';
    }
  });

  document.querySelectorAll('.articles').forEach(container => {
    const cards = [...container.children].filter(card => card.matches?.('.article-card[data-level]'));
    cards.map((card,index) => ({card,index,level:Number(card.dataset.level) || 99}))
      .sort((a,b) => a.level - b.level || a.index - b.index)
      .forEach(({card}) => container.appendChild(card));
  });

  const prose = document.querySelector('article.prose');
  const heroContainer = document.querySelector('.article-hero .container');
  if (prose) {
    const words = prose.textContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 210));
    if (heroContainer && !heroContainer.querySelector('.reading-meta')) {
      const meta = document.createElement('div');
      meta.className = 'reading-meta';
      meta.textContent = `${minutes} min de lecture · ${words.toLocaleString('fr-FR')} mots`;
      const paragraph = heroContainer.querySelector(':scope > p:last-of-type');
      paragraph ? paragraph.insertAdjacentElement('afterend', meta) : heroContainer.append(meta);
    }
  }

  if (!document.querySelector('.reading-progress')) {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.prepend(progress);
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1,window.scrollY/max) : 0})`;
    };
    window.addEventListener('scroll',update,{passive:true}); update();
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  document.querySelectorAll('.foot').forEach(foot => {
    const links = foot.querySelector('span:last-child');
    if (links && !links.querySelector('a[href$="methode-sources.html"]')) {
      const methodHref = `${prefix}methode-sources.html`;
      links.insertAdjacentHTML('afterbegin', `<a href="${methodHref}">Méthode & sources</a> · `);
    }
  });

  const path = window.location.pathname;
  const isHome = /\/Esquisse\/?$/.test(path) || /\/index\.html$/.test(path);
  if (isHome) {
    const libraryButton = [...document.querySelectorAll('.hero .btn')].find(a => a.getAttribute('href') === 'bibliotheque.html');
    if (libraryButton) libraryButton.textContent = 'Explorer la bibliothèque';

    document.querySelector('.youth-entry-banner')?.remove();
    document.querySelector('.ce-search-strip')?.remove();
    document.querySelector('.global-search-band')?.remove();

    const situationGrid = document.querySelector('.situation-grid');
    if (situationGrid) {
      const sectionHead = situationGrid.closest('section')?.querySelector('.section-head');
      if (sectionHead) sectionHead.innerHTML = '<div class="kicker">Partez de votre situation</div><h2>Quel problème cherchez-vous à résoudre aujourd’hui ?</h2><p>Le site ne suppose pas que tous les lecteurs ont le même âge, le même patrimoine ou les mêmes priorités.</p>';
    }

    const levelGrid = document.querySelector('.level-grid');
    if (levelGrid && !levelGrid.querySelector('[data-level="4"]')) {
      const sectionHead = levelGrid.closest('section')?.querySelector('.section-head');
      if (sectionHead) sectionHead.innerHTML = '<div class="kicker">Choisissez votre profondeur</div><h2>Une même idée, quatre niveaux de lecture.</h2><p>Commencez simplement, approfondissez les mécanismes puis passez à l’analyse lorsque les bases sont acquises.</p>';
      levelGrid.insertAdjacentHTML('beforeend', '<a class="level-card level-card-expert" data-level="4" href="marches-analyses-avancees.html"><span class="level-badge level-4">Niveau 4 · Analyser</span><h3>Analyser</h3><p>Croiser données, scénarios, valorisation, signaux et risque pour construire une décision argumentée.</p></a>');
    }
  }

  const isLibrary = /\/bibliotheque\.html$/.test(path);
  if (isLibrary) {
    document.querySelector('.video-library-callout')?.closest('section')?.remove();
    const tools = document.querySelector('.library-tools');
    if (tools && !document.querySelector('.library-expert-gateway')) {
      tools.insertAdjacentHTML('beforebegin', '<div class="library-expert-gateway"><div><span class="level-badge level-4">Niveau 4 · Analyser</span><h2>Vous cherchez les analyses de marché et d’entreprise ?</h2><p>Les contenus avancés sont regroupés dans un espace séparé afin de ne pas être noyés dans les articles pédagogiques.</p></div><a class="btn btn-primary" href="marches-analyses-avancees.html">Marchés & analyses avancées</a></div><div class="format-gateway"><span class="filter-label">Explorer par format :</span><a href="parcours-argent.html">Dossiers</a><a href="#articles">Articles</a><a href="marches-analyses-avancees.html">Analyses</a><a href="methode-sources.html">Méthode & sources</a></div>');
    }
  }
})();