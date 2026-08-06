(() => {
  const stylesheetUrl = new URL('navigation-tabs.css', document.currentScript?.src || window.location.href).href;
  let tabsStyles = document.querySelector('link[data-ce-navigation]');
  if (!tabsStyles) {
    tabsStyles = document.createElement('link');
    tabsStyles.rel = 'stylesheet';
    tabsStyles.href = stylesheetUrl;
    tabsStyles.dataset.ceNavigation = 'true';
    document.head.appendChild(tabsStyles);
  }

  const header = document.querySelector('header');
  if (!header) return;

  const pathname = window.location.pathname;
  const prefix = /\/(articles|themes)\//.test(pathname) ? '../' : '';
  const href = path => `${prefix}${path}`;

  header.className = 'ce-header';
  header.innerHTML = `
    <div class="container ce-head">
      <a class="ce-brand" href="${href('index.html')}">
        <img src="${href('assets/logo.svg')}" alt="">
        <span>Contre-évidence</span>
      </a>
      <div class="ce-head-actions">
        <a class="ce-about" href="${href('a-propos.html')}">À propos</a>
        <button class="ce-menu" type="button" aria-expanded="false" aria-controls="ce-navigation" aria-label="Ouvrir le menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <nav id="ce-navigation" class="ce-nav" aria-label="Navigation principale">
      <div class="container ce-tabs">
        <div class="ce-tab-group" data-section="commencer" data-menu>
          <button class="ce-tab ce-tab-start" type="button" aria-expanded="false">
            <span>Commencer</span><span class="ce-chevron" aria-hidden="true"></span>
          </button>
          <div class="ce-panel">
            <div class="ce-panel-inner ce-panel-3">
              <a class="ce-panel-link" href="${href('debuter.html')}"><strong>Découvrir le site</strong><small>Les premiers articles, sans jargon.</small></a>
              <a class="ce-panel-link" href="${href('parcours-vie-professionnelle.html')}"><strong>Partir de ma situation</strong><small>Insertion, retour à l’emploi, reconversion, après 50 ans.</small></a>
              <a class="ce-panel-link" href="${href('parcours-argent.html')}"><strong>Organiser mon argent</strong><small>Épargne, enveloppes, supports et allocation.</small></a>
            </div>
          </div>
        </div>

        <div class="ce-tab-group" data-section="travail" data-menu>
          <button class="ce-tab ce-tab-work" type="button" aria-expanded="false">
            <span>Vie professionnelle</span><span class="ce-chevron" aria-hidden="true"></span>
          </button>
          <div class="ce-panel">
            <div class="ce-panel-inner ce-panel-3">
              <a class="ce-panel-link" href="${href('themes/travail.html')}"><strong>Tous les articles</strong><small>Emploi, parcours, progression et difficultés.</small></a>
              <a class="ce-panel-link" href="${href('parcours-vie-professionnelle.html')}"><strong>Choisir ma situation</strong><small>Une entrée adaptée à votre moment de vie.</small></a>
              <a class="ce-panel-link" href="${href('bibliotheque.html?theme=travail')}"><strong>Explorer la bibliothèque</strong><small>Filtrer tous les contenus professionnels.</small></a>
            </div>
          </div>
        </div>

        <div class="ce-tab-group" data-section="argent" data-menu>
          <button class="ce-tab ce-tab-money" type="button" aria-expanded="false">
            <span>Argent</span><span class="ce-chevron" aria-hidden="true"></span>
          </button>
          <div class="ce-panel">
            <div class="ce-panel-inner ce-panel-3">
              <a class="ce-panel-link" href="${href('themes/argent.html')}"><strong>Argent et investissement</strong><small>Budget, risque, supports et patrimoine.</small></a>
              <a class="ce-panel-link" href="${href('parcours-argent.html')}"><strong>Suivre le parcours</strong><small>Des premières décisions aux grosses sommes.</small></a>
              <a class="ce-panel-link" href="${href('bibliotheque.html?theme=argent')}"><strong>Voir les articles</strong><small>Accéder directement aux contenus financiers.</small></a>
            </div>
          </div>
        </div>

        <a class="ce-tab ce-tab-business" data-section="entreprendre" href="${href('themes/entreprendre.html')}">Entreprendre</a>

        <div class="ce-tab-group" data-section="comprendre" data-menu>
          <button class="ce-tab ce-tab-think" type="button" aria-expanded="false">
            <span>Décider & comprendre</span><span class="ce-chevron" aria-hidden="true"></span>
          </button>
          <div class="ce-panel">
            <div class="ce-panel-inner ce-panel-3">
              <a class="ce-panel-link" href="${href('themes/decisions.html')}"><strong>Décisions et comportements</strong><small>Biais, incertitude et passage à l’action.</small></a>
              <a class="ce-panel-link" href="${href('themes/systemes.html')}"><strong>Comprendre les systèmes</strong><small>Règles, leviers et effets indirects.</small></a>
              <a class="ce-panel-link" href="${href('themes/ia.html')}"><strong>Outils numériques et IA</strong><small>Automatiser sans abandonner son jugement.</small></a>
            </div>
          </div>
        </div>

        <div class="ce-tab-group" data-section="bibliotheque" data-menu>
          <button class="ce-tab ce-tab-library" type="button" aria-expanded="false">
            <span>Bibliothèque</span><span class="ce-chevron" aria-hidden="true"></span>
          </button>
          <div class="ce-panel">
            <div class="ce-panel-inner ce-panel-4">
              <a class="ce-panel-link" href="${href('bibliotheque.html')}"><strong>Tous les articles</strong><small>Rechercher par sujet et par niveau.</small></a>
              <a class="ce-panel-link" href="${href('bibliotheque.html?level=1')}"><strong>Découvrir</strong><small>Niveau 1, accessible immédiatement.</small></a>
              <a class="ce-panel-link" href="${href('bibliotheque.html?level=2')}"><strong>Comprendre</strong><small>Niveau 2, mécanismes et cas pratiques.</small></a>
              <a class="ce-panel-link" href="${href('bibliotheque.html?level=3')}"><strong>Approfondir</strong><small>Niveau 3, analyses et arbitrages.</small></a>
            </div>
          </div>
        </div>
      </div>
    </nav>`;

  header.classList.add('ce-ready');

  const mobileButton = header.querySelector('.ce-menu');
  const groups = [...header.querySelectorAll('.ce-tab-group[data-menu]')];

  const normalizePath = value => {
    try {
      const url = new URL(value, window.location.href);
      return url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    } catch {
      return '';
    }
  };

  const current = normalizePath(window.location.href);
  const sectionPatterns = {
    commencer: ['/debuter.html', '/parcours-vie-professionnelle.html'],
    travail: ['/themes/travail.html'],
    argent: ['/themes/argent.html', '/parcours-argent.html'],
    entreprendre: ['/themes/entreprendre.html'],
    comprendre: ['/themes/decisions.html', '/themes/systemes.html', '/themes/ia.html'],
    bibliotheque: ['/bibliotheque.html']
  };

  header.querySelectorAll('[data-section]').forEach(item => {
    const section = item.dataset.section;
    const matched = (sectionPatterns[section] || []).some(path => current.endsWith(path));
    if (matched) item.classList.add('is-current');
  });

  const closeGroups = except => {
    groups.forEach(group => {
      if (group === except) return;
      group.classList.remove('is-open');
      group.querySelector('.ce-tab')?.setAttribute('aria-expanded', 'false');
    });
  };

  groups.forEach(group => {
    const trigger = group.querySelector('.ce-tab');
    trigger?.addEventListener('click', event => {
      event.stopPropagation();
      const open = !group.classList.contains('is-open');
      closeGroups(group);
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  mobileButton?.addEventListener('click', () => {
    const open = !header.classList.contains('nav-open');
    header.classList.toggle('nav-open', open);
    mobileButton.setAttribute('aria-expanded', String(open));
    mobileButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeGroups();
  });

  document.addEventListener('click', event => {
    if (header.contains(event.target)) return;
    closeGroups();
    header.classList.remove('nav-open');
    mobileButton?.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeGroups();
    header.classList.remove('nav-open');
    mobileButton?.setAttribute('aria-expanded', 'false');
  });

  header.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeGroups();
      header.classList.remove('nav-open');
      mobileButton?.setAttribute('aria-expanded', 'false');
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 700) {
      header.classList.remove('nav-open');
      mobileButton?.setAttribute('aria-expanded', 'false');
    }
  });
})();
