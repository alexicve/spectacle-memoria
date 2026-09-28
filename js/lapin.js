/* =========================================================================
   LAPIN QUI SORT LA TÊTE À DROITE (avec rebond)
   -------------------------------------------------------------------------
   Ajoute la classe `.lapin-peek--go` sur <img class="lapin-peek" data-lapin>
   (fin de <body>) : la tête entre dans le cadre avec un rebond puis se cale
   sur le bord droit. Voir css/style.css §18 pour les réglages.

   Attributs data- acceptés sur l'élément :
     data-lapin-trigger      "load" (défaut) | "scroll" | "hover"
     data-lapin-watch        sélecteur observé en mode "scroll" (sinon : 1er scroll)
     data-lapin-hover-target sélecteur de la zone survolée en mode "hover" (défaut ".hero")

   API : window.lapinPeek()  → rejoue le rebond d'entrée à la demande.
   ========================================================================= */
(function () {
  "use strict";

  var el = document.querySelector("[data-lapin]");
  if (!el) return;

  /* prefers-reduced-motion : le CSS affiche déjà la tête, immobile → on n'anime pas. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var trigger = (el.getAttribute("data-lapin-trigger") || "load").toLowerCase();

  function play() {
    el.classList.remove("lapin-peek--go");
    void el.offsetWidth;                 // reflow : autorise un redémarrage propre
    el.classList.add("lapin-peek--go");
  }
  window.lapinPeek = play;

  /* ----- Déclencheurs -------------------------------------------------- */
  if (trigger === "hover") {
    var hoverSel = el.getAttribute("data-lapin-hover-target") || ".hero";
    var zone = document.querySelector(hoverSel) || document.body;
    var busy = false;
    zone.addEventListener("mouseenter", function () {
      if (busy) return;
      busy = true;
      play();
      window.setTimeout(function () { busy = false; }, 700);
    });
    return;
  }

  if (trigger === "scroll") {
    /* Cible observée : l'élément indiqué par data-lapin-watch, sinon la section
       parente du lapin (il n'apparaît donc que quand cette section est visible). */
    var watchSel = el.getAttribute("data-lapin-watch");
    var target = (watchSel && document.querySelector(watchSel))
              || el.closest("section")
              || el;

    if (!("IntersectionObserver" in window)) { play(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        io.disconnect();
        play();
      });
    }, { threshold: 0.25 });
    io.observe(target);
    return;
  }

  /* trigger === "load" (défaut) */
  if (document.readyState === "complete") {
    window.setTimeout(play, 150);
  } else {
    window.addEventListener("load", function () { window.setTimeout(play, 150); });
  }
})();
