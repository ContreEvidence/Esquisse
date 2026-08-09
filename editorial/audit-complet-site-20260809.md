# Audit complet du site Contre-Évidence — 9 août 2026

Audit automatique du dépôt **ContreEvidence/Esquisse**, complété par une lecture éditoriale. Le contrôle porte sur la structure statique du site ; il ne remplace pas un test Lighthouse dans un navigateur ni une vérification HTTP des liens externes.

## 1. Vue d’ensemble

| Indicateur | Valeur |
| --- | --- |
| Fichiers du dépôt | 342 |
| Pages HTML | 180 |
| Pages articles/dossiers | 131 |
| URLs sitemap | 68 |
| Entrées bibliothèque principale | 49 |
| Entrées bibliothèque quotidienne | 0 |
| Outils catalogués | 15 |
| Articles/dossiers avec au moins une source externe | 29/131 |
| Articles/dossiers avec cas chiffré ou marqueur de données | 50/131 |
| Pages déclarant le RSS | 2/180 |
| Pages chargeant le système Suivre | 180/180 |
| Longueur moyenne brute des pages | 608 mots |
| Référentiel éditorial lastChecked/asOf | non détecté |
## 2. Synthèse par gravité

### Critique
- 42 référence(s) interne(s) pointent vers un fichier absent.

### Élevée
- 37 ancre(s) interne(s) sont introuvables.
- Problèmes de canonical détectés (manquants 25, hors domaine 0, doublons 27).
- 142 page(s) n'ont pas un jeu Open Graph complet.

### Moyenne
- 40 image(s) Open Graph utilisent une URL relative.
- 49 page(s) indexables ne figurent pas dans le sitemap.
- 24 page(s) contiennent du CSS inline ou beaucoup de styles inline, source de dérive visuelle.
- 26 contenu(s) longs n'ont aucun lien externe source détecté.

### Faible
- 178 page(s) ne déclarent pas le flux RSS dans leur <head>.

## 3. Intégrité des liens

### Fichiers internes absents
| Depuis | Lien | Cible résolue |
| --- | --- | --- |
| PREVIEW-MENU.html | ${u( | ${u( |
| PREVIEW-MENU.html | ${u( | ${u( |
| PREVIEW-MENU.html | ${u(path)} | ${u(path)} |
| bonne-entreprise-mauvais-investissement.html | ../assets/logo.svg | ../assets/logo.svg |
| bonne-entreprise-mauvais-investissement.html | ../assets/style.css | ../assets/style.css |
| bonne-entreprise-mauvais-investissement.html | ../index.html | ../index.html |
| bonne-entreprise-mauvais-investissement.html | ../assets/logo.svg | ../assets/logo.svg |
| bonne-entreprise-mauvais-investissement.html | ../index.html#articles | ../index.html |
| bonne-entreprise-mauvais-investissement.html | ../index.html#methode | ../index.html |
| bonne-entreprise-mauvais-investissement.html | ../index.html#newsletter | ../index.html |
| bonne-entreprise-mauvais-investissement.html | ../a-propos.html | ../a-propos.html |
| bonne-entreprise-mauvais-investissement.html | ../index.html#articles | ../index.html |
| bonne-entreprise-mauvais-investissement.html | ../confidentialite.html | ../confidentialite.html |
| bonne-entreprise-mauvais-investissement.html | ../mentions.html | ../mentions.html |
| bonne-entreprise-mauvais-investissement.html | ../assets/script.js | ../assets/script.js |
| ia-remplace-t-elle-le-codage.html | ../assets/logo.svg | ../assets/logo.svg |
| ia-remplace-t-elle-le-codage.html | ../assets/style.css | ../assets/style.css |
| ia-remplace-t-elle-le-codage.html | ../index.html | ../index.html |
| ia-remplace-t-elle-le-codage.html | ../assets/logo.svg | ../assets/logo.svg |
| ia-remplace-t-elle-le-codage.html | ../index.html#articles | ../index.html |
| ia-remplace-t-elle-le-codage.html | ../index.html#methode | ../index.html |
| ia-remplace-t-elle-le-codage.html | ../index.html#newsletter | ../index.html |
| ia-remplace-t-elle-le-codage.html | ../a-propos.html | ../a-propos.html |
| ia-remplace-t-elle-le-codage.html | ../index.html#articles | ../index.html |
| ia-remplace-t-elle-le-codage.html | ../confidentialite.html | ../confidentialite.html |
| ia-remplace-t-elle-le-codage.html | ../mentions.html | ../mentions.html |
| ia-remplace-t-elle-le-codage.html | ../assets/script.js | ../assets/script.js |
| portes-fermees.html | ../assets/logo.svg | ../assets/logo.svg |
| portes-fermees.html | ../assets/style.css | ../assets/style.css |
| portes-fermees.html | ../index.html | ../index.html |
| portes-fermees.html | ../assets/logo.svg | ../assets/logo.svg |
| portes-fermees.html | ../index.html#articles | ../index.html |
| portes-fermees.html | ../index.html#methode | ../index.html |
| portes-fermees.html | ../index.html#newsletter | ../index.html |
| portes-fermees.html | ../a-propos.html | ../a-propos.html |
| portes-fermees.html | ../index.html#articles | ../index.html |
| portes-fermees.html | ../confidentialite.html | ../confidentialite.html |
| portes-fermees.html | ../mentions.html | ../mentions.html |
| portes-fermees.html | ../assets/script.js | ../assets/script.js |
| simulateur-capacite-emprunt.html | ${reference.rateSource} | ${reference.rateSource} |

_2 lignes supplémentaires non affichées._

### Ancres introuvables
| Depuis | Lien | Cible | Ancre |
| --- | --- | --- | --- |
| articles/applications-captent-attention.html | ../index.html#methode | index.html | methode |
| articles/biais-du-survivant.html | ../index.html#articles | index.html | articles |
| articles/biais-du-survivant.html | ../index.html#methode | index.html | methode |
| articles/bonne-entreprise-mauvais-investissement.html | ../index.html#articles | index.html | articles |
| articles/bonne-entreprise-mauvais-investissement.html | ../index.html#methode | index.html | methode |
| articles/bonne-entreprise-mauvais-investissement.html | ../index.html#newsletter | index.html | newsletter |
| articles/bonne-entreprise-mauvais-investissement.html | ../index.html#articles | index.html | articles |
| articles/bonnes-questions.html | ../index.html#articles | index.html | articles |
| articles/bonnes-questions.html | ../index.html#methode | index.html | methode |
| articles/changer-metier-sans-zero.html | ../index.html#methode | index.html | methode |
| articles/clients-interesses-personne-nachete.html | ../themes/entreprendre.html#offre | themes/entreprendre.html | offre |
| articles/comprendre-avant-agir.html | ../index.html#articles | index.html | articles |
| articles/comprendre-avant-agir.html | ../index.html#methode | index.html | methode |
| articles/decision-difficile-options-imparfaites.html | ../index.html#methode | index.html | methode |
| articles/demarche-bloquee.html | ../index.html#methode | index.html | methode |
| articles/dire-oui-coute-cher.html | ../index.html#methode | index.html | methode |
| articles/effet-de-cadrage.html | ../index.html#articles | index.html | articles |
| articles/effet-de-cadrage.html | ../index.html#methode | index.html | methode |
| articles/effets-de-reseau.html | ../index.html#articles | index.html | articles |
| articles/effets-de-reseau.html | ../index.html#methode | index.html | methode |
| articles/ia-gagner-temps-jugement.html | ../index.html#methode | index.html | methode |
| articles/ia-remplace-t-elle-le-codage.html | ../index.html#articles | index.html | articles |
| articles/ia-remplace-t-elle-le-codage.html | ../index.html#methode | index.html | methode |
| articles/ia-remplace-t-elle-le-codage.html | ../index.html#newsletter | index.html | newsletter |
| articles/ia-remplace-t-elle-le-codage.html | ../index.html#articles | index.html | articles |
| articles/optimisation-locale.html | ../index.html#articles | index.html | articles |
| articles/optimisation-locale.html | ../index.html#methode | index.html | methode |
| articles/penser-en-probabilites.html | ../index.html#articles | index.html | articles |
| articles/penser-en-probabilites.html | ../index.html#methode | index.html | methode |
| articles/promotion-bonne-affaire.html | ../index.html#methode | index.html | methode |
| articles/reconnaitre-bonne-affaire.html | ../index.html#methode | index.html | methode |
| articles/simplifier-sans-trahir.html | ../index.html#articles | index.html | articles |
| articles/simplifier-sans-trahir.html | ../index.html#methode | index.html | methode |
| articles/strategie-barbell.html | ../index.html#articles | index.html | articles |
| articles/strategie-barbell.html | ../index.html#methode | index.html | methode |
| articles/travailler-beaucoup-gagner-peu-prix.html | ../themes/entreprendre.html#marge | themes/entreprendre.html | marge |
| articles/travailler-plus-avancer-moins.html | ../index.html#methode | index.html | methode |

### Liens de catalogue absents
_Aucun._

## 4. Sitemap et découvrabilité

### URLs sitemap sans fichier
_Aucun._

### Pages indexables absentes du sitemap
- PREVIEW-LOGO.html
- PREVIEW-MENU.html
- PREVIEW-VIDEOS.html
- PREVIEW.html
- articles/applications-captent-attention.html
- articles/biais-du-survivant.html
- articles/bonne-entreprise-mauvais-investissement.html
- articles/bonnes-questions.html
- articles/changer-metier-sans-zero.html
- articles/choisir-orientation-sans-se-fermer.html
- articles/comparatif-enveloppes-pea-assurance-vie-cto-per.html
- articles/comparatif-supports-epargne-investissement.html
- articles/comprendre-avant-agir.html
- articles/construire-allocation-debutant.html
- articles/continuer-parce-quon-a-deja-trop-investi.html
- articles/decision-difficile-options-imparfaites.html
- articles/demarche-bloquee.html
- articles/dire-oui-coute-cher.html
- articles/effet-de-cadrage.html
- articles/effets-de-reseau.html
- articles/exemples-allocation-250000-500000-1000000.html
- articles/gagner-plus-epargner-moins.html
- articles/hesiter-trois-semaines-deux-options.html
- articles/ia-gagner-temps-jugement.html
- articles/ia-remplace-t-elle-le-codage.html
- articles/ia-reponse-convaincante-fausse.html
- articles/justificatif-impossible-procedure-bloquee.html
- articles/optimisation-locale.html
- articles/penser-en-probabilites.html
- articles/premier-logement-autonomie.html
- … 19 autre(s)

### Contenus du catalogue éditorial absents du sitemap
_Aucun._

### Articles/dossiers du sitemap absents du catalogue éditorial
- dossiers/education-financiere-consommation.html
- dossiers/cout-reel-voiture-achat-credit-loa-lld.html
- dossiers/depenses-recurrentes-abonnements-assurances.html
- dossiers/gestion-pilotee-comparer-performances.html

## 5. SEO on-page

### Métadonnées manquantes
- Titres manquants : **0**
- Descriptions manquantes : **37**
- Canonicals manquants : **25**
- Langue manquante : **0**
- Viewport manquant : **0**

### H1 non conformes
_Aucun._

### Titres longs (>65 caractères)
| Page | Longueur | Titre |
| --- | --- | --- |
| articles/50-candidatures-zero-reponse.html | 79 | 50 candidatures, zéro réponse : avant d’en envoyer 50 de plus — Contre-évidence |
| articles/50000-euros-livret-peur-investir.html | 78 | Vous avez une grosse épargne disponible : par où commencer ? — Contre-évidence |
| articles/accepter-nimporte-quel-poste-retour-emploi.html | 77 | Accepter un poste imparfait quand on veut retravailler vite \| Contre-évidence |
| articles/applications-captent-attention.html | 98 | Pourquoi certaines applications captent votre attention plus longtemps que prévu — Contre-évidence |
| articles/biais-du-survivant.html | 81 | Le biais du survivant : apprendre aussi de ceux qui ont disparu — Contre-évidence |
| articles/bonne-entreprise-mauvais-investissement.html | 83 | Pourquoi une bonne entreprise peut être un mauvais investissement — Contre-évidence |
| articles/checklist-avant-placement-conseiller.html | 100 | Avant de placer une grosse somme : la checklist contre les erreurs et les arnaques — Contre-évidence |
| articles/choisir-etf-mondial-debutant.html | 69 | Choisir un ETF diversifié : les critères essentiels — Contre-évidence |
| articles/clients-interesses-personne-nachete.html | 86 | Tout le monde trouve votre idée intéressante, mais personne n’achète — Contre-évidence |
| articles/comparatif-enveloppes-pea-assurance-vie-cto-per.html | 87 | PEA, assurance-vie, compte-titres ou PER : quelle enveloppe choisir ? — Contre-évidence |
| articles/comparatif-produits-bancaires.html | 96 | Livrets, compte à terme, PEL, fonds en euros : quel produit pour quel besoin ? — Contre-évidence |
| articles/comparatif-supports-epargne-investissement.html | 108 | Cash, fonds en euros, obligations, actions, ETF : comprendre les supports avant d’investir — Contre-évidence |
| articles/competences-invisibles-preuves.html | 88 | Vous ne manquez peut-être pas de compétences. Vous manquez de preuves. — Contre-évidence |
| articles/competences-transferables.html | 77 | Comment identifier ses compétences réellement transférables — Contre-évidence |
| articles/comprendre-avant-agir.html | 72 | Comprendre avant d’agir — sans attendre de tout savoir — Contre-évidence |
| articles/construire-allocation-debutant.html | 66 | Construire une allocation simple quand on débute — Contre-évidence |
| articles/construire-epargne-de-zero.html | 85 | Construire son épargne à partir de zéro : dans quel ordre avancer ? — Contre-évidence |
| articles/continuer-parce-quon-a-deja-trop-investi.html | 78 | Vous continuez surtout parce que vous avez déjà trop investi — Contre-évidence |
| articles/decision-difficile-options-imparfaites.html | 68 | Comment décider quand aucune option n’est parfaite — Contre-évidence |
| articles/demarche-bloquee.html | 81 | Quand une démarche vous bloque : comment reformuler le problème — Contre-évidence |
| articles/dire-oui-coute-cher.html | 69 | Pourquoi dire oui à tout finit par vous coûter cher — Contre-évidence |
| articles/effet-de-cadrage.html | 81 | L’effet de cadrage : la même réalité, des décisions différentes — Contre-évidence |
| articles/effets-de-reseau.html | 100 | Les effets de réseau : quand chaque nouvel utilisateur change la valeur du système — Contre-évidence |
| articles/entretien-rate-ce-qui-bloque.html | 85 | Vous décrochez des entretiens mais jamais le poste : où ça bloque ? — Contre-évidence |
| articles/exemples-allocation-250000-500000-1000000.html | 80 | Exemples d’allocation pour 250 000 €, 500 000 € et 1 000 000 € — Contre-évidence |
| articles/expliquer-parcours-accidente.html | 81 | Parcours atypique — contenu intégré au guide recherche d’emploi \| Contre-évidence |
| articles/frais-fiscalite-rendement-net.html | 100 | Frais et fiscalité : pourquoi le rendement affiché n’est pas celui que vous gardez — Contre-évidence |
| articles/gagner-plus-epargner-moins.html | 78 | Vous gagnez plus qu’avant mais vous n’épargnez toujours rien — Contre-évidence |
| articles/grosse-entree-argent-que-faire.html | 100 | Vous recevez une grosse somme d’argent : que faire pendant les 90 premiers jours ? — Contre-évidence |
| articles/hesiter-trois-semaines-deux-options.html | 92 | Vous hésitez depuis trois semaines entre deux options presque équivalentes — Contre-évidence |
| articles/ia-gagner-temps-jugement.html | 95 | Comment utiliser l’IA pour gagner du temps sans lui abandonner votre jugement — Contre-évidence |
| articles/ia-remplace-t-elle-le-codage.html | 82 | L’intelligence artificielle remplace-t-elle vraiment le codage ? — Contre-évidence |
| articles/indicateur-monte-service-se-degrade.html | 69 | Indicateurs et qualité de service : dossier complet \| Contre-évidence |
| articles/investir-grosse-somme-dun-coup-ou-progressivement.html | 74 | Investir une grosse somme d’un coup ou progressivement ? — Contre-évidence |
| articles/justificatif-impossible-procedure-bloquee.html | 90 | On vous demande un document que vous ne pouvez pas fournir : que faire ? — Contre-évidence |
| articles/portes-fermees.html | 72 | Une porte fermée ne prouve pas qu’il n’y a pas d’issue — Contre-évidence |
| articles/premier-logement-autonomie.html | 84 | Premier logement : devenir autonome sans sous-estimer le coût réel — Contre-évidence |
| articles/premiere-chance-sans-experience.html | 86 | Obtenir une première chance quand personne ne veut prendre le risque — Contre-évidence |
| articles/premiers-contrats-abonnements-credit.html | 101 | Premiers contrats, abonnements et crédits : éviter les engagements qui coûtent cher — Contre-évidence |
| articles/promotion-bonne-affaire.html | 80 | Pourquoi une promotion peut vous faire dépenser plus que prévu — Contre-évidence |

_53 lignes supplémentaires non affichées._

### Descriptions longues (>165 caractères)
| Page | Longueur |
| --- | --- |
| articles/accepter-nimporte-quel-poste-retour-emploi.html | 166 |
| articles/checklist-avant-placement-conseiller.html | 176 |
| articles/justificatif-impossible-procedure-bloquee.html | 187 |
| articles/premiere-chance-sans-experience.html | 174 |
| bibliotheque.html | 174 |
| dossiers/embaucher-ou-sous-traiter.html | 172 |
| dossiers/experience-devient-risque-recruteur.html | 175 |
| dossiers/finances-allocation-portefeuille.html | 189 |
| dossiers/finances-transmission-patrimoine.html | 166 |
| dossiers/formation-vaut-elle-le-cout.html | 172 |
| dossiers/methode-analyse-complete.html | 167 |
| dossiers/quitter-emploi-stable-ou-rester.html | 175 |
| dossiers/vendre-ou-conserver-bien-immobilier.html | 169 |
| portes-fermees.html | 167 |
| simulateur-prix-minimum-rentable.html | 173 |
| themes/argent.html | 186 |

### Doublons de titres
| Titre | Pages |
| --- | --- |
| Vidéos — Contre-évidence | PREVIEW-VIDEOS.html, videos.html |
| Pourquoi une bonne entreprise peut être un mauvais investissement — Contre-évidence | articles/bonne-entreprise-mauvais-investissement.html, bonne-entreprise-mauvais-investissement.html |
| L’intelligence artificielle remplace-t-elle vraiment le codage ? — Contre-évidence | articles/ia-remplace-t-elle-le-codage.html, ia-remplace-t-elle-le-codage.html |
| Une porte fermée ne prouve pas qu’il n’y a pas d’issue — Contre-évidence | articles/portes-fermees.html, portes-fermees.html |
| Par où commencer ? — Contre-évidence | debuter.html, moins-de-25-ans.html, parcours-de-vie.html |

### Doublons de descriptions
| Description | Pages |
| --- | --- |
| Une entreprise admirable peut produire un rendement médiocre si son prix intègre déjà trop de perfection. | articles/bonne-entreprise-mauvais-investissement.html, bonne-entreprise-mauvais-investissement.html |
| L’IA réduit le coût d’écriture du code. Elle augmente simultanément la valeur de la conception, du contrôle et du jugement. | articles/ia-remplace-t-elle-le-codage.html, ia-remplace-t-elle-le-codage.html |
| Ce sujet est désormais traité dans le dossier complet sur l’amélioration des procédures sans dégrader le service. | articles/indicateur-monte-service-se-degrade.html, articles/regle-absurde-logique-cachee.html |

### Open Graph incomplet
- 404.html
- PREVIEW-LOGO.html
- PREVIEW-MENU.html
- PREVIEW-VIDEOS.html
- PREVIEW.html
- a-propos.html
- articles/50-candidatures-zero-reponse.html
- articles/50000-euros-livret-peur-investir.html
- articles/accepter-nimporte-quel-poste-retour-emploi.html
- articles/accepter-nimporte-quel-premier-emploi.html
- articles/asymetrie.html
- articles/automatiser-tache-5-minutes-perdre-30.html
- articles/biais-confirmation.html
- articles/boucles-retroaction.html
- articles/checklist-avant-placement-conseiller.html
- articles/choisir-etf-mondial-debutant.html
- articles/choisir-orientation-sans-se-fermer.html
- articles/clients-interesses-personne-nachete.html
- articles/comparatif-produits-bancaires.html
- articles/continuer-parce-quon-a-deja-trop-investi.html
- articles/contraintes-innovation.html
- articles/cout-opportunite.html
- articles/couts-irrecuperables.html
- articles/decisions-reversibles-irreversibles.html
- articles/dependance-au-sentier.html
- articles/effet-de-levier.html
- articles/effets-second-ordre.html
- articles/entretien-rate-ce-qui-bloque.html
- articles/expliquer-parcours-accidente.html
- articles/frais-fiscalite-rendement-net.html
- … 112 autre(s)

### Images OG relatives
| Page | og:image |
| --- | --- |
| articles/applications-captent-attention.html | ../assets/og-cover.svg |
| articles/biais-du-survivant.html | ../assets/og-cover.svg |
| articles/bonne-entreprise-mauvais-investissement.html | ../assets/og-cover.svg |
| articles/bonnes-questions.html | ../assets/og-cover.svg |
| articles/changer-metier-sans-zero.html | ../assets/og-cover.svg |
| articles/comparatif-enveloppes-pea-assurance-vie-cto-per.html | ../assets/og-cover.svg |
| articles/comparatif-supports-epargne-investissement.html | ../assets/og-cover.svg |
| articles/competences-invisibles-preuves.html | ../assets/og-cover-brand.png |
| articles/competences-transferables.html | ../assets/og-cover-brand.png |
| articles/comprendre-avant-agir.html | ../assets/og-cover.svg |
| articles/construire-allocation-debutant.html | ../assets/og-cover.svg |
| articles/construire-epargne-de-zero.html | ../assets/og-cover-brand.png |
| articles/decision-difficile-options-imparfaites.html | ../assets/og-cover.svg |
| articles/demarche-bloquee.html | ../assets/og-cover.svg |
| articles/dire-oui-coute-cher.html | ../assets/og-cover.svg |
| articles/effet-de-cadrage.html | ../assets/og-cover.svg |
| articles/effets-de-reseau.html | ../assets/og-cover.svg |
| articles/exemples-allocation-250000-500000-1000000.html | ../assets/og-cover.svg |
| articles/grosse-entree-argent-que-faire.html | ../assets/og-cover-brand.png |
| articles/ia-gagner-temps-jugement.html | ../assets/og-cover.svg |
| articles/ia-remplace-t-elle-le-codage.html | ../assets/og-cover.svg |
| articles/optimisation-locale.html | ../assets/og-cover.svg |
| articles/penser-en-probabilites.html | ../assets/og-cover.svg |
| articles/premiere-chance-sans-experience.html | ../assets/og-cover-brand.png |
| articles/promotion-bonne-affaire.html | ../assets/og-cover.svg |
| articles/reconnaitre-bonne-affaire.html | ../assets/og-cover.svg |
| articles/repartir-sans-recommencer-zero.html | ../assets/og-cover-brand.png |
| articles/retrouver-emploi-apres-interruption.html | ../assets/og-cover-brand.png |
| articles/sans-diplome-chemins-alternatifs.html | ../assets/og-cover-brand.png |
| articles/sante-oblige-changer-metier.html | ../assets/og-cover-brand.png |
| articles/simplifier-sans-trahir.html | ../assets/og-cover.svg |
| articles/strategie-barbell.html | ../assets/og-cover.svg |
| articles/tester-metier-avant-investir.html | ../assets/og-cover-brand.png |
| articles/travailler-plus-avancer-moins.html | ../assets/og-cover.svg |
| bonne-entreprise-mauvais-investissement.html | ../assets/og-cover.svg |
| ia-remplace-t-elle-le-codage.html | ../assets/og-cover.svg |
| index.html | assets/og-cover-brand.png |
| parcours-vie-professionnelle.html | assets/og-cover-brand.png |
| portes-fermees.html | ../assets/og-cover.svg |
| themes/travail.html | ../assets/og-cover-brand.png |

## 6. Accessibilité statique

- Pages sans lien d’évitement détecté : **27**
- Pages sans conteneur de navigation #site-header : **31**
- Pages avec image(s) sans alt : **0**

_Aucun._

## 7. Qualité éditoriale et preuves

- Pages articles/dossiers : **131**
- Avec au moins un lien externe source : **29**
- Avec cas chiffré ou marqueur CE_DATA : **50**

### Contenus longs (≥900 mots) sans source externe détectée
| Page | Mots |
| --- | --- |
| articles/accepter-nimporte-quel-poste-retour-emploi.html | 1358 |
| articles/clients-interesses-personne-nachete.html | 968 |
| articles/competences-invisibles-preuves.html | 1051 |
| articles/entretien-rate-ce-qui-bloque.html | 1040 |
| articles/exemples-allocation-250000-500000-1000000.html | 1406 |
| articles/premiere-chance-sans-experience.html | 1019 |
| articles/retrouver-emploi-apres-interruption.html | 1078 |
| dossiers/ameliorer-processus-sans-degrader-service.html | 1635 |
| dossiers/audit-budget-60-minutes.html | 1513 |
| dossiers/automatiser-ou-non-processus.html | 1096 |
| dossiers/calculer-prix-minimum-rentable.html | 1639 |
| dossiers/capacite-refuser-travail-rentabilite.html | 1062 |
| dossiers/competent-mais-invisible-travail.html | 1079 |
| dossiers/cout-reel-voiture-achat-credit-loa-lld.html | 1200 |
| dossiers/debloquer-demarche-administrative.html | 1359 |
| dossiers/decider-sans-tourner-en-rond.html | 1655 |
| dossiers/dependance-gros-client.html | 1329 |
| dossiers/depenses-recurrentes-abonnements-assurances.html | 1120 |
| dossiers/devenir-manager-premiere-fois.html | 1331 |
| dossiers/finances-cadre-global.html | 907 |
| dossiers/liquidites-reserve-securite.html | 1077 |
| dossiers/methode-analyse-complete.html | 2265 |
| dossiers/plan-30-jours-recherche-emploi.html | 1979 |
| dossiers/protocole-verifier-reponse-ia.html | 1524 |
| dossiers/rembourser-credit-ou-investir.html | 1107 |
| dossiers/vendre-ou-conserver-bien-immobilier.html | 1255 |

### Pages minces (<350 mots)
| Page | Mots |
| --- | --- |
| PREVIEW-LOGO.html | 29 |
| PREVIEW-MENU.html | 43 |
| PREVIEW.html | 18 |
| articles/50000-euros-livret-peur-investir.html | 175 |
| articles/accepter-nimporte-quel-premier-emploi.html | 82 |
| articles/asymetrie.html | 35 |
| articles/automatiser-tache-5-minutes-perdre-30.html | 84 |
| articles/biais-confirmation.html | 40 |
| articles/boucles-retroaction.html | 44 |
| articles/contraintes-innovation.html | 43 |
| articles/cout-opportunite.html | 38 |
| articles/couts-irrecuperables.html | 40 |
| articles/decisions-reversibles-irreversibles.html | 45 |
| articles/dependance-au-sentier.html | 43 |
| articles/effet-de-levier.html | 41 |
| articles/effets-second-ordre.html | 39 |
| articles/expliquer-parcours-accidente.html | 85 |
| articles/incitations-gouvernent.html | 36 |
| articles/indicateur-monte-service-se-degrade.html | 74 |
| articles/information-comprehension.html | 40 |
| articles/lancer-activite-probleme-client.html | 74 |
| articles/majorite-peut-se-tromper.html | 37 |
| articles/marge-de-securite.html | 44 |
| articles/mesure-devient-cible.html | 42 |
| articles/modeles-mentaux.html | 44 |
| articles/portes-fermees.html | 59 |
| articles/premier-logement-autonomie.html | 308 |
| articles/premiers-contrats-abonnements-credit.html | 321 |
| articles/probleme-symptome-cause.html | 42 |
| articles/reconversion-apres-50-ans.html | 72 |
| articles/reconversion-ne-commence-pas-formation.html | 138 |
| articles/regle-absurde-logique-cachee.html | 77 |
| articles/rendements-decroissants.html | 43 |
| articles/reseaux-sociaux-comparaison-pression.html | 348 |
| articles/risque-incertitude.html | 46 |
| articles/surqualification-rassurer-employeur.html | 71 |
| articles/taux-de-base.html | 36 |
| articles/transition-temporaire-sans-abandonner-projet.html | 73 |
| articles/valeur-des-options.html | 39 |
| assets/PREVIEW-MENU.html | 50 |

_35 lignes supplémentaires non affichées._

## 8. Cohérence technique et dette CSS/JS

### Références CSS les plus utilisées
| Référence | Pages |
| --- | --- |
| ../assets/style.css | 14 |
| assets/style.css | 9 |
| ../assets/navigation.css | 9 |
| assets/navigation.css | 8 |
| ../assets/pro.css | 7 |
| assets/pro.css | 5 |
| ../assets/voice.css | 4 |
| ../assets/brand.css?v=20260807-18 | 4 |
| assets/voice.css | 4 |
| ../assets/finance.css?v=20260808-5 | 3 |
| ../assets/brand.css?v=20260808-5 | 3 |
| assets/brand.css?v=20260808-22 | 3 |
| assets/brand.css?v=20260808-15 | 2 |
| ../assets/finance.css?v=20260808-15 | 2 |
| ../assets/brand.css?v=20260808-15 | 2 |
| assets/brand.css?v=20260808-16 | 2 |
| assets/finance.css?v=20260808-22 | 2 |
| assets/tools.css?v=20260808-22 | 2 |
| assets/brand.css | 1 |
| ../assets/finance.css?v=20260807-2 | 1 |
| assets/brand.css?v=20260808-21 | 1 |
| assets/brand.css?v=20260807-18 | 1 |
| assets/finance.css | 1 |
| assets/finance.css?v=20260808-16 | 1 |
| assets/video.css?v=20260808-16 | 1 |

### Références JS les plus utilisées
| Référence | Pages |
| --- | --- |
| ../assets/follow.js?v=20260809-1 | 137 |
| ./assets/follow.js?v=20260809-1 | 41 |
| ../assets/script.js | 38 |
| ../assets/article-v3.js | 28 |
| ../assets/navigation-v3.js?v=20260808-16 | 27 |
| ../assets/navigation-v3.js | 22 |
| ../assets/navigation-v3.js?v=20260808-14 | 15 |
| assets/navigation-v3.js?v=20260808-22 | 14 |
| ../assets/navigation-v3.js?v=20260808-15 | 12 |
| ../assets/script.js?v=20260808-5 | 9 |
| ../assets/navigation-v3.js?v=20260808-5 | 9 |
| ../assets/navigation-v3.js?v=20260808-22 | 8 |
| assets/navigation-v3.js?v=20260808-15 | 7 |
| ../assets/script.js?v=20260808-7 | 6 |
| ../assets/navigation-v3.js?v=20260808-7 | 6 |
| assets/navigation-v3.js?v=20260808-24 | 5 |
| ../assets/navigation-v3.js?v=20260808-12 | 5 |
| assets/navigation-v3.js?v=20260808-16 | 4 |
| ../assets/script.js?v=20260807-18 | 4 |
| ../assets/navigation-v3.js?v=20260807-18 | 4 |
| ../assets/script.js?v=20260808-6 | 4 |
| ../assets/navigation-v3.js?v=20260808-6 | 3 |
| assets/navigation-v3.js | 2 |
| ../assets/script.js?v=20260808-16 | 2 |
| ./follow.js?v=20260809-1 | 2 |
| ../assets/navigation-v3.js?v=20260808-13 | 2 |
| assets/navigation-v3.js?v=20260809-03 | 2 |
| assets/script.js?v=20260806-12 | 1 |
| assets/navigation-v3.js?v=20260806-12 | 1 |
| ../assets/navigation-v3.js?v=20260808-24 | 1 |

### Pages avec CSS inline / styles inline nombreux
| Page | Blocs <style> | Attributs style |
| --- | --- | --- |
| PREVIEW-LOGO.html | 1 | 2 |
| PREVIEW-MENU.html | 1 | 1 |
| PREVIEW-VIDEOS.html | 1 | 0 |
| PREVIEW.html | 1 | 2 |
| assets/PREVIEW-MENU.html | 1 | 0 |
| contact.html | 1 | 1 |
| dossiers/cout-reel-voiture-achat-credit-loa-lld.html | 1 | 0 |
| dossiers/depenses-recurrentes-abonnements-assurances.html | 1 | 1 |
| dossiers/education-financiere-consommation.html | 1 | 0 |
| dossiers/gestion-pilotee-comparer-performances.html | 1 | 0 |
| dossiers/inflation-comprendre-histoire-pouvoir-achat.html | 1 | 0 |
| hors-cadre-cuisine.html | 1 | 0 |
| hors-cadre-decouvertes.html | 1 | 0 |
| hors-cadre.html | 1 | 0 |
| index.html | 1 | 0 |
| merci.html | 1 | 0 |
| outil-repartir-grosse-somme.html | 1 | 1 |
| parcours-argent.html | 1 | 1 |
| parcours-vie-professionnelle.html | 1 | 1 |
| simulateur-capacite-emprunt.html | 1 | 3 |
| simulateur-capitalisation-comparateur.html | 1 | 2 |
| themes/argent.html | 1 | 1 |
| themes/entreprendre.html | 1 | 1 |
| themes/travail.html | 1 | 1 |

## 9. RSS et suivi

- Déclaration RSS : **2/180 pages**
- Script de suivi : **180/180 pages**

### Pages sans autodétection RSS
- 404.html
- PREVIEW-LOGO.html
- PREVIEW-MENU.html
- PREVIEW-VIDEOS.html
- PREVIEW.html
- a-propos.html
- articles/50-candidatures-zero-reponse.html
- articles/50000-euros-livret-peur-investir.html
- articles/accepter-nimporte-quel-poste-retour-emploi.html
- articles/accepter-nimporte-quel-premier-emploi.html
- articles/applications-captent-attention.html
- articles/asymetrie.html
- articles/automatiser-tache-5-minutes-perdre-30.html
- articles/biais-confirmation.html
- articles/biais-du-survivant.html
- articles/bonne-entreprise-mauvais-investissement.html
- articles/bonnes-questions.html
- articles/boucles-retroaction.html
- articles/changer-metier-sans-zero.html
- articles/checklist-avant-placement-conseiller.html
- articles/choisir-etf-mondial-debutant.html
- articles/choisir-orientation-sans-se-fermer.html
- articles/clients-interesses-personne-nachete.html
- articles/comparatif-enveloppes-pea-assurance-vie-cto-per.html
- articles/comparatif-produits-bancaires.html
- articles/comparatif-supports-epargne-investissement.html
- articles/competences-invisibles-preuves.html
- articles/competences-transferables.html
- articles/comprendre-avant-agir.html
- articles/construire-allocation-debutant.html
- … 148 autre(s)

## 10. Domaines de sources externes les plus cités

| Domaine | Occurrences |
| --- | --- |
| amf-france.org | 16 |
| economie.gouv.fr | 14 |
| service-public.fr | 11 |
| insee.fr | 10 |
| abe-infoservice.fr | 4 |
| banque-france.fr | 4 |
| garantiedesdepots.fr | 4 |
| travail-emploi.gouv.fr | 4 |
| impots.gouv.fr | 4 |
| msci.com | 3 |
| yomoni.fr | 3 |
| corporate.vanguard.com | 3 |
| spglobal.com | 3 |
| aliabdaal.com | 3 |
| orias.fr | 2 |
| acpr.banque-france.fr | 2 |
| content.nalo.fr | 2 |
| ramify.fr | 2 |
| vae.gouv.fr | 2 |
| immersion-facile.beta.gouv.fr | 2 |
| services.info-retraite.fr | 2 |
| info-retraite.fr | 2 |
| francecompetences.fr | 2 |
| presse.economie.gouv.fr | 1 |
| statistiques.francetravail.org | 1 |
| franceassureurs.fr | 1 |
| mon-entreprise.urssaf.fr | 1 |
| urssaf.fr | 1 |
| moncompteformation.gouv.fr | 1 |
| financeurs.moncompteformation.gouv.fr | 1 |

## 11. Recommandations automatiques

1. Corriger d’abord toutes les références internes et ancres cassées.
2. Mettre le sitemap à jour automatiquement à chaque modification d’un article/dossier, pas seulement lors de la création.
3. Générer un jeu Open Graph complet pour chaque contenu et utiliser une URL absolue pour og:image.
4. Uniformiser les versions de CSS/JS au lieu de multiplier les query strings différentes selon les pages.
5. Étendre l’autodétection RSS à toutes les pages via le composant de navigation ou un gabarit commun.
6. Continuer l’enrichissement chiffré, mais cibler en priorité les contenus longs sans source externe.
7. Réduire progressivement le CSS inline en composants partagés pour éviter que l’identité visuelle dérive d’une page à l’autre.
8. Conserver les outils secondaires dans les dossiers, mais rendre leur accès direct explicite dans la Bibliothèque si l’objectif est aussi l’usage récurrent.
9. Ajouter un contrôle CI automatique de cet audit sur chaque modification de contenu importante.
10. Compléter cet audit statique par Lighthouse mobile/desktop dès qu’un navigateur de test est disponible.
