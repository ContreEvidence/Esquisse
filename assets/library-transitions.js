(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;
  const additions = [
    {d:'vie-pro',t:'guide',c:'Transition',h:'dossiers/quitter-cdi-avec-credit-immobilier.html',n:'Quitter son CDI avec un crédit immobilier : comment savoir si vous pouvez vous le permettre ?',x:'Mesurer la marge financière, vérifier les droits et comparer rester, préparer la sortie ou partir lorsque le foyer porte déjà un crédit.',k:'quitter cdi crédit immobilier démission salaire épargne runway chômage reconversion sécurité financière'},
    {d:'vie-pro',t:'guide',c:'Transition',h:'dossiers/combien-epargne-avant-demissionner.html',n:'Combien d’épargne faut-il avant de démissionner ?',x:'Calculer la réserve réellement disponible à partir des dépenses essentielles et tester un retour à l’emploi plus long que prévu.',k:'combien épargne avant démission démissionner cdi réserve sécurité runway dépenses chômage emploi'},
    {d:'vie-pro',t:'guide',c:'Reconversion',h:'dossiers/reconversion-sans-perte-salaire.html',n:'Reconversion sans perte de salaire : quelles options sont réellement possibles ?',x:'Distinguer maintien de revenu, manque à gagner, coût de formation et salaire de sortie avant de construire la transition.',k:'reconversion sans perte salaire revenu formation cpf transition professionnelle changer métier'},
    {d:'vie-pro',t:'dossier',c:'Qualité de vie',h:'dossiers/accepter-emploi-moins-paye-vivre-mieux.html',n:'Accepter un emploi moins payé pour vivre mieux ?',x:'Comparer revenu réellement disponible, trajet, temps, santé, télétravail, progression et soutenabilité financière.',k:'emploi moins payé gagner moins vivre mieux salaire trajet temps qualité vie télétravail stress'},
    {d:'patrimoine',t:'guide',c:'Immobilier',h:'dossiers/acheter-sans-vider-epargne.html',n:'Acheter un logement sans vider son épargne : combien garder après l’achat ?',x:'Séparer apport, travaux et réserve puis tester la solidité du foyer après la signature.',k:'acheter sans vider épargne combien garder après achat immobilier apport réserve sécurité liquidités'},
    {d:'patrimoine',t:'dossier',c:'Liberté financière',h:'dossiers/patrimoine-permet-il-travailler-moins.html',n:'Mon patrimoine me permet-il de travailler moins ?',x:'Comparer baisse de revenu, dépenses, dette, retraite, actifs disponibles et valeur du temps libéré.',k:'patrimoine travailler moins temps partiel 80 pourcent revenu qualité vie retraite liberté financière'}
  ];
  for (const item of additions) {
    if (!window.CE_LIBRARY_CATALOG.some(existing => existing.h === item.h)) window.CE_LIBRARY_CATALOG.push(item);
  }
})();
