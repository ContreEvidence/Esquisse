# Connexion des réseaux sociaux au pipeline automatique

Le code de publication est déjà présent dans `scripts/publish-social.cjs`. Tant que les secrets ci-dessous ne sont pas configurés, le workflow génère les médias et les textes mais n'envoie rien à l'extérieur.

## Ordre recommandé

### 1. Facebook + Instagram

Les deux passent par Meta Graph API.

Secrets utilisés :

- `META_USER_ACCESS_TOKEN` ou le couple `META_PAGE_ID` + `META_PAGE_ACCESS_TOKEN`
- `META_IG_USER_ID` pour Instagram si l'identifiant n'est pas récupéré automatiquement depuis la Page

Page attendue : `Contre-Évidence`.

Une fois les accès présents :

- Facebook publie le texte et le lien du dossier.
- Instagram publie la vidéo verticale en Reel avec sa légende.

### 2. YouTube

Secrets utilisés :

- `YOUTUBE_CLIENT_ID`
- `YOUTUBE_CLIENT_SECRET`
- `YOUTUBE_REFRESH_TOKEN`
- `YOUTUBE_PRIVACY_STATUS` (facultatif)
- `YOUTUBE_CATEGORY_ID` (facultatif)

Valeur de sécurité actuelle : `private` tant qu'aucune autre valeur n'est fournie.

### 3. TikTok

Secrets utilisés :

- `TIKTOK_ACCESS_TOKEN`
- `TIKTOK_PRIVACY_LEVEL` (facultatif)

Valeur de sécurité actuelle : `SELF_ONLY` tant qu'aucune autre valeur n'est fournie.

## Anti-doublon

`publications/social-state.json` mémorise les plateformes déjà publiées pour chaque URL. Une plateforme réussie n'est pas republiée au passage suivant. En cas de publication partielle, seuls les réseaux encore en échec sont retentés.

## Cadence

`publications/social-config.json` impose actuellement :

- un contenu maximum par passage ;
- quatre heures minimum entre deux contenus sociaux complets ;
- le dossier sur les dépenses récurrentes comme premier contenu prioritaire.

## Premier test

Contenu prioritaire :

`dossiers/depenses-recurrentes-abonnements-assurances.html`

Angle : près de 4 000 € de dépenses récurrentes dans l'exemple, avec 1 037,64 € d'économies identifiées après audit. Ne jamais présenter 4 000 € comme une économie promise.
