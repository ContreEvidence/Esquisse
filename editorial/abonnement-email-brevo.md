# Abonnement e-mail Contre-Évidence — branchement Brevo

## Objectif

Transformer le flux RSS déjà généré par Contre-Évidence en un abonnement e-mail automatique, sans newsletter à rédiger manuellement.

Flux principal :
https://contreevidence.github.io/Esquisse/rss.xml

## Configuration retenue pour le lancement

- Une seule liste : `Contre-Évidence — nouveautés`.
- Une seule adresse demandée : l'e-mail.
- Formulaire Brevo intégré au site.
- Champ RGPD explicite.
- Double opt-in activé.
- Lien de désinscription géré par Brevo.
- Campagne RSS récurrente.
- Envoi uniquement lorsque le flux contient de nouveaux contenus.
- Cadence de départ : un récapitulatif hebdomadaire maximum.
- Pas de segmentation thématique au lancement : on garde l'inscription simple. Les flux Patrimoine et Vie professionnelle restent disponibles séparément pour les lecteurs RSS.

## Branchement unique à effectuer dans Brevo

1. Créer le compte et la liste `Contre-Évidence — nouveautés`.
2. Dans Marketing > Formulaires, créer un formulaire d'inscription intégré.
3. Activer les champs RGPD et la double confirmation.
4. Ne demander que l'adresse e-mail au lancement.
5. Personnaliser l'e-mail de confirmation avec l'identité Contre-Évidence.
6. Récupérer le code ou l'URL du formulaire et le brancher dans le module `assets/follow.js`.
7. Créer une campagne RSS récurrente alimentée par `rss.xml`.
8. Régler la cadence sur un récapitulatif hebdomadaire maximum et ne rien envoyer lorsqu'il n'y a aucun nouveau contenu.
9. Faire un test complet : inscription > confirmation > apparition dans la liste > nouvel article > RSS > e-mail > désinscription.

## Évolution possible ensuite

Si le volume d'abonnés le justifie, proposer dans le formulaire des préférences facultatives :

- Tout Contre-Évidence
- Patrimoine
- Vie professionnelle

Les flux thématiques sont déjà générés automatiquement :

- `rss-patrimoine.xml`
- `rss-vie-pro.xml`

Il ne faudra donc pas reconstruire l'architecture technique pour segmenter les e-mails plus tard.

## Principe éditorial

L'e-mail doit ramener au site, pas remplacer le dossier. Format recommandé : titre, angle ou chiffre clé, résumé court, bouton vers le contenu. Pas de copie intégrale des articles dans la newsletter.
