/* =========================================================================
   ÉTOILE FILANTE — Formulaire de contact
   -------------------------------------------------------------------------
   Validation côté client + message de confirmation.
   Aucun serveur n'est appelé : pour recevoir réellement les demandes,
   remplacez le corps de la fonction sendForm() par un appel à votre
   service (Formspree, Netlify Forms, EmailJS, votre API, etc.)
   ou renseignez l'attribut action / method du <form> dans contact.html.
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

  function sendForm(data) {
    // --- Simulation d'envoi (à remplacer par un vrai service) ---
    return new Promise(function (resolve) {
      setTimeout(resolve, 700);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("err", "Merci de vérifier les champs surlignés.");
      return;
    }

    var data = Object.fromEntries(new FormData(form).entries());
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = "Envoi en cours…"; }

    sendForm(data).then(function () {
      form.reset();
      setStatus(
        "ok",
        "Merci " + (data.prenom || "") + " ! Votre demande a bien été envoyée. " +
        "Nous vous répondons sous 48 h ouvrées."
      );
    }).catch(function () {
      setStatus("err", "Une erreur est survenue. Vous pouvez nous écrire directement à spectacle.memoria@gmail.com");
    }).finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = label; }
    });
  });
})();
