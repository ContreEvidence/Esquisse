(() => {
  'use strict';

  const VERSION = '20260810-13';
  if (document.documentElement.dataset.ceNavigation === VERSION) return;
  document.documentElement.dataset.ceNavigation = VERSION;

  const header = document.querySelector('#site-header, header');
  if (!header) return;

  const path = window.location.pathname;
  const nested = /\/(articles|themes|dossiers|fiches-metiers)\//.test(path);
  const prefix = nested ? '../' : '';
  const u = p => `${prefix}${p}`;
  const params = new URLSearchParams(window.location.search);

  const links = [
    ['Patrimoine','themes/argent.html','patrimoine'],
    ['Vie professionnelle','parcours-vie-professionnelle.html','vie-pro'],
    ['Fenêtres','hors-cadre.html','hors-cadre'],
    ['Outils','bibliotheque.html?type=outil','outils']
  ];
  const mobileLinks = [
    ['Bibliothèque','bibliotheque.html'],
    ['Par où commencer ?','parcours-de-vie.html'],
    ['Mon espace','mon-espace.html']
  ];

  header.className = 'ce-flat-header';
  header.innerHTML = `<div class="ce-flat-shell ce-flat-top">
    <a class="ce-flat-brand" href="${u('index.html')}"><img src="${u('assets/logo.png')}?v=20260808-14" alt="Logo Contre-évidence"><span class="ce-flat-brand-copy"><strong>CONTRE-<em>ÉVIDENCE</em></strong><small>PATRIMOINE · VIE PROFESSIONNELLE · FENÊTRES</small></span></a>
    <form class="ce-search" action="${u('bibliotheque.html')}" method="get" role="search"><input type="search" name="q" aria-label="Rechercher sur le site" placeholder="Rechercher : emploi, formation, immobilier, investissement…" autocomplete="off"><button type="submit">Rechercher</button></form>
    <div class="ce-flat-actions"><a class="ce-start-link" href="${u('parcours-de-vie.html')}">Par où commencer ?</a><button class="ce-flat-toggle" type="button" aria-expanded="false" aria-label="Ouvrir le menu"><span></span><span></span><span></span></button></div>
  </div><nav class="ce-flat-nav" aria-label="Navigation principale"><div class="ce-flat-shell ce-flat-links">${links.map(([label,p,key]) => `<a class="ce-flat-link" data-key="${key}" href="${u(p)}">${label}</a>`).join('')}${mobileLinks.map(([label,p]) => `<a class="ce-flat-link ce-menu-only" href="${u(p)}">${label}</a>`).join('')}</div></nav>`;

  const q = params.get('q');
  if (q) header.querySelector('.ce-search input').value = q;

  const isTools = /\/(simulateur|outil)[^/]*\.html$/i.test(path) || (path.endsWith('/bibliotheque.html') && params.get('type') === 'outil');
  let current = isTools ? 'outils'
    : path.includes('/hors-cadre') ? 'hors-cadre'
    : path.includes('/themes/argent') || path.includes('/parcours-argent') || path.includes('/marches-analyses-avancees') || path.includes('/dossiers/finances-') || path.includes('/dossiers/audit-budget') || path.includes('/dossiers/liquidites-reserve') || path.includes('/dossiers/rembourser-credit') || path.includes('/dossiers/assurer-ou-autoassurer') || path.includes('/dossiers/vendre-ou-conserver-bien-immobilier') || path.includes('/dossiers/immobilier-') || path.includes('/dossiers/location-') || path.includes('/dossiers/garages-') || path.includes('/dossiers/classes-actifs') ? 'patrimoine'
    : path.includes('/fiches-metiers') || path.includes('/parcours-vie-professionnelle') || path.includes('/themes/travail') || path.includes('/themes/entreprendre') || path.includes('/moins-de-25-ans') || path.includes('/videos') || path.includes('/dossiers/plan-30-jours') || path.includes('/dossiers/calculer-prix') || path.includes('/dossiers/debloquer') || path.includes('/dossiers/negocier-salaire') || path.includes('/dossiers/dependance-gros-client') || path.includes('/dossiers/tresorerie-bfr') || path.includes('/dossiers/devenir-manager') || path.includes('/dossiers/competent-mais-invisible') || path.includes('/dossiers/capacite-refuser-travail') || path.includes('/dossiers/formation-vaut-elle-le-cout') || path.includes('/dossiers/quitter-emploi-stable') || path.includes('/dossiers/embaucher-ou-sous-traiter') || path.includes('/dossiers/competences-qualification-employabilite') || path.includes('/dossiers/metiers-fonctions-organisation-entreprise') || path.includes('/dossiers/apprendre-developper-competences') || path.includes('/dossiers/management-relations-conflits') || path.includes('/dossiers/regles-responsabilites-fautes-travail') || path.includes('/dossiers/prejuges-biais-monde-professionnel') || path.includes('/dossiers/sante-travail-equilibre-vie-pro-perso') ? 'vie-pro'
    : '';

  if (!current) {
    const signals = `${document.querySelector('.theme-link')?.getAttribute('href') || ''} ${document.querySelector('.article-hero .kicker')?.textContent || ''} ${document.querySelector('a.back')?.getAttribute('href') || ''} ${document.title}`.toLowerCase();
    if (/argent|finance|patrimoine|immobilier|investissement|retraite|transmission|allocation|etf|pea|assurance-vie/.test(signals)) current = 'patrimoine';
    else if (/travail|vie professionnelle|entreprendre|entrepreneuriat|emploi|carrière|formation|reconversion|candidature|entretien|métier|compétence|management|employabilité/.test(signals)) current = 'vie-pro';
  }
  if (current) header.querySelector(`[data-key="${current}"]`)?.classList.add('is-current');

  const toggle = header.querySelector('.ce-flat-toggle');
  const setOpen = open => {
    header.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
    if (toggle) toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  };
  toggle?.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
  header.querySelectorAll('.ce-flat-link').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  const syncMobileOnly = () => header.querySelectorAll('.ce-menu-only').forEach(a => { a.style.display = window.innerWidth < 760 ? 'flex' : 'none'; });
  window.addEventListener('resize', syncMobileOnly);
  syncMobileOnly();

  if (!/\/(index\.html)?$/.test(path)) {
    document.querySelector('.ce-breadcrumb')?.remove();
    const h1 = document.querySelector('main h1');
    const crumb = document.createElement('div');
    crumb.className = 'ce-breadcrumb';
    let middle = '';
    if (current === 'patrimoine') middle = `<span class="sep">›</span><a href="${u('themes/argent.html')}">Patrimoine</a>`;
    else if (current === 'vie-pro') middle = `<span class="sep">›</span><a href="${u('parcours-vie-professionnelle.html')}">Vie professionnelle</a>`;
    else if (current === 'hors-cadre' && !path.endsWith('/hors-cadre.html')) middle = `<span class="sep">›</span><a href="${u('hors-cadre.html')}">Fenêtres</a>`;
    const label = path.includes('/bibliotheque') ? 'Tous les contenus' : (h1?.textContent?.trim() || document.title.split('—')[0].trim());
    crumb.innerHTML = `<div class="ce-breadcrumb-inner"><a href="${u('index.html')}">Accueil</a>${middle}<span class="sep">›</span><span class="current">${label}</span></div>`;
    header.insertAdjacentElement('afterend', crumb);
  }

  const footer = document.querySelector('footer .foot, footer .container');
  if (footer && !footer.querySelector('.ce-footer-socials')) {
    const socials = document.createElement('div');
    socials.className = 'ce-footer-socials';
    socials.innerHTML = '<strong>Suivre Contre-Évidence</strong><a href="https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA" target="_blank" rel="noopener">YouTube</a><a href="https://www.instagram.com/contre_evidence/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/profile.php?id=61592757877017" target="_blank" rel="noopener">Facebook</a><a href="https://www.tiktok.com/@contreevidence" target="_blank" rel="noopener">TikTok</a>';
    footer.appendChild(socials);
  }
})();