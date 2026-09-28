/* =========================================================================
   ÉTOILE FILANTE — Carrousel « pages de livre »
   -------------------------------------------------------------------------
   Effet : la page se tourne de la droite vers la gauche, en perspective 3D,
   avec une ombre portée ; l'image suivante se dévoile derrière la page.
   - boutons précédent / suivant
   - pastilles de pagination
   - défilement automatique + pause au survol / focus / onglet caché
   - support du swipe tactile
   - respecte prefers-reduced-motion (simple échange d'image)

   POUR CHANGER LES PHOTOS : modifiez les <li> dans <ul class="book__slides">
   directement dans le fichier HTML (index.html).
   ========================================================================= */
(function () {
  "use strict";

  var root = document.querySelector("[data-book]");
  if (!root) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var AUTOPLAY_MS = 10000;
  var TURN_MS = 1600;

  /* --- Lecture des diapositives depuis le HTML ----------------------- */
  var source = root.querySelector(".book__slides");
  var slides = [].map.call(source ? source.querySelectorAll("li") : [], function (li) {
    var img = li.querySelector("img");
    return {
      src: img ? img.getAttribute("src") : "",
      alt: img ? img.getAttribute("alt") : "",
      caption: li.getAttribute("data-caption") || ""
    };
  });
  if (slides.length < 2) return;
  if (source) source.remove();

  /* --- Construction de la structure --------------------------------- */
  var index = 0;
  var animating = false;
  var timer = null;

  var stage = el("div", "book__stage");
  var base = el("div", "book__base");
  var baseImg = new Image();
  baseImg.decoding = "async";
  base.appendChild(baseImg);

  var flip = el("div", "book__flip");
  var faceFront = el("div", "book__face book__face--front");
  var frontImg = new Image();
  frontImg.decoding = "async";
  faceFront.appendChild(frontImg);

  var faceBack = el("div", "book__face book__face--back");
  var unmirror = el("div", "book__unmirror");
  var backImg = new Image();
  backImg.decoding = "async";
  unmirror.appendChild(backImg);
  faceBack.appendChild(unmirror);

  flip.appendChild(faceFront);
  flip.appendChild(faceBack);
  stage.appendChild(base);
  stage.appendChild(flip);
  root.appendChild(stage);

  var caption = el("p", "book__caption");
  root.appendChild(caption);

  var btnPrev = el("button", "book__btn book__btn--prev");
  btnPrev.type = "button";
  btnPrev.setAttribute("aria-label", "Image précédente");
  btnPrev.innerHTML = "&#8249;";

  var btnNext = el("button", "book__btn book__btn--next");
  btnNext.type = "button";
  btnNext.setAttribute("aria-label", "Image suivante");
  btnNext.innerHTML = "&#8250;";

  root.appendChild(btnPrev);
  root.appendChild(btnNext);

  var dots = el("div", "book__dots");
  dots.setAttribute("role", "tablist");
  dots.setAttribute("aria-label", "Choisir une image");
  var dotEls = slides.map(function (s, i) {
    var d = el("button", "book__dot");
    d.type = "button";
    d.setAttribute("role", "tab");
    d.setAttribute("aria-label", "Image " + (i + 1) + (s.caption ? " : " + s.caption : ""));
    d.addEventListener("click", function () { goTo(i); });
    dots.appendChild(d);
    return d;
  });
  // placées APRÈS le livre (qui a overflow:hidden pour la rotation des pages)
  root.insertAdjacentElement("afterend", dots);

  root.setAttribute("aria-roledescription", "carrousel");
  var liveRegion = el("p", "visually-hidden");
  liveRegion.setAttribute("aria-live", "polite");
  root.appendChild(liveRegion);

  /* --- Rendu de l'état courant ------------------------------------- */
  function paintCurrent() {
    baseImg.src = slides[index].src;
    baseImg.alt = slides[index].alt;
    frontImg.src = slides[index].src;
    frontImg.alt = "";
    flip.classList.remove("is-animating", "is-turning");
    flip.style.transition = "none";
    flip.style.transform = "rotateY(0deg)";
    flip.style.opacity = "1";
    caption.textContent = slides[index].caption;
    dotEls.forEach(function (d, i) {
      d.setAttribute("aria-current", i === index ? "true" : "false");
    });
    liveRegion.textContent =
      "Image " + (index + 1) + " sur " + slides.length +
      (slides[index].caption ? " : " + slides[index].caption : "");
  }

  /* --- Changement de page ---------------------------------------- */
  function goTo(target) {
    if (target === index || animating) return;
    var dir = target > index ? 1 : -1;
    // sens circulaire le plus court si on passe par les extrémités
    if (index === 0 && target === slides.length - 1) dir = -1;
    if (index === slides.length - 1 && target === 0) dir = 1;
    turn(target, dir);
  }
  function next() { turn((index + 1) % slides.length, 1); }
  function prev() { turn((index - 1 + slides.length) % slides.length, -1); }

  function turn(target, dir) {
    if (animating || target === index) return;

    if (reduceMotion) {
      index = target;
      paintCurrent();
      return;
    }

    animating = true;
    var done = function () {
      flip.removeEventListener("transitionend", onEnd);
      clearTimeout(safety);
      index = target;
      paintCurrent();
      animating = false;
    };
    var onEnd = function (e) { if (e.propertyName === "transform") done(); };
    var safety = setTimeout(done, TURN_MS + 250);

    if (dir === 1) {
      /* --- Page qui se tourne vers la gauche (image suivante) --- */
      frontImg.src = slides[index].src;          // recto = page courante
      backImg.src = slides[target].src;          // verso = page suivante
      baseImg.src = slides[target].src;          // dessous = page suivante
      baseImg.alt = slides[target].alt;
      flip.classList.remove("is-animating", "is-turning");
      flip.style.transition = "none";
      flip.style.opacity = "1";
      flip.style.transform = "rotateY(0deg)";
      void flip.offsetWidth;                     // fige l'état de départ
      flip.style.transition = "";               // rend la main à la feuille de style
      flip.classList.add("is-animating", "is-turning");
      flip.addEventListener("transitionend", onEnd);
      requestAnimationFrame(function () {
        flip.style.transform = "rotateY(-180deg)";
      });
    } else {
      /* --- Page qui revient (image précédente) ----------------- */
      flip.classList.remove("is-animating");
      flip.style.transition = "none";
      flip.style.opacity = "1";
      flip.style.transform = "rotateY(-180deg)";
      frontImg.src = slides[target].src;         // recto = page précédente
      backImg.src = slides[index].src;           // verso = page courante (celle qui s'en va)
      baseImg.src = slides[target].src;          // dessous = page précédente
      baseImg.alt = slides[target].alt;
      void flip.offsetWidth;                     // reflow
      flip.style.transition = "";
      flip.classList.add("is-animating", "is-turning");
      flip.addEventListener("transitionend", onEnd);
      requestAnimationFrame(function () {
        flip.style.transform = "rotateY(0deg)";
      });
    }
  }

  /* --- Défilement automatique ----------------------------------- */
  function start() {
    if (reduceMotion) return;
    stop();
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  btnNext.addEventListener("click", function () { next(); start(); });
  btnPrev.addEventListener("click", function () { prev(); start(); });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", function () {
    document.hidden ? stop() : start();
  });

  /* --- Clavier (quand le carrousel a le focus) ------------------ */
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { prev(); start(); }
    else if (e.key === "ArrowRight") { next(); start(); }
  });

  /* --- Swipe tactile ------------------------------------------ */
  var startX = 0, startY = 0, tracking = false;
  root.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    stop();
  }, { passive: true });
  root.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - startX;
    var dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
    start();
  }, { passive: true });

  /* --- Démarrage --------------------------------------------- */
  paintCurrent();
  // précharge les images suivantes
  slides.forEach(function (s) { var i = new Image(); i.src = s.src; });
  start();

  /* --- Utilitaire ------------------------------------------- */
  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }
})();
