(() => {
  'use strict';
  if (document.documentElement.dataset.ceAnalyticsLoader === '1') return;
  document.documentElement.dataset.ceAnalyticsLoader = '1';

  const current = document.currentScript;
  if (!current?.src) return;
  const configUrl = new URL('analytics-config.json', current.src);

  fetch(configUrl, { cache: 'no-store', credentials: 'same-origin' })
    .then(response => response.ok ? response.json() : null)
    .then(config => {
      if (!config || config.enabled !== true) return;
      if (config.provider !== 'cloudflare-web-analytics') return;
      const token = String(config.token || '').trim();
      if (!token) return;
      if (document.querySelector('script[data-cf-beacon]')) return;

      const beacon = document.createElement('script');
      beacon.defer = true;
      beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      beacon.setAttribute('data-cf-beacon', JSON.stringify({ token, spa: false }));
      document.head.appendChild(beacon);
    })
    .catch(() => {});
})();
