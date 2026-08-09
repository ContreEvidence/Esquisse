(() => {
  const entry = {
    d:'patrimoine',
    t:'dossier',
    c:'Inflation & pouvoir d’achat',
    h:'dossiers/inflation-comprendre-histoire-pouvoir-achat.html',
    n:'Inflation : comprendre 80 ans d’histoire et l’effet sur votre argent',
    x:'Définition, causes, séries historiques depuis 1945, pouvoir d’achat, rendement réel, crédit, taux et placements.',
    k:'inflation prix pouvoir achat ipc désinflation déflation 1970 1980 épargne cash rendement réel taux crédit histoire économie'
  };
  const catalog = Array.isArray(window.CE_LIBRARY_CATALOG) ? window.CE_LIBRARY_CATALOG : [];
  if (!catalog.some(item => item.h === entry.h)) window.CE_LIBRARY_CATALOG = [entry, ...catalog];
})();
