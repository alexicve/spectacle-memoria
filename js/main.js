/* =========================================================================
   ÉTOILE FILANTE — Scripts généraux
   En-tête au défilement · menu mobile · apparition au scroll · parallaxe
   ========================================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- 1. En-tête : classe .is-scrolled ---------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- 2. Menu mobile (hamburger) -------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  function closeMenu() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.style.removeProperty("overflow");
  }
  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* --- 3. Lien de navigation actif ----------------------------------- */
  var current = document.body.getAttribute("data-page");
  if (current) {
    document.querySelectorAll(".nav__link").forEach(function (link) {
      if (link.getAttribute("data-nav") === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* --- 4. Apparition progressive au scroll --------------------------- */
  function setupReveal() {
    var items = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });

    items.forEach(function (el) { io.observe(el); });
  }
  setupReveal();
  document.addEventListener("content:updated", setupReveal);

  /* --- 5. Parallaxe légère ----------------------------------------- */
  var parallaxEls = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (parallaxEls.length && !reduceMotion) {
    var ticking = false;
    var apply = function () {
      var vh = window.innerHeight;
      parallaxEls.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        var rect = el.getBoundingClientRect();
        var offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        // on ne pilote qu'une variable CSS pour ne pas écraser un transform existant
        el.style.setProperty("--parallax-y", offset.toFixed(1) + "px");
      });
      ticking = false;
    };
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(apply); ticking = true; }
    }, { passive: true });
    apply();
  }

  /* --- 6. Année du pied de page ----------------------------------- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* --- 7. Animations « boîte à musique » au scroll ----------------- */
  var GLYPHS = ["♪", "♫", "♩", "♬", "♪"]; // ♪ ♫ ♩ ♬ ♪
  var NOTE_COLORS = [
    "var(--violet)", "var(--coral)", "var(--turquoise)", "var(--rose)", "var(--plum)"
  ];

  function buildNoteLayer(section) {
    var count = parseInt(section.getAttribute("data-notes"), 10);
    if (!count || count < 1) count = 6;

    var layer = document.createElement("div");
    layer.className = "note-layer";
    layer.setAttribute("aria-hidden", "true");

    for (var i = 0; i < count; i++) {
      var n = document.createElement("span");
      n.className = "note";
      n.textContent = GLYPHS[i % GLYPHS.length];
      n.style.left = (6 + Math.random() * 88).toFixed(1) + "%";
      n.style.setProperty("--n-size", (1.1 + Math.random() * 1.6).toFixed(2) + "rem");
      n.style.setProperty("--n-color", NOTE_COLORS[i % NOTE_COLORS.length]);
      n.style.setProperty("--n-dur", (7 + Math.random() * 7).toFixed(1) + "s");
      n.style.setProperty("--n-delay", (-Math.random() * 8).toFixed(1) + "s");
      layer.appendChild(n);
    }
    section.insertBefore(layer, section.firstChild);
    return layer;
  }

  var musicSections = [].slice.call(document.querySelectorAll("[data-notes]"));

  if (!reduceMotion && musicSections.length) {
    var layers = musicSections.map(buildNoteLayer);

    if ("IntersectionObserver" in window) {
      var notesIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-playing", entry.isIntersecting);
        });
      }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
      layers.forEach(function (l) { notesIO.observe(l); });
    } else {
      layers.forEach(function (l) { l.classList.add("is-playing"); });
    }
  }

  /* Mini-égaliseurs et portées : lancés quand ils entrent dans le champ */
  function setupPulse(selector, playingClass) {
    var els = [].slice.call(document.querySelectorAll(selector));
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add(playingClass); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle(playingClass, entry.isIntersecting);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  }
  setupPulse(".equalizer", "is-playing");
  setupPulse(".staff", "is-visible");
})();
