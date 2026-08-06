(() => {
  const article = document.querySelector('article.prose');
  if (!article) return;

  const words = article.innerText.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  const headings = [...article.querySelectorAll('h2')].filter(h => {
    const t = h.textContent.trim().toLowerCase();
    return !t.startsWith('sources officielles') && !t.startsWith('pour compléter') && t !== 'ce que j’en retiens';
  });

  const tools = document.createElement('aside');
  tools.className = 'article-tools';
  tools.setAttribute('aria-label', 'Repères de lecture');
  tools.innerHTML = `
    <div class="article-meta-line">
      <span>⏱ ${minutes} min de lecture</span>
      <span>≈ ${words.toLocaleString('fr-FR')} mots</span>
      <span>${headings.length} sections</span>
    </div>
    <details class="article-toc" open>
      <summary>Dans cet article</summary>
      <nav aria-label="Sommaire de l’article"></nav>
    </details>`;

  const firstContent = article.querySelector('.voice-note, .answer-box, .warning-box');
  if (firstContent) firstContent.insertAdjacentElement('beforebegin', tools);
  else article.prepend(tools);

  const toc = tools.querySelector('nav');
  const slugify = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const used = new Set();
  headings.forEach((heading, index) => {
    let id = heading.id || slugify(heading.textContent) || `section-${index + 1}`;
    let unique = id;
    let n = 2;
    while (used.has(unique) || document.getElementById(unique)) unique = `${id}-${n++}`;
    heading.id = unique;
    used.add(unique);
    const link = document.createElement('a');
    link.href = `#${unique}`;
    link.textContent = heading.textContent.trim();
    toc.appendChild(link);
  });

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  const update = () => {
    const rect = article.getBoundingClientRect();
    const total = article.offsetHeight - window.innerHeight;
    const read = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    bar.style.width = `${Math.min(100, (read / Math.max(total, 1)) * 100)}%`;
  };
  update();
  document.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
})();
