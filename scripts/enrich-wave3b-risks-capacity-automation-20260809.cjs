const fs = require('fs');

function injectBefore(path, marker, anchor, html) {
  let s = fs.readFileSync(path, 'utf8');
  if (s.includes(marker)) return false;
  const i = s.indexOf(anchor);
  if (i < 0) throw new Error(`Ancre introuvable dans ${path}`);
  s = s.slice(0, i) + html + s.slice(i);
  fs.writeFileSync(path, s);
  return true;
}

const insuranceBlock = `<!-- CE_DATA_WAVE3_20260809:dossiers/assurer-ou-autoassurer-risques.html -->
<div class="case-study" id="cout-assurance-2025"><h2>Assurance habitation : ce que représentent vraiment les hausses de primes</h2><p><strong>Données de marché 2025.</strong> France Assureurs indique une prime moyenne hors taxes de <strong>323 €</strong> pour les contrats multirisques habitation, dont <strong>351 € pour les occupants</strong> et <strong>191 € pour les non-occupants</strong>. La prime moyenne hors taxes a progressé de <strong>7,8 % sur un an</strong>. L'ACPR observe parallèlement en 2025 une hausse de 8 % des primes acquises de la ligne incendie et dommages aux biens.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Repère 2025</th><th>Montant / évolution</th><th>Lecture utile</th></tr></thead><tbody><tr><td>MRH · moyenne tous contrats</td><td><strong>323 € HT/an</strong></td><td>Repère de marché, pas devis individuel.</td></tr><tr><td>Occupants</td><td><strong>351 € HT/an</strong></td><td>Environ 29,25 € HT/mois.</td></tr><tr><td>Non-occupants</td><td><strong>191 € HT/an</strong></td><td>Environ 15,92 € HT/mois.</td></tr><tr><td>Hausse moyenne HT 2025</td><td><strong>+7,8 %</strong></td><td>Sur 351 €, cela représente environ 27,40 € de hausse annuelle.</td></tr></tbody></table></div><p>Le chiffre ne dit pas qu'il faut choisir l'assureur le moins cher. Il donne une raison de <strong>réexaminer chaque année le couple prime / franchise / plafond / exclusions</strong>. Une économie de 80 € n'a aucun intérêt si elle augmente de 2 000 € la perte restant à charge sur un risque que vous ne pouvez pas absorber.</p><p>Après le premier anniversaire, les assurances auto et habitation concernées peuvent en principe être résiliées à tout moment sans frais ni pénalité ; pour les assurances obligatoires, le nouvel assureur organise la continuité de couverture. Depuis le 19 juin 2026, les règles de souscription à distance ont aussi renforcé les possibilités de rétractation en ligne.</p><p class="source-note">Sources : <a href="https://www.franceassureurs.fr/nos-chiffres-cles/assurance-de-dommages-et-responsabilite/assurance-habitation-2025/" rel="noopener noreferrer">France Assureurs — assurance habitation 2025</a> ; <a href="https://acpr.banque-france.fr/fr/publications-et-statistiques/publications/ndeg-181-la-situation-des-assureurs-en-france-fin-2025" rel="noopener noreferrer">ACPR — situation des assureurs fin 2025</a> ; <a href="https://www.economie.gouv.fr/particuliers/gerer-mon-argent/emprunter-et-sassurer/assurance-habitation-auto-complementaire-sante-comment-resilier-son-contrat" rel="noopener noreferrer">Économie.gouv.fr — résiliation des assurances, juin 2026</a>.</p></div>`;

const clientBlock = `<!-- CE_DATA_WAVE3_20260809:dossiers/dependance-gros-client.html -->
<div class="case-study" id="stress-client"><h2>Stress-test : ce que 60 % de chiffre d'affaires peut réellement cacher</h2><p><strong>Cas illustratif, avec toutes les hypothèses affichées.</strong> Une entreprise réalise 240 000 € de chiffre d'affaires annuel. Son premier client représente 60 %, soit 144 000 €. Ce client laisse 55 % de marge contributive ; les autres clients, 45 %. Les charges fixes annuelles atteignent 100 000 €.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Scénario</th><th>CA annuel</th><th>Marge contributive estimée</th><th>Résultat avant autres éléments</th></tr></thead><tbody><tr><td>Client maintenu</td><td>240 000 €</td><td>79 200 € + 43 200 € = <strong>122 400 €</strong></td><td><strong>+22 400 €</strong></td></tr><tr><td>Volume du gros client -25 %</td><td>204 000 €</td><td>59 400 € + 43 200 € = <strong>102 600 €</strong></td><td><strong>+2 600 €</strong></td></tr><tr><td>Volume du gros client -50 %</td><td>168 000 €</td><td>39 600 € + 43 200 € = <strong>82 800 €</strong></td><td><strong>-17 200 €</strong></td></tr><tr><td>Départ complet</td><td>96 000 €</td><td><strong>43 200 €</strong></td><td><strong>-56 800 €</strong></td></tr></tbody></table></div><p>Dans cet exemple, perdre 50 % du volume du gros client ne réduit pas seulement le bénéfice : cela fait basculer l'activité en perte si les charges fixes ne peuvent pas être réduites rapidement. La concentration doit donc être suivie en <strong>marge et en coûts évitables</strong>, pas seulement en chiffre d'affaires.</p><div class="decision-box"><h3>Le calcul à refaire avec vos chiffres</h3><p><strong>Marge perdue = CA perdu × taux de marge contributive du client.</strong><br/><strong>Besoin de réaction = charges fixes qui continuent − marge restante hors client.</strong></p><p>Ajoutez ensuite le préavis contractuel, la trésorerie immédiatement disponible et le temps réaliste pour signer des clients de remplacement.</p></div></div>`;

const hireBlock = `<!-- CE_DATA_WAVE3_20260809:dossiers/embaucher-ou-sous-traiter.html -->
<div class="case-study" id="reperes-urssaf-soustraitance"><h2>Avant de comparer les prix : deux repères 2026 à intégrer</h2><p><strong>1. Le coût salarié doit venir d'un calcul employeur réel.</strong> Le simulateur officiel Mon-entreprise de l'Urssaf intègre les paramètres 2026, notamment la réduction générale dégressive unique. Il permet de passer du salaire brut au coût total employeur. L'Urssaf précise toutefois que le résultat reste indicatif et ne tient pas compte de toutes les conventions collectives ni de toutes les aides.</p><p><strong>2. La sous-traitance n'est pas seulement une facture variable.</strong> Pour tout contrat de prestation d'un montant global au moins égal à <strong>5 000 € HT</strong>, le donneur d'ordre doit obtenir et vérifier l'attestation de vigilance du cocontractant lors de la conclusion du contrat, puis <strong>tous les six mois</strong> jusqu'à sa fin.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Comparaison annuelle</th><th>Embauche</th><th>Sous-traitance</th></tr></thead><tbody><tr><td>Base à utiliser</td><td><strong>Coût total employeur Urssaf</strong></td><td>Factures HT réellement prévues</td></tr><tr><td>À ajouter</td><td>Matériel, recrutement, formation, management, sous-occupation</td><td>Coordination, contrôle, éventuelle prime de flexibilité, remplacement</td></tr><tr><td>Risque administratif</td><td>Obligations d'employeur</td><td>Contrat entre entreprises + vigilance si ≥ 5 000 € HT</td></tr><tr><td>Coût en baisse d'activité</td><td>Reste largement fixe</td><td>Peut diminuer si le volume contractuel diminue</td></tr></tbody></table></div><div class="decision-box"><h3>Exemple de seuil — hypothèses, pas moyenne de marché</h3><p>Si votre <strong>coût complet interne</strong> après simulation Urssaf, équipement et management est de 48 000 €/an, et qu'un prestataire équivalent coûte 400 €/jour, l'égalité de coût se situe à <strong>120 jours de prestation par an</strong> (48 000 / 400), avant différences de qualité, disponibilité, TVA et risque. À 60 jours, la sous-traitance coûte 24 000 € ; à 180 jours, 72 000 €. Le volume change donc complètement la réponse.</p></div><p class="source-note">Sources : <a href="https://mon-entreprise.urssaf.fr/simulateurs/salaire-brut-net?view=employeur" rel="noopener noreferrer">Urssaf / Mon-entreprise — coût d'embauche, version 2026</a> ; <a href="https://www.urssaf.fr/accueil/attestation-vigilance.html" rel="noopener noreferrer">Urssaf — attestation de vigilance</a>. Les montants 48 000 € et 400 €/jour de l'exemple sont des hypothèses illustratives à remplacer par vos données.</p></div>`;

const autoBlock = `<!-- CE_DATA_WAVE3_20260809:dossiers/automatiser-ou-non-processus.html -->
<div class="case-study" id="roi-automatisation"><h2>Cas complet : le volume peut faire passer le retour sur investissement de 17 mois à 1 mois</h2><p><strong>Hypothèses illustratives.</strong> Une tâche prend 12 minutes manuellement. L'automatisation laisse 2 minutes de contrôle humain. Le temps complet vaut 30 €/h, l'outil coûte 150 €/mois, la maintenance consomme 3 h/mois et la mise en place initiale coûte 4 500 €.</p><div class="compare-wrap"><table class="compare-table"><thead><tr><th>Volume mensuel</th><th>Coût manuel</th><th>Coût récurrent automatisé</th><th>Économie mensuelle</th><th>Retour sur 4 500 €</th></tr></thead><tbody><tr><td>100 exécutions</td><td>600 €</td><td>340 €</td><td><strong>260 €</strong></td><td>≈ 17,3 mois</td></tr><tr><td>400 exécutions</td><td>2 400 €</td><td>640 €</td><td><strong>1 760 €</strong></td><td>≈ 2,6 mois</td></tr><tr><td>800 exécutions</td><td>4 800 €</td><td>1 040 €</td><td><strong>3 760 €</strong></td><td>≈ 1,2 mois</td></tr></tbody></table></div><p>À 400 exécutions par mois, la première année produit environ <strong>21 120 € d'économies récurrentes</strong> avant coût initial ; après les 4 500 € de mise en place, le gain économique illustratif de première année est d'environ <strong>16 620 €</strong>.</p><p><strong>Le point décisif :</strong> le même outil, le même prix et le même gain par tâche peuvent être médiocres à faible volume et excellents à fort volume. C'est pourquoi le nombre réel d'exécutions doit être mesuré avant de choisir l'outil.</p><div class="decision-box"><h3>Formules</h3><p><strong>Coût manuel mensuel = volume × minutes manuelles / 60 × coût horaire.</strong><br/><strong>Coût automatisé = volume × minutes de contrôle / 60 × coût horaire + abonnement + maintenance.</strong><br/><strong>Délai de retour = coût initial / économie mensuelle nette.</strong></p></div></div>`;

injectBefore('dossiers/assurer-ou-autoassurer-risques.html', 'CE_DATA_WAVE3_20260809:dossiers/assurer-ou-autoassurer-risques.html', '<h2>1. Penser en gravité avant de penser en probabilité</h2>', insuranceBlock);
injectBefore('dossiers/dependance-gros-client.html', 'CE_DATA_WAVE3_20260809:dossiers/dependance-gros-client.html', '<h2>1. Le bon chiffre n’est pas seulement 60 % du CA</h2>', clientBlock);
injectBefore('dossiers/embaucher-ou-sous-traiter.html', 'CE_DATA_WAVE3_20260809:dossiers/embaucher-ou-sous-traiter.html', '<h2>1. Vérifier d’abord pourquoi vous manquez de capacité</h2>', hireBlock);
injectBefore('dossiers/automatiser-ou-non-processus.html', 'CE_DATA_WAVE3_20260809:dossiers/automatiser-ou-non-processus.html', '<h2>1. Commencer par le processus actuel</h2>', autoBlock);

const dataPath = 'assets/editorial-data.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
data.insurance2025 = {
  home: {
    averagePremiumHtEur: 323,
    occupantAveragePremiumHtEur: 351,
    nonOccupantAveragePremiumHtEur: 191,
    averagePremiumYoYPct: 7.8,
    source: 'https://www.franceassureurs.fr/nos-chiffres-cles/assurance-de-dommages-et-responsabilite/assurance-habitation-2025/',
    status: 'market-reported'
  },
  nonLife: {
    premiumsYoYPct: 5.6,
    autoPremiumsYoYPct: 7,
    propertyPremiumsYoYPct: 8,
    autoClaimsYoYPct: 10,
    autoRepairAverageCostYoYPct: 5.9,
    source: 'https://acpr.banque-france.fr/fr/publications-et-statistiques/publications/ndeg-181-la-situation-des-assureurs-en-france-fin-2025',
    status: 'regulator-observed'
  }
};
data.subcontracting2026 = {
  vigilanceThresholdHtEur: 5000,
  recheckMonths: 6,
  source: 'https://www.urssaf.fr/accueil/attestation-vigilance.html',
  status: 'regulatory-current'
};
data.automationExamples = {
  status: 'illustrative-user-replaceable',
  setupEur: 4500,
  hourlyCostEur: 30,
  manualMinutes: 12,
  controlMinutes: 2,
  subscriptionMonthlyEur: 150,
  maintenanceHoursMonthly: 3
};
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');

const auditPath = 'editorial/audit-chiffrage-bibliotheque.md';
let audit = fs.readFileSync(auditPath, 'utf8');
const note = `\n## Vague 3 — 9 août 2026\n- \`dossiers/assurer-ou-autoassurer-risques.html\` — enrichi avec primes MRH 2025, évolution des primes et règles de résiliation.\n- \`dossiers/dependance-gros-client.html\` — enrichi avec stress-test complet 60 % / -25 % / -50 % / rupture.\n- \`dossiers/embaucher-ou-sous-traiter.html\` — enrichi avec simulateur Urssaf 2026, seuil de vigilance 5 000 € HT et exemple de seuil en jours.\n- \`dossiers/automatiser-ou-non-processus.html\` — enrichi avec ROI complet et sensibilité au volume.\n`;
if (!audit.includes('## Vague 3 — 9 août 2026')) {
  audit += note;
  fs.writeFileSync(auditPath, audit);
}
console.log('Vague 3b appliquée.');
