/* =========================================================================
   ÉTOILE FILANTE — Galerie & lightbox
   -------------------------------------------------------------------------
   - clic sur une vignette : ouverture d'une grande version
   - navigation précédent / suivant (boutons, flèches clavier, swipe)
   - fermeture par le bouton, la touche Échap ou un clic sur le fond
   - piège à focus + verrouillage du défilement de la page

   POUR CHANGER LES PHOTOS : modifiez les <button class="gallery__item">
   dans galerie.html (attributs data-full et data-caption + <img>).
   ========================================================================= */
(function () {
  "use strict";

  var items = [].slice.call(document.querySelectorAll(".gallery__item"));
  if (!items.length) return;

  function toPhoto(btn) {
    var img = btn.querySelector("img");
    return {
      full: btn.getAttribute("data-full") || (img && img.src),
      alt: (img && img.getAttribute("alt")) || "",
      caption: btn.getAttribute("data-caption") || ""
    };
  }

  /* Si les vignettes sont réparties dans plusieurs onglets/panneaux
     (data-tab-panel), la navigation précédent/suivant reste DANS le
     panneau cliqué. Sinon (pas d'onglets), elle porte sur toute la page. */
  var photos = items.map(toPhoto);
  var current = 0;
  var lastFocused = null;

  /* --- Construction de la lightbox -------------------------------- */
  var box = document.createElement("div");
  box.className = "lightbox";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-modal", "true");
  box.setAttribute("aria-label", "Visionneuse de photos");
  box.hidden = true;
  box.innerHTML =
    '<span class="lightbox__count" data-lb-count></span>' +
    '<button class="lightbox__btn lightbox__btn--close" type="button" aria-label="Fermer">&#10005;</button>' +
    '<button class="lightbox__btn lightbox__btn--prev" type="button" aria-label="Photo précédente">&#8249;</button>' +
    '<button class="lightbox__btn lightbox__btn--next" type="button" aria-label="Photo suivante">&#8250;</button>' +
    '<figure class="lightbox__figure">' +
      '<img class="lightbox__img" data-lb-img alt="">' +
      '<figcaption class="lightbox__caption" data-lb-caption></figcaption>' +
    '</figure>';
  document.body.appendChild(box);

  var lbImg = box.querySelector("[data-lb-img]");
  var lbCaption = box.querySelector("[data-lb-caption]");
  var lbCount = box.querySelector("[data-lb-count]");
  var btnClose = box.querySelector(".lightbox__btn--close");
  var btnPrev = box.querySelector(".lightbox__btn--prev");
  var btnNext = box.querySelector(".lightbox__btn--next");
  var figure = box.querySelector(".lightbox__figure");

  /* --- Ouverture / fermeture ------------------------------------ */
  function open(i, btn) {
    var panel = btn && btn.closest("[data-tab-panel]");
    if (panel) {
      var scoped = [].slice.call(panel.querySelectorAll(".gallery__item"));
      photos = scoped.map(toPhoto);
      current = scoped.indexOf(btn);
    } else {
      photos = items.map(toPhoto);
      current = i;
    }
    lastFocused = document.activeElement;
    box.hidden = false;
    // force le reflow pour jouer la transition
    void box.offsetWidth;
    box.classList.add("is-open");
    document.body.style.overflow = "hidden";
    render();
    btnClose.focus();
    document.addEventListener("keydown", onKey);
  }

  function close() {
    box.classList.remove("is-open");
    document.body.style.removeProperty("overflow");
    document.removeEventListener("keydown", onKey);
    var hide = function () { box.hidden = true; box.removeEventListener("transitionend", hide); };
    box.addEventListener("transitionend", hide);
    // filet de sécurité si transition désactivée
    setTimeout(function () { if (!box.classList.contains("is-open")) box.hidden = true; }, 400);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function go(delta) {
    current = (current + delta + photos.length) % photos.length;
    render();
  }

  function render() {
    var p = photos[current];
    lbImg.src = p.full;
    lbImg.alt = p.alt;
    lbCaption.textContent = p.caption;
    lbCaption.style.display = p.caption ? "" : "none";
    lbCount.textContent = (current + 1) + " / " + photos.length;
  }

  /* --- Événements --------------------------------------------- */
  items.forEach(function (btn, i) {
    btn.addEventListener("click", function () { open(i, btn); });
  });
  btnClose.addEventListener("click", close);
  btnNext.addEventListener("click", function () { go(1); });
  btnPrev.addEventListener("click", function () { go(-1); });
  box.addEventListener("click", function (e) {
    if (e.target === box) close();
  });

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "Tab") {
      // piège à focus simple : garde le focus sur les boutons de la lightbox
      var focusables = [btnClose, btnPrev, btnNext];
      var idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      var dirn = e.shiftKey ? -1 : 1;
      var nextIdx = (idx + dirn + focusables.length) % focusables.length;
      focusables[nextIdx].focus();
    }
  }

  /* --- Swipe tactile ---------------------------------------- */
  var sx = 0, sy = 0, tracking = false;
  figure.addEventListener("touchstart", function (e) {
    if (e.touches.length !== 1) return;
    tracking = true;
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY;
  }, { passive: true });
  figure.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    var dx = e.changedTouches[0].clientX - sx;
    var dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    } else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) {
      close();
    }
  }, { passive: true });
})();
