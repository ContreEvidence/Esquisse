(() => {
  'use strict';

  const slugify = (s='') => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70) || 'section';

  function enhanceToc(toc) {
    if (!toc || toc.dataset.ceCollapsible === '1') return;
    toc.dataset.ceCollapsible = '1';
    const list = toc.querySelector('ol');
    if (!list) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ce-toc-toggle';
    button.setAttribute('aria-expanded','false');
    button.innerHTML = `Dans ce dossier <span>+</span>`;
    button.addEventListener('click', () => {
      const open = toc.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
      button.querySelector('span').textContent = open ? '−' : '+';
    });
    toc.insertBefore(button, list);
  }

  function enhanceMobileTables() {
    document.querySelectorAll('.prose .compare-wrap table').forEach(table => {
      const wrap = table.closest('.compare-wrap');
      if (!wrap || wrap.dataset.ceMobileTable === '1') return;
      const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
      const rows = [...table.querySelectorAll('tbody tr')];
      if (headers.length < 2 || !rows.length || rows.length > 18) return;
      const mobile = document.createElement('div');
      mobile.className = 'ce-mobile-table';
      rows.forEach(row => {
        const cells = [...row.children];
        const card = document.createElement('div');
        card.className = 'ce-mobile-row';
        card.innerHTML = cells.map((cell,index) => `<div class="ce-mobile-cell"><strong>${headers[index] || `Colonne ${index+1}`}</strong><span>${cell.innerHTML}</span></div>`).join('');
        mobile.appendChild(card);
      });
      wrap.dataset.ceMobileTable = '1';
      wrap.appendChild(mobile);
    });
  }

  function addEditorialAttribution(heroContainer) {
    if (!heroContainer || heroContainer.querySelector('.ce-editorial-meta')) return;
    const deep = /\/(?:dossiers|articles|fiches-metiers)\//.test(location.pathname);
    const root = deep ? '../' : '';
    const meta = document.createElement('div');
    meta.className = 'ce-reading-meta ce-editorial-meta';
    meta.innerHTML = `<span>Par <a href="${root}a-propos.html">Rédaction Contre-Évidence</a></span><span><a href="${root}methode-sources.html">Méthode & sources</a></span>`;
    const update = heroContainer.querySelector('.ce-update-meta');
    if (update) update.insertAdjacentElement('afterend', meta);
    else heroContainer.appendChild(meta);
  }

  function buildArticleBodyLongform() {
    const prose = document.querySelector('main article.prose');
    if (!document.body.classList.contains('article-body') && !prose) return;
    const main = document.querySelector('main');
    const hero = main?.querySelector(':scope > .hero, :scope > .article-hero');
    if (!main || !hero || main.dataset.ceLongform === '1') return;
    main.dataset.ceLongform = '1';

    const heroContainer = hero.querySelector('.container');
    if (prose) addEditorialAttribution(heroContainer);

    const sections = [...main.querySelectorAll(':scope > section')].filter(s => s !== hero && !s.classList.contains('ce-related'));
    const h2s = prose ? [...prose.querySelectorAll(':scope > h2')] : sections.map(s => s.querySelector('h2')).filter(Boolean);
    if (h2s.length < 4) return;

    const readingText = prose ? (prose.textContent || '') : sections.map(s => s.textContent || '').join(' ');
    const words = readingText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    if (heroContainer && !heroContainer.querySelector('.ce-longform-meta')) {
      const meta = document.createElement('div');
      meta.className = 'ce-reading-meta ce-longform-meta';
      meta.innerHTML = `<span>≈ ${minutes} min de lecture</span><span>${words.toLocaleString('fr-FR')} mots</span>`;
      heroContainer.appendChild(meta);
    }

    const used = new Set();
    h2s.forEach((h2,index) => {
      if (!h2.id) {
        let id = slugify(h2.textContent);
        if (used.has(id) || document.getElementById(id)) id = `${id}-${index+1}`;
        h2.id = id;
      }
      used.add(h2.id);
    });

    const toc = document.createElement('nav');
    toc.className = 'ce-article-toc';
    toc.id = 'sommaire';
    toc.setAttribute('aria-label','Sommaire du dossier');
    const candidates = h2s.filter(h => !/checklist|pour aller plus loin|à retenir|ce que j.en retiens/i.test(h.textContent)).slice(0,8);
    toc.innerHTML = `<strong>Dans ce dossier</strong><ol>${candidates.map(h => `<li><a href="#${h.id}">${h.textContent.replace(/^\d+\s*[·.:-]?\s*/, '')}</a></li>`).join('')}</ol>`;
    const wrap = document.createElement('div');
    wrap.className = 'ce-longform-toc-wrap';
    wrap.appendChild(toc);
    hero.insertAdjacentElement('afterend', wrap);

    h2s.forEach((h2,index) => {
      if (index > 0 && index % 4 === 0) {
        const back = document.createElement('a');
        back.className = 'ce-back-toc';
        back.href = '#sommaire';
        back.textContent = '↑ Retour au sommaire';
        h2.insertAdjacentElement('beforebegin', back);
      }
    });

    if (!document.querySelector('.ce-reading-progress')) {
      const progress = document.createElement('div');
      progress.className = 'ce-reading-progress';
      document.body.appendChild(progress);
      const sync = () => {
        const rect = main.getBoundingClientRect();
        const start = window.scrollY + rect.top;
        const end = start + Math.max(main.offsetHeight - window.innerHeight, 1);
        const ratio = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start || 1)));
        progress.style.transform = `scaleX(${ratio})`;
      };
      window.addEventListener('scroll', sync, {passive:true});
      window.addEventListener('resize', sync);
      sync();
    }
  }

  const run = () => {
    buildArticleBodyLongform();
    document.querySelectorAll('.ce-article-toc').forEach(enhanceToc);
    enhanceMobileTables();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
  setTimeout(run, 0);
})();