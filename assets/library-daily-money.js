(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;
  const href = 'dossiers/education-financiere-consommation.html';
  if (window.CE_LIBRARY_CATALOG.some(item => item.h === href)) return;
  window.CE_LIBRARY_CATALOG.splice(1, 0, {
    d:'patrimoine',
    t:'guide',
    c:'Éducation financière',
    h:href,
    n:'Consommer, acheter, s’endetter : les bases financières du quotidien',
    x:'Coût réel, mensualités, LOA/LLD, paiement fractionné, abonnements, gaspillage et arbitrage réparer ou remplacer.',
    k:'éducation financière consommation achat coût total mensualité leasing loa lld crédit paiement fractionné 3x 4x abonnement gaspillage réparer remplacer voiture budget épargne'
  });
})();
