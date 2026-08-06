(() => {
  'use strict';

  const existingHeader = document.querySelector('header');
  if (!existingHeader) return;

  // Supprime les anciennes surcharges du menu. La nouvelle navigation est autonome.
  document.querySelectorAll('link[href*="navigation-tabs.css"], style[data-ce-navigation]').forEach(node => node.remove());

  const style = document.createElement('style');
  style.dataset.ceNavigation = 'clean-v7';
  style.textContent = `
    .ce-header-clean,
    .ce-header-clean * { box-sizing: border-box; }

    .ce-header-clean {
      position: sticky;
      top: 0;
      z-index: 5000;
      width: 100%;
      background: #f7f4ec;
      color: #101820;
      border-bottom: 1px solid rgba(16,24,32,.14);
      box-shadow: 0 4px 18px rgba(16,24,32,.07);
      font-family: inherit;
    }

    .ce-shell {
      width: min(1180px, 92vw);
      margin: 0 auto;
    }

    .ce-topbar {
      min-height: 76px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .ce-logo-link {
      display: inline-flex;
      align-items: center;
      gap: .85rem;
      min-width: 0;
      color: #101820;
      text-decoration: none;
      font-size: clamp(1.08rem, 1.7vw, 1.35rem);
      font-weight: 900;
      letter-spacing: -.025em;
    }

    .ce-logo-link img {
      display: block;
      width: 54px;
      height: 54px;
      flex: 0 0 54px;
    }

    .ce-logo-link span { white-space: nowrap; }

    .ce-top-actions {
      display: flex;
      align-items: center;
      gap: .7rem;
    }

    .ce-about-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      padding: .65rem 1rem;
      color: #34414b;
      text-decoration: none;
      font-size: .88rem;
      font-weight: 800;
      background: #fff;
      border: 1px solid rgba(16,24,32,.14);
      border-radius: 11px;
    }

    .ce-about-link:hover,
    .ce-about-link:focus-visible {
      color: #101820;
      border-color: #d6a94a;
      outline: none;
    }

    .ce-mobile-toggle {
      display: none;
      width: 46px;
      height: 46px;
      padding: 0;
      border: 1px solid rgba(16,24,32,.16);
      border-radius: 12px;
      background: #fff;
      cursor: pointer;
    }

    .ce-mobile-toggle i {
      display: block;
      width: 20px;
      height: 2px;
      margin: 4px auto;
      background: #101820;
      border-radius: 2px;
      transition: transform .18s ease, opacity .18s ease;
    }

    .ce-header-clean.ce-mobile-open .ce-mobile-toggle i:nth-child(1) { transform: translateY(6px) rotate(45deg); }
    .ce-header-clean.ce-mobile-open .ce-mobile-toggle i:nth-child(2) { opacity: 0; }
    .ce-header-clean.ce-mobile-open .ce-mobile-toggle i:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

    .ce-navigation {
      position: relative;
      background: #fff;
      border-top: 1px solid rgba(16,24,32,.08);
    }

    .ce-tabs-row {
      position: relative;
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: .55rem;
      padding: .65rem 0 .72rem;
      align-items: stretch;
    }

    .ce-menu-group {
      position: static;
      min-width: 0;
    }

    .ce-main-tab {
      width: 100%;
      min-height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      padding: .72rem .55rem;
      color: #26333d;
      text-decoration: none;
      text-align: center;
      font: inherit;
      font-size: .87rem;
      font-weight: 850;
      line-height: 1.15;
      background: #fff;
      border: 1px solid rgba(16,24,32,.13);
      border-bottom: 4px solid #aab4ba;
      border-radius: 12px 12px 4px 4px;
      box-shadow: 0 2px 7px rgba(16,24,32,.045);
      cursor: pointer;
      transition: transform .14s ease, box-shadow .14s ease, color .14s ease, background .14s ease;
    }

    button.ce-main-tab { appearance: none; -webkit-appearance: none; }

    .ce-main-tab:hover,
    .ce-main-tab:focus-visible {
      color: #101820;
      transform: translateY(-2px);
      box-shadow: 0 7px 14px rgba(16,24,32,.09);
      outline: none;
    }

    .ce-tab-start { background: #fff5d8; border-color: #e4c775; border-bottom-color: #d6a94a; }
    .ce-tab-work { background: #edf4f7; border-color: #c3d3dc; border-bottom-color: #7898ab; }
    .ce-tab-money { background: #f4efe5; border-color: #ddd0bb; border-bottom-color: #a78c5d; }
    .ce-tab-business { background: #f5f0fa; border-color: #d9cbed; border-bottom-color: #8f75b6; }
    .ce-tab-think { background: #edf5ee; border-color: #c7dbc9; border-bottom-color: #709875; }
    .ce-tab-library { background: #fff; border-color: #d8dfe3; border-bottom-color: #96a2a9; }

    .ce-menu-group.ce-open > .ce-main-tab,
    .ce-menu-group.ce-current > .ce-main-tab,
    .ce-main-tab.ce-current {
      color: #fff !important;
      background: #101820 !important;
      border-color: #101820 !important;
      border-bottom-color: #d6a94a !important;
      box-shadow: 0 7px 16px rgba(16,24,32,.17);
    }

    .ce-arrow {
      width: 7px;
      height: 7px;
      flex: 0 0 7px;
      border-right: 1.7px solid currentColor;
      border-bottom: 1.7px solid currentColor;
      transform: rotate(45deg) translateY(-2px);
      transition: transform .15s ease;
    }

    .ce-menu-group.ce-open .ce-arrow { transform: rotate(225deg) translate(-1px,-1px); }

    .ce-dropdown {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      z-index: 50;
      padding: .75rem 0 1rem;
      background: #fff;
      border-top: 1px solid rgba(16,24,32,.08);
      border-bottom: 1px solid rgba(16,24,32,.14);
      box-shadow: 0 18px 36px rgba(16,24,32,.15);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-5px);
      transition: opacity .14s ease, visibility .14s ease, transform .14s ease;
    }

    .ce-menu-group.ce-open > .ce-dropdown {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0);
    }

    .ce-dropdown-grid {
      width: min(1180px, 92vw);
      margin: 0 auto;
      display: grid;
      gap: .7rem;
    }

    .ce-dropdown-grid.cols-3 { grid-template-columns: repeat(3, minmax(0,1fr)); }
    .ce-dropdown-grid.cols-4 { grid-template-columns: repeat(4, minmax(0,1fr)); }

    .ce-dropdown-link {
      display: block;
      min-width: 0;
      padding: .88rem .95rem;
      color: #26333d;
      text-decoration: none;
      background: #fbfaf6;
      border: 1px solid rgba(16,24,32,.11);
      border-radius: 11px;
      transition: background .14s ease, border-color .14s ease, transform .14s ease;
    }

    .ce-dropdown-link:hover,
    .ce-dropdown-link:focus-visible {
      background: #fff8df;
      border-color: #d6a94a;
      transform: translateY(-1px);
      outline: none;
    }

    .ce-dropdown-link strong {
      display: block;
      margin-bottom: .18rem;
      font-size: .92rem;
      line-height: 1.25;
    }

    .ce-dropdown-link small {
      display: block;
      color: #66727b;
      font-size: .78rem;
      font-weight: 500;
      line-height: 1.38;
    }

    @media (max-width: 1080px) and (min-width: 721px) {
      .ce-tabs-row { grid-template-columns: repeat(3, minmax(0,1fr)); }
      .ce-main-tab { min-height: 49px; font-size: .83rem; }
      .ce-dropdown-grid.cols-3,
      .ce-dropdown-grid.cols-4 { grid-template-columns: repeat(2, minmax(0,1fr)); }
    }

    @media (max-width: 720px) {
      .ce-topbar { min-height: 68px; }
      .ce-logo-link img { width: 46px; height: 46px; flex-basis: 46px; }
      .ce-logo-link { font-size: 1.02rem; gap: .65rem; }
      .ce-about-link { display: none; }
      .ce-mobile-toggle { display: block; }

      .ce-navigation {
        display: none;
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        max-height: calc(100vh - 70px);
        overflow: auto;
        background: #f7f4ec;
        box-shadow: 0 18px 42px rgba(16,24,32,.18);
      }

      .ce-header-clean.ce-mobile-open .ce-navigation { display: block; }

      .ce-tabs-row {
        display: block;
        width: min(94vw, 680px);
        margin: 0 auto;
        padding: .7rem 0 1rem;
      }

      .ce-menu-group { position: relative; }

      .ce-main-tab {
        min-height: 48px;
        justify-content: space-between;
        margin-bottom: .48rem;
        padding: .72rem .85rem;
        border-width: 1px;
        border-left-width: 5px;
        border-radius: 10px;
        background: #fff;
        text-align: left;
        font-size: .91rem;
      }

      .ce-tab-business { justify-content: flex-start; }

      .ce-dropdown {
        position: static;
        display: none;
        padding: 0 0 .55rem .75rem;
        border: 0;
        background: transparent;
        box-shadow: none;
        opacity: 1;
        visibility: visible;
        pointer-events: auto;
        transform: none;
      }

      .ce-menu-group.ce-open > .ce-dropdown { display: block; }

      .ce-dropdown-grid,
      .ce-dropdown-grid.cols-3,
      .ce-dropdown-grid.cols-4 {
        width: auto;
        grid-template-columns: 1fr;
        gap: .42rem;
      }

      .ce-dropdown-link { padding: .76rem .82rem; background: #fff; }
    }
  `;
  document.head.appendChild(style);

  const nested = /\/(articles|themes)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const url = path => `${prefix}${path}`;

  existingHeader.className = 'ce-header-clean';
  existingHeader.innerHTML = `
    <div class="ce-shell ce-topbar">
      <a class="ce-logo-link" href="${url('index.html')}">
        <img src="${url('assets/logo.svg')}" alt="">
        <span>Contre-évidence</span>
      </a>
      <div class="ce-top-actions">
        <a class="ce-about-link" href="${url('a-propos.html')}">À propos</a>
        <button class="ce-mobile-toggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false">
          <i></i><i></i><i></i>
        </button>
      </div>
    </div>

    <nav class="ce-navigation" aria-label="Navigation principale">
      <div class="ce-shell ce-tabs-row">
        <div class="ce-menu-group" data-section="start">
          <button class="ce-main-tab ce-tab-start" type="button" aria-expanded="false"><span>Commencer</span><span class="ce-arrow"></span></button>
          <div class="ce-dropdown"><div class="ce-dropdown-grid cols-3">
            <a class="ce-dropdown-link" href="${url('debuter.html')}"><strong>Découvrir le site</strong><small>Les premiers articles, sans jargon.</small></a>
            <a class="ce-dropdown-link" href="${url('parcours-vie-professionnelle.html')}"><strong>Partir de ma situation</strong><small>Insertion, retour à l’emploi, reconversion, après 50 ans.</small></a>
            <a class="ce-dropdown-link" href="${url('parcours-argent.html')}"><strong>Organiser mon argent</strong><small>Épargne, enveloppes, supports et allocation.</small></a>
          </div></div>
        </div>

        <div class="ce-menu-group" data-section="work">
          <button class="ce-main-tab ce-tab-work" type="button" aria-expanded="false"><span>Vie professionnelle</span><span class="ce-arrow"></span></button>
          <div class="ce-dropdown"><div class="ce-dropdown-grid cols-3">
            <a class="ce-dropdown-link" href="${url('themes/travail.html')}"><strong>Tous les articles</strong><small>Emploi, parcours, progression et difficultés.</small></a>
            <a class="ce-dropdown-link" href="${url('parcours-vie-professionnelle.html')}"><strong>Choisir ma situation</strong><small>Une entrée adaptée à votre moment de vie.</small></a>
            <a class="ce-dropdown-link" href="${url('bibliotheque.html?theme=travail')}"><strong>Explorer la bibliothèque</strong><small>Filtrer les contenus professionnels.</small></a>
          </div></div>
        </div>

        <div class="ce-menu-group" data-section="money">
          <button class="ce-main-tab ce-tab-money" type="button" aria-expanded="false"><span>Argent</span><span class="ce-arrow"></span></button>
          <div class="ce-dropdown"><div class="ce-dropdown-grid cols-3">
            <a class="ce-dropdown-link" href="${url('themes/argent.html')}"><strong>Argent et investissement</strong><small>Budget, risque, supports et patrimoine.</small></a>
            <a class="ce-dropdown-link" href="${url('parcours-argent.html')}"><strong>Suivre le parcours</strong><small>Des premières décisions aux grosses sommes.</small></a>
            <a class="ce-dropdown-link" href="${url('bibliotheque.html?theme=argent')}"><strong>Voir les articles</strong><small>Accéder aux contenus financiers.</small></a>
          </div></div>
        </div>

        <a class="ce-main-tab ce-tab-business" data-section="business" href="${url('themes/entreprendre.html')}">Entreprendre</a>

        <div class="ce-menu-group" data-section="think">
          <button class="ce-main-tab ce-tab-think" type="button" aria-expanded="false"><span>Décider & comprendre</span><span class="ce-arrow"></span></button>
          <div class="ce-dropdown"><div class="ce-dropdown-grid cols-3">
            <a class="ce-dropdown-link" href="${url('themes/decisions.html')}"><strong>Décisions et comportements</strong><small>Biais, incertitude et passage à l’action.</small></a>
            <a class="ce-dropdown-link" href="${url('themes/systemes.html')}"><strong>Comprendre les systèmes</strong><small>Règles, leviers et effets indirects.</small></a>
            <a class="ce-dropdown-link" href="${url('themes/ia.html')}"><strong>Outils numériques et IA</strong><small>Automatiser sans abandonner son jugement.</small></a>
          </div></div>
        </div>

        <div class="ce-menu-group" data-section="library">
          <button class="ce-main-tab ce-tab-library" type="button" aria-expanded="false"><span>Bibliothèque</span><span class="ce-arrow"></span></button>
          <div class="ce-dropdown"><div class="ce-dropdown-grid cols-4">
            <a class="ce-dropdown-link" href="${url('bibliotheque.html')}"><strong>Tous les articles</strong><small>Rechercher par sujet et par niveau.</small></a>
            <a class="ce-dropdown-link" href="${url('bibliotheque.html?level=1')}"><strong>Découvrir</strong><small>Niveau 1, accessible immédiatement.</small></a>
            <a class="ce-dropdown-link" href="${url('bibliotheque.html?level=2')}"><strong>Comprendre</strong><small>Niveau 2, mécanismes et cas pratiques.</small></a>
            <a class="ce-dropdown-link" href="${url('bibliotheque.html?level=3')}"><strong>Approfondir</strong><small>Niveau 3, analyses et arbitrages.</small></a>
          </div></div>
        </div>
      </div>
    </nav>
  `;

  const groups = [...existingHeader.querySelectorAll('.ce-menu-group')];
  const mobileButton = existingHeader.querySelector('.ce-mobile-toggle');

  const closeAll = except => {
    groups.forEach(group => {
      if (group === except) return;
      group.classList.remove('ce-open');
      group.querySelector('button')?.setAttribute('aria-expanded', 'false');
    });
  };

  groups.forEach(group => {
    const button = group.querySelector('button.ce-main-tab');
    if (!button) return;
    button.addEventListener('click', event => {
      event.stopPropagation();
      const open = !group.classList.contains('ce-open');
      closeAll(group);
      group.classList.toggle('ce-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });

  mobileButton?.addEventListener('click', event => {
    event.stopPropagation();
    const open = !existingHeader.classList.contains('ce-mobile-open');
    existingHeader.classList.toggle('ce-mobile-open', open);
    mobileButton.setAttribute('aria-expanded', String(open));
    mobileButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeAll();
  });

  document.addEventListener('click', event => {
    if (existingHeader.contains(event.target)) return;
    closeAll();
    existingHeader.classList.remove('ce-mobile-open');
    mobileButton?.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeAll();
    existingHeader.classList.remove('ce-mobile-open');
    mobileButton?.setAttribute('aria-expanded', 'false');
  });

  existingHeader.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeAll();
      existingHeader.classList.remove('ce-mobile-open');
      mobileButton?.setAttribute('aria-expanded', 'false');
    });
  });

  const currentPath = window.location.pathname;
  const sectionRules = {
    start: ['/debuter.html', '/parcours-vie-professionnelle.html'],
    work: ['/themes/travail.html'],
    money: ['/themes/argent.html', '/parcours-argent.html'],
    business: ['/themes/entreprendre.html'],
    think: ['/themes/decisions.html', '/themes/systemes.html', '/themes/ia.html'],
    library: ['/bibliotheque.html']
  };

  existingHeader.querySelectorAll('[data-section]').forEach(item => {
    const matches = (sectionRules[item.dataset.section] || []).some(path => currentPath.endsWith(path));
    if (matches) item.classList.add('ce-current');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      existingHeader.classList.remove('ce-mobile-open');
      mobileButton?.setAttribute('aria-expanded', 'false');
    }
  });
})();
