(() => {
  'use strict';

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  if (document.documentElement.dataset.ceFlatNav === '25') return;
  document.documentElement.dataset.ceFlatNav = '25';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '25';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.36);box-shadow:0 7px 24px rgba(0,0,0,.32);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:98px;display:grid;grid-template-columns:minmax(280px,auto) minmax(260px,1fr) auto;align-items:center;gap:1rem;padding:.62rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:1rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:78px;height:78px;flex:0 0 78px;object-fit:contain;border-radius:50%;background:#050506;box-shadow:0 0 0 2px #d4ab56,0 0 0 5px #fff,0 10px 28px rgba(0,0,0,.42)}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.28rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1.12rem,1.6vw,1.48rem);letter-spacing:.045em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.64rem;letter-spacing:.14em;color:#e8c979;font-weight:800}
    .ce-search{display:flex!important;visibility:visible!important;opacity:1!important;align-items:stretch;width:100%;max-width:560px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:13px;overflow:hidden;box-shadow:0 3px 12px rgba(0,0,0,.22)}
    .ce-search input{display:block!important;min-width:0;flex:1;height:44px;padding:0 .9rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.92rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{display:block!important;min-width:88px;border:0;background:#d4ab56;color:#101010;font-size:.9rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;gap:.4rem;max-width:330px}
    .ce-flat-toplink,.ce-contact-link,.ce-youth-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:.58rem .78rem;border-radius:999px;text-decoration:none;font-size:.78rem;font-weight:850;white-space:nowrap}
    .ce-flat-toplink{background:#18181a;color:#fff;border:1px solid rgba(255,255,255,.28)}
    .ce-youth-link{background:#fff;color:#101820;border:2px solid #d4ab56}
    .ce-youth-link:hover,.ce-youth-link:focus-visible{background:#fff3c8;color:#000;outline:2px solid #fff;outline-offset:2px}
    .ce-contact-link{background:#d4ab56;color:#0b0b0c;border:1px solid #e8c979}
    .ce-contact-link:hover,.ce-contact-link:focus-visible{background:#e8c979;color:#000;outline:2px solid #fff;outline-offset:2px}
    .ce-socials{display:flex;align-items:center;gap:.28rem}
    .ce-social-link{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:999px;background:#1c1c1f;color:#fff;border:1px solid rgba(255,255,255,.3);text-decoration:none;font-size:.67rem;font-weight:950}
    .ce-social-link:hover,.ce-social-link:focus-visible{background:#d4ab56;color:#09090a;border-color:#e8c979;outline:2px solid #fff;outline-offset:2px}
    .ce-socials-mobile{display:none}
    .ce-flat-toggle{display:none;width:46px;height:46px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:12px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.22)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.46rem;padding:.58rem 0 .7rem}
    .ce-flat-link{display:flex;align-items:center;justify-content:center;min-height:44px;padding:.62rem .52rem;color:#fff;text-decoration:none;text-align:center;font-size:.8rem;font-weight:850;line-height:1.15;background:#1c1c1f;border:1px solid rgba(255,255,255,.18);border-bottom:3px solid #b28a38;border-radius:11px}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{background:#29292d;color:#fff;outline:2px solid #e8c979;outline-offset:2px}
    .ce-flat-link.is-current{background:#d4ab56!important;color:#09090a!important;border-color:#e8c979!important;border-bottom-color:#fff1b8!important}
    .ce-flat-link[data-key="hors-cadre"]{border-bottom-color:#e8c979;background:linear-gradient(180deg,#28231b,#1c1c1f)}
    .ce-flat-link[data-key="hors-cadre"]:hover,.ce-flat-link[data-key="hors-cadre"].is-current{background:#d4ab56!important;color:#09090a!important}
    @media(max-width:1080px) and (min-width:760px){
      .ce-flat-top{grid-template-columns:auto 1fr;align-items:center}
      .ce-search{grid-column:1/-1;grid-row:2;max-width:none}
      .ce-flat-actions{grid-column:2;grid-row:1;max-width:none}
      .ce-flat-brand-copy small{display:none}
      .ce-flat-links{grid-template-columns:repeat(4,minmax(0,1fr))}
      .ce-socials-top{display:none}
    }
    @media(max-width:759px){
      .ce-flat-top{grid-template-columns:1fr auto;gap:.6rem;padding:.55rem 0 .65rem}
      .ce-flat-brand img{width:64px;height:64px;flex-basis:64px;box-shadow:0 0 0 2px #d4ab56,0 0 0 4px #fff}
      .ce-flat-brand{gap:.72rem}.ce-flat-brand-copy strong{font-size:.96rem}.ce-flat-brand-copy small{display:none}
      .ce-flat-actions{justify-self:end;max-width:none}.ce-flat-toplink,.ce-contact-link,.ce-socials-top{display:none}.ce-youth-link{min-height:40px;padding:.5rem .68rem;font-size:.77rem}.ce-flat-toggle{display:block}
      .ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:44px;font-size:.9rem}.ce-search button{min-width:86px;font-size:.86rem}
      .ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 130px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}
      .ce-flat-header.is-open .ce-flat-nav{display:block}
      .ce-flat-links{grid-template-columns:1fr;gap:.45rem;width:min(94vw,680px);padding:.7rem 0 1rem}
      .ce-flat-link{min-height:48px;justify-content:flex-start;padding:.8rem .9rem;text-align:left;border-width:1px;border-left-width:5px;border-radius:10px;font-size:.94rem}
      .ce-socials-mobile{display:flex;grid-column:1/-1;justify-content:flex-start;padding:.35rem 0 .1rem}.ce-socials-mobile::before{content:'Réseaux';align-self:center;margin-right:.25rem;color:#e8c979;font-size:.78rem;font-weight:900;text-transform:uppercase;letter-spacing:.08em}
    }
  `;
  document.head.appendChild(style);

  const nested = /\/(articles|themes|dossiers)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const u = path => `${prefix}${path}`;
  const links = [
    ['Vie professionnelle','themes/travail.html','travail'],
    ['Finances personnelles','themes/argent.html','finances'],
    ['Entreprendre','themes/entreprendre.html','entreprendre'],
    ['IA & technologie','themes/ia.html','ia'],
    ['Décisions','themes/decisions.html','decisions'],
    ['Systèmes','themes/systemes.html','systemes'],
    ['Bibliothèque','bibliotheque.html','bibliotheque'],
    ['Hors Cadre','hors-cadre.html','hors-cadre']
  ];
  const socials = [
    ['YouTube','YT','https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA'],
    ['Instagram','IG','https://www.instagram.com/contre_evidence/'],
    ['Facebook','f','https://www.facebook.com/profile.php?id=61592757877017'],
    ['TikTok','TT','https://www.tiktok.com/@contreevidence']
  ];
  const socialMarkup = extraClass => `<div class="ce-socials ${extraClass}">${socials.map(([name,short,url]) => `<a class="ce-social-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="Contre-évidence sur ${name}" title="${name}">${short}</a>`).join('')}</div>`;

  header.className = 'ce-flat-header';
  header.innerHTML = `
    <div class="ce-flat-shell ce-flat-top">
      <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260807-2" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>SYSTÈMES · STRATÉGIES · DÉCISIONS</small></span></a>
      <form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search">
        <input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, épargne, IA, décision…" autocomplete="off">
        <button type="submit">Rechercher</button>
      </form>
      <div class="ce-flat-actions"><a class="ce-youth-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><a class="ce-contact-link" href="${u('contact.html')}">Poser une question</a><a class="ce-flat-toplink" href="${u('a-propos.html')}">À propos</a>${socialMarkup('ce-socials-top')}<button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>
    </div>
    <nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}${socialMarkup('ce-socials-mobile')}</div></nav>`;

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

  document.querySelectorAll('.ce-footer-socials').forEach(node => node.remove());

  const toggle = header.querySelector('.ce-flat-toggle');
  const closeMenu = () => { header.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); };
  toggle?.addEventListener('click', event => { event.stopPropagation(); const open=header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded',String(open)); });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();