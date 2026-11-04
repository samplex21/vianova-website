/* =========================================================
   Vianova – JavaScript
   1) Mobiles Menü (barrierefrei per aria-expanded)
   2) Schriftgröße-Steuerung (A− / A / A+) mit Speicherung
   3) Aktuelle Jahreszahl im Footer
   Alles läuft auch ohne JS: die Seite bleibt nutzbar.
   ========================================================= */
(function () {
  "use strict";

  /* 1) Mobiles Menü ------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("hauptnavigation");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var offen = nav.classList.toggle("is-open");
      // aria-expanded teilt Screenreadern den Zustand mit
      toggle.setAttribute("aria-expanded", String(offen));
    });

    // Menü mit Escape schließen und Fokus zurück zum Button
    nav.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* 2) Schriftgröße-Steuerung --------------------------- */
  var MIN = 100, MAX = 140, SCHRITT = 10, SPEICHER = "vianova-schrift";
  var wurzel = document.documentElement;

  function setzeGroesse(prozent) {
    prozent = Math.min(MAX, Math.max(MIN, prozent));
    wurzel.style.fontSize = prozent + "%";
    try { localStorage.setItem(SPEICHER, String(prozent)); } catch (e) {}
    return prozent;
  }

  // Gespeicherte Größe beim Laden wiederherstellen
  var gespeichert = 100;
  try {
    var wert = parseInt(localStorage.getItem(SPEICHER), 10);
    if (!isNaN(wert)) gespeichert = wert;
  } catch (e) {}
  setzeGroesse(gespeichert);

  document.querySelectorAll(".text-size__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var aktuell = parseInt(wurzel.style.fontSize, 10) || 100;
      var aktion = btn.getAttribute("data-size");
      if (aktion === "increase") setzeGroesse(aktuell + SCHRITT);
      else if (aktion === "decrease") setzeGroesse(aktuell - SCHRITT);
      else setzeGroesse(100);
    });
  });

  /* 3) Jahreszahl im Footer ----------------------------- */
  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = String(new Date().getFullYear());
})();
