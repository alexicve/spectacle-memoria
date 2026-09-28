/* =========================================================================
   ONGLETS DE LA GALERIE
   -------------------------------------------------------------------------
   Bascule entre les panneaux `[data-tab-panel]` au clic sur les boutons
   `.tabs__btn[data-tab]` (et avec les flèches gauche/droite au clavier,
   comme le veut le pattern ARIA "tabs").

   POUR AJOUTER UN ONGLET : ajoutez un bouton .tabs__btn (role="tab",
   data-tab="mon-onglet") et un panneau portant data-tab-panel="mon-onglet".
   ========================================================================= */
(function () {
  "use strict";

  var tabsGroups = [].slice.call(document.querySelectorAll(".tabs"));
  if (!tabsGroups.length) return;

  tabsGroups.forEach(function (group) {
    var btns = [].slice.call(group.querySelectorAll(".tabs__btn"));
    if (!btns.length) return;

    function activate(btn, focus) {
      var target = btn.getAttribute("data-tab");
      btns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.tabIndex = on ? 0 : -1;
      });
      document.querySelectorAll("[data-tab-panel]").forEach(function (panel) {
        panel.hidden = panel.getAttribute("data-tab-panel") !== target;
      });
      if (focus) btn.focus();
      // Prévient les autres scripts (lightbox…) qu'un panneau a changé.
      document.dispatchEvent(new CustomEvent("tabs:changed", { detail: { tab: target } }));
    }

    btns.forEach(function (btn, i) {
      btn.addEventListener("click", function () { activate(btn, false); });
      btn.addEventListener("keydown", function (e) {
        var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        var next = btns[(i + dir + btns.length) % btns.length];
        activate(next, true);
      });
    });
  });
})();
