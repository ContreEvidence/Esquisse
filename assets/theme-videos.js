(() => {
  'use strict';
  const path = window.location.pathname;
  const configs = {
    '/themes/argent.html': {title:'Finances : 3 formats courts', items:[
      ['Pourquoi l’épargne seule ne suffit pas','Épargner sécurise. Investir cherche à faire croître. Le bon choix dépend du temps, du risque et du besoin de liquidité.'],
      ['Le vrai coût d’un crédit','Le taux ne raconte pas tout : durée, assurance, frais et coût d’opportunité changent la décision.'],
      ['Faut-il rembourser ou investir ?','Comparer le rendement certain de la dette évitée au rendement incertain d’un placement.']
    ]},
    '/themes/entreprendre.html': {title:'Entreprendre : 3 formats courts', items:[
      ['Une idée n’est pas encore une offre','Le client n’achète pas l’idée. Il achète un problème mieux résolu.'],
      ['Le chiffre d’affaires ne paie pas les factures','Marge, récurrence et trésorerie comptent davantage que le volume seul.'],
      ['Tester avant de construire','Un petit test réel vaut mieux qu’un long projet fondé sur des suppositions.']
    ]},
    '/themes/ia.html': {title:'IA & Tech : 3 formats courts', items:[
      ['L’IA ne remplace pas une mauvaise question','Un outil puissant amplifie aussi une consigne floue.'],
      ['Automatiser n’est pas déléguer son jugement','L’automatisation gagne du temps. La responsabilité de la décision reste humaine.'],
      ['Le meilleur outil n’est pas toujours le plus récent','Un bon outil est celui qui réduit vraiment une friction ou améliore un résultat.']
    ]},
    '/themes/decisions.html': {title:'Décisions : 3 formats courts', items:[
      ['Une bonne décision peut produire un mauvais résultat','Il faut juger le processus séparément du hasard.'],
      ['Le coût invisible du “on verra”','Ne pas décider est souvent une décision avec ses propres conséquences.'],
      ['Comparer des scénarios, pas des certitudes','Quand l’avenir est incertain, on cherche surtout ce qui reste acceptable dans plusieurs scénarios.']
    ]},
    '/themes/systemes.html': {title:'Systèmes : 3 formats courts', items:[
      ['Une règle change les comportements','Les systèmes produisent souvent ce qu’ils récompensent, pas ce qu’ils déclarent vouloir.'],
      ['Optimiser une partie peut dégrader l’ensemble','Un gain local peut créer un coût ailleurs dans le système.'],
      ['Le problème visible n’est pas toujours la cause','Chercher la boucle, l’incitation et le délai avant de traiter le symptôme.']
    ]}
  };
  const cfg = Object.entries(configs).find(([key]) => path.endsWith(key))?.[1];
  if (!cfg || document.querySelector('.ce-motion-section')) return;

  const style = document.createElement('style');
  style.textContent = `
    .ce-motion-section{background:#0b0e11;color:#fff;border-top:1px solid rgba(212,171,86,.3);border-bottom:1px solid rgba(212,171,86,.3)}
    .ce-motion-section .section-head p{color:#c9d1d6}
    .ce-motion-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
    .ce-motion-card{border:1px solid rgba(255,255,255,.16);border-radius:18px;overflow:hidden;background:#12161a;box-shadow:0 16px 35px rgba(0,0,0,.2)}
    .ce-motion-stage{position:relative;aspect-ratio:9/12;overflow:hidden;background:radial-gradient(circle at 75% 20%,rgba(212,171,86,.22),transparent 26%),linear-gradient(145deg,#111922,#07090b);display:flex;align-items:center;justify-content:center;padding:1.5rem;cursor:pointer}
    .ce-motion-stage:before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:28px 28px;opacity:.35}
    .ce-motion-brand{position:absolute;left:1rem;top:1rem;z-index:3;color:#e8c979;font-size:.68rem;font-weight:900;letter-spacing:.12em}
    .ce-motion-line{position:absolute;left:10%;right:10%;bottom:12%;height:3px;background:linear-gradient(90deg,transparent,#d4ab56,transparent);transform:scaleX(.15);opacity:.35}
    .ce-motion-card.is-playing .ce-motion-line{animation:ceLine 6s linear infinite}
    .ce-motion-copy{position:relative;z-index:2;font-size:clamp(1.45rem,2.4vw,2.25rem);font-weight:900;line-height:1.02;letter-spacing:-.035em;text-align:center;max-width:90%}
    .ce-motion-card.is-playing .ce-motion-copy{animation:cePulse 6s ease-in-out infinite}
    .ce-motion-play{position:absolute;right:1rem;bottom:1rem;z-index:4;width:46px;height:46px;border-radius:50%;border:1px solid #e8c979;background:#d4ab56;color:#09090a;font-weight:950;cursor:pointer}
    .ce-motion-body{padding:1.15rem 1.2rem 1.3rem}.ce-motion-body h3{margin:.1rem 0 .55rem;font-size:1.18rem}.ce-motion-body p{margin:0;color:#cdd5da;line-height:1.55;font-size:.93rem}
    @keyframes cePulse{0%,100%{transform:translateY(16px);opacity:.45}18%,72%{transform:translateY(0);opacity:1}88%{transform:translateY(-12px);opacity:.6}}
    @keyframes ceLine{0%{transform:scaleX(.12);opacity:.25}55%{transform:scaleX(1);opacity:1}100%{transform:scaleX(.12);opacity:.25}}
    @media(max-width:880px){.ce-motion-grid{grid-template-columns:1fr}.ce-motion-stage{aspect-ratio:16/9}.ce-motion-copy{font-size:2rem}}
  `;
  document.head.appendChild(style);

  const cards = cfg.items.map(([title,desc],i)=>`<article class="ce-motion-card"><div class="ce-motion-stage" role="button" tabindex="0" aria-label="Lire la vidéo ${i+1}"><div class="ce-motion-brand">CONTRE-ÉVIDENCE · FORMAT COURT</div><div class="ce-motion-copy">${title}</div><div class="ce-motion-line"></div><button class="ce-motion-play" type="button" aria-label="Lire">▶</button></div><div class="ce-motion-body"><div class="kicker">Vidéo ${String(i+1).padStart(2,'0')}</div><h3>${title}</h3><p>${desc}</p></div></article>`).join('');
  const section = document.createElement('section');
  section.className='ce-motion-section';
  section.innerHTML=`<div class="container"><div class="section-head"><div class="kicker">Vidéos de ce thème</div><h2>${cfg.title}.</h2><p>Des formats très courts, sans voix, pour saisir l’idée essentielle avant d’aller plus loin.</p></div><div class="ce-motion-grid">${cards}</div></div>`;
  const main=document.querySelector('main');
  const target=[...main.querySelectorAll('section')].find(s=>s.querySelector('.articles,.track-section,.article-card')) || main.children[1];
  target ? main.insertBefore(section,target) : main.appendChild(section);

  section.querySelectorAll('.ce-motion-card').forEach(card=>{
    const toggle=()=>{const playing=card.classList.toggle('is-playing');card.querySelector('.ce-motion-play').textContent=playing?'❚❚':'▶';};
    card.querySelector('.ce-motion-stage').addEventListener('click',e=>{if(e.target.closest('button')) return;toggle();});
    card.querySelector('.ce-motion-play').addEventListener('click',toggle);
    card.querySelector('.ce-motion-stage').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
})();