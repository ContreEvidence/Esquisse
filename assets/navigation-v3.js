(() => {
  if (!document.querySelector('link[href$="navigation-tabs.css"]')) {
    const tabsStyles = document.createElement('link');
    tabsStyles.rel = 'stylesheet';
    tabsStyles.href = new URL('navigation-tabs.css', document.currentScript?.src || window.location.href).href;
    document.head.appendChild(tabsStyles);
  }

  const header = document.querySelector('header');
  const menuButton = header?.querySelector('.menu');
  const nav = header?.querySelector('.site-nav');
  const items = [...document.querySelectorAll('.nav-item')];
  if (!header || !nav) return;

  const normalizePath = value => {
    try {
      const url = new URL(value, window.location.href);
      return url.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '') || '/';
    } catch {
      return '';
    }
  };

  const currentPath = normalizePath(window.location.href);
  nav.querySelectorAll('a[href]').forEach(link => {
    if (normalizePath(link.href) !== currentPath) return;
    link.classList.add('is-current');
    link.closest('.nav-item')?.classList.add('has-current');
  });

  const closeDropdowns = (except = null) => {
    items.forEach(item => {
      if (item === except) return;
      item.classList.remove('is-open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  };

  menuButton?.addEventListener('click', () => {
    const open = !header.classList.contains('nav-open');
    header.classList.toggle('nav-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    if (!open) closeDropdowns();
  });

  items.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', event => {
      event.stopPropagation();
      const open = !item.classList.contains('is-open');
      closeDropdowns(item);
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) {
      closeDropdowns();
      header.classList.remove('nav-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeDropdowns();
    header.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.focus();
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
    closeDropdowns();
  }));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      header.classList.remove('nav-open');
      menuButton?.setAttribute('aria-expanded', 'false');
    }
  });
})();
