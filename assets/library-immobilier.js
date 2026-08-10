(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;
  const additions = [
    {
      d:'patrimoine',t:'dossier',c:'Immobilier & allocation',
      h:'dossiers/immobilier-allocation-globale-patrimoine.html',
      n:'Immobilier et allocation globale : quelle place donner à la pierre dans son patrimoine ?',
      x:'Résidence principale, locatif, dette, liquidité, rendement, concentration et diversification : juger l’immobilier à l’échelle du patrimoine complet.',
      k:'immobilier allocation globale patrimoine résidence principale locatif dette concentration diversification liquidité rendement actifs'
    },
    {
      d:'patrimoine',t:'guide',c:'Investissement locatif',
      h:'dossiers/location-nue-ou-meublee-comparer.html',
      n:'Location nue ou meublée : comparer l’économie complète avant la fiscalité',
      x:'Bail, rotation, mobilier, travaux, fiscalité, temps de gestion et souplesse : comparer deux modes d’exploitation sans se limiter au loyer facial.',
      k:'location nue meublée lmnp revenus fonciers bic bail mobilier rotation rendement fiscalité vacance gestion'
    },
    {
      d:'patrimoine',t:'dossier',c:'Meublé de tourisme',
      h:'dossiers/location-courte-duree-meuble-tourisme.html',
      n:'Location courte durée : rendement élevé ou petite activité hôtelière sous contrainte ?',
      x:'Occupation, saisonnalité, ménage, plateformes, copropriété, enregistrement, DPE et fiscalité : mesurer le rendement après exploitation et risque réglementaire.',
      k:'courte durée meublé tourisme airbnb saisonnier location plateforme occupation ménage copropriété dpe réglementation fiscalité'
    },
    {
      d:'patrimoine',t:'dossier',c:'Immobilier alternatif',
      h:'dossiers/garages-parkings-locaux-commerciaux.html',
      n:'Garages, parkings et locaux commerciaux : l’immobilier ne se résume pas au logement',
      x:'Ticket d’entrée, bail, vacance, travaux, dépendance à l’emplacement, liquidité et rendement : comparer les actifs immobiliers directs hors logement classique.',
      k:'garage parking local commercial murs commerciaux immobilier alternatif bail commercial rendement vacance emplacement liquidité'
    },
    {
      d:'patrimoine',t:'guide',c:'Optionnalité immobilière',
      h:'dossiers/valeur-option-bien-immobilier.html',
      n:'Un bien immobilier vaut aussi par les options qu’il laisse ouvertes',
      x:'Habiter, louer, diviser, exploiter une partie, transformer ou revendre : intégrer la flexibilité future dans l’analyse d’un bien immobilier.',
      k:'immobilier option valeur optionnelle divisibilité transformation colocation location partie revente flexibilité usage changement situation'
    }
  ];
  let pos = 0;
  for (const item of additions) {
    if (window.CE_LIBRARY_CATALOG.some(existing => existing.h === item.h)) continue;
    window.CE_LIBRARY_CATALOG.splice(pos, 0, item);
    pos += 1;
  }
})();
