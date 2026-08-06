(() => {
  'use strict';
  if (document.documentElement.dataset.ceFlatNav === '1') return;
  document.documentElement.dataset.ceFlatNav = '1';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '1';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#0c0c0d!important;color:#f4efe5;border-bottom:1px solid rgba(212,171,86,.24);box-shadow:0 6px 22px rgba(0,0,0,.22);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:78px;display:flex;align-items:center;justify-content:space-between;gap:1rem}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:.85rem;color:#f8f5ef;text-decoration:none;font-size:clamp(1.05rem,1.7vw,1.35rem);font-weight:900;letter-spacing:-.025em}
    .ce-flat-brand img{display:block;width:56px;height:56px;flex:0 0 56px;border-radius:50%;box-shadow:0 0 0 1px rgba(212,171,86,.22)}
    .ce-flat-actions{display:flex;align-items:center;gap:.7rem}
    .ce-flat-toplink{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:.68rem 1rem;border-radius:999px;text-decoration:none;background:#151516;color:#f4efe5;border:1px solid rgba(212,171,86,.26);font-size:.87rem;font-weight:780}
    .ce-flat-toplink:hover,.ce-flat-toplink:focus-visible{background:#1a1a1c;color:#fff;border-color:rgba(212,171,86,.55);outline:none}
    .ce-flat-toggle{display:none;width:46px;height:46px;padding:0;border:1px solid rgba(212,171,86,.28);border-radius:12px;background:#151516;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#f4efe5;border-radius:2px;transition:transform .18s ease,opacity .18s ease}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(2){opacity:0}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
    .ce-flat-nav{background:#121213;border-top:1px solid rgba(212,171,86,.14)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.48rem;padding:.62rem 0 .78rem}
    .ce-flat-link{display:flex;align-items:center;justify-content:center;min-height:48px;padding:.7rem .56rem;color:#ece7dd;text-decoration:none;text-align:center;font-size:.82rem;font-weight:820;line-height:1.15;background:#171719;border:1px solid rgba(255,255,255,.06);border-bottom:3px solid #8d7540;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.12);transition:transform .14s ease,box-shadow .14s ease,background .14s ease,color .14s ease,border-color .14s ease}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{transform:translateY(-2px);box-shadow:0 7px 14px rgba(0,0,0,.22);color:#fff;outline:none;border-color:rgba(212,171,86,.35)}
    .ce-flat-link.is-current{background:#d4ab56!important;color:#0e0e0f!important;border-color:#d4ab56!important;border-bottom-color:#f4d487!important;box-shadow:0 8px 18px rgba(0,0,0,.25)}
    @media(max-width:1099px) and (min-width:760px){.ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr))}.ce-flat-link{font-size:.86rem}}
    @media(max-width:759px){
      .ce-flat-top{min-height:68px}
      .ce-flat-brand img{width:46px;height:46px;flex-basis:46px}
      .ce-flat-brand{font-size:1rem;gap:.65rem}
      .ce-flat-toplink{display:none}
      .ce-flat-toggle{display:block}
      .ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 68px);overflow:auto;background:#0f0f10;box-shadow:0 18px 40px rgba(0,0,0,.38)}
      .ce-flat-header.is-open .ce-flat-nav{display:block}
      .ce-flat-links{grid-template-columns:1fr;gap:.45rem;width:min(94vw,680px);padding:.7rem 0 1rem}
      .ce-flat-link{min-height:46px;justify-content:flex-start;padding:.78rem .9rem;text-align:left;border-width:1px;border-left-width:5px;border-radius:10px;font-size:.92rem}
    }
  `;
  document.head.appendChild(style);

  const nested = /\/(articles|themes)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const u = path => `${prefix}${path}`;
  const links = [
    ['Vie professionnelle','themes/travail.html','travail'],
    ['Finances personnelles','themes/argent.html','finances'],
    ['Entreprendre','themes/entreprendre.html','entreprendre'],
    ['IA & technologie','themes/ia.html','ia'],
    ['Décisions','themes/decisions.html','decisions'],
    ['Systèmes','themes/systemes.html','systemes'],
    ['Vidéos','videos.html','videos'],
    ['Bibliothèque','bibliotheque.html','bibliotheque']
  ];

  header.className = 'ce-flat-header';
  header.innerHTML = `
    <div class="ce-flat-shell ce-flat-top">
      <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo-ce-512.png')}" alt="Logo Contre-évidence"><span>Contre-évidence</span></a>
      <div class="ce-flat-actions">
        <a class="ce-flat-toplink" href="${u('a-propos.html')}">À propos</a>
        <button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="ce-flat-nav" aria-label="Navigation principale">
      <div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div>
    </nav>`;

  const path = window.location.pathname;
  const current = path.includes('/themes/travail') || path.includes('/parcours-vie-professionnelle') ? 'travail'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/moins-de-25-ans') ? 'finances'
    : path.includes('/themes/entreprendre') ? 'entreprendre'
    : path.includes('/themes/ia') ? 'ia'
    : path.includes('/themes/decisions') ? 'decisions'
    : path.includes('/themes/systemes') ? 'systemes'
    : path.includes('/videos') ? 'videos'
    : path.includes('/bibliotheque') ? 'bibliotheque' : '';
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  const toggle = header.querySelector('.ce-flat-toggle');
  const closeMenu = () => {
    header.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Ouvrir le menu');
  };
  toggle?.addEventListener('click', event => {
    event.stopPropagation();
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();
