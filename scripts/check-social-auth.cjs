const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const out = path.join(ROOT, 'publications', 'social-auth-status.json');

const value = name => String(process.env[name] || '').trim();
const present = name => Boolean(value(name));

async function validateYouTube() {
  const clientId = value('YOUTUBE_CLIENT_ID');
  const clientSecret = value('YOUTUBE_CLIENT_SECRET');
  const refreshToken = value('YOUTUBE_REFRESH_TOKEN');
  if (!clientId || !clientSecret || !refreshToken) {
    return { configured: false, valid: false, error: 'missing_credentials' };
  }

  try {
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    });
    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch (_) {}
    if (res.ok && data.access_token) {
      return { configured: true, valid: true, httpStatus: res.status };
    }
    return {
      configured: true,
      valid: false,
      httpStatus: res.status,
      error: String(data.error || 'token_exchange_failed'),
      errorDescription: String(data.error_description || '').slice(0, 240)
    };
  } catch (err) {
    return { configured: true, valid: false, error: 'network_error', errorDescription: String(err.message || err).slice(0, 240) };
  }
}

async function main() {
  const youtube = present('YOUTUBE_CLIENT_ID') && present('YOUTUBE_CLIENT_SECRET') && present('YOUTUBE_REFRESH_TOKEN');
  const youtubeCheck = await validateYouTube();
  const status = {
    version: 4,
    checkedAt: new Date().toISOString(),
    meta: present('META_USER_ACCESS_TOKEN') || (present('META_PAGE_ID') && present('META_PAGE_ACCESS_TOKEN')),
    instagramId: present('META_IG_USER_ID'),
    tiktok: present('TIKTOK_ACCESS_TOKEN'),
    youtube,
    youtubeValid: youtubeCheck.valid,
    youtubeHttpStatus: youtubeCheck.httpStatus || null,
    youtubeError: youtubeCheck.valid ? null : youtubeCheck.error,
    youtubeErrorDescription: youtubeCheck.valid ? null : (youtubeCheck.errorDescription || null)
  };

  fs.writeFileSync(out, JSON.stringify(status, null, 2) + '\n', 'utf8');
  console.log(`Autorisations détectées — Meta: ${status.meta ? 'oui' : 'non'}, TikTok: ${status.tiktok ? 'oui' : 'non'}, YouTube: ${status.youtube ? 'oui' : 'non'}; OAuth YouTube valide: ${status.youtubeValid ? 'oui' : 'non'}.`);
}

main().catch(err => { console.error(err); process.exit(1); });
