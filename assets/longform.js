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

  function buildArticleBodyLongform() {
    if (!document.body.classList.contains('article-body')) return;
    const main = document.querySelector('main');
    const hero = main?.querySelector(':scope > .hero, :scope > .article-hero');
    if (!main || !hero || main.dataset.ceLongform === '1') return;
    main.dataset.ceLongform = '1';

    const sections = [...main.querySelectorAll(':scope > section')].filter(s => s !== hero && !s.classList.contains('ce-related'));
    const h2s = sections.map(s => s.querySelector('h2')).filter(Boolean);
    if (h2s.length < 4) return;

    const readingText = sections.map(s => s.textContent || '').join(' ');
    const words = readingText.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    const heroContainer = hero.querySelector('.container');
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
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run, {once:true});
  else run();
  setTimeout(run, 0);
})();
