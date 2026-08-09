const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const out = path.join(ROOT, 'publications', 'social-auth-status.json');

const present = name => Boolean(String(process.env[name] || '').trim());

const status = {
  version: 1,
  checkedAt: new Date().toISOString(),
  meta: present('META_USER_ACCESS_TOKEN') || (present('META_PAGE_ID') && present('META_PAGE_ACCESS_TOKEN')),
  instagramId: present('META_IG_USER_ID'),
  tiktok: present('TIKTOK_ACCESS_TOKEN'),
  youtube: present('YOUTUBE_CLIENT_ID') && present('YOUTUBE_CLIENT_SECRET') && present('YOUTUBE_REFRESH_TOKEN')
};

fs.writeFileSync(out, JSON.stringify(status, null, 2) + '\n', 'utf8');
console.log(`Autorisations détectées — Meta: ${status.meta ? 'oui' : 'non'}, TikTok: ${status.tiktok ? 'oui' : 'non'}, YouTube: ${status.youtube ? 'oui' : 'non'}.`);
