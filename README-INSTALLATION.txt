MISE À JOUR — FINANCES PERSONNELLES ET MOINS DE 25 ANS

OBJECTIF
- Une rubrique directe par thème.
- Aucun menu déroulant.
- « Finances personnelles » remplace « Argent » dans la navigation.
- « Moins de 25 ans » devient une page transversale accessible depuis l’accueil.
- « Parcours argent » devient « Organiser ses finances » dans les textes visibles.

FICHIERS À REMPLACER
1. assets/script.js
2. assets/navigation-v3.js
3. index.html
4. bibliotheque.html
5. parcours-argent.html
6. themes/argent.html
7. sitemap.xml

FICHIERS À AJOUTER
1. assets/young.css
2. moins-de-25-ans.html

FAUT-IL SUPPRIMER D’ANCIENS FICHIERS ?
Non. Ne supprimez pas navigation.css : il sert aussi aux cartes, aux filtres et aux parcours.
Vous pouvez supprimer navigation-tabs.css s’il existe encore, mais ce n’est plus obligatoire : le nouveau menu n’utilise aucune de ses classes.

ORDRE CONSEILLÉ DANS GITHUB
1. Envoyer les deux fichiers du dossier assets.
2. Envoyer les quatre pages HTML de remplacement et la nouvelle page.
3. Remplacer sitemap.xml.
4. Attendre une minute.
5. Recharger le site avec Ctrl + F5.

TEST AVANT INSTALLATION
Ouvrir PREVIEW-MENU.html sur l’ordinateur. Le fichier montre le principe d’alignement sans modifier le site.
