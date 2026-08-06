(() => {
  const nested = /\/(articles|themes)\//.test(window.location.pathname);
  const root = nested ? '../' : '';
  const nav = document.querySelector('header nav');
  const menu = document.querySelector('.menu');

  if (nav) {
    nav.classList.add('site-nav');
    nav.innerHTML = `
      <div class="nav-group">
        <button class="nav-trigger" type="button" aria-expanded="false">Commencer <span aria-hidden="true">⌄</span></button>
        <div class="nav-dropdown">
          <a href="${root}debuter.html"><strong>Débuter</strong><small>Les premiers articles, sans jargon</small></a>
          <a href="${root}parcours-argent.html"><strong>Parcours argent</strong><small>Épargne, enveloppes, supports et allocation</small></a>
          <a href="${root}articles/grosse-entree-argent-que-faire.html"><strong>Gérer une grosse somme</strong><small>Les décisions des 90 premiers jours</small></a>
        </div>
      </div>
      <div class="nav-group">
        <button class="nav-trigger" type="button" aria-expanded="false">Thèmes <span aria-hidden="true">⌄</span></button>
        <div class="nav-dropdown nav-dropdown-wide">
          <a href="${root}themes/argent.html"><strong>Argent et épargne</strong><small>Budget, produits, investissement et risque</small></a>
          <a href="${root}themes/travail.html"><strong>Travail et carrière</strong><small>Compétences, reconversion et organisation</small></a>
          <a href="${root}themes/entreprendre.html"><strong>Entreprendre</strong><small>Clients, offre, prix et développement</small></a>
          <a href="${root}themes/ia.html"><strong>IA et technologie</strong><small>Outils, automatisation et jugement</small></a>
          <a href="${root}themes/decisions.html"><strong>Décisions et psychologie</strong><small>Biais, arbitrages et incertitude</small></a>
          <a href="${root}themes/systemes.html"><strong>Systèmes et société</strong><small>Règles, incitations et effets indirects</small></a>
        </div>
      </div>
      <a class="nav-direct" href="${root}bibliotheque.html">Bibliothèque</a>
      <a class="nav-direct" href="${root}a-propos.html">À propos</a>`;
  }

  const closeDropdowns = (except = null) => {
    document.querySelectorAll('.nav-group.open').forEach(group => {
      if (group !== except) {
        group.classList.remove('open');
        group.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
  };

  document.querySelectorAll('.nav-trigger').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const group = trigger.closest('.nav-group');
      const willOpen = !group.classList.contains('open');
      closeDropdowns(group);
      group.classList.toggle('open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  document.addEventListener('click', () => closeDropdowns());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeDropdowns();
      nav?.classList.remove('open');
      menu?.setAttribute('aria-expanded', 'false');
    }
  });

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(open));
      if (!open) closeDropdowns();
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      closeDropdowns();
    }));
  }

  const prose = document.querySelector('article.prose');
  const heroContainer = document.querySelector('.article-hero .container');
  if (prose) {
    const words = prose.textContent.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 210));
    if (heroContainer && !heroContainer.querySelector('.reading-meta')) {
      const meta = document.createElement('div');
      meta.className = 'reading-meta';
      meta.textContent = `${minutes} min de lecture · ${words.toLocaleString('fr-FR')} mots`;
      const paragraph = heroContainer.querySelector(':scope > p:last-of-type');
      paragraph ? paragraph.insertAdjacentElement('afterend', meta) : heroContainer.append(meta);
    }

    const headings = [...prose.querySelectorAll('h2')].filter(h => !h.closest('.source-list'));
    if (headings.length >= 4 && !prose.querySelector('.article-toc')) {
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const slug = heading.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          heading.id = slug || `section-${index + 1}`;
        }
      });
      const toc = document.createElement('details');
      toc.className = 'article-toc';
      toc.open = window.matchMedia('(min-width: 900px)').matches;
      toc.innerHTML = `<summary>Dans cet article</summary><ol>${headings.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
      const answerBox = prose.querySelector('.answer-box');
      const voiceNote = prose.querySelector('.voice-note');
      const anchor = answerBox || voiceNote || prose.firstElementChild;
      anchor ? anchor.insertAdjacentElement('afterend', toc) : prose.prepend(toc);
    }
  }

  if (!document.querySelector('.reading-progress')) {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  document.querySelectorAll('[data-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
})();
