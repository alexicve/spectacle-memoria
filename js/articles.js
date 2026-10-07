/* =========================================================================
   ÉTOILE FILANTE — Données des actualités
   -------------------------------------------------------------------------
   POUR AJOUTER UN ARTICLE :
   1. Copiez un bloc { ... } ci-dessous et collez-le EN HAUT du tableau
      (le plus récent en premier).
   2. Renseignez les champs :
        slug     : identifiant pour l'URL du fichier (ex. "tournee-2026")
        title    : titre de l'article
        date     : date au format AAAA-MM-JJ (sert au tri et au SEO)
        category : "Tournée", "Coulisses", "Presse", "Distinctions"...
        image    : chemin de l'image principale (assets/images/…)
        alt      : texte alternatif décrivant l'image
        excerpt  : résumé court affiché sur les cartes
   3. Dupliquez le fichier articles/_modele-article.html, renommez-le
      "articles/<slug>.html" et remplacez-y le contenu.
   Aucune autre modification n'est nécessaire : les cartes se génèrent seules
   sur la page d'accueil et sur la page Actualités.
   ========================================================================= */

window.ARTICLES = [
  {
    slug: "premiere-la-residence-landeronde",
    title: "La première représentation du spectacle à Landeronde",
    date: "2026-09-06",
    category: "Tournée",
    image: "assets/images/image15.jpeg",
    alt: "Zoé au clavier et Jean à la basse, sur scène pendant la représentation",
    excerpt:
      "Le vendredi 4 septembre 2026, « Mémoria » a donné sa première représentation publique à la salle André Astoul, à Landeronde, en Vendée."
  },
];

/* -------------------------------------------------------------------------
   Rendu des cartes d'actualités (utilisé par index.html et actualites.html)
   ------------------------------------------------------------------------- */
(function () {
  "use strict";

  var MONTHS = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ];

  function formatDate(iso) {
    var parts = iso.split("-");
    return parseInt(parts[2], 10) + " " + MONTHS[parseInt(parts[1], 10) - 1] + " " + parts[0];
  }

  function articleUrl(article, prefix) {
    return (prefix || "") + "articles/" + article.slug + ".html";
  }

  function cardMarkup(article, prefix, index) {
    var url = articleUrl(article, prefix);
    return (
      '<article class="news-card reveal" style="--reveal-delay:' + (index * 90) + 'ms">' +
        '<a class="news-card__media" href="' + url + '" aria-label="Lire : ' + escapeAttr(article.title) + '">' +
          '<img src="' + (prefix || "") + article.image + '" alt="' + escapeAttr(article.alt) + '" loading="lazy" width="1200" height="800">' +
          '<span class="news-card__cat">' + escapeHtml(article.category) + '</span>' +
        '</a>' +
        '<div class="news-card__body">' +
          '<span class="news-card__date">' + formatDate(article.date) + '</span>' +
          '<h3><a href="' + url + '" style="color:inherit;text-decoration:none">' + escapeHtml(article.title) + '</a></h3>' +
          '<p class="news-card__excerpt">' + escapeHtml(article.excerpt) + '</p>' +
          '<a class="link-more" href="' + url + '">Lire l\'article</a>' +
        '</div>' +
      '</article>'
    );
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function escapeAttr(str) { return escapeHtml(str).replace(/'/g, "&#39;"); }

  function render() {
    var containers = document.querySelectorAll("[data-articles]");
    containers.forEach(function (el) {
      var limit = parseInt(el.getAttribute("data-articles-limit") || "0", 10);
      var prefix = el.getAttribute("data-articles-prefix") || "";
      var list = window.ARTICLES.slice().sort(function (a, b) {
        return a.date < b.date ? 1 : -1;
      });
      if (limit > 0) list = list.slice(0, limit);
      el.innerHTML = list.map(function (a, i) { return cardMarkup(a, prefix, i); }).join("");
    });
    // Prévient main.js que du contenu « reveal » a été injecté
    document.dispatchEvent(new CustomEvent("content:updated"));
  }

  window.ETOILE = window.ETOILE || {};
  window.ETOILE.formatDate = formatDate;

  if (document.readyState !== "loading") render();
  else document.addEventListener("DOMContentLoaded", render);
})();
