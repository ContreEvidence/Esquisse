const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_PATH = path.join(ROOT, 'publications', 'social-package.json');
const CONFIG_PATH = path.join(ROOT, 'publications', 'social-config.json');
const STATE_PATH = path.join(ROOT, 'publications', 'social-state.json');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function readJson(file, fallback = {}) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (_) { return fallback; }
}

function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

async function jsonRequest(url, options = {}) {
  const res = await fetch(url, options);
  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : {}; } catch (_) { data = { raw: text }; }
  if (!res.ok || data?.error?.code && data.error.code !== 'ok') {
    const message = data?.error?.message || data?.error?.error_user_msg || data?.error?.code || `${res.status} ${res.statusText}`;
    throw new Error(message);
  }
  return { data, headers: res.headers, status: res.status };
}

async function postForm(url, params) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) body.set(key, String(value));
  }
  return jsonRequest(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
}

async function waitForPublicUrl(url) {
  for (let i = 0; i < 12; i++) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      if (res.ok) return true;
    } catch (_) {}
    await sleep(5000);
  }
  return false;
}

async function metaCredentials(apiVersion) {
  const directPageId = process.env.META_PAGE_ID;
  const directPageToken = process.env.META_PAGE_ACCESS_TOKEN;
  const directIg = process.env.META_IG_USER_ID;
  if (directPageId && directPageToken) {
    return { pageId: directPageId, pageToken: directPageToken, igUserId: directIg || null };
  }

  const userToken = process.env.META_USER_ACCESS_TOKEN;
  if (!userToken) return null;
  const url = new URL(`https://graph.facebook.com/${apiVersion}/me/accounts`);
  url.searchParams.set('fields', 'name,access_token,tasks,instagram_business_account');
  url.searchParams.set('access_token', userToken);
  const { data } = await jsonRequest(url.toString());
  const pages = Array.isArray(data.data) ? data.data : [];
  if (!pages.length) throw new Error('Aucune Page Facebook accessible avec ce jeton.');

  const wanted = normalize(process.env.META_PAGE_NAME || 'Contre-Évidence');
  let page = pages.find(p => normalize(p.name) === wanted || normalize(p.name).includes(wanted));
  if (!page && pages.length === 1) page = pages[0];
  if (!page) throw new Error('Plusieurs Pages sont accessibles : définir META_PAGE_NAME ou META_PAGE_ID.');
  return {
    pageId: page.id,
    pageToken: page.access_token,
    igUserId: directIg || page.instagram_business_account?.id || null
  };
}

async function publishFacebook(pkg, config) {
  const meta = await metaCredentials(config.metaApiVersion || 'v23.0');
  if (!meta?.pageId || !meta?.pageToken) return { configured: false };
  const url = `https://graph.facebook.com/${config.metaApiVersion || 'v23.0'}/${meta.pageId}/feed`;
  const { data } = await postForm(url, {
    message: pkg.facebook.message,
    link: pkg.item.link,
    access_token: meta.pageToken
  });
  return { configured: true, ok: true, id: data.id || null };
}

