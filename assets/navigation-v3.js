(() => {
  'use strict';

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  if (document.documentElement.dataset.ceFlatNav === '33') return;
  document.documentElement.dataset.ceFlatNav = '33';

  const header = document.querySelector('header');
  if (!header) return;

  document.querySelectorAll('style[data-ce-flat-nav]').forEach(node => node.remove());
  const style = document.createElement('style');
  style.dataset.ceFlatNav = '33';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.34);box-shadow:0 5px 18px rgba(0,0,0,.28);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:82px;display:grid;grid-template-columns:minmax(250px,auto) minmax(280px,1fr) auto;align-items:center;gap:1rem;padding:.46rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:.8rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:64px;height:64px;flex:0 0 64px;object-fit:contain;border-radius:50%;background:#050506;box-shadow:0 0 0 2px #d4ab56,0 0 0 4px #fff}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.22rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1.05rem,1.5vw,1.38rem);letter-spacing:.045em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.61rem;letter-spacing:.13em;color:#e8c979;font-weight:800}
    .ce-search{display:flex!important;align-items:stretch;width:100%;max-width:590px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:12px;overflow:hidden}
    .ce-search input{min-width:0;flex:1;height:42px;padding:0 .85rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.9rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{min-width:86px;border:0;background:#d4ab56;color:#101010;font-size:.88rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;justify-content:flex-end}
    .ce-start-link{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:.56rem .82rem;border-radius:999px;text-decoration:none;font-size:.8rem;font-weight:850;white-space:nowrap;background:#fff;color:#101820;border:2px solid #d4ab56}
    .ce-start-link:hover,.ce-start-link:focus-visible{background:#e8c979;color:#000;outline:2px solid #fff;outline-offset:2px}
    .ce-flat-toggle{display:none;width:44px;height:44px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:11px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.2)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem;padding:.36rem 0 .42rem}
    .ce-flat-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:44px;padding:.55rem .5rem;color:#e9edef;text-decoration:none;text-align:center;font-size:1.06rem;font-weight:850;line-height:1.08;background:transparent;border:0;border-radius:7px;white-space:nowrap}
    .ce-flat-link:after{content:'';position:absolute;left:22%;right:22%;bottom:1px;height:2px;background:transparent;border-radius:3px}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{background:#1a1a1d;color:#fff;outline:none}
    .ce-flat-link:hover:after,.ce-flat-link:focus-visible:after{background:#8d7133}
    .ce-flat-link.is-current{background:#171719!important;color:#fff!important}
    .ce-flat-link.is-current:after{background:#d4ab56!important}
    .ce-flat-link[data-key="hors-cadre"]{color:#e8c979}
    .ce-breadcrumb{background:#f5f1e7;border-bottom:1px solid rgba(16,24,32,.08)}
    .ce-breadcrumb-inner{width:min(1180px,92vw);margin:0 auto;display:flex;align-items:center;gap:.45rem;min-height:38px;font-size:.82rem;color:#59646d;white-space:nowrap;overflow:hidden}
    .ce-breadcrumb a{color:#49545d;text-decoration:none;font-weight:750}.ce-breadcrumb a:hover{text-decoration:underline}.ce-breadcrumb .sep{color:#9b927f}.ce-breadcrumb .current{overflow:hidden;text-overflow:ellipsis;color:#101820;font-weight:750}
    .ce-footer-socials{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .6rem;margin-top:.45rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.14)}
    .ce-footer-socials strong{color:#e8c979;margin-right:.15rem}.ce-footer-socials a{display:inline-flex;align-items:center;min-height:30px;padding:.28rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);color:#fff!important;text-decoration:none;font-size:.84rem;font-weight:800}.ce-footer-socials a:hover,.ce-footer-socials a:focus-visible{background:#d4ab56;color:#09090a!important;border-color:#e8c979}
    @media(max-width:1040px) and (min-width:760px){.ce-flat-top{grid-template-columns:auto 1fr}.ce-search{grid-column:1/-1;grid-row:2;max-width:none}.ce-flat-actions{grid-column:2;grid-row:1}.ce-flat-brand-copy small{display:none}.ce-flat-link{font-size:.98rem}}
    @media(max-width:759px){.ce-flat-top{grid-template-columns:1fr auto;gap:.55rem;padding:.48rem 0 .55rem}.ce-flat-brand img{width:58px;height:58px;flex-basis:58px}.ce-flat-brand{gap:.65rem}.ce-flat-brand-copy strong{font-size:.94rem}.ce-flat-brand-copy small{display:none}.ce-flat-actions{justify-self:end}.ce-start-link{display:none}.ce-flat-toggle{display:block}.ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:40px;font-size:.86rem}.ce-search button{min-width:82px;font-size:.83rem}.ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 118px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}.ce-flat-header.is-open .ce-flat-nav{display:block}.ce-flat-links{grid-template-columns:1fr;gap:.25rem;width:min(94vw,680px);padding:.55rem 0 .75rem}.ce-flat-link{min-height:44px;justify-content:flex-start;padding:.72rem .82rem;text-align:left;border-left:4px solid #8d7133;border-radius:7px;font-size:1rem;white-space:normal}.ce-flat-link:after{display:none}.ce-flat-link.is-current{border-left-color:#d4ab56}.ce-breadcrumb-inner{font-size:.76rem}}
  `;
  document.head.appendChild(style);

  const nested = /\/(articles|themes|dossiers)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';
  const u = path => `${prefix}${path}`;
  const links = [
    ['Patrimoine','themes/argent.html','patrimoine'],
    ['Vie professionnelle','parcours-vie-professionnelle.html','vie-pro'],
    ['Hors cadre','hors-cadre.html','hors-cadre']
  ];
  const socials = [['YouTube','https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA'],['Instagram','https://www.instagram.com/contre_evidence/'],['Facebook','https://www.facebook.com/profile.php?id=61592757877017'],['TikTok','https://www.tiktok.com/@contreevidence']];

  header.className = 'ce-flat-header';
  header.innerHTML = `<div class="ce-flat-shell ce-flat-top"><a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260808-4" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>PATRIMOINE · VIE PROFESSIONNELLE · HORS CADRE</small></span></a><form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search"><input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, formation, immobilier, épargne…" autocomplete="off"><button type="submit">Rechercher</button></form><div class="ce-flat-actions"><a class="ce-start-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div></div><nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div></nav>`;

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const currentQuery = params.get('q');
  const searchInput = header.querySelector('.ce-search input');
  if (currentQuery && searchInput) searchInput.value = currentQuery;

  const current = path.includes('/hors-cadre') ? 'hors-cadre'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/marches-analyses-avancees') || path.includes('/dossiers/finances-') || path.includes('/dossiers/audit-budget') ? 'patrimoine'
    : path.includes('/themes/travail') || path.includes('/themes/entreprendre') || path.includes('/parcours-vie-professionnelle') || path.includes('/moins-de-25-ans') || path.includes('/videos') || path.includes('/dossiers/plan-30-jours') || path.includes('/dossiers/calculer-prix') ? 'vie-pro'
    : '';
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  if (path.includes('/themes/travail')) {
    const kicker = document.querySelector('.article-hero .kicker');
    if (kicker) kicker.textContent = 'Vie professionnelle · Salariat & carrière';
  }
  if (path.includes('/themes/entreprendre')) {
    const kicker = document.querySelector('.article-hero .kicker');
    if (kicker) kicker.textContent = 'Vie professionnelle · Entrepreneuriat';
  }

  if (path.includes('/bibliotheque')) {
    document.querySelector('.library-editorial-note')?.remove();
    if (!params.has('level')) {
      const depthLabel = [...document.querySelectorAll('.library-tools .filter-label')].find(el => el.textContent.trim().startsWith('Profondeur'));
      depthLabel?.closest('.filter-group')?.remove();
    }
  }

  if (!/\/(index\.html)?$/.test(path)) {
    const h1 = document.querySelector('main h1');
    const crumb = document.createElement('div');
    crumb.className = 'ce-breadcrumb';
    let middle = '';
    if (current === 'patrimoine') middle = `<span class="sep">›</span><a href="${u('themes/argent.html')}">Patrimoine</a>`;
    else if (current === 'vie-pro') middle = `<span class="sep">›</span><a href="${u('parcours-vie-professionnelle.html')}">Vie professionnelle</a>`;
    else if (current === 'hors-cadre' && !path.endsWith('/hors-cadre.html')) middle = `<span class="sep">›</span><a href="${u('hors-cadre.html')}">Hors cadre</a>`;
    else if (path.includes('/bibliotheque')) middle = '';
    else middle = `<span class="sep">›</span><a href="${u('bibliotheque.html')}">Tous les contenus</a>`;
    const label = path.includes('/bibliotheque') ? 'Tous les contenus' : (h1?.textContent?.trim() || document.title.split('—')[0].trim());
    crumb.innerHTML = `<div class="ce-breadcrumb-inner"><a href="${u('index.html')}">Accueil</a>${middle}<span class="sep">›</span><span class="current">${label}</span></div>`;
    header.insertAdjacentElement('afterend', crumb);
  }

  const foot = document.querySelector('footer .foot');
  if (foot) {
    const linksSpan = foot.querySelector('span:last-child');
    if (linksSpan) {
      const prepend = [];
      if (!linksSpan.querySelector('a[href$="bibliotheque.html"]')) prepend.push(`<a href="${u('bibliotheque.html')}">Tous les contenus</a>`);
      if (!linksSpan.querySelector('a[href$="contact.html"]')) prepend.push(`<a href="${u('contact.html')}">Contact</a>`);
      if (!linksSpan.querySelector('a[href$="a-propos.html"]')) prepend.push(`<a href="${u('a-propos.html')}">À propos</a>`);
      if (prepend.length) linksSpan.insertAdjacentHTML('afterbegin', `${prepend.join(' · ')} · `);
    }
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