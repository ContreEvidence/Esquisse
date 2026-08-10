(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;
  const additions = [
    {
      d:'patrimoine',
      t:'dossier',
      c:'Commencer ses finances',
      h:'dossiers/prix-attendre-finances.html',
      n:'Le prix d’attendre : combien coûte le fait de remettre ses finances à plus tard ?',
      x:'Rendre visible le coût possible de l’inaction : dépenses récurrentes, inflation, retard d’investissement, frais et grosses décisions laissées sans contrôle.',
      k:'commencer finances remettre plus tard attendre procrastination budget épargne investir investissement inflation frais dépenses récurrentes coût opportunité capitalisation prendre en main argent'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Immobilier',
      h:'dossiers/cout-complet-achat-immobilier.html',
      n:'Achat immobilier : calculer le coût complet avant de regarder la mensualité',
      x:'Prix, frais d’acquisition, crédit, apport, travaux, charges, revente et coût d’opportunité : reconstruire l’économie complète d’un achat.',
      k:'immobilier achat logement coût complet mensualité crédit apport frais acquisition notaire travaux charges copropriété taxe foncière revente coût opportunité dette'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Immobilier',
      h:'dossiers/audit-copropriete-avant-achat.html',
      n:'Acheter en copropriété : l’audit à faire avant de signer',
      x:'Procès-verbaux, charges, impayés, travaux, toiture, façade, ascenseur et diagnostics : transformer les risques de l’immeuble en décisions chiffrées.',
      k:'immobilier copropriété achat appartement audit assemblée générale pv charges impayés travaux toiture façade ascenseur fonds travaux syndic diagnostic coût'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Inflation & pouvoir d’achat',
      h:'dossiers/inflation-comprendre-histoire-pouvoir-achat.html',
      n:'Inflation : comprendre 80 ans d’histoire et l’effet sur votre argent',
      x:'Définition, causes, séries historiques depuis 1945, pouvoir d’achat, rendement réel, crédit, taux et placements.',
      k:'inflation prix pouvoir achat ipc désinflation déflation 1970 1980 épargne cash rendement réel taux crédit histoire économie'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Automobile',
      h:'dossiers/cout-reel-voiture-achat-credit-loa-lld.html',
      n:'Avoir une voiture : achat, crédit, LOA ou LLD — que coûte vraiment chaque formule ?',
      x:'Comparer sur une même durée le financement, la décote, l’entretien, l’assurance, le kilométrage et la valeur récupérée à la sortie.',
      k:'voiture automobile achat crédit loa lld leasing occasion neuf décote assurance entretien kilométrage coût total mensualité revente'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Dépenses récurrentes',
      h:'dossiers/depenses-recurrentes-abonnements-assurances.html',
      n:'Abonnements, assurances, forfaits : combien coûtent les dépenses qui se renouvellent toutes seules ?',
      x:'Ramener les prélèvements récurrents au coût annuel, retrouver les services oubliés, détecter les doublons et distinguer dépense inutile et protection utile.',
      k:'abonnement assurance forfait prélèvement récurrent streaming téléphone internet banque logiciel salle sport contrat coût annuel doublon résiliation renégociation budget'
    },
    {
      d:'patrimoine',
      t:'dossier',
      c:'Gestion pilotée',
      h:'dossiers/gestion-pilotee-comparer-performances.html',
      n:'Gestion pilotée : comment comparer les performances sans se faire piéger ?',
      x:'Comparer performances publiées, niveau de risque, frais, benchmark, périodes et drawdowns avant de juger une gestion pilotée.',
      k:'gestion pilotée assurance vie performance yomoni nalo ramify benchmark frais risque drawdown spiva etf portefeuille rendement'
    }
  ];
  let pos = 0;
  for (const item of additions) {
    if (window.CE_LIBRARY_CATALOG.some(existing => existing.h === item.h)) continue;
    window.CE_LIBRARY_CATALOG.splice(pos, 0, item);
    pos += 1;
  }
})();
