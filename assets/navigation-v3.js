(() => {
  'use strict';

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  if (document.documentElement.dataset.ceFlatNav === '27') return;
  document.documentElement.dataset.ceFlatNav = '27';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '27';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.34);box-shadow:0 5px 18px rgba(0,0,0,.28);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:84px;display:grid;grid-template-columns:minmax(260px,auto) minmax(260px,1fr) auto;align-items:center;gap:.9rem;padding:.48rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:.8rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:66px;height:66px;flex:0 0 66px;object-fit:contain;border-radius:50%;background:#050506;box-shadow:0 0 0 2px #d4ab56,0 0 0 4px #fff}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.22rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1.05rem,1.5vw,1.38rem);letter-spacing:.045em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.61rem;letter-spacing:.13em;color:#e8c979;font-weight:800}
    .ce-search{display:flex!important;align-items:stretch;width:100%;max-width:560px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:12px;overflow:hidden}
    .ce-search input{min-width:0;flex:1;height:42px;padding:0 .85rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.9rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{min-width:86px;border:0;background:#d4ab56;color:#101010;font-size:.88rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;justify-content:flex-end;gap:.4rem}
    .ce-contact-link,.ce-youth-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:.56rem .76rem;border-radius:999px;text-decoration:none;font-size:.78rem;font-weight:850;white-space:nowrap}
    .ce-youth-link{background:#fff;color:#101820;border:2px solid #d4ab56}
    .ce-contact-link{background:#d4ab56;color:#0b0b0c;border:1px solid #e8c979}
    .ce-youth-link:hover,.ce-youth-link:focus-visible,.ce-contact-link:hover,.ce-contact-link:focus-visible{background:#e8c979;color:#000;outline:2px solid #fff;outline-offset:2px}
    .ce-flat-toggle{display:none;width:44px;height:44px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:11px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.2)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:.18rem;padding:.3rem 0 .36rem}
    .ce-flat-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:38px;padding:.48rem .3rem;color:#e9edef;text-decoration:none;text-align:center;font-size:.77rem;font-weight:800;line-height:1.08;background:transparent;border:0;border-radius:6px;white-space:nowrap}
    .ce-flat-link:after{content:'';position:absolute;left:18%;right:18%;bottom:1px;height:2px;background:transparent;border-radius:3px}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{background:#1a1a1d;color:#fff;outline:none}
    .ce-flat-link:hover:after,.ce-flat-link:focus-visible:after{background:#8d7133}
    .ce-flat-link.is-current{background:#171719!important;color:#fff!important}
    .ce-flat-link.is-current:after{background:#d4ab56!important}
    .ce-flat-link[data-key="hors-cadre"]{color:#e8c979}
    .ce-flat-link[data-key="hors-cadre"].is-current{color:#fff}
    .ce-footer-socials{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .6rem;margin-top:.45rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.14)}
    .ce-footer-socials strong{color:#e8c979;margin-right:.15rem}
    .ce-footer-socials a{display:inline-flex;align-items:center;min-height:30px;padding:.28rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);color:#fff!important;text-decoration:none;font-size:.84rem;font-weight:800}
    .ce-footer-socials a:hover,.ce-footer-socials a:focus-visible{background:#d4ab56;color:#09090a!important;border-color:#e8c979}
    @media(max-width:1120px) and (min-width:760px){
      .ce-flat-top{grid-template-columns:auto 1fr}.ce-search{grid-column:1/-1;grid-row:2;max-width:none}.ce-flat-actions{grid-column:2;grid-row:1}.ce-flat-brand-copy small{display:none}
      .ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr));gap:.3rem;padding:.38rem 0 .46rem}
      .ce-flat-link{white-space:normal;min-height:38px}
    }
    @media(max-width:759px){
      .ce-flat-top{grid-template-columns:1fr auto;gap:.55rem;padding:.48rem 0 .55rem}
      .ce-flat-brand img{width:58px;height:58px;flex-basis:58px}.ce-flat-brand{gap:.65rem}.ce-flat-brand-copy strong{font-size:.94rem}.ce-flat-brand-copy small{display:none}
      .ce-flat-actions{justify-self:end}.ce-contact-link{display:none}.ce-youth-link{min-height:38px;padding:.46rem .62rem;font-size:.74rem}.ce-flat-toggle{display:block}
      .ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:40px;font-size:.86rem}.ce-search button{min-width:82px;font-size:.83rem}
      .ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 118px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}
      .ce-flat-header.is-open .ce-flat-nav{display:block}
      .ce-flat-links{grid-template-columns:1fr;gap:.25rem;width:min(94vw,680px);padding:.55rem 0 .75rem}
      .ce-flat-link{min-height:42px;justify-content:flex-start;padding:.68rem .82rem;text-align:left;border-left:4px solid #8d7133;border-radius:7px;font-size:.9rem;white-space:normal}
      .ce-flat-link:after{display:none}.ce-flat-link.is-current{border-left-color:#d4ab56}
    }
  `;
  document.head.appendChild(style);

  const nested = /\/(articles|themes|dossiers)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const u = path => `${prefix}${path}`;
  const links = [
    ['Vie pro','themes/travail.html','travail'],
    ['Finances','themes/argent.html','finances'],
    ['Entreprendre','themes/entreprendre.html','entreprendre'],
    ['IA & Tech','themes/ia.html','ia'],
    ['Décisions','themes/decisions.html','decisions'],
    ['Systèmes','themes/systemes.html','systemes'],
    ['Bibliothèque','bibliotheque.html','bibliotheque'],
    ['Hors Cadre','hors-cadre.html','hors-cadre']
  ];
  const socials = [
    ['YouTube','https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA'],
    ['Instagram','https://www.instagram.com/contre_evidence/'],
    ['Facebook','https://www.facebook.com/profile.php?id=61592757877017'],
    ['TikTok','https://www.tiktok.com/@contreevidence']
  ];

  header.className = 'ce-flat-header';
  header.innerHTML = `
    <div class="ce-flat-shell ce-flat-top">
      <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260807-2" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>SYSTÈMES · STRATÉGIES · DÉCISIONS</small></span></a>
      <form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search"><input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, épargne, IA, décision…" autocomplete="off"><button type="submit">Rechercher</button></form>
      <div class="ce-flat-actions"><a class="ce-youth-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><a class="ce-contact-link" href="${u('contact.html')}">Poser une question</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>
    </div>
    <nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div></nav>`;

  const currentQuery = new URLSearchParams(window.location.search).get('q');
  const searchInput = header.querySelector('.ce-search input');
  if (currentQuery && searchInput) searchInput.value = currentQuery;
  const path = window.location.pathname;
  const current = path.includes('/hors-cadre') ? 'hors-cadre'
    : path.includes('/themes/travail') || path.includes('/parcours-vie-professionnelle') ? 'travail'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/dossiers/finances-') ? 'finances'
    : path.includes('/themes/entreprendre') ? 'entreprendre'
    : path.includes('/themes/ia') ? 'ia'
    : path.includes('/themes/decisions') ? 'decisions'
    : path.includes('/themes/systemes') ? 'systemes'
    : path.includes('/bibliotheque') ? 'bibliotheque' : '';
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  const foot = document.querySelector('footer .foot');
  if (foot) {
    const linksSpan = foot.querySelector('span:last-child');
    if (linksSpan && !linksSpan.querySelector('a[href$="a-propos.html"]')) linksSpan.insertAdjacentHTML('afterbegin', `<a href="${u('a-propos.html')}">À propos</a> · `);
    if (!foot.querySelector('.ce-footer-socials')) {
      const socialFooter = document.createElement('div');
      socialFooter.className = 'ce-footer-socials';
      socialFooter.innerHTML = `<strong>Réseaux</strong>${socials.map(([name,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}`;
      foot.appendChild(socialFooter);
    }
  }

  const toggle = header.querySelector('.ce-flat-toggle');
  const closeMenu = () => { header.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); };
  toggle?.addEventListener('click', event => { event.stopPropagation(); const open=header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded',String(open)); });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();