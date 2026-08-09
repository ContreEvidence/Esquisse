const fs = require('fs');

function insertBefore(path, marker, anchor, html) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(marker)) return false;
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error(`Ancre introuvable dans ${path}`);
  s = s.slice(0, i) + html + s.slice(i);
  fs.writeFileSync(path, s);
  return true;
}

const leaveBlock = `<!-- CE_DATA_WAVE4_20260809:dossiers/quitter-emploi-stable-ou-rester.html -->
<div class="case-study" id="cout-reel-changement-emploi"><h2>Une hausse de salaire peut cacher une baisse du gain réel</h2><p><strong>Cas illustratif : les chiffres sont des hypothèses à remplacer par votre situation.</strong> Une personne compare son emploi actuel à une offre affichant 300 € nets de plus par mois. Elle ajoute pourtant le variable, les trajets et le temps supplémentaire avant de conclure.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Élément annuel</th><th>Emploi actuel</th><th>Nouvelle offre</th></tr></thead><tbody><tr><td>Salaire net</td><td>2 400 € × 12 = <strong>28 800 €</strong></td><td>2 700 € × 12 = <strong>32 400 €</strong></td></tr><tr><td>Variable / prime probable</td><td><strong>1 500 €</strong></td><td>0 €</td></tr><tr><td>Transport</td><td>-120 € × 12 = <strong>-1 440 €</strong></td><td>-360 € × 12 = <strong>-4 320 €</strong></td></tr><tr><td>Parking</td><td>0 €</td><td>-70 € × 12 = <strong>-840 €</strong></td></tr><tr><td><strong>Cash annuel après ces éléments</strong></td><td><strong>28 860 €</strong></td><td><strong>27 240 €</strong></td></tr></tbody></table></div><p>Dans cet exemple, l'offre à +300 € nets par mois produit finalement <strong>1 620 € de cash annuel en moins</strong> après les seuls éléments retenus. Si elle ajoute aussi une heure de trajet par jour sur 220 jours travaillés, cela représente <strong>220 heures par an</strong>, soit l'équivalent de 27,5 journées de huit heures. Cela ne signifie pas qu'il faut refuser : le poste peut apporter progression, santé, intérêt ou options futures. Cela signifie simplement que le salaire affiché n'est pas le gain complet.</p></div>
<div class="warning-box" id="demission-are-2026"><strong>Démission et ARE : vérifiez avant de rompre le contrat.</strong> En règle générale, une démission volontaire n'ouvre pas immédiatement droit à l'allocation chômage. Des exceptions existent, notamment certaines démissions légitimes et le dispositif démission-reconversion. Pour ce dernier, France Travail indique notamment qu'il faut justifier d'au moins <strong>1 300 jours travaillés dans les 60 mois précédant la démission</strong>, engager le conseil en évolution professionnelle <strong>avant</strong> de démissionner et faire reconnaître le caractère réel et sérieux du projet. Après l'attestation, la demande d'allocation doit être déposée dans les délais prévus. Une décision de départ doit donc utiliser les droits réellement vérifiés, jamais une ARE supposée.</div><p class="source-note">Source : <a href="https://www.francetravail.fr/candidat/mes-droits-aux-aides-et-allocati/a-chaque-situation-son-allocatio/quelle-est-ma-situation-professi/je-perds-ou-je-quitte-un-emploi/je-veux-demissionner-et-jai-un-p.html" rel="noopener noreferrer">France Travail — démission pour reconversion professionnelle</a>. Règles à revérifier au moment d'une décision réelle.</p>`;

const managerBlock = `<!-- CE_DATA_WAVE4_20260809:dossiers/devenir-manager-premiere-fois.html -->
<div class="case-study" id="cout-goulot-manager"><h2>Le goulot d'étranglement peut se compter en heures</h2><p><strong>Cas illustratif.</strong> Un manager encadre huit personnes. Chacune lui adresse en moyenne deux interruptions non planifiées par jour, de huit minutes chacune. Ajoutons huit 1:1 de 30 minutes toutes les deux semaines, 45 minutes de réunion d'équipe hebdomadaire, trois heures de reprise de dossiers et deux heures de reporting.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Charge hebdomadaire</th><th>Calcul</th><th>Temps</th></tr></thead><tbody><tr><td>Interruptions</td><td>8 personnes × 2/jour × 8 min × 5 jours</td><td><strong>10 h 40</strong></td></tr><tr><td>1:1</td><td>8 × 30 min toutes les 2 semaines</td><td><strong>2 h</strong></td></tr><tr><td>Réunion d'équipe</td><td>1 × 45 min</td><td><strong>45 min</strong></td></tr><tr><td>Reprises de dossiers</td><td>Hypothèse observée</td><td><strong>3 h</strong></td></tr><tr><td>Reporting</td><td>Hypothèse observée</td><td><strong>2 h</strong></td></tr><tr><td><strong>Total</strong></td><td></td><td><strong>18 h 25 / semaine</strong></td></tr></tbody></table></div><p>Si des règles de décision et une meilleure délégation divisent seulement les interruptions par deux, le manager récupère environ <strong>5 h 20 par semaine</strong>. Sur 46 semaines de travail, cela représente près de <strong>245 heures</strong>. Ce temps peut être remis dans l'anticipation, la formation, les arbitrages ou les problèmes réellement exceptionnels.</p><p><strong>Le bon indicateur n'est donc pas « combien de questions reçoit le manager ? »</strong> mais combien de décisions récurrentes pourraient être prises au bon niveau sans dégrader la qualité.</p></div>`;

const processBlock = `<!-- CE_DATA_WAVE4_20260809:dossiers/ameliorer-processus-sans-degrader-service.html -->
<div class="case-study" id="cout-processus-complet"><h2>Accélérer de cinq minutes peut économiser 34 000 € par an… ou coûter plus cher si les reprises explosent</h2><p><strong>Cas illustratif.</strong> Un service traite 1 000 demandes par mois. Le processus actuel consomme 25 minutes par demande et 11 % des dossiers nécessitent 12 minutes de reprise. Le coût complet du temps est estimé à 32 €/h.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Scénario</th><th>Temps initial</th><th>Reprises</th><th>Temps total/mois</th><th>Coût mensuel</th></tr></thead><tbody><tr><td>Processus actuel</td><td>416,7 h</td><td>22 h</td><td><strong>438,7 h</strong></td><td><strong>≈ 14 037 €</strong></td></tr><tr><td>Amélioration maîtrisée</td><td>333,3 h (20 min/dossier)</td><td>16 h (8 % × 12 min)</td><td><strong>349,3 h</strong></td><td><strong>≈ 11 179 €</strong></td></tr><tr><td>Fausse amélioration</td><td>333,3 h</td><td>125 h (25 % × 30 min)</td><td><strong>458,3 h</strong></td><td><strong>≈ 14 667 €</strong></td></tr></tbody></table></div><p>Dans le scénario maîtrisé, l'économie atteint environ <strong>2 858 € par mois</strong>, soit environ <strong>34 300 € sur douze mois</strong> si le volume reste comparable. Mais si la simplification fait monter fortement les reprises et leur durée, le processus devient plus cher qu'avant malgré un traitement initial cinq minutes plus rapide.</p><div class="decision-box"><h3>La mesure à suivre</h3><p><strong>Coût complet = temps de traitement initial + reprises + contrôles + incidents + charge déplacée ailleurs.</strong></p><p>Une optimisation locale n'est une amélioration que si ce total baisse sans détériorer le résultat final.</p></div></div>`;

const decisionBlock = `<!-- CE_DATA_WAVE4_20260809:dossiers/decider-sans-tourner-en-rond.html -->
<div class="case-study" id="valeur-information"><h2>Combien vaut une information avant une décision irréversible ?</h2><p>On peut parfois chiffrer la <strong>valeur de tester avant de s'engager</strong>. Prenons une formation dont le coût économique serait de 8 000 € de frais + 3 600 € de revenu perdu, soit <strong>11 600 € exposés</strong>. Une immersion, un déplacement et deux jours libérés coûtent au total 440 €.</p><div class="decision-box"><h3>Seuil de rentabilité de l'information</h3><p><strong>440 € / 11 600 € = 3,8 %.</strong></p><p>Si ce test a plus de 3,8 % de chances d'éviter un engagement de 11 600 € qui se révélerait mauvais, son coût est déjà défendable sur la seule logique de perte évitée. Ce calcul ne prédit pas la probabilité : il montre la probabilité minimale à partir de laquelle chercher l'information devient économiquement rationnel.</p></div><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Coût du test</th><th>Capital / temps à risque</th><th>Probabilité minimale d'éviter l'erreur</th></tr></thead><tbody><tr><td>100 €</td><td>10 000 €</td><td><strong>1 %</strong></td></tr><tr><td>500 €</td><td>10 000 €</td><td><strong>5 %</strong></td></tr><tr><td>1 000 €</td><td>50 000 €</td><td><strong>2 %</strong></td></tr></tbody></table></div><p>Cette logique est particulièrement utile pour une formation longue, un achat immobilier, une création d'entreprise ou tout choix où une petite expérience réversible peut empêcher une grosse erreur irréversible.</p><p><strong>À l'inverse, continuer à rechercher des informations gratuites mais incapables de changer le choix a une valeur proche de zéro</strong> et peut simplement retarder la décision.</p></div>`;

insertBefore('dossiers/quitter-emploi-stable-ou-rester.html', 'CE_DATA_WAVE4_20260809:dossiers/quitter-emploi-stable-ou-rester.html', '<h2>1. Nommer précisément ce qui pousse à partir</h2>', leaveBlock);
insertBefore('dossiers/devenir-manager-premiere-fois.html', 'CE_DATA_WAVE4_20260809:dossiers/devenir-manager-premiere-fois.html', '<h2>1. Comprendre le changement de fonction</h2>', managerBlock);
insertBefore('dossiers/ameliorer-processus-sans-degrader-service.html', 'CE_DATA_WAVE4_20260809:dossiers/ameliorer-processus-sans-degrader-service.html', '<h2>1. Partir du problème réel, pas de l’irritant le plus visible</h2>', processBlock);
insertBefore('dossiers/decider-sans-tourner-en-rond.html', 'CE_DATA_WAVE4_20260809:dossiers/decider-sans-tourner-en-rond.html', '<h2>1. Écrire la vraie décision</h2>', decisionBlock);

const dataPath = 'assets/editorial-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
data.careerDecision2026 = {
  resignationReconversion: {
    continuousWorkDaysRequired: 1300,
    referencePeriodMonths: 60,
    cepBeforeResignation: true,
    projectMustBeCertifiedRealSerious: true,
    status: 'regulatory-current',
    source: 'https://www.francetravail.fr/candidat/mes-droits-aux-aides-et-allocati/a-chaque-situation-son-allocatio/quelle-est-ma-situation-professi/je-perds-ou-je-quitte-un-emploi/je-veux-demissionner-et-jai-un-p.html'
  }
};
data.editorialExamplesWave4 = {
  status: 'illustrative-user-replaceable',
  jobChange: {currentNetMonthlyEur:2400,newNetMonthlyEur:2700,currentVariableAnnualEur:1500,currentTransportMonthlyEur:120,newTransportMonthlyEur:360,newParkingMonthlyEur:70,extraCommuteHoursAnnual:220},
  manager: {directReports:8,interruptionsPerPersonPerDay:2,minutesPerInterruption:8,workingWeeks:46},
  process: {monthlyCases:1000,currentMinutes:25,currentReworkPct:11,currentReworkMinutes:12,improvedMinutes:20,improvedReworkPct:8,hourlyCostEur:32},
  valueOfInformation: {commitmentAtRiskEur:11600,testCostEur:440,breakEvenProbabilityPct:3.8}
};
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

const auditPath = 'editorial/audit-chiffrage-bibliotheque.md';
let audit = fs.readFileSync(auditPath, 'utf8');
const note = `\n## Vague 4 — 9 août 2026\n- \`dossiers/quitter-emploi-stable-ou-rester.html\` — coût complet d'une mobilité + règles France Travail sur la démission-reconversion.\n- \`dossiers/devenir-manager-premiere-fois.html\` — quantification du goulot managérial par interruptions et reprises.\n- \`dossiers/ameliorer-processus-sans-degrader-service.html\` — coût complet avant/après et scénario où la vitesse dégrade le résultat.\n- \`dossiers/decider-sans-tourner-en-rond.html\` — calcul de valeur de l'information avant engagement irréversible.\n`;
if (!audit.includes('## Vague 4 — 9 août 2026')) {
  audit += note;
  fs.writeFileSync(auditPath, audit);
}

console.log('Vague 4 appliquée.');
