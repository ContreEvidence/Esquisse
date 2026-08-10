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

        /* Hiérarchie visuelle plus calme : moins d'or, moins d'ombres, titres moins monumentaux. */
        .theme-card,.level-card,.path-card,.article-card,.situation-card,.video-card,.home-video-card,.young-home-card,.callout-light,.library-tools{
          border-top-width:1px!important;
          box-shadow:0 5px 16px rgba(16,24,32,.055)!important;
        }
        .theme-card:hover,.level-card:hover,.path-card:hover,.article-card:hover,.situation-card:hover,.video-card:hover,.home-video-card:hover{
          box-shadow:0 8px 20px rgba(16,24,32,.085)!important;
        }
        @media(min-width:821px){
          .article-hero h1{font-size:clamp(2.55rem,5vw,4.55rem)!important}
          .section-head h2{font-size:clamp(1.95rem,4vw,3.3rem)!important}
        }

        /* Le hero d'accueil reste volontairement contrasté. */
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

        /* Sur grand écran, l'en-tête se fait discret une fois la lecture engagée. */
        @media(min-width:1041px){
          .ce-flat-header,.ce-flat-top,.ce-flat-brand img,.ce-search,.ce-search input,.ce-search button,.ce-flat-link,.ce-start-link{transition:.18s ease}
          .ce-flat-header.is-compact .ce-flat-top{min-height:48px!important;padding:.12rem 0!important}
          .ce-flat-header.is-compact .ce-flat-brand img{width:36px!important;height:36px!important;flex-basis:36px!important;box-shadow:0 0 0 1px #d4ab56,0 0 0 2px #fff!important}
          .ce-flat-header.is-compact .ce-flat-brand-copy small{display:none!important}
          .ce-flat-header.is-compact .ce-flat-brand-copy strong{font-size:.92rem!important}
          .ce-flat-header.is-compact .ce-search{max-width:410px!important}
          .ce-flat-header.is-compact .ce-search input{height:31px!important;font-size:.8rem!important}
          .ce-flat-header.is-compact .ce-search button{min-width:72px!important;font-size:.77rem!important}
          .ce-flat-header.is-compact .ce-start-link{min-height:30px!important;padding:.32rem .58rem!important;font-size:.7rem!important}
          .ce-flat-header.is-compact .ce-flat-link{min-height:29px!important;padding:.28rem .4rem!important;font-size:.87rem!important}
          .ce-flat-header.is-compact .ce-flat-links{padding:.08rem 0 .1rem!important}
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

    /* Libellés éditoriaux courts : éviter les intitulés administratifs dans les parcours. */
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

    const header = document.querySelector('.ce-flat-header');
    if (header && !header.dataset.ceCompactBound) {
      header.dataset.ceCompactBound = '1';
      const syncCompact = () => header.classList.toggle('is-compact', window.innerWidth >= 1041 && window.scrollY > 150);
      window.addEventListener('scroll', syncCompact, { passive:true });
      window.addEventListener('resize', syncCompact);
      syncCompact();
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, { once:true });
  else run();
  setTimeout(run, 0);
})();
