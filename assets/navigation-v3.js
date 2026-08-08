(() => {
  'use strict';

  if (!document.querySelector('script[data-cf-beacon]')) {
    const analytics = document.createElement('script');
    analytics.defer = true;
    analytics.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    analytics.setAttribute('data-cf-beacon', JSON.stringify({ token: 'a2d9198dc1684d70bce3ef999bf831a0' }));
    document.head.appendChild(analytics);
  }

  if (document.documentElement.dataset.ceFlatNav === '35') return;
  document.documentElement.dataset.ceFlatNav = '35';

  const header = document.querySelector('header');
  if (!header) return;

  const style = document.createElement('style');
  style.dataset.ceFlatNav = '35';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.34);box-shadow:0 4px 14px rgba(0,0,0,.24);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:70px;display:grid;grid-template-columns:minmax(230px,auto) minmax(270px,1fr) auto;align-items:center;gap:.9rem;padding:.34rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:.72rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:54px;height:54px;flex:0 0 54px;object-fit:contain;border-radius:50%;background:#050506;box-shadow:0 0 0 2px #d4ab56,0 0 0 3px #fff}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.2rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(1rem,1.45vw,1.28rem);letter-spacing:.045em;color:#fff}
    .ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.57rem;letter-spacing:.12em;color:#e8c979;font-weight:800}
    .ce-search{display:flex!important;align-items:stretch;width:100%;max-width:590px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:11px;overflow:hidden}
    .ce-search input{min-width:0;flex:1;height:38px;padding:0 .8rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.88rem}
    .ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{min-width:82px;border:0;background:#d4ab56;color:#101010;font-size:.84rem;font-weight:900;cursor:pointer}
    .ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;justify-content:flex-end}
    .ce-start-link{display:inline-flex;align-items:center;justify-content:center;min-height:36px;padding:.46rem .72rem;border-radius:999px;text-decoration:none;font-size:.76rem;font-weight:850;white-space:nowrap;background:#fff;color:#101820;border:2px solid #d4ab56}
    .ce-start-link:hover,.ce-start-link:focus-visible{background:#e8c979;color:#000;outline:2px solid #fff;outline-offset:2px}
    .ce-flat-toggle{display:none;width:42px;height:42px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:10px;background:#18181a;cursor:pointer}
    .ce-flat-toggle span{display:block;width:20px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.18)}
    .ce-flat-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4rem;padding:.26rem 0 .3rem}
    .ce-flat-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:38px;padding:.46rem .5rem;color:#e9edef;text-decoration:none;text-align:center;font-size:1rem;font-weight:850;line-height:1.08;background:transparent;border:0;border-radius:7px;white-space:nowrap}
    .ce-flat-link:after{content:'';position:absolute;left:22%;right:22%;bottom:0;height:2px;background:transparent;border-radius:3px}
    .ce-flat-link:hover,.ce-flat-link:focus-visible{background:#1a1a1d;color:#fff;outline:none}
    .ce-flat-link:hover:after,.ce-flat-link:focus-visible:after{background:#8d7133}
    .ce-flat-link.is-current{background:#171719!important;color:#fff!important}.ce-flat-link.is-current:after{background:#d4ab56!important}
    .ce-flat-link[data-key="hors-cadre"]{color:#e8c979}
    .ce-breadcrumb{background:#f5f1e7;border-bottom:1px solid rgba(16,24,32,.08)}
    .ce-breadcrumb-inner{width:min(1180px,92vw);margin:0 auto;display:flex;align-items:center;gap:.42rem;min-height:34px;font-size:.79rem;color:#59646d;white-space:nowrap;overflow:hidden}
    .ce-breadcrumb a{color:#49545d;text-decoration:none;font-weight:750}.ce-breadcrumb a:hover{text-decoration:underline}.ce-breadcrumb .sep{color:#9b927f}.ce-breadcrumb .current{overflow:hidden;text-overflow:ellipsis;color:#101820;font-weight:750}
    .ce-article-toc{margin:1.4rem 0 1.7rem;padding:1rem 1.1rem;border:1px solid rgba(16,24,32,.12);border-left:4px solid #d4ab56;border-radius:12px;background:#f8f6f0}
    .ce-article-toc strong{display:block;margin-bottom:.7rem;font-size:1.02rem;color:#101820}
    .ce-article-toc ol{margin:0;padding-left:1.3rem;columns:2;column-gap:2rem}.ce-article-toc li{break-inside:avoid;margin:.3rem 0}.ce-article-toc a{color:#25313a;text-decoration:none;font-weight:720}.ce-article-toc a:hover{text-decoration:underline}
    .ce-back-toc{display:block;width:max-content;margin:.45rem 0 1rem;font-size:.8rem;font-weight:800;color:#78612d;text-decoration:none}.ce-back-toc:hover{text-decoration:underline}
    .ce-footer-socials{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .6rem;margin-top:.45rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.14)}
    .ce-footer-socials strong{color:#e8c979;margin-right:.15rem}.ce-footer-socials a{display:inline-flex;align-items:center;min-height:30px;padding:.28rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);color:#fff!important;text-decoration:none;font-size:.84rem;font-weight:800}.ce-footer-socials a:hover,.ce-footer-socials a:focus-visible{background:#d4ab56;color:#09090a!important;border-color:#e8c979}
    @media(max-width:1040px) and (min-width:760px){.ce-flat-top{grid-template-columns:auto 1fr}.ce-search{grid-column:1/-1;grid-row:2;max-width:none}.ce-flat-actions{grid-column:2;grid-row:1}.ce-flat-brand-copy small{display:none}.ce-flat-link{font-size:.95rem}}
    @media(max-width:759px){.ce-flat-top{grid-template-columns:1fr auto;gap:.5rem;padding:.4rem 0 .48rem}.ce-flat-brand img{width:50px;height:50px;flex-basis:50px}.ce-flat-brand{gap:.6rem}.ce-flat-brand-copy strong{font-size:.92rem}.ce-flat-brand-copy small{display:none}.ce-flat-actions{justify-self:end}.ce-start-link{display:none}.ce-flat-toggle{display:block}.ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:38px;font-size:.84rem}.ce-search button{min-width:78px;font-size:.81rem}.ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 110px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}.ce-flat-header.is-open .ce-flat-nav{display:block}.ce-flat-links{grid-template-columns:1fr;gap:.25rem;width:min(94vw,680px);padding:.55rem 0 .75rem}.ce-flat-link{min-height:42px;justify-content:flex-start;padding:.68rem .82rem;text-align:left;border-left:4px solid #8d7133;border-radius:7px;font-size:.98rem;white-space:normal}.ce-flat-link:after{display:none}.ce-flat-link.is-current{border-left-color:#d4ab56}.ce-breadcrumb-inner{font-size:.74rem}.ce-article-toc ol{columns:1}}
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
  header.innerHTML = `<div class="ce-flat-shell ce-flat-top"><a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260808-6" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>PATRIMOINE · VIE PROFESSIONNELLE · HORS CADRE</small></span></a><form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search"><input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, formation, immobilier, investissement…" autocomplete="off"><button type="submit">Rechercher</button></form><div class="ce-flat-actions"><a class="ce-start-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div></div><nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,path,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(path)}">${label}</a>`).join('')}</div></nav>`;

  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const currentQuery = params.get('q');
  const searchInput = header.querySelector('.ce-search input');
  if (currentQuery && searchInput) searchInput.value = currentQuery;

  let current = path.includes('/hors-cadre') ? 'hors-cadre'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/marches-analyses-avancees') || path.includes('/dossiers/finances-') || path.includes('/dossiers/audit-budget') ? 'patrimoine'
    : path.includes('/themes/travail') || path.includes('/themes/entreprendre') || path.includes('/parcours-vie-professionnelle') || path.includes('/moins-de-25-ans') || path.includes('/videos') || path.includes('/dossiers/plan-30-jours') || path.includes('/dossiers/calculer-prix') ? 'vie-pro'
    : '';

  if (!current) {
    const signals = `${document.querySelector('.theme-link')?.getAttribute('href') || ''} ${document.querySelector('.article-hero .kicker')?.textContent || ''} ${document.querySelector('a.back')?.getAttribute('href') || ''} ${document.title}`.toLowerCase();
    if (/argent|finance|patrimoine|immobilier|investissement|retraite|transmission|allocation|etf|pea|assurance-vie/.test(signals)) current = 'patrimoine';
    else if (/travail|vie professionnelle|entreprendre|entrepreneuriat|emploi|carrière|formation|reconversion|candidature|entretien/.test(signals)) current = 'vie-pro';
  }
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  if (path.includes('/themes/travail')) {
    const kicker = document.querySelector('.article-hero .kicker');
    if (kicker) kicker.textContent = 'Vie professionnelle · Salariat & carrière';
  }
  if (path.includes('/themes/entreprendre')) {
    const kicker = document.querySelector('.article-hero .kicker');
    if (kicker) kicker.textContent = 'Vie professionnelle · Entrepreneuriat';
  }

  if (!/\/(index\.html)?$/.test(path)) {
    const h1 = document.querySelector('main h1');
    const crumb = document.createElement('div');
    crumb.className = 'ce-breadcrumb';
    let middle = '';
    if (current === 'patrimoine') middle = `<span class="sep">›</span><a href="${u('themes/argent.html')}">Patrimoine</a>`;
    else if (current === 'vie-pro') middle = `<span class="sep">›</span><a href="${u('parcours-vie-professionnelle.html')}">Vie professionnelle</a>`;
    else if (current === 'hors-cadre' && !path.endsWith('/hors-cadre.html')) middle = `<span class="sep">›</span><a href="${u('hors-cadre.html')}">Hors cadre</a>`;
    const label = path.includes('/bibliotheque') ? 'Tous les contenus' : (h1?.textContent?.trim() || document.title.split('—')[0].trim());
    crumb.innerHTML = `<div class="ce-breadcrumb-inner"><a href="${u('index.html')}">Accueil</a>${middle}<span class="sep">›</span><span class="current">${label}</span></div>`;
    header.insertAdjacentElement('afterend', crumb);
  }

  const slugify = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70) || 'section';
  const longContent = document.querySelector('article.prose, main article.prose, main .prose');
  if (longContent && !path.includes('/bibliotheque')) {
    const h2s = [...longContent.querySelectorAll(':scope > h2, :scope .dossier-section > h2')];
    const answerTitle = longContent.querySelector('.answer-box h2');
    if (answerTitle && /réponse en une minute/i.test(answerTitle.textContent)) answerTitle.textContent = 'En bref';

    if (h2s.length >= 5) {
      const used = new Set();
      h2s.forEach((h2, index) => {
        if (!h2.id) {
          let id = slugify(h2.textContent);
          let n = 2;
          while (used.has(id) || document.getElementById(id)) id = `${slugify(h2.textContent)}-${n++}`;
          h2.id = id;
        }
        used.add(h2.id);
      });

      let toc = longContent.querySelector('.dossier-nav, .ce-article-toc');
      if (!toc) {
        toc = document.createElement('nav');
        toc.className = 'ce-article-toc';
        toc.id = 'sommaire';
        toc.setAttribute('aria-label','Sommaire du dossier');
        const candidates = h2s.filter(h2 => !/ce que j.en retiens|checklist|pour aller plus loin/i.test(h2.textContent)).slice(0,8);
        toc.innerHTML = `<strong>Dans ce dossier</strong><ol>${candidates.map(h2 => `<li><a href="#${h2.id}">${h2.textContent.replace(/^\d+\.?\s*/, '')}</a></li>`).join('')}</ol>`;
        const intro = longContent.querySelector('.answer-box, .voice-note, .dossier-nav');
        if (intro) intro.insertAdjacentElement('afterend', toc); else h2s[0].insertAdjacentElement('beforebegin', toc);
      } else {
        toc.id = toc.id || 'sommaire';
      }

      h2s.forEach((h2, index) => {
        if (index > 0 && index % 4 === 0 && !h2.previousElementSibling?.classList.contains('ce-back-toc')) {
          const back = document.createElement('a');
          back.className = 'ce-back-toc';
          back.href = '#sommaire';
          back.textContent = '↑ Retour au sommaire';
          h2.insertAdjacentElement('beforebegin', back);
        }
      });
    }
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
  toggle?.addEventListener('click', event => { event.stopPropagation(); const open = header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) closeMenu(); });
})();