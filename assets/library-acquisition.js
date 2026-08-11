(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;

  const patch = (href, values) => {
    const item = window.CE_LIBRARY_CATALOG.find(entry => entry.h === href);
    if (item) Object.assign(item, values);
  };

  patch('dossiers/formation-vaut-elle-le-cout.html', {
    n:'Choisir une formation pour une reconversion : coût, RNCP et débouchés',
    x:'Partir du métier et des offres réelles, vérifier RNCP/RS, insertion, coût économique total, revenu sacrifié et alternatives plus courtes.',
    k:'choisir formation reconversion rncp rs qualiopi cpf débouchés insertion coût économique revenu perdu salaire métier alternatives vae alternance'
  });

  patch('articles/competences-transferables.html', {
    n:'Changer de métier sans repartir de zéro : quelles compétences sont transférables ?',
    x:'Comparer profondeur de maîtrise, proximité de contexte, preuves et écarts à combler pour choisir entre candidature directe, poste passerelle ou formation.',
    k:'changer métier sans repartir zéro compétences transférables reconversion poste passerelle preuves expérience formation candidature'
  });

  patch('dossiers/passer-80-pourcent-cout-reel.html', {
    n:'Passer à 80 % : combien je perds en salaire et quel coût réel ?',
    x:'Comparer baisse de revenu, frais évités, temps réellement récupéré, épargne, retraite et charge de travail avant de passer à temps partiel.',
    k:'passer à 80 pourcent combien perdre salaire temps partiel coût réel retraite épargne temps récupéré travail privé fonction publique'
  });

  patch('dossiers/comparer-deux-offres-emploi.html', {
    n:'Comparer deux offres d’emploi : salaire, contrat, temps, risques et évolution',
    x:'Comparer revenu disponible, temps capturé, contrat, manager, risque organisationnel, qualité de vie, capital professionnel et scénarios avant de signer.',
    k:'comparer deux offres emploi choisir offre salaire contrat temps trajet manager télétravail risque évolution carrière qualité vie'
  });

  const additions = [
    {
      d:'vie-pro',t:'guide',c:'Choix d’emploi',
      h:'dossiers/questions-poser-avant-prise-de-poste.html',
      n:'Questions à poser avant d’accepter un poste : les 10 essentielles',
      x:'Révéler le poste réel avant de signer : raison du recrutement, objectifs, manager, charge, turnover, moyens, variable, télétravail et évolution.',
      k:'questions poser avant accepter poste emploi embauche entretien manager charge turnover salaire variable télétravail prise de poste onboarding'
    },
    {
      d:'vie-pro',t:'guide',c:'Contrat de travail',
      h:'dossiers/contrat-travail-clauses-verifier-avant-signer.html',
      n:'Contrat de travail : clauses à vérifier avant de signer un CDI',
      x:'Examiner salaire, classification, période d’essai, forfait jours, télétravail, mobilité, variable, exclusivité, non-concurrence et convention collective.',
      k:'contrat travail clauses vérifier avant signer cdi période essai forfait jours mobilité télétravail variable exclusivité non concurrence convention collective salaire'
    }
  ];

  const anchor = window.CE_LIBRARY_CATALOG.findIndex(item => item.h === 'dossiers/comparer-deux-offres-emploi.html');
  let offset = anchor >= 0 ? anchor + 1 : window.CE_LIBRARY_CATALOG.length;
  for (const item of additions) {
    if (window.CE_LIBRARY_CATALOG.some(existing => existing.h === item.h)) continue;
    window.CE_LIBRARY_CATALOG.splice(offset, 0, item);
    offset += 1;
  }
})();
