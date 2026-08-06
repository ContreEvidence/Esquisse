(() => {
  'use strict';

  const oldHeader = document.querySelector('header');
  if (!oldHeader) return;

  const nested = /\/(articles|themes)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const href = path => `${prefix}${path}`;

  document.querySelectorAll('style[data-ce-menu-final]').forEach(node => node.remove());

  const style = document.createElement('style');
  style.dataset.ceMenuFinal = '20260806-final';
  style.textContent = `
    .ce-final-header,.ce-final-header *{box-sizing:border-box}
    .ce-final-header{
      position:sticky!important;top:0!important;z-index:10000!important;width:100%!important;
      background:#f7f4ec!important;color:#101820!important;border:0!important;
      border-bottom:1px solid rgba(16,24,32,.13)!important;
      box-shadow:0 3px 16px rgba(16,24,32,.07)!important;
      backdrop-filter:none!important;-webkit-backdrop-filter:none!important;
    }
    .ce-final-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-final-top{
      min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:1rem
    }
    .ce-final-brand{
      display:inline-flex;align-items:center;gap:.85rem;min-width:0;color:#101820!important;
      text-decoration:none!important;font-weight:900;font-size:clamp(1.08rem,1.7vw,1.35rem);
      letter-spacing:-.025em
    }
    .ce-final-brand img{display:block;width:54px;height:54px;flex:0 0 54px}
    .ce-final-brand span{white-space:nowrap}
    .ce-final-about{
      display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:.65rem 1rem;
      color:#34414b!important;text-decoration:none!important;font-size:.88rem;font-weight:800;
      background:#fff;border:1px solid rgba(16,24,32,.14);border-radius:11px
    }
    .ce-final-about:hover,.ce-final-about:focus-visible{color:#101820!important;border-color:#d6a94a;outline:none}
    .ce-final-toggle{
      display:none;width:46px;height:46px;padding:0;border:1px solid rgba(16,24,32,.16);
      border-radius:12px;background:#fff;cursor:pointer;box-shadow:0 2px 8px rgba(16,24,32,.05)
    }
    .ce-final-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#101820;border-radius:2px;transition:.18s ease}
    .ce-final-header.is-open .ce-final-toggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}
    .ce-final-header.is-open .ce-final-toggle span:nth-child(2){opacity:0}
    .ce-final-header.is-open .ce-final-toggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
    .ce-final-desktop-nav{background:#fff;border-top:1px solid rgba(16,24,32,.08)}
    .ce-final-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.58rem;padding:.66rem 0 .74rem}
    .ce-final-tab{
      min-width:0;min-height:50px;display:flex;align-items:center;justify-content:center;padding:.72rem .55rem;
      color:#26333d!important;text-decoration:none!important;text-align:center;font-size:.87rem;font-weight:850;
      line-height:1.15;background:#fff;border:1px solid rgba(16,24,32,.13);border-bottom:4px solid #9ba7ae;
      border-radius:12px 12px 4px 4px;box-shadow:0 2px 7px rgba(16,24,32,.045);transition:.14s ease
    }
    .ce-final-tab:hover,.ce-final-tab:focus-visible{color:#101820!important;transform:translateY(-2px);box-shadow:0 7px 14px rgba(16,24,32,.09);outline:none}
    .ce-final-tab:nth-child(1){background:#fff5d8;border-color:#e4c775;border-bottom-color:#d6a94a}
    .ce-final-tab:nth-child(2){background:#edf4f7;border-color:#c3d3dc;border-bottom-color:#7898ab}
    .ce-final-tab:nth-child(3){background:#f4efe5;border-color:#ddd0bb;border-bottom-color:#a78c5d}
    .ce-final-tab:nth-child(4){background:#f5f0fa;border-color:#d9cbed;border-bottom-color:#8f75b6}
    .ce-final-tab:nth-child(5){background:#edf5ee;border-color:#c7dbc9;border-bottom-color:#709875}
    .ce-final-tab:nth-child(6){background:#fff;border-color:#d8dfe3;border-bottom-color:#96a2a9}
    .ce-final-tab.is-current{color:#fff!important;background:#101820!important;border-color:#101820!important;border-bottom-color:#d6a94a!important;box-shadow:0 7px 16px rgba(16,24,32,.17)}
    .ce-final-backdrop{display:none;position:fixed;inset:0;z-index:9998;background:rgba(8,16,24,.46);opacity:0;transition:opacity .18s ease}
    .ce-final-drawer{
      display:none;position:fixed;z-index:9999;top:0;right:0;width:min(370px,88vw);height:100dvh;
      padding:0;background:#fbfaf6;box-shadow:-18px 0 42px rgba(16,24,32,.22);transform:translateX(102%);transition:transform .2s ease;
      overflow:auto
    }
    .ce-final-drawer-head{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:0 1.1rem;border-bottom:1px solid rgba(16,24,32,.1);background:#fff}
    .ce-final-drawer-head strong{font-size:1.06rem}
    .ce-final-close{width:42px;height:42px;border:1px solid rgba(16,24,32,.14);border-radius:11px;background:#fff;color:#101820;font-size:1.6rem;line-height:1;cursor:pointer}
    .ce-final-drawer-body{padding:1rem}
    .ce-final-drawer-label{margin:.25rem .25rem .55rem;color:#80601b;font-size:.7rem;font-weight:900;letter-spacing:.09em;text-transform:uppercase}
    .ce-final-drawer-link{
      display:flex;align-items:center;justify-content:space-between;min-height:54px;margin-bottom:.55rem;padding:.8rem .9rem;
      color:#24313b!important;text-decoration:none!important;font-size:.94rem;font-weight:850;background:#fff;
      border:1px solid rgba(16,24,32,.12);border-left:5px solid #d6a94a;border-radius:11px;box-shadow:0 2px 7px rgba(16,24,32,.04)
    }
    .ce-final-drawer-link::after{content:'›';font-size:1.35rem;font-weight:500;color:#7a858c}
    .ce-final-drawer-link:hover,.ce-final-drawer-link:focus-visible{background:#fff8df;border-color:#d6a94a;outline:none}
    .ce-final-drawer-link.is-current{color:#fff!important;background:#101820;border-color:#101820;border-left-color:#d6a94a}
    .ce-final-drawer-sep{height:1px;margin:1rem 0;background:rgba(16,24,32,.1)}
    body.ce-menu-lock{overflow:hidden!important}
    @media(max-width:1080px) and (min-width:801px){.ce-final-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}}
    @media(max-width:800px){
      .ce-final-top{min-height:70px}.ce-final-brand img{width:48px;height:48px;flex-basis:48px}.ce-final-brand{font-size:1.04rem;gap:.68rem}
      .ce-final-about,.ce-final-desktop-nav{display:none!important}.ce-final-toggle{display:block}
      .ce-final-backdrop,.ce-final-drawer{display:block}
      .ce-final-header.is-open .ce-final-backdrop{opacity:1}
      .ce-final-header.is-open .ce-final-drawer{transform:translateX(0)}
    }
    @media(max-width:430px){.ce-final-shell{width:min(94vw,1180px)}.ce-final-brand span{font-size:.97rem}}
  `;
  document.head.appendChild(style);

  const links = [
    ['Commencer', 'debuter.html', 'start'],
    ['Vie professionnelle', 'parcours-vie-professionnelle.html', 'work'],
    ['Argent', 'parcours-argent.html', 'money'],
    ['Entreprendre', 'themes/entreprendre.html', 'business'],
    ['Décider & comprendre', 'themes/decisions.html', 'think'],
    ['Bibliothèque', 'bibliotheque.html', 'library']
  ];

  const currentPath = window.location.pathname;
  const sectionMatch = section => {
    const rules = {
      start: ['/debuter.html'],
      work: ['/parcours-vie-professionnelle.html','/themes/travail.html'],
      money: ['/parcours-argent.html','/themes/argent.html'],
      business: ['/themes/entreprendre.html'],
      think: ['/themes/decisions.html','/themes/systemes.html','/themes/ia.html'],
      library: ['/bibliotheque.html']
    };
    return (rules[section] || []).some(item => currentPath.endsWith(item));
  };

  const desktopLinks = links.map(([label,path,section]) =>
    `<a class="ce-final-tab${sectionMatch(section) ? ' is-current' : ''}" href="${href(path)}">${label}</a>`
  ).join('');

  const drawerLinks = links.map(([label,path,section]) =>
    `<a class="ce-final-drawer-link${sectionMatch(section) ? ' is-current' : ''}" href="${href(path)}">${label}</a>`
  ).join('');

  oldHeader.className = 'ce-final-header';
  oldHeader.innerHTML = `
    <div class="ce-final-shell ce-final-top">
      <a class="ce-final-brand" href="${href('index.html')}">
        <img src="${href('assets/logo.svg')}" alt="">
        <span>Contre-évidence</span>
      </a>
      <a class="ce-final-about" href="${href('a-propos.html')}">À propos</a>
      <button class="ce-final-toggle" type="button" aria-label="Ouvrir la navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="ce-final-desktop-nav" aria-label="Navigation principale">
      <div class="ce-final-shell ce-final-tabs">${desktopLinks}</div>
    </nav>
    <div class="ce-final-backdrop" aria-hidden="true"></div>
    <aside class="ce-final-drawer" aria-label="Navigation mobile" aria-hidden="true">
      <div class="ce-final-drawer-head"><strong>Navigation</strong><button class="ce-final-close" type="button" aria-label="Fermer la navigation">×</button></div>
      <div class="ce-final-drawer-body">
        <div class="ce-final-drawer-label">Rubriques</div>
        ${drawerLinks}
        <div class="ce-final-drawer-sep"></div>
        <a class="ce-final-drawer-link" href="${href('a-propos.html')}">À propos</a>
      </div>
    </aside>`;

  const toggle = oldHeader.querySelector('.ce-final-toggle');
  const close = oldHeader.querySelector('.ce-final-close');
  const backdrop = oldHeader.querySelector('.ce-final-backdrop');
  const drawer = oldHeader.querySelector('.ce-final-drawer');

  const setOpen = open => {
    oldHeader.classList.toggle('is-open', open);
    document.body.classList.toggle('ce-menu-lock', open);
    toggle?.setAttribute('aria-expanded', String(open));
    toggle?.setAttribute('aria-label', open ? 'Fermer la navigation' : 'Ouvrir la navigation');
    drawer?.setAttribute('aria-hidden', String(!open));
  };

  toggle?.addEventListener('click', () => setOpen(!oldHeader.classList.contains('is-open')));
  close?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  oldHeader.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 800) setOpen(false); });

  document.documentElement.dataset.ceMenu = 'final-20260806';
})();
