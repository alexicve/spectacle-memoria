/* =========================================================================
   ÉTOILE FILANTE — Formulaire de contact
   -------------------------------------------------------------------------
   Validation côté client, puis envoi à Formspree (adresse dans l'attribut
   action du <form>, contact.html). Formspree transfère chaque demande
   par e-mail à contact@spectacle-memoria.fr. Le message de confirmation
   ne s'affiche que si Formspree a bien accepté l'envoi.
   ========================================================================= */
(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  var status = form.querySelector(".form__status");

  function setStatus(type, message) {
    if (!status) return;
    status.className = "form__status " + (type === "ok" ? "is-ok" : "is-err");
    status.textContent = message;
    status.setAttribute("role", "status");
  }

  function sendForm(formData) {
    formData.append("_subject", "Site Mémoria : " + (formData.get("sujet") || "nouvelle demande"));
    return fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { Accept: "application/json" }
    }).then(function (res) {
      if (!res.ok) throw new Error("Formspree " + res.status);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("err", "Merci de vérifier les champs surlignés.");
      return;
    }

    var formData = new FormData(form);
    var data = Object.fromEntries(formData.entries());
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.innerHTML : "";
    if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }

    sendForm(formData).then(function () {
      form.reset();
      setStatus(
        "ok",
        "Merci " + (data.prenom || "") + " ! Votre demande a bien été envoyée. " +
        "Nous vous répondons sous 48 h ouvrées."
      );
    }).catch(function () {
      setStatus("err", "Une erreur est survenue. Vous pouvez nous écrire directement à contact@spectacle-memoria.fr");
    }).finally(function () {
      if (btn) { btn.disabled = false; btn.innerHTML = label; }
    });
  });
})();
