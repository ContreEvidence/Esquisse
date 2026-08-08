(() => {
  'use strict';
  // Compatibilité uniquement. Le sommaire, le temps de lecture et la progression
  // sont désormais gérés par assets/navigation-v3.js afin d'éviter les doublons.
  document.documentElement.dataset.ceArticleV3Legacy = 'disabled';
})();