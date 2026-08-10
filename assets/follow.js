(() => {
  'use strict';

  if (document.documentElement.dataset.ceFollow === '2') return;
  document.documentElement.dataset.ceFollow = '2';

  const BASE = 'https://contreevidence.github.io/Esquisse/';
  const FOLLOW_EXTERNAL = `https://follow.it/${BASE}`;
  const feeds = [
    { key:'all', label:'Tout Contre-Évidence', url:`${BASE}rss.xml` },
    { key:'patrimoine', label:'Patrimoine', url:`${BASE}rss-patrimoine.xml` },
    { key:'vie-pro', label:'Vie professionnelle', url:`${BASE}rss-vie-pro.xml` }
  ];
  const socials = [
    ['YouTube','https://www.youtube.com/channel/UCxzyhABkEwWcGxmLyQvXISA'],
    ['Instagram','https://www.instagram.com/contre_evidence/'],
    ['Facebook','https://www.facebook.com/profile.php?id=61592757877017'],
    ['TikTok','https://www.tiktok.com/@contreevidence']
  ];

  const style=document.createElement('style');
  style.textContent=`
    .ce-follow-trigger{display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:.42rem .72rem;border:1px solid #d4ab56;border-radius:999px;background:#d4ab56;color:#101010;font:inherit;font-size:.76rem;font-weight:900;cursor:pointer;white-space:nowrap}
    .ce-follow-trigger:hover,.ce-follow-trigger:focus-visible{background:#e8c979;outline:2px solid #fff;outline-offset:2px}
    .ce-follow-backdrop{position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;padding:1rem;background:rgba(3,5,7,.72);backdrop-filter:blur(4px)}.ce-follow-backdrop.is-open{display:flex}
    .ce-follow-dialog{position:relative;width:min(650px,94vw);max-height:min(790px,90vh);overflow:auto;border:1px solid rgba(212,171,86,.55);border-radius:20px;background:#10161b;color:#fff;box-shadow:0 30px 80px rgba(0,0,0,.45);padding:1.4rem}
    .ce-follow-close{position:absolute;right:1rem;top:1rem;width:38px;height:38px;border:1px solid rgba(255,255,255,.25);border-radius:50%;background:#1c242b;color:#fff;font-size:1.3rem;cursor:pointer}
    .ce-follow-kicker{margin:0 3rem .45rem 0;color:#e8c979;font-size:.75rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.ce-follow-dialog h2{margin:.1rem 3rem .55rem 0;color:#fff;font-size:clamp(1.7rem,4vw,2.5rem);letter-spacing:-.03em}.ce-follow-intro{margin:0 0 1.2rem;color:#c8d0d5;line-height:1.6}
    .ce-follow-section{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(255,255,255,.12)}.ce-follow-section h3{margin:0 0 .35rem;color:#fff;font-size:1.05rem}.ce-follow-section p{margin:.2rem 0 .8rem;color:#aeb9c0;font-size:.88rem;line-height:1.5}
    .ce-follow-external{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem;border:1px solid rgba(212,171,86,.42);border-radius:16px;background:linear-gradient(135deg,rgba(212,171,86,.10),rgba(255,255,255,.025))}.ce-follow-external a{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:.65rem .9rem;border-radius:10px;background:#d4ab56;color:#101820;text-decoration:none;font-weight:900}.ce-follow-external a:hover{background:#e8c979}.ce-follow-external small{display:block;color:#8f9ca4;line-height:1.45}
    .ce-follow-feed-list{display:grid;gap:.55rem}.ce-follow-feed{display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:.8rem .9rem;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:#161e24}.ce-follow-feed strong{color:#fff}.ce-follow-feed small{display:block;margin-top:.18rem;color:#9da9b0}.ce-follow-copy{flex:0 0 auto;min-height:34px;padding:.38rem .65rem;border:1px solid #d4ab56;border-radius:9px;background:transparent;color:#e8c979;font:inherit;font-size:.8rem;font-weight:900;cursor:pointer}.ce-follow-copy:hover,.ce-follow-copy:focus-visible{background:#d4ab56;color:#101010;outline:none}
    .ce-follow-socials{display:flex;flex-wrap:wrap;gap:.5rem}.ce-follow-socials a{display:inline-flex;align-items:center;min-height:34px;padding:.4rem .65rem;border:1px solid rgba(255,255,255,.2);border-radius:999px;color:#fff;text-decoration:none;font-size:.82rem;font-weight:850}.ce-follow-socials a:hover{border-color:#d4ab56;color:#e8c979}.ce-follow-note{margin-top:1rem;padding:.8rem .9rem;border-radius:12px;background:#f7edcf;color:#342b19;font-size:.84rem;line-height:1.5}.ce-follow-toast{position:fixed;left:50%;bottom:1.25rem;z-index:9100;transform:translate(-50%,18px);opacity:0;pointer-events:none;padding:.65rem .9rem;border-radius:999px;background:#fff;color:#111820;font-size:.85rem;font-weight:850;transition:.2s}.ce-follow-toast.is-visible{opacity:1;transform:translate(-50%,0)}
    @media(max-width:759px){.ce-flat-actions{gap:.38rem}.ce-follow-trigger{min-height:40px;padding:.45rem .68rem}.ce-follow-dialog{padding:1.1rem}.ce-follow-external,.ce-follow-feed{align-items:flex-start;flex-direction:column}.ce-follow-external a,.ce-follow-copy{width:100%}}
  `;
  document.head.appendChild(style);

  const backdrop=document.createElement('div');
  backdrop.className='ce-follow-backdrop';
  backdrop.setAttribute('aria-hidden','true');
  backdrop.innerHTML=`<section class="ce-follow-dialog" role="dialog" aria-modal="true" aria-labelledby="ce-follow-title">
    <button class="ce-follow-close" type="button" aria-label="Fermer">×</button>
    <p class="ce-follow-kicker">Ne perdez pas le fil</p>
    <h2 id="ce-follow-title">Recevoir les nouveautés</h2>
    <p class="ce-follow-intro">Contre-Évidence ne demande plus votre adresse e-mail sur le site. Choisissez un service externe ou copiez directement un flux RSS.</p>
    <div class="ce-follow-section"><h3>Par e-mail via follow.it</h3><div class="ce-follow-external"><div><strong>Inscription entièrement sur follow.it</strong><small>Aucune adresse e-mail n’est saisie dans une page Contre-Évidence. Le service externe gère l’inscription, les préférences et le désabonnement.</small></div><a href="${FOLLOW_EXTERNAL}" target="_blank" rel="noopener noreferrer">Continuer sur follow.it ↗</a></div></div>
    <div class="ce-follow-section"><h3>Par RSS</h3><p>Copiez le flux qui vous intéresse dans Feedly, Inoreader ou un autre lecteur RSS.</p><div class="ce-follow-feed-list">${feeds.map(feed=>`<div class="ce-follow-feed" data-feed="${feed.key}"><div><strong>${feed.label}</strong><small>${feed.url.replace(BASE,'')}</small></div><button class="ce-follow-copy" type="button" data-url="${feed.url}">Copier le flux</button></div>`).join('')}</div></div>
    <div class="ce-follow-section"><h3>Sur les réseaux</h3><div class="ce-follow-socials">${socials.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`).join('')}</div></div>
    <div class="ce-follow-note"><strong>Principe :</strong> Contre-Évidence privilégie les fonctions locales et les services externes ouverts volontairement par le lecteur plutôt que la collecte de données personnelles sur le site.</div>
  </section>`;
  document.body.appendChild(backdrop);

  const toast=document.createElement('div');toast.className='ce-follow-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');document.body.appendChild(toast);
  let lastFocus=null;const dialog=backdrop.querySelector('.ce-follow-dialog');const closeBtn=backdrop.querySelector('.ce-follow-close');
  const openDialog=()=>{lastFocus=document.activeElement;backdrop.classList.add('is-open');backdrop.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeBtn.focus();};
  const closeDialog=()=>{backdrop.classList.remove('is-open');backdrop.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus?.();};
  function addTrigger(){const actions=document.querySelector('.ce-flat-actions');if(actions&&!actions.querySelector('.ce-follow-trigger')){const b=document.createElement('button');b.type='button';b.className='ce-follow-trigger';b.textContent='Recevoir les nouveautés';b.setAttribute('aria-haspopup','dialog');b.addEventListener('click',openDialog);actions.prepend(b);}const foot=document.querySelector('.ce-footer-socials');if(foot&&!foot.querySelector('.ce-follow-trigger')){const b=document.createElement('button');b.type='button';b.className='ce-follow-trigger';b.textContent='Recevoir les nouveautés';b.addEventListener('click',openDialog);foot.prepend(b);}}
  async function copyFeed(url,button){try{await navigator.clipboard.writeText(url);}catch(_){const input=document.createElement('textarea');input.value=url;input.style.position='fixed';input.style.opacity='0';document.body.appendChild(input);input.select();document.execCommand('copy');input.remove();}const old=button.textContent;button.textContent='Copié ✓';toast.textContent='Lien RSS copié.';toast.classList.add('is-visible');setTimeout(()=>{button.textContent=old;toast.classList.remove('is-visible');},1600);}
  backdrop.querySelectorAll('.ce-follow-copy').forEach(button=>button.addEventListener('click',()=>copyFeed(button.dataset.url,button)));
  closeBtn.addEventListener('click',closeDialog);backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeDialog();});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&backdrop.classList.contains('is-open'))closeDialog();if(e.key==='Tab'&&backdrop.classList.contains('is-open')){const focusable=[...dialog.querySelectorAll('button,a[href]')].filter(el=>!el.disabled);if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(addTrigger));else requestAnimationFrame(addTrigger);setTimeout(addTrigger,500);
})();