async function publishInstagram(pkg, config) {
  const meta = await metaCredentials(config.metaApiVersion || 'v23.0');
  if (!meta?.pageToken || !meta?.igUserId) return { configured: false };
  if (!(await waitForPublicUrl(pkg.media.rawVideoUrl))) throw new Error('La vidéo sociale n’est pas encore accessible publiquement.');

  const api = config.metaApiVersion || 'v23.0';
  const createUrl = `https://graph.facebook.com/${api}/${meta.igUserId}/media`;
  const { data: created } = await postForm(createUrl, {
    media_type: 'REELS',
    video_url: pkg.media.rawVideoUrl,
    caption: pkg.instagram.caption,
    share_to_feed: 'true',
    access_token: meta.pageToken
  });
  const containerId = created.id;
  if (!containerId) throw new Error('Instagram n’a pas renvoyé de container_id.');

  let finished = false;
  for (let i = 0; i < 18; i++) {
    await sleep(5000);
    const statusUrl = new URL(`https://graph.facebook.com/${api}/${containerId}`);
    statusUrl.searchParams.set('fields', 'status_code,status');
    statusUrl.searchParams.set('access_token', meta.pageToken);
    const { data: status } = await jsonRequest(statusUrl.toString());
    if (status.status_code === 'FINISHED') { finished = true; break; }
    if (status.status_code === 'ERROR' || status.status_code === 'EXPIRED') throw new Error(status.status || `Statut Instagram ${status.status_code}`);
  }
  if (!finished) throw new Error('Instagram n’a pas terminé le traitement du Reel dans le délai prévu.');

  const publishUrl = `https://graph.facebook.com/${api}/${meta.igUserId}/media_publish`;
  const { data: published } = await postForm(publishUrl, {
    creation_id: containerId,
    access_token: meta.pageToken
  });
  return { configured: true, ok: true, id: published.id || null };
}

async function publishTikTok(pkg, config) {
  const token = process.env.TIKTOK_ACCESS_TOKEN;
  if (!token) return { configured: false };
  const videoPath = path.join(ROOT, pkg.media.localVideo);
  const bytes = fs.readFileSync(videoPath);
  const size = bytes.length;

  const creator = await jsonRequest('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: '{}'
  });
  const options = creator.data?.data?.privacy_level_options || [];
  let privacy = process.env.TIKTOK_PRIVACY_LEVEL || config.tiktokPrivacyDefault || 'SELF_ONLY';
  if (options.length && !options.includes(privacy)) privacy = options.includes('SELF_ONLY') ? 'SELF_ONLY' : options[0];

  const init = await jsonRequest('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      post_info: {
        title: pkg.tiktok.title,
        privacy_level: privacy,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false,
        video_cover_timestamp_ms: 1000
      },
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: size,
        chunk_size: size,
        total_chunk_count: 1
      }
    })
  });
  const publishId = init.data?.data?.publish_id;
  const uploadUrl = init.data?.data?.upload_url;
  if (!publishId || !uploadUrl) throw new Error('TikTok n’a pas renvoyé l’URL d’upload attendue.');

  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Range': `bytes 0-${size - 1}/${size}`,
      'Content-Type': 'video/mp4',
      'Content-Length': String(size)
    },
    body: bytes
  });
  if (!upload.ok) throw new Error(`Upload TikTok refusé : ${upload.status} ${upload.statusText}`);
  return { configured: true, ok: true, id: publishId, privacy, submitted: true };
}

async function youtubeAccessToken() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token'
  });
  const { data } = await jsonRequest('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });
  return data.access_token;
}

async function publishYouTube(pkg, config) {
  const accessToken = await youtubeAccessToken();
  if (!accessToken) return { configured: false };
  const videoPath = path.join(ROOT, pkg.media.localVideo);
  const bytes = fs.readFileSync(videoPath);
  const privacy = process.env.YOUTUBE_PRIVACY_STATUS || config.youtubePrivacyDefault || 'private';
  const categoryId = process.env.YOUTUBE_CATEGORY_ID || '27';
  const metadata = {
    snippet: {
      title: pkg.youtube.title,
      description: pkg.youtube.description,
      categoryId
    },
    status: {
      privacyStatus: privacy,
      selfDeclaredMadeForKids: false
    }
  };

  const initUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status';
  const initRes = await fetch(initUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Length': String(bytes.length),
      'X-Upload-Content-Type': 'video/mp4'
    },
    body: JSON.stringify(metadata)
  });
  if (!initRes.ok) throw new Error(`Initialisation YouTube refusée : ${initRes.status} ${await initRes.text()}`);
  const uploadUrl = initRes.headers.get('location');
  if (!uploadUrl) throw new Error('YouTube n’a pas renvoyé d’URL resumable.');

  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'video/mp4', 'Content-Length': String(bytes.length) },
    body: bytes
  });
  const text = await uploadRes.text();
  let data = {};
  try { data = JSON.parse(text); } catch (_) {}
  if (!uploadRes.ok) throw new Error(`Upload YouTube refusé : ${uploadRes.status} ${text}`);
  return { configured: true, ok: true, id: data.id || null, privacy };
}

async function main() {
  if (!fs.existsSync(PACKAGE_PATH)) {
    console.log('Aucun package social à publier.');
    return;
  }
  const pkg = readJson(PACKAGE_PATH);
  const config = readJson(CONFIG_PATH, {});
  const state = readJson(STATE_PATH, { version: 1, lastPublicationAt: null, items: {} });
  state.items ||= {};
  const link = pkg.item?.link;
  if (!link) throw new Error('Package social invalide : lien absent.');
  state.items[link] ||= { complete: false, platforms: {} };
  const entry = state.items[link];
  entry.platforms ||= {};

  const metaPossible = Boolean(process.env.META_PAGE_ACCESS_TOKEN || process.env.META_USER_ACCESS_TOKEN);
  const configuredNames = [
    ...(metaPossible ? ['facebook'] : []),
    ...(metaPossible ? ['instagram'] : []),
    ...(process.env.TIKTOK_ACCESS_TOKEN ? ['tiktok'] : []),
    ...(process.env.YOUTUBE_CLIENT_ID && process.env.YOUTUBE_CLIENT_SECRET && process.env.YOUTUBE_REFRESH_TOKEN ? ['youtube'] : [])
  ];

  if (!configuredNames.length) {
    console.log('Aucun compte social n’est encore autorisé dans GitHub Secrets.');
    console.log('Le package et la vidéo sont prêts ; aucune publication n’est tentée.');
    return;
  }

  const hadPartialSuccess = Object.values(entry.platforms).some(p => p?.ok);
  const last = state.lastPublicationAt ? new Date(state.lastPublicationAt) : null;
  const cooldownMs = Number(config.cooldownHours || 4) * 3600 * 1000;
  if (!hadPartialSuccess && last && Date.now() - last.getTime() < cooldownMs) {
    const remaining = Math.ceil((cooldownMs - (Date.now() - last.getTime())) / 60000);
    console.log(`Cadence protégée : prochain envoi possible dans environ ${remaining} min.`);
    return;
  }

  const publishers = {
    facebook: () => publishFacebook(pkg, config),
    instagram: () => publishInstagram(pkg, config),
    tiktok: () => publishTikTok(pkg, config),
    youtube: () => publishYouTube(pkg, config)
  };

  for (const name of configuredNames) {
    if (entry.platforms[name]?.ok) {
      console.log(`${name}: déjà envoyé, on ne republie pas.`);
      continue;
    }
    try {
      const result = await publishers[name]();
      if (!result.configured) {
        entry.platforms[name] = { ok: false, skipped: true, checkedAt: new Date().toISOString() };
        console.log(`${name}: configuration incomplète, ignoré.`);
      } else {
        entry.platforms[name] = { ...result, publishedAt: new Date().toISOString() };
        console.log(`${name}: envoi accepté${result.id ? ` (${result.id})` : ''}.`);
      }
    } catch (err) {
      entry.platforms[name] = { ok: false, error: String(err.message || err), checkedAt: new Date().toISOString() };
      console.error(`${name}: ${err.message || err}`);
    }
  }

  const complete = configuredNames.every(name => entry.platforms[name]?.ok);
  if (complete) {
    entry.complete = true;
    entry.completedAt = new Date().toISOString();
    state.lastPublicationAt = entry.completedAt;
  }
  entry.title = pkg.item.title;
  entry.pubDate = pkg.item.pubDate;
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf8');
  console.log(complete ? 'Publication sociale terminée pour ce contenu.' : 'Publication partielle : le prochain passage réessaiera les plateformes en échec.');
}

main().catch(err => { console.error(err); process.exit(1); });
