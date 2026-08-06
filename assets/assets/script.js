(() => {
  'use strict';

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

    const headings = [...prose.querySelectorAll('h2')].filter(heading => !heading.closest('.source-list'));
    if (headings.length >= 4 && !prose.querySelector('.article-toc')) {
      headings.forEach((heading, index) => {
        if (!heading.id) {
          const slug = heading.textContent.toLowerCase().normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          heading.id = slug || `section-${index + 1}`;
        }
      });

      const toc = document.createElement('details');
      toc.className = 'article-toc';
      toc.open = window.matchMedia('(min-width: 900px)').matches;
      toc.innerHTML = `<summary>Dans cet article</summary><ol>${headings.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join('')}</ol>`;
      const anchor = prose.querySelector('.answer-box') || prose.querySelector('.voice-note') || prose.firstElementChild;
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
