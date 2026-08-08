(() => {
  'use strict';

  const featured = [
    {domain:'patrimoine',theme:'argent',type:'guide',chip:'Budget',title:'Où part votre argent ? Faire l’audit de son budget en 60 minutes',desc:'Trois mois de relevés, quatre nombres et trois corrections maximum pour rendre le budget pilotable.',tags:'budget dépenses épargne audit sécurité financière',href:'dossiers/audit-budget-60-minutes.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Stratégie patrimoniale',title:'Construire sa stratégie financière avant de choisir ses placements',desc:'Bilan, flux, horizons, capacité de risque, concentration et règles de décision avant les produits.',tags:'patrimoine stratégie bilan flux risque objectifs investissement',href:'dossiers/finances-cadre-global.html'},
    {domain:'patrimoine',theme:'argent',type:'guide',chip:'Allocation',title:'Construire une allocation patrimoniale robuste',desc:'Capacité de risque, drawdown, corrélations, concentration, scénarios de stress et rééquilibrage.',tags:'allocation portefeuille diversification risque corrélation drawdown investissement',href:'dossiers/finances-allocation-portefeuille.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Immobilier',title:'Immobilier et patrimoine : raisonner sur le coût, le risque et la concentration',desc:'Résidence principale, locatif, dette, rendement net, liquidité et poids de la pierre dans le patrimoine global.',tags:'immobilier résidence principale locatif crédit patrimoine rendement',href:'dossiers/finances-immobilier-patrimoine.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Résidence principale',title:'Acheter ou louer sa résidence principale : comparer le coût complet',desc:'Durée de détention, frais, financement, coût d’opportunité, mobilité et scénarios de sortie.',tags:'acheter louer logement résidence principale crédit frais mobilité',href:'dossiers/finances-residence-principale.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Investissement locatif',title:'Investissement locatif : rendement, cash-flow et stress tests',desc:'Prix total, rendement net, couverture de dette, vacance, travaux, fiscalité et concentration.',tags:'immobilier locatif rendement cash flow vacance travaux dette',href:'dossiers/finances-investissement-locatif.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Enveloppes',title:'PEA, assurance-vie, CTO, PER : choisir l’enveloppe après la stratégie',desc:'Comparer disponibilité, fiscalité, supports, frais et horizon sans confondre enveloppe et placement.',tags:'pea assurance vie cto per fiscalité enveloppe investissement',href:'dossiers/finances-enveloppes-fiscalite.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Crédit',title:'Crédit et endettement : utiliser la dette sans fragiliser le patrimoine',desc:'Coût total, durée, levier, capacité de remboursement, liquidité et scénario dégradé.',tags:'crédit dette endettement levier taux mensualité patrimoine',href:'dossiers/finances-credit-endettement.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Retraite',title:'Retraite et décumulation : transformer un patrimoine en revenus',desc:'Dépenses, revenus garantis, risque de séquence, inflation, longévité et règles de retrait.',tags:'retraite décumulation revenus patrimoine inflation longévité',href:'dossiers/finances-retraite-decumulation.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Transmission',title:'Transmission du patrimoine : préparer sans improviser',desc:'Objectifs, propriété, liquidité, bénéficiaires, partage et coordination civile et fiscale.',tags:'transmission succession donation bénéficiaire patrimoine notaire',href:'dossiers/finances-transmission-patrimoine.html'},
    {domain:'vie-pro',theme:'travail',type:'guide',chip:'Recherche d’emploi',title:'30 jours pour relancer une recherche d’emploi qui tourne en rond',desc:'Segmenter le marché, construire les preuves, mesurer les conversions et traiter le risque perçu en entretien.',tags:'emploi cv candidature recrutement entretien recherche chômage',href:'dossiers/plan-30-jours-recherche-emploi.html'},
    {domain:'vie-pro',theme:'entreprendre',type:'guide',chip:'Prix & marge',title:'Quel prix minimum facturer pour gagner réellement de l’argent ?',desc:'Capacité facturable, coûts, marge contributive, point mort, coût d’opportunité et concentration client.',tags:'prix tarif marge rentabilité point mort entreprise devis client',href:'dossiers/calculer-prix-minimum-rentable.html'},
    {domain:'vie-pro patrimoine',theme:'ia',type:'guide',chip:'IA appliquée',title:'Avant de croire une réponse IA : le protocole de vérification en 10 minutes',desc:'Classer le risque, isoler le fait central, hiérarchiser les sources et chercher la contradiction.',tags:'ia intelligence artificielle source vérifier hallucination chatgpt',href:'dossiers/protocole-verifier-reponse-ia.html'},
    {domain:'vie-pro patrimoine',theme:'decisions',type:'guide',chip:'Décision',title:'Prendre une décision importante sans tourner en rond',desc:'Taux de base, coût d’erreur, valeur de l’option, coûts irrécupérables, effets de second ordre et pré-mortem.',tags:'décision choix matrice risque option biais pré mortem',href:'dossiers/decider-sans-tourner-en-rond.html'},
    {domain:'vie-pro',theme:'systemes',type:'guide',chip:'Démarches',title:'Démarche bloquée : comment sortir d’une boucle administrative',desc:'Chronologie, preuve équivalente, motif écrit, interlocuteur compétent et escalade propre.',tags:'administratif démarche blocage justificatif recours procédure',href:'dossiers/debloquer-demarche-administrative.html'},
    {domain:'vie-pro',theme:'travail',type:'dossier',chip:'Recherche d’emploi',title:'50 candidatures, zéro réponse : avant d’en envoyer 50 de plus',desc:'Quand presque rien ne revient, diagnostiquer le ciblage, le CV et les preuves avant de multiplier les envois.',tags:'emploi candidature cv recrutement réponse',href:'articles/50-candidatures-zero-reponse.html'},
    {domain:'vie-pro',theme:'travail',type:'dossier',chip:'Entretien',title:'Vous décrochez des entretiens mais jamais le poste : où ça bloque ?',desc:'Si le CV ouvre la porte, chercher le doute précis qui reste dans la tête du recruteur.',tags:'emploi entretien recruteur candidature risque',href:'articles/entretien-rate-ce-qui-bloque.html'},
    {domain:'patrimoine',theme:'argent',type:'dossier',chip:'Épargne',title:'Vous avez 50 000 € de côté mais vous n’osez rien en faire',desc:'Séparer sécurité, projets proches et capital réellement disponible à long terme avant de chercher un placement.',tags:'épargne investir placement allocation livret 50000',href:'articles/50000-euros-livret-peur-investir.html'},
    {domain:'vie-pro',theme:'entreprendre',type:'dossier',chip:'Offre & clients',title:'Tout le monde trouve votre idée intéressante, mais personne n’achète',desc:'Un compliment ne valide pas un marché : tester une offre, un prix et un vrai sacrifice client.',tags:'entreprise client offre vente marché prix',href:'articles/clients-interesses-personne-nachete.html'}
  ];

  const conceptPaths = new Set([
    'articles/majorite-peut-se-tromper.html','articles/bonnes-questions.html','articles/comprendre-avant-agir.html','articles/biais-confirmation.html','articles/penser-en-probabilites.html','articles/effet-de-cadrage.html','articles/modeles-mentaux.html','articles/decisions-reversibles-irreversibles.html','articles/risque-incertitude.html','articles/taux-de-base.html','articles/asymetrie.html','articles/strategie-barbell.html','articles/effets-second-ordre.html','articles/incitations-gouvernent.html','articles/boucles-retroaction.html','articles/mesure-devient-cible.html','articles/dependance-au-sentier.html','articles/probleme-symptome-cause.html','articles/contraintes-innovation.html','articles/information-comprehension.html','articles/simplifier-sans-trahir.html','articles/effets-de-reseau.html','articles/effet-de-levier.html','articles/couts-irrecuperables.html','articles/marge-de-securite.html','articles/rendements-decroissants.html','articles/valeur-des-options.html','articles/optimisation-locale.html'
  ]);
  const dualDomainPaths = new Set([
    'articles/decision-difficile-options-imparfaites.html','articles/majorite-peut-se-tromper.html','articles/bonnes-questions.html','articles/comprendre-avant-agir.html','articles/biais-confirmation.html','articles/penser-en-probabilites.html','articles/effet-de-cadrage.html','articles/modeles-mentaux.html','articles/decisions-reversibles-irreversibles.html','articles/risque-incertitude.html','articles/taux-de-base.html','articles/information-comprehension.html','articles/simplifier-sans-trahir.html','articles/continuer-parce-quon-a-deja-trop-investi.html','articles/hesiter-trois-semaines-deux-options.html','articles/ia-reponse-convaincante-fausse.html','dossiers/protocole-verifier-reponse-ia.html','dossiers/decider-sans-tourner-en-rond.html'
  ]);

  const list = document.querySelector('.articles');
  const tools = document.querySelector('.library-tools');
  if (!list || !tools) return;

  document.querySelector('.ce-search-strip')?.remove();
  document.querySelector('.video-library-callout')?.closest('section')?.remove();
  document.querySelector('.library-expert-gateway')?.remove();
  document.querySelector('.format-gateway')?.remove();

  const hero = document.querySelector('.article-hero');
  if (hero) {
    const h1 = hero.querySelector('h1');
    const p = hero.querySelector('p');
    if (h1) h1.textContent = 'Trouvez le dossier qui répond à votre situation.';
    if (p) p.textContent = 'Recherchez un problème concret ou choisissez un domaine. Les guides et dossiers applicables passent avant les références théoriques.';
  }

  const existing = new Set([...list.querySelectorAll('a[href]')].map(a => a.getAttribute('href')));
  const fresh = featured.filter(item => !existing.has(item.href));
  if (fresh.length) {
    list.insertAdjacentHTML('afterbegin', fresh.map(item => `<article class="article-card filter-card" data-theme="${item.theme}" data-domain="${item.domain}" data-content-type="${item.type}" data-tags="${item.tags}"><div><div class="card-meta"><span class="level-badge">${item.type === 'guide' ? 'Guide pratique' : 'Dossier'}</span><span class="theme-chip">${item.chip}</span></div><h3>${item.title}</h3><p>${item.desc}</p></div><a href="${item.href}">${item.type === 'guide' ? 'Ouvrir le guide' : 'Lire le dossier'} →</a></article>`).join(''));
  }

  const normalise = value => (value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9€]+/g,' ').trim();
  const cards = [...list.querySelectorAll('.filter-card')];

  cards.forEach((card,index) => {
    card.dataset.originalOrder = String(index);
    const href = card.querySelector('a[href]')?.getAttribute('href') || '';
    const theme = card.dataset.theme || '';
    if (!card.dataset.domain) {
      if (theme === 'argent') card.dataset.domain = 'patrimoine';
      else if (theme === 'travail' || theme === 'entreprendre') card.dataset.domain = 'vie-pro';
      else if (dualDomainPaths.has(href)) card.dataset.domain = 'vie-pro patrimoine';
      else card.dataset.domain = 'vie-pro';
    }
    if (conceptPaths.has(href)) card.dataset.contentType = 'reference';
    else if (!card.dataset.contentType) card.dataset.contentType = 'dossier';

    const badge = card.querySelector('.level-badge');
    const chip = card.querySelector('.theme-chip');
    const link = card.querySelector(':scope > a[href], div + a[href]') || card.querySelector('a[href]');
    if (card.dataset.contentType === 'reference') {
      card.classList.add('support-note');
      if (badge) badge.textContent = 'Référence';
      if (chip) chip.textContent = 'Notion d’appui';
      if (link) link.textContent = 'Approfondir →';
    } else if (card.dataset.contentType === 'guide') {
      if (badge) badge.textContent = 'Guide pratique';
      if (link) link.textContent = 'Ouvrir le guide →';
    } else {
      if (badge) badge.textContent = 'Dossier';
      if (link) link.textContent = 'Lire le dossier →';
    }
  });

  tools.innerHTML = `<label class="library-search"><span class="filter-label">Rechercher :</span><input type="search" placeholder="Ex. acheter un logement, changer de métier, fixer mes prix…" aria-label="Rechercher dans la bibliothèque"></label><div class="filter-group domain-filters"><span class="filter-label">Domaine :</span><button aria-pressed="true" class="filter-btn" data-domain="all">Tous</button><button aria-pressed="false" class="filter-btn" data-domain="patrimoine">Patrimoine</button><button aria-pressed="false" class="filter-btn" data-domain="vie-pro">Vie professionnelle</button></div><div class="library-reference-control"><button type="button" class="filter-btn reference-toggle" aria-pressed="false">Afficher les références et notions</button><span>Les guides et dossiers restent prioritaires.</span></div><div class="results-count" data-results-count></div>`;

  const style = document.createElement('style');
  style.textContent = `.library-tools{display:grid;gap:.75rem}.library-tools .library-search{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap}.library-tools .library-search input{min-width:min(540px,82vw);padding:.72rem .82rem;border:1px solid rgba(16,24,32,.2);border-radius:10px;font:inherit}.library-reference-control{display:flex;align-items:center;gap:.65rem;flex-wrap:wrap}.library-reference-control span{font-size:.82rem;color:#657078}.filter-card.is-hidden{display:none!important}.filter-card.support-note{background:#faf9f5}.results-count{font-weight:800;color:#657078}`;
  document.head.appendChild(style);

  const state = {
    domain: new URLSearchParams(location.search).get('domain') || 'all',
    query: new URLSearchParams(location.search).get('q') || '',
    showReferences: new URLSearchParams(location.search).get('references') === '1'
  };

  const aliases = {
    emploi:'candidature cv entretien recrutement recruteur travail poste', candidature:'emploi cv recrutement recruteur entretien', reconversion:'formation métier compétences emploi orientation', formation:'reconversion métier diplôme compétences orientation', budget:'dépenses épargne argent finances revenu sécurité', epargne:'budget investissement placement capital livret', investir:'investissement allocation etf actions pea placement capital', investissement:'investir allocation etf actions pea placement capital', immobilier:'logement résidence locatif crédit acheter louer travaux', logement:'immobilier résidence acheter louer crédit', acheter:'immobilier logement résidence crédit', prix:'tarif marge rentabilité coût client devis facturer', marge:'prix tarif rentabilité coût point mort entreprise', entreprendre:'entreprise client offre prix marge vente', ia:'intelligence artificielle chatgpt automatisation vérification source', retraite:'décumulation transmission patrimoine revenus long terme'
  };

  const search = tools.querySelector('input[type="search"]');
  const domainButtons = [...tools.querySelectorAll('[data-domain]')];
  const referenceButton = tools.querySelector('.reference-toggle');
  const count = tools.querySelector('[data-results-count]');
  search.value = state.query;

  const queryTokens = query => {
    const base = normalise(query).split(/\s+/).filter(Boolean), expanded = [...base];
    base.forEach(token => { if (aliases[token]) expanded.push(...normalise(aliases[token]).split(/\s+/)); });
    return [...new Set(expanded)];
  };

  function scoreCard(card,query) {
    if (!query.trim()) return 0;
    const title = normalise(card.querySelector('h3')?.textContent), chip = normalise(card.querySelector('.theme-chip')?.textContent), desc = normalise(card.querySelector('p')?.textContent), tags = normalise(card.dataset.tags), phrase = normalise(query), tokens = queryTokens(query);
    let score = 0;
    if (title === phrase) score += 180; else if (title.startsWith(phrase)) score += 130; else if (title.includes(phrase)) score += 90;
    if (chip.includes(phrase)) score += 45; if (tags.includes(phrase)) score += 45; if (desc.includes(phrase)) score += 30;
    tokens.forEach(token => { if (title.includes(token)) score += 24; if (chip.includes(token)) score += 12; if (tags.includes(token)) score += 14; if (desc.includes(token)) score += 7; });
    if (card.dataset.contentType === 'guide') score += 20; else if (card.dataset.contentType === 'dossier') score += 9; else score -= 12;
    return score;
  }

  function sync() {
    domainButtons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.domain === state.domain)));
    referenceButton.setAttribute('aria-pressed', String(state.showReferences));
    referenceButton.textContent = state.showReferences ? 'Masquer les références et notions' : 'Afficher les références et notions';
  }

  function updateURL() {
    const next = new URLSearchParams();
    if (state.domain !== 'all') next.set('domain',state.domain);
    if (state.query.trim()) next.set('q',state.query.trim());
    if (state.showReferences) next.set('references','1');
    history.replaceState(null,'',next.toString() ? `?${next}` : location.pathname);
  }

  function apply() {
    const hasQuery = Boolean(state.query.trim());
    let visible = 0;
    const ranked = [];
    cards.forEach(card => {
      const domains = (card.dataset.domain || '').split(/\s+/), domainOK = state.domain === 'all' || domains.includes(state.domain), isReference = card.dataset.contentType === 'reference', score = scoreCard(card,state.query), queryOK = !hasQuery || score > 0, referenceOK = !isReference || state.showReferences || hasQuery, show = domainOK && queryOK && referenceOK;
      card.classList.toggle('is-hidden',!show);
      if (show) { visible++; ranked.push({card,score,typePriority:card.dataset.contentType === 'guide' ? 0 : card.dataset.contentType === 'dossier' ? 1 : 2,order:Number(card.dataset.originalOrder || 0)}); }
    });
    ranked.sort((a,b) => hasQuery ? (b.score-a.score || a.typePriority-b.typePriority || a.order-b.order) : (a.typePriority-b.typePriority || a.order-b.order));
    ranked.forEach(x => list.appendChild(x.card));
    count.textContent = `${visible} contenu${visible > 1 ? 's' : ''}`;
    sync(); updateURL();
  }

  domainButtons.forEach(b => b.addEventListener('click',() => { state.domain = b.dataset.domain; apply(); }));
  referenceButton.addEventListener('click',() => { state.showReferences = !state.showReferences; apply(); });
  search.addEventListener('input',() => { state.query = search.value; apply(); });
  sync(); apply();
})();