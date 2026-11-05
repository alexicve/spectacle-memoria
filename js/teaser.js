/* =========================================================================
   MÉMORIA — Lecteur du teaser
   -------------------------------------------------------------------------
   - Lecture automatique (attribut data-teaser-autoplay) : quand la vidéo est
     visible aux 2/3, elle démarre EN MUET (les navigateurs interdisent le son
     sans clic) avec un bouton « Activer le son ». Elle se met en pause quand
     on la fait sortir de l'écran et reprend quand on revient — sauf si le
     visiteur l'a mise en pause lui-même.
     Pas de lecture auto en mode « économie de données » ni pour les visiteurs
     qui demandent moins d'animations (prefers-reduced-motion).
   - Sans lecture auto : rien n'est téléchargé avant le clic (preload="none").
   - Sur petit écran ou en économie de données : version 720p (data-src-sd).
   - Sans JavaScript, la vidéo reste lisible avec les contrôles natifs.
   ========================================================================= */
(function () {
  "use strict";

  var conn = navigator.connection || {};
  var saveData = conn.saveData === true;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var preferSd = window.matchMedia("(max-width: 820px)").matches || saveData;

  document.querySelectorAll("[data-teaser]").forEach(function (box) {
    var video = box.querySelector("video");
    var play = box.querySelector(".teaser__play");
    var unmute = box.querySelector(".teaser__unmute");
    if (!video || !play) return;

    box.classList.add("teaser--js");
    video.removeAttribute("controls");

    if (preferSd && video.getAttribute("data-src-sd")) {
      var source = video.querySelector("source");
      if (source) source.src = video.getAttribute("data-src-sd");
    }

    var autoPausing = false;   // pause déclenchée par le script (sortie d'écran)
    var userStopped = false;   // le visiteur a mis en pause ou la vidéo est finie

    function startWithSound() {
      userStopped = false;
      video.muted = false;
      box.classList.add("is-playing");
      box.classList.remove("is-muted");
      video.setAttribute("controls", "");
      var p = video.play();
      if (p && p.catch) p.catch(function () { /* contrôles natifs disponibles */ });
    }

    function startMuted() {
      video.muted = true;
      video.preload = "auto";
      var p = video.play();
      if (p && p.then) {
        p.then(function () {
          box.classList.add("is-playing", "is-muted");
        }).catch(function () {
          /* lecture auto refusée (ex. mode économie d'énergie) : le bouton reste */
        });
      }
    }

    play.addEventListener("click", function () {
      startWithSound();
      video.focus({ preventScroll: true });
    });

    if (unmute) {
      unmute.addEventListener("click", function () {
        startWithSound();
        video.focus({ preventScroll: true });
      });
    }

    // Clic sur la vidéo pendant l'aperçu muet = activer le son
    video.addEventListener("click", function () {
      if (box.classList.contains("is-muted")) startWithSound();
    });

    video.addEventListener("pause", function () {
      if (!autoPausing && !video.ended) userStopped = true;
      autoPausing = false;
    });
    video.addEventListener("volumechange", function () {
      if (!video.muted) box.classList.remove("is-muted");
    });

    video.addEventListener("ended", function () {
      userStopped = true;
      if (document.fullscreenElement) return;
      box.classList.remove("is-playing", "is-muted");
      video.removeAttribute("controls");
      video.load(); // réaffiche l'affiche
    });

    var wantsAutoplay = box.hasAttribute("data-teaser-autoplay") &&
                        !saveData && !reduceMotion && "IntersectionObserver" in window;
    if (!wantsAutoplay) return;

    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!userStopped && video.paused) {
            if (box.classList.contains("is-playing") && !video.muted) {
              video.play().catch(function () {});
            } else {
              startMuted();
            }
          }
        } else if (!video.paused) {
          autoPausing = true;
          video.pause();
        }
      });
    }, { threshold: 0.66 }).observe(video);
  });
})();
