(() => {
  'use strict';
  if (document.documentElement.dataset.ceFlatNav === '13') return;
  document.documentElement.dataset.ceFlatNav = '13';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '13';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.36);box-shadow:0 7px 24px rgba(0,0,0,.32);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:102px;display:grid;grid-template-columns:minmax(300px,auto) minmax(260px,1fr) auto;align-items:center;gap:1rem;padding:.65rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:1rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:82px;height:82px;flex:0 0 82px;object-fit:contain;border-radius:50%;box-shadow:0 0 0 2px #d4ab56,0 0 0 5px #fff,0 10px 28px rgba(0,0,0,.42)}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.28rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1.18rem,1.8vw,1.6rem);letter-spacing:.045em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.66rem;letter-spacing:.15em;color:#e8c979;font-weight:800}
    .ce-search{display:flex;align-items:stretch;width:100%;max-width:610px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:13px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,.22)}
    .ce-search input{min-width:0;flex:1;height:46px;padding:0 .9rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.94rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{min-width:52px;border:0;background:#d4ab56;color:#101010;font-size:1rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;gap:.55rem}
    .ce-flat-toplink{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.68rem .95rem;border-radius:999px;text-decoration:none;font-size:.87rem;font-weight:850;white-space:nowrap;background:#18181a;color:#fff;border:1px solid rgba(255,255,255,.28)}
    .ce-flat-toggle{display:none;width:46px;height:46px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:12px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.22)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:.48rem;padding:.62rem 0 .78rem}
    .ce-flat-link{display:flex;align-items:center;justify-content:center;min-height:48px;padding:.7rem .56rem;color:#fff;text-decoration:none;text-align:center;font-size:.82rem;font-weight:850;line-height:1.15;background:#1c1c1f;border:1px solid rgba(255,255,255,.18);border-bottom:3px solid #b28a38;border-radius:12px}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{background:#29292d;color:#fff;outline:2px solid #e8c979;outline-offset:2px}
    .ce-flat-link.is-current{background:#d4ab56!important;color:#09090a!important;border-color:#e8c979!important;border-bottom-color:#fff1b8!important}
    @media(max-width:1099px) and (min-width:760px){.ce-flat-top{grid-template-columns:auto 1fr auto}.ce-flat-brand-copy small{display:none}.ce-flat-brand-copy strong{font-size:1.08rem}.ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr))}.ce-flat-toplink{display:none}}
    @media(max-width:759px){
      .ce-flat-top{grid-template-columns:1fr auto;gap:.6rem;padding:.55rem 0 .65rem}
      .ce-flat-brand img{width:64px;height:64px;flex-basis:64px;box-shadow:0 0 0 2px #d4ab56,0 0 0 4px #fff}
      .ce-flat-brand{gap:.72rem}.ce-flat-brand-copy strong{font-size:.96rem}.ce-flat-brand-copy small{display:none}
      .ce-flat-actions{justify-self:end}.ce-flat-toplink{display:none}.ce-flat-toggle{display:block}
      .ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:44px;font-size:.9rem}
      .ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 130px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}
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
      <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>SYSTÈMES · STRATÉGIES · DÉCISIONS</small></span></a>
      <form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search">
        <input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, épargne, IA, décision…" autocomplete="off">
        <button type="submit">Rechercher</button>
      </form>
      <div class="ce-flat-actions"><a class="ce-flat-toplink" href="${u('a-propos.html')}">À propos</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>
    </div>
    <nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div></nav>`;

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
  const closeMenu = () => { header.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); };
  toggle?.addEventListener('click', event => { event.stopPropagation(); const open=header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded',String(open)); });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();
