(() => {
  'use strict';

  // Nouvelle génération : neutralise aussi les anciennes versions éventuellement en cache.
  if (document.documentElement.dataset.ceNavigation20260808 === '1') return;
  document.documentElement.dataset.ceNavigation20260808 = '1';
  document.documentElement.dataset.ceFlatNav = '36';

  const header = document.querySelector('header');
  if (!header) return;

  const path = window.location.pathname;
  const nested = /\/(articles|themes|dossiers)\//.test(path);
  const prefix = nested ? '../' : '';
  const u = p => `${prefix}${p}`;
  const params = new URLSearchParams(window.location.search);

  const style = document.createElement('style');
  style.dataset.ceNavigation20260808 = '1';
  style.textContent = `
    .ce-flat-header,.ce-flat-header *{box-sizing:border-box}
    .ce-flat-header{position:sticky!important;top:0;z-index:5000;width:100%;background:#080809!important;color:#fff;border-bottom:1px solid rgba(232,201,121,.34);box-shadow:0 4px 14px rgba(0,0,0,.22);font-family:inherit}
    .ce-flat-shell{width:min(1180px,92vw);margin:0 auto}
    .ce-flat-top{min-height:62px;display:grid;grid-template-columns:minmax(220px,auto) minmax(260px,1fr) auto;align-items:center;gap:.8rem;padding:.25rem 0}
    .ce-flat-brand{display:inline-flex;align-items:center;gap:.65rem;color:#fff;text-decoration:none;white-space:nowrap}
    .ce-flat-brand img{display:block;width:48px;height:48px;flex:0 0 48px;object-fit:contain;border-radius:50%;background:#050506;box-shadow:0 0 0 2px #d4ab56,0 0 0 3px #fff}
    .ce-flat-brand-copy{display:flex;flex-direction:column;gap:.18rem;line-height:1}
    .ce-flat-brand-copy strong{font-size:clamp(.98rem,1.35vw,1.22rem);letter-spacing:.045em;color:#fff}.ce-flat-brand-copy strong em{font-style:normal;color:#d4ab56}
    .ce-flat-brand-copy small{font-size:.54rem;letter-spacing:.11em;color:#e8c979;font-weight:800}
    .ce-search{display:flex!important;align-items:stretch;width:100%;max-width:590px;margin-inline:auto;background:#fff;border:2px solid #fff;border-radius:10px;overflow:hidden}
    .ce-search input{min-width:0;flex:1;height:36px;padding:0 .75rem;border:0;background:#fff;color:#101820;font:inherit;font-size:.86rem}.ce-search input::placeholder{color:#59646d;opacity:1}
    .ce-search button{min-width:80px;border:0;background:#d4ab56;color:#101010;font-size:.82rem;font-weight:900;cursor:pointer}.ce-search button:hover,.ce-search button:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:-4px}
    .ce-flat-actions{display:flex;align-items:center;justify-content:flex-end}.ce-start-link{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:.42rem .68rem;border-radius:999px;text-decoration:none;font-size:.74rem;font-weight:850;white-space:nowrap;background:#fff;color:#101820;border:2px solid #d4ab56}
    .ce-flat-toggle{display:none;width:40px;height:40px;padding:0;border:1px solid rgba(255,255,255,.34);border-radius:9px;background:#18181a;cursor:pointer}.ce-flat-toggle span{display:block;width:19px;height:2px;margin:4px auto;background:#fff;border-radius:2px}
    .ce-flat-nav{background:#111113;border-top:1px solid rgba(232,201,121,.18)}.ce-flat-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.35rem;padding:.18rem 0 .22rem}
    .ce-flat-link{position:relative;display:flex;align-items:center;justify-content:center;min-height:35px;padding:.4rem .45rem;color:#e9edef;text-decoration:none;text-align:center;font-size:.96rem;font-weight:850;line-height:1.08;border-radius:7px;white-space:nowrap}
    .ce-flat-link:after{content:'';position:absolute;left:24%;right:24%;bottom:0;height:2px;background:transparent;border-radius:3px}.ce-flat-link:hover,.ce-flat-link:focus-visible{background:#1a1a1d;color:#fff;outline:none}.ce-flat-link:hover:after,.ce-flat-link:focus-visible:after{background:#8d7133}.ce-flat-link.is-current{background:#171719!important;color:#fff!important}.ce-flat-link.is-current:after{background:#d4ab56!important}.ce-flat-link[data-key="hors-cadre"]{color:#e8c979}
    .ce-breadcrumb{background:#f5f1e7;border-bottom:1px solid rgba(16,24,32,.08)}.ce-breadcrumb-inner{width:min(1180px,92vw);margin:0 auto;display:flex;align-items:center;gap:.42rem;min-height:32px;font-size:.77rem;color:#59646d;white-space:nowrap;overflow:hidden}.ce-breadcrumb a{color:#49545d;text-decoration:none;font-weight:750}.ce-breadcrumb a:hover{text-decoration:underline}.ce-breadcrumb .sep{color:#9b927f}.ce-breadcrumb .current{overflow:hidden;text-overflow:ellipsis;color:#101820;font-weight:750}
    .ce-reading-meta{display:flex;flex-wrap:wrap;gap:.45rem .8rem;margin-top:.65rem;font-size:.8rem;color:#67717a}.ce-reading-meta span{white-space:nowrap}.ce-update-meta{display:flex;flex-wrap:wrap;gap:.4rem .8rem;margin-top:.55rem;font-size:.78rem;color:#75602f;font-weight:750}
    .ce-article-toc{margin:1.25rem 0 1.55rem;padding:.95rem 1.05rem;border:1px solid rgba(16,24,32,.12);border-left:4px solid #d4ab56;border-radius:12px;background:#f8f6f0}.ce-article-toc strong{display:block;margin-bottom:.62rem;font-size:1rem;color:#101820}.ce-article-toc ol{margin:0;padding-left:1.25rem;columns:2;column-gap:2rem}.ce-article-toc li{break-inside:avoid;margin:.28rem 0}.ce-article-toc a{color:#25313a;text-decoration:none;font-weight:720}.ce-article-toc a:hover{text-decoration:underline}.ce-back-toc{display:block;width:max-content;margin:.42rem 0 .95rem;font-size:.79rem;font-weight:800;color:#78612d;text-decoration:none}.ce-back-toc:hover{text-decoration:underline}
    .ce-tool-bridge{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1.2rem 0 1.5rem;padding:1rem 1.05rem;border:1px solid rgba(16,24,32,.13);border-left:4px solid #d4ab56;border-radius:12px;background:#fff8e8}.ce-tool-bridge strong{display:block;color:#101820}.ce-tool-bridge span{display:block;margin-top:.2rem;color:#59646d;font-size:.88rem}.ce-tool-bridge a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;padding:.62rem .82rem;border-radius:9px;background:#101820;color:#fff;text-decoration:none;font-weight:850}.ce-tool-bridge a:hover{background:#2b3238}
    .ce-reading-progress{position:fixed;left:0;top:0;z-index:7000;height:3px;width:100%;transform:scaleX(0);transform-origin:left center;background:#d4ab56;pointer-events:none}.article-tools,.reading-progress{display:none!important}
    .ce-footer-socials{width:100%;display:flex;flex-wrap:wrap;align-items:center;gap:.45rem .6rem;margin-top:.45rem;padding-top:.8rem;border-top:1px solid rgba(255,255,255,.14)}.ce-footer-socials strong{color:#e8c979;margin-right:.15rem}.ce-footer-socials a{display:inline-flex;align-items:center;min-height:30px;padding:.28rem .55rem;border-radius:999px;border:1px solid rgba(255,255,255,.22);color:#fff!important;text-decoration:none;font-size:.84rem;font-weight:800}.ce-footer-socials a:hover,.ce-footer-socials a:focus-visible{background:#d4ab56;color:#09090a!important;border-color:#e8c979}
    @media(max-width:1040px) and (min-width:760px){.ce-flat-top{grid-template-columns:auto 1fr}.ce-search{grid-column:1/-1;grid-row:2;max-width:none}.ce-flat-actions{grid-column:2;grid-row:1}.ce-flat-brand-copy small{display:none}.ce-flat-link{font-size:.93rem}}
    @media(max-width:759px){.ce-flat-top{grid-template-columns:1fr auto;gap:.45rem;padding:.35rem 0 .42rem}.ce-flat-brand img{width:46px;height:46px;flex-basis:46px}.ce-flat-brand{gap:.55rem}.ce-flat-brand-copy strong{font-size:.9rem}.ce-flat-brand-copy small,.ce-start-link{display:none}.ce-flat-actions{justify-self:end}.ce-flat-toggle{display:block}.ce-search{grid-column:1/-1;grid-row:2;max-width:none;margin:0}.ce-search input{height:36px;font-size:.82rem}.ce-search button{min-width:76px;font-size:.8rem}.ce-flat-nav{display:none;position:absolute;left:0;right:0;top:100%;max-height:calc(100vh - 105px);overflow:auto;background:#0d0d0f;box-shadow:0 18px 40px rgba(0,0,0,.44)}.ce-flat-header.is-open .ce-flat-nav{display:block}.ce-flat-links{grid-template-columns:1fr;gap:.22rem;width:min(94vw,680px);padding:.5rem 0 .7rem}.ce-flat-link{min-height:40px;justify-content:flex-start;padding:.64rem .8rem;text-align:left;border-left:4px solid #8d7133;border-radius:7px;font-size:.96rem;white-space:normal}.ce-flat-link:after{display:none}.ce-flat-link.is-current{border-left-color:#d4ab56}.ce-breadcrumb-inner{font-size:.72rem}.ce-article-toc ol{columns:1}.ce-tool-bridge{align-items:stretch;flex-direction:column}.ce-tool-bridge a{width:100%}}
  `;
  document.head.appendChild(style);

  const links = [
    ['Patrimoine','themes/argent.html','patrimoine'],
    ['Vie professionnelle','parcours-vie-professionnelle.html','vie-pro'],
    ['Hors cadre','hors-cadre.html','hors-cadre']
  ];
  const socials = [
    ['YouTube','https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA'],
    ['Instagram','https://www.instagram.com/contre_evidence/'],
    ['Facebook','https://www.facebook.com/profile.php?id=61592757877017'],
    ['TikTok','https://www.tiktok.com/@contreevidence']
  ];

  header.className = 'ce-flat-header';
  header.innerHTML = `<div class="ce-flat-shell ce-flat-top"><a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260808-14" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>PATRIMOINE · VIE PROFESSIONNELLE · HORS CADRE</small></span></a><form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search"><input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, formation, immobilier, investissement…" autocomplete="off"><button type="submit">Rechercher</button></form><div class="ce-flat-actions"><a class="ce-start-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div></div><nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,p,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(p)}">${label}</a>`).join('')}</div></nav>`;

  const q = params.get('q');
  if (q) header.querySelector('.ce-search input').value = q;

  let current = path.includes('/hors-cadre') ? 'hors-cadre'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/marches-analyses-avancees') || path.includes('/dossiers/finances-') || path.includes('/dossiers/audit-budget') || path.includes('/dossiers/liquidites-reserve') || path.includes('/dossiers/rembourser-credit') || path.includes('/dossiers/assurer-ou-autoassurer') || path.includes('/dossiers/vendre-ou-conserver-bien-immobilier') ? 'patrimoine'
    : path.includes('/themes/travail') || path.includes('/themes/entreprendre') || path.includes('/parcours-vie-professionnelle') || path.includes('/moins-de-25-ans') || path.includes('/videos') || path.includes('/dossiers/plan-30-jours') || path.includes('/dossiers/calculer-prix') || path.includes('/dossiers/debloquer') || path.includes('/dossiers/negocier-salaire') || path.includes('/dossiers/dependance-gros-client') || path.includes('/dossiers/tresorerie-bfr') || path.includes('/dossiers/devenir-manager') || path.includes('/dossiers/competent-mais-invisible') || path.includes('/dossiers/capacite-refuser-travail') || path.includes('/dossiers/formation-vaut-elle-le-cout') || path.includes('/dossiers/quitter-emploi-stable') || path.includes('/dossiers/embaucher-ou-sous-traiter') ? 'vie-pro'
    : '';

  if (!current) {
    const signals = `${document.querySelector('.theme-link')?.getAttribute('href') || ''} ${document.querySelector('.article-hero .kicker')?.textContent || ''} ${document.querySelector('a.back')?.getAttribute('href') || ''} ${document.title}`.toLowerCase();
    if (/argent|finance|patrimoine|immobilier|investissement|retraite|transmission|allocation|etf|pea|assurance-vie/.test(signals)) current = 'patrimoine';
    else if (/travail|vie professionnelle|entreprendre|entrepreneuriat|emploi|carrière|formation|reconversion|candidature|entretien/.test(signals)) current = 'vie-pro';
  }
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  if (!/\/(index\.html)?$/.test(path)) {
    document.querySelector('.ce-breadcrumb')?.remove();
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

  const longContent = document.querySelector('article.prose, main .prose');
  if (longContent && !path.includes('/bibliotheque')) {
    document.querySelectorAll('.article-tools,.reading-progress,.ce-reading-meta,.ce-update-meta,.ce-article-toc,.ce-back-toc,.ce-reading-progress,.ce-tool-bridge').forEach(el => el.remove());

    const words = longContent.textContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    const heroContainer = document.querySelector('.article-hero .container');
    if (heroContainer) {
      const reading = document.createElement('div');
      reading.className = 'ce-reading-meta';
      reading.innerHTML = `<span>${minutes} min de lecture</span><span>≈ ${words.toLocaleString('fr-FR')} mots</span>`;
      heroContainer.appendChild(reading);
    }

    const updated = /\/dossiers\/finances-|\/dossiers\/(audit-budget|liquidites-reserve-securite|rembourser-credit-ou-investir|assurer-ou-autoassurer-risques|vendre-ou-conserver-bien-immobilier|calculer-prix-minimum-rentable|plan-30-jours|negocier-salaire-responsabilites|competent-mais-invisible-travail|devenir-manager-premiere-fois|quitter-emploi-stable-ou-rester|formation-vaut-elle-le-cout|dependance-gros-client|tresorerie-bfr-entreprise|capacite-refuser-travail-rentabilite|embaucher-ou-sous-traiter|protocole-verifier-reponse-ia|decider-sans-tourner-en-rond|debloquer-demarche-administrative)|\/(articles)\/(reconversion-ne-commence-pas-formation|tester-metier-avant-investir|sans-diplome-chemins-alternatifs|competences-transferables|competences-invisibles-preuves|premiere-chance-sans-experience|retrouver-emploi-apres-interruption|repartir-sans-recommencer-zero|grosse-entree-argent-que-faire|construire-epargne-de-zero|clients-interesses-personne-nachete|travailler-beaucoup-gagner-peu-prix)\.html/.test(path);
    if (updated && heroContainer) {
      const update = document.createElement('div');
      update.className = 'ce-update-meta';
      update.innerHTML = `<span>Mis à jour le 8 août 2026</span>${longContent.querySelector('.source-list') ? '<span>Références officielles indiquées dans le dossier</span>' : ''}`;
      heroContainer.appendChild(update);
      let meta = document.querySelector('meta[name="dateModified"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'dateModified'; document.head.appendChild(meta); }
      meta.content = '2026-08-08';
      let og = document.querySelector('meta[property="article:modified_time"]');
      if (!og) { og = document.createElement('meta'); og.setAttribute('property','article:modified_time'); document.head.appendChild(og); }
      og.content = '2026-08-08T13:37:00+02:00';
    }

    const toolLinks = [
      [path.endsWith('/dossiers/audit-budget-60-minutes.html'),'outil-audit-financier-personnel.html','Faire mon audit financier'],
      [path.endsWith('/dossiers/liquidites-reserve-securite.html'),'simulateur-reserve-securite.html','Tester ma réserve de sécurité'],
      [path.endsWith('/dossiers/finances-allocation-portefeuille.html'),'simulateur-allocation-stress-test.html','Tester mon allocation'],
      [path.endsWith('/dossiers/rembourser-credit-ou-investir.html'),'simulateur-rembourser-ou-investir.html','Comparer avec mes chiffres'],
      [path.endsWith('/dossiers/finances-credit-endettement.html'),'simulateur-capacite-emprunt.html','Estimer une capacité d’emprunt'],
      [path.endsWith('/dossiers/finances-residence-principale.html'),'simulateur-acheter-ou-louer.html','Comparer acheter et louer'],
      [path.endsWith('/dossiers/finances-investissement-locatif.html'),'simulateur-investissement-locatif.html','Tester un projet locatif'],
      [path.endsWith('/dossiers/vendre-ou-conserver-bien-immobilier.html'),'simulateur-vendre-ou-conserver.html','Comparer vendre et conserver'],
      [path.endsWith('/articles/grosse-entree-argent-que-faire.html'),'outil-repartir-grosse-somme.html','Isoler le capital réellement investissable'],
      [path.endsWith('/dossiers/plan-30-jours-recherche-emploi.html'),'outil-pilotage-recherche-emploi.html','Piloter mes candidatures'],
      [path.endsWith('/articles/competences-transferables.html') || path.endsWith('/articles/competences-invisibles-preuves.html'),'outil-competences-preuves-cv.html','Construire mes preuves'],
      [path.endsWith('/dossiers/formation-vaut-elle-le-cout.html'),'simulateur-cout-formation.html','Calculer le coût réel'],
      [path.endsWith('/dossiers/calculer-prix-minimum-rentable.html'),'simulateur-prix-minimum-rentable.html','Calculer mon prix plancher'],
      [path.endsWith('/dossiers/tresorerie-bfr-entreprise.html'),'outil-tresorerie-13-semaines.html','Projeter ma trésorerie']
    ];
    const toolLink = toolLinks.find(([match]) => match);
    if (toolLink) {
      const bridge = document.createElement('div');
      bridge.className = 'ce-tool-bridge';
      bridge.innerHTML = `<div><strong>Passer du dossier à votre situation</strong><span>L’outil applique ce raisonnement à vos propres chiffres ou informations, dans votre navigateur.</span></div><a href="${u(toolLink[1])}">${toolLink[2]} →</a>`;
      const intro = longContent.querySelector('.answer-box, .voice-note, .warning-box');
      if (intro) intro.insertAdjacentElement('afterend', bridge); else longContent.prepend(bridge);
    }

    const answerTitle = longContent.querySelector('.answer-box h2');
    if (answerTitle && /réponse en une minute/i.test(answerTitle.textContent)) answerTitle.textContent = 'En bref';

    const h2s = [...longContent.querySelectorAll(':scope > h2, :scope .dossier-section > h2')].filter(h => !/sources officielles|pour compléter/i.test(h.textContent));
    if (h2s.length >= 5) {
      const slugify = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70) || 'section';
      const used = new Set();
      h2s.forEach(h2 => {
        if (!h2.id) {
          let id = slugify(h2.textContent), n = 2;
          while (used.has(id) || document.getElementById(id)) id = `${slugify(h2.textContent)}-${n++}`;
          h2.id = id;
        }
        used.add(h2.id);
      });
      const toc = document.createElement('nav');
      toc.className = 'ce-article-toc';
      toc.id = 'sommaire';
      toc.setAttribute('aria-label','Sommaire du dossier');
      const candidates = h2s.filter(h => !/ce que j.en retiens|checklist|pour aller plus loin/i.test(h.textContent)).slice(0,8);
      toc.innerHTML = `<strong>Dans ce dossier</strong><ol>${candidates.map(h => `<li><a href="#${h.id}">${h.textContent.replace(/^\d+\.?\s*/, '')}</a></li>`).join('')}</ol>`;
      const intro = longContent.querySelector('.answer-box, .voice-note, .warning-box');
      if (intro) intro.insertAdjacentElement('afterend', toc); else h2s[0].insertAdjacentElement('beforebegin', toc);
      h2s.forEach((h2,index) => {
        if (index > 0 && index % 4 === 0) {
          const back = document.createElement('a');
          back.className = 'ce-back-toc'; back.href = '#sommaire'; back.textContent = '↑ Retour au sommaire';
          h2.insertAdjacentElement('beforebegin', back);
        }
      });
    }

    const progress = document.createElement('div');
    progress.className = 'ce-reading-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.appendChild(progress);
    const updateProgress = () => {
      const rect = longContent.getBoundingClientRect();
      const total = Math.max(longContent.offsetHeight - window.innerHeight, 1);
      const read = Math.min(Math.max(-rect.top, 0), total);
      progress.style.transform = `scaleX(${read / total})`;
    };
    window.addEventListener('scroll', updateProgress, {passive:true});
    window.addEventListener('resize', updateProgress);
    updateProgress();
  }

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

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
      const social = document.createElement('div');
      social.className = 'ce-footer-socials';
      social.innerHTML = `<strong>Réseaux</strong>${socials.map(([name,url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}`;
      foot.appendChild(social);
    }
  }

  const toggle = header.querySelector('.ce-flat-toggle');
  const close = () => { header.classList.remove('is-open'); toggle?.setAttribute('aria-expanded','false'); };
  toggle?.addEventListener('click', e => { e.stopPropagation(); const open = header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
  header.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => { if (!header.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 760) close(); });
})();