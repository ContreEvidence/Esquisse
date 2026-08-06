(() => {
  'use strict';
  if (document.documentElement.dataset.ceFlatNav === '4') return;
  document.documentElement.dataset.ceFlatNav = '4';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '4';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.34);box-shadow:0 7px 24px rgba(0,0,0,.32);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:112px;display:grid;grid-template-columns:minmax(330px,auto) minmax(260px,1fr) auto;align-items:center;gap:1rem;padding:.7rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:1.15rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:92px;height:92px;flex:0 0 92px;border-radius:50%;box-shadow:0 0 0 3px #d4ab56,0 0 0 6px #fff,0 10px 28px rgba(0,0,0,.42)}

    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.24rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1.24rem,2vw,1.72rem);letter-spacing:.055em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.68rem;letter-spacing:.16em;color:#e8c979;font-weight:800}
    .ce-search{display:flex;align-items:stretch;width:100%;max-width:620px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:13px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,.22)}
    .ce-search input{min-width:0;flex:1;height:46px;padding:0 .9rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.94rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search input:focus{outline:3px solid rgba(232,201,121,.7);outline-offset:-3px}
    .ce-search button{min-width:50px;border:0;background:#d4ab56;color:#101010;font-size:1.15rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;gap:.55rem}
    .ce-flat-toplink{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.68rem .95rem;border-radius:999px;text-decoration:none;font-size:.87rem;font-weight:850;white-space:nowrap;background:#18181a;color:#fff;border:1px solid rgba(255,255,255,.28)}
    .ce-flat-toplink:hover,.ce-flat-toplink:focus-visible{background:#242427;border-color:#fff;color:#fff;outline:none}
    .ce-flat-toggle{display:none;width:46px;height:46px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:12px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px;transition:transform .18s ease,opacity .18s ease}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(2){opacity:0}
    .ce-flat-header.is-open .ce-flat-toggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.22)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:.48rem;padding:.62rem 0 .78rem}
    .ce-flat-link{display:flex;align-items:center;justify-content:center;min-height:48px;padding:.7rem .56rem;color:#fff;text-decoration:none;text-align:center;font-size:.82rem;font-weight:850;line-height:1.15;background:#1c1c1f;border:1px solid rgba(255,255,255,.18);border-bottom:3px solid #b28a38;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.16);transition:transform .14s ease,box-shadow .14s ease,background .14s ease,color .14s ease,border-color .14s ease}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{transform:translateY(-2px);box-shadow:0 7px 14px rgba(0,0,0,.28);background:#29292d;color:#fff;outline:2px solid #e8c979;outline-offset:2px}
    .ce-flat-link.is-current{background:#d4ab56!important;color:#09090a!important;border-color:#e8c979!important;border-bottom-color:#fff1b8!important;box-shadow:0 8px 18px rgba(0,0,0,.32)}
    @media(max-width:1099px) and (min-width:760px){
      .ce-flat-top{grid-template-columns:auto 1fr auto}
      .ce-flat-brand-copy small{display:none}.ce-flat-brand-copy strong{font-size:1.16rem}
      .ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr))}
      .ce-flat-link{font-size:.86rem}
      .ce-flat-toplink{display:none}
    }
    @media(max-width:759px){
      .ce-flat-top{min-height:0;grid-template-columns:1fr auto;gap:.65rem;padding:.55rem 0 .65rem}
      .ce-flat-brand img{width:68px;height:68px;flex-basis:68px;box-shadow:0 0 0 2px #d4ab56,0 0 0 4px #fff,0 8px 20px rgba(0,0,0,.38)}
      .ce-flat-brand{gap:.75rem}
      .ce-flat-brand-copy{display:flex}.ce-flat-brand-copy strong{font-size:1rem;letter-spacing:.035em}.ce-flat-brand-copy small{display:none}
      .ce-flat-actions{justify-self:end}
      .ce-flat-toplink{display:none}
      .ce-flat-toggle{display:block}
      .ce-search{grid-column:1 / -1;grid-row:2;max-width:none;margin:0}
      .ce-search input{height:44px;font-size:.91rem}
      .ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 125px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}
      .ce-flat-header.is-open .ce-flat-nav{display:block}
      .ce-flat-links{grid-template-columns:1fr;gap:.45rem;width:min(94vw,680px);padding:.7rem 0 1rem}
      .ce-flat-link{min-height:48px;justify-content:flex-start;padding:.8rem .9rem;text-align:left;border-width:1px;border-left-width:5px;border-radius:10px;font-size:.94rem}
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
    ['Bibliothèque','bibliotheque.html','bibliotheque']
  ];

  header.className = 'ce-flat-header';
  header.innerHTML = `
    <div class="ce-flat-shell ce-flat-top">
      <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo-ce-512.png')}" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>SYSTÈMES · STRATÉGIES · DÉCISIONS</small></span></a>
      <form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search">
        <input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, épargne, IA, décision…" autocomplete="off">
        <button type="submit" aria-label="Lancer la recherche">⌕</button>
      </form>
      <div class="ce-flat-actions">
<a class="ce-flat-toplink" href="${u('a-propos.html')}">À propos</a>
        <button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button>
      </div>
    </div>
    <nav class="ce-flat-nav" aria-label="Navigation principale">
      <div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div>
    </nav>`;

  const currentQuery = new URLSearchParams(window.location.search).get('q');
  const searchInput = header.querySelector('.ce-search input');
  if (currentQuery && searchInput) searchInput.value = currentQuery;

  const path = window.location.pathname;
  const current = path.includes('/themes/travail') || path.includes('/parcours-vie-professionnelle') ? 'travail'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/moins-de-25-ans') ? 'finances'
    : path.includes('/themes/entreprendre') ? 'entreprendre'
    : path.includes('/themes/ia') ? 'ia'
    : path.includes('/themes/decisions') ? 'decisions'
    : path.includes('/themes/systemes') ? 'systemes'
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
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();
