(() => {
  'use strict';

  const run = () => {
    const path = window.location.pathname;
    const nested = /\/(articles|themes|dossiers)\//.test(path);
    const prefix = nested ? '../' : '';
    const toolsHref = `${prefix}bibliotheque.html?type=outil`;

    if (!document.getElementById('ce-orientation-style')) {
      const style = document.createElement('style');
      style.id = 'ce-orientation-style';
      style.textContent = `
        .ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr))!important}
        .ce-flat-link[data-key="outils"]{color:#f0d48a!important}

        /* Le sélecteur .beginner-hero était plus tard forcé en blanc alors que
           les textes du hero restaient clairs : contraste presque nul. */
        .home-index .hero.beginner-hero{
          background:linear-gradient(135deg,#070708 0%,#101820 68%,#1d2730 100%)!important;
          color:#fff!important;
          border-bottom:3px solid #d4ab56!important;
        }
        .home-index .hero.beginner-hero h1{color:#fff!important}
        .home-index .hero.beginner-hero p,
        .home-index .hero.beginner-hero .home-principle span{color:#f2eee5!important;opacity:1!important}
        .home-index .hero.beginner-hero .kicker,
        .home-index .hero.beginner-hero .home-principle strong{color:#e8c979!important}
        .home-index .hero.beginner-hero .btn-ghost{
          background:#fff!important;
          color:#101820!important;
          border:2px solid #d4ab56!important;
        }
        .home-index .hero.beginner-hero .btn-ghost:hover,
        .home-index .hero.beginner-hero .btn-ghost:focus-visible{
          background:#f6f1e7!important;
          color:#09090a!important;
        }

        @media(max-width:759px){
          .ce-flat-links{grid-template-columns:1fr!important}
          .ce-flat-actions{gap:.35rem!important}
          .ce-start-link{display:inline-flex!important;min-height:32px!important;padding:.34rem .52rem!important;font-size:.68rem!important}
        }
        @media(max-width:420px){
          .ce-start-link{font-size:0!important;min-width:82px!important}
          .ce-start-link::after{content:'Commencer';font-size:.66rem!important}
        }
      `;
      document.head.appendChild(style);
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
    if (!flatLinks && fallbackNav && !fallbackNav.querySelector('[data-ce-tools-link]')) {
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
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once:true });
  else run();
  setTimeout(run, 0);
})();
