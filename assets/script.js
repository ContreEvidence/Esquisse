(() => {
  'use strict';
  const currentScript = document.currentScript;
  if (!document.documentElement.dataset.ceNavLoader) {
    document.documentElement.dataset.ceNavLoader = '13';
    const navScript = document.createElement('script');
    navScript.src = new URL('navigation-v3.js?v=20260806-13', currentScript?.src || window.location.href).href;
    navScript.defer = true;
    document.head.appendChild(navScript);
  }

  const nested = /\/(articles|themes)\//.test(window.location.pathname);
  const prefix = nested ? '../' : '';

  // Corrige les anciennes références visibles vers le logo.
  document.querySelectorAll('img').forEach(image => {
    const src = image.getAttribute('src') || '';
    if (/logo-ce|logo\.svg|avatar\.svg/.test(src)) {
      image.src = `${prefix}assets/logo.png`;
      image.alt = 'Logo Contre-évidence';
    }
  });

  // Classe chaque groupe d'articles du niveau 1 au niveau 3,
  // en conservant l'ordre éditorial à l'intérieur d'un même niveau.
  document.querySelectorAll('.articles').forEach(container => {
    const cards = [...container.children].filter(card => card.matches?.('.article-card[data-level]'));
    cards.map((card,index) => ({card,index,level:Number(card.dataset.level) || 99}))
      .sort((a,b) => a.level - b.level || a.index - b.index)
      .forEach(({card}) => container.appendChild(card));
  });

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
  }
  if (!document.querySelector('.reading-progress')) {
    const progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden','true');
    document.body.prepend(progress);
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1,window.scrollY/max) : 0})`;
    };
    window.addEventListener('scroll',update,{passive:true}); update();
  }
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
