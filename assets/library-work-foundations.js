(() => {
  if (!Array.isArray(window.CE_LIBRARY_CATALOG)) return;
  const additions = [
    {
      d:'vie-pro',t:'guide',c:'Comprendre le travail',
      h:'dossiers/competences-qualification-employabilite.html',
      n:'Compétences, qualification, diplôme et employabilité : remettre chaque notion à sa place',
      x:'Distinguer connaissances, savoir-faire, comportements professionnels, qualification, certification, diplôme, expérience, preuves et employabilité avant de choisir une formation ou un poste.',
      k:'compétences savoir savoir-faire savoir-être qualification diplôme titre certification rncp expérience preuve employabilité autonomie responsabilité transférable'
    },
    {
      d:'vie-pro',t:'guide',c:'Comprendre le travail',
      h:'dossiers/metiers-fonctions-organisation-entreprise.html',
      n:'Métier, poste, fonction, service : comprendre qui fait quoi dans une entreprise',
      x:'Lire une organisation par ses finalités, ses flux et ses responsabilités : direction, opérations, commercial, finance, RH, qualité, achats, logistique, numérique et fonctions support.',
      k:'métier poste fonction entreprise organisation service direction opérations production commercial marketing finance rh qualité hse achats logistique informatique support responsabilité interface'
    },
    {
      d:'vie-pro',t:'guide',c:'Apprentissage',
      h:'dossiers/apprendre-developper-competences.html',
      n:'Comment apprend-on réellement un métier et une compétence ?',
      x:'Formation formelle, pratique, observation, tutorat, autoformation, feedback, mise en situation et répétition : choisir le bon mode d’apprentissage selon la compétence visée.',
      k:'apprentissage apprendre formation pratique expérience tutorat alternance autoformation feedback répétition mise en situation compétence transfert'
    },
    {
      d:'vie-pro',t:'guide',c:'Management & relations',
      h:'dossiers/management-relations-conflits.html',
      n:'Management, autorité et conflits : choisir le bon mode de fonctionnement',
      x:'Comparer direction, participation, délégation, autonomie, contrôle et feedback ; distinguer désaccord, tension et conflit puis traiter le problème au bon niveau.',
      k:'management directif participatif délégatif situationnel autorité autonomie contrôle feedback conflit désaccord tension médiation équipe manager'
    },
    {
      d:'vie-pro',t:'guide',c:'Droit & responsabilités',
      h:'dossiers/regles-responsabilites-fautes-travail.html',
      n:'Erreur, insuffisance, faute : qui est responsable de quoi au travail ?',
      x:'Distinguer erreur, insuffisance professionnelle, manquement disciplinaire, faute simple, grave ou lourde, et replacer les obligations du salarié, du manager et de l’employeur dans leur cadre.',
      k:'travail droit obligations responsabilité employeur salarié manager erreur négligence insuffisance professionnelle faute simple grave lourde discipline sécurité consigne'
    },
    {
      d:'vie-pro',t:'dossier',c:'Perceptions & biais',
      h:'dossiers/prejuges-biais-monde-professionnel.html',
      n:'Préjugés au travail : ce qui est réellement évalué n’est pas toujours ce que l’on croit',
      x:'Âge, diplôme, parcours, apparence, statut, ancienneté et stéréotypes : distinguer biais de perception, critères professionnels légitimes et discrimination interdite.',
      k:'préjugé biais stéréotype discrimination recrutement âge diplôme apparence parcours ancienneté halo similarité expérience employabilité égalité'
    },
    {
      d:'vie-pro',t:'guide',c:'Santé & conditions de travail',
      h:'dossiers/sante-travail-equilibre-vie-pro-perso.html',
      n:'Santé au travail et équilibre de vie : le coût d’un emploi ne se résume pas au salaire',
      x:'Risques physiques, charge, horaires, récupération, risques psychosociaux, trajet, organisation et vie personnelle : évaluer la soutenabilité réelle d’un travail.',
      k:'santé travail sécurité prévention risque physique psychosocial rps stress burnout charge horaires repos équilibre vie professionnelle personnelle trajet récupération soutenabilité'
    },
    {
      d:'vie-pro',t:'guide',c:'Fiches métiers',
      h:'fiches-metiers.html',
      n:'Fiches métiers : comprendre le travail réel derrière un intitulé',
      x:'Lire un métier par sa finalité, ses activités, ses décisions, ses compétences, ses preuves, ses contraintes, ses responsabilités, ses portes d’entrée et ses évolutions.',
      k:'fiches métiers métier fonction emploi finalité activités compétences contraintes responsabilités accès évolution mobilité rome'
    },
    {
      d:'vie-pro',t:'guide',c:'Fiche métier',
      h:'fiches-metiers/manager-proximite.html',
      n:'Manager de proximité : coordonner le travail sans devenir le goulot d’étranglement',
      x:'Finalité, arbitrages quotidiens, compétences, preuves, contraintes, responsabilités et évolutions d’un rôle d’encadrement de proximité.',
      k:'fiche métier manager proximité chef équipe responsable secteur encadrement organisation délégation feedback sécurité performance équipe'
    },
    {
      d:'vie-pro',t:'guide',c:'Fiche métier',
      h:'fiches-metiers/responsable-qualite.html',
      n:'Responsable qualité : transformer des exigences en système de travail fiable',
      x:'Processus, conformité, audit, amélioration, preuves, coopération avec les opérations et responsabilité : comprendre le métier au-delà des procédures.',
      k:'fiche métier responsable qualité qualiticien conformité audit processus amélioration continue indicateur procédure preuve risque'
    },
    {
      d:'vie-pro',t:'guide',c:'Fiche métier',
      h:'fiches-metiers/charge-recrutement-rh.html',
      n:'Chargé de recrutement et RH : réduire l’incertitude sans réduire les personnes à un CV',
      x:'Besoin de recrutement, tri, entretien, intégration, droit, données et relations internes : comprendre les décisions et limites du rôle.',
      k:'fiche métier recrutement ressources humaines rh recruteur entretien candidat intégration compétences droit discrimination manager'
    },
    {
      d:'vie-pro',t:'guide',c:'Fiche métier',
      h:'fiches-metiers/commercial-b2b.html',
      n:'Commercial B2B : transformer un besoin en décision d’achat rentable',
      x:'Prospection, qualification, vente, négociation, marge, cycle de décision, CRM, preuves et transfert de compétences vers d’autres fonctions.',
      k:'fiche métier commercial b2b vente prospection client négociation marge crm compte portefeuille besoin offre cycle vente'
    }
  ];
  let pos = 0;
  for (const item of additions) {
    if (window.CE_LIBRARY_CATALOG.some(existing => existing.h === item.h)) continue;
    window.CE_LIBRARY_CATALOG.splice(pos, 0, item);
    pos += 1;
  }
})();
