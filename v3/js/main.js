/* =========================================================
   Vianova – Variante v2 · JavaScript
   1) Mobiles Menü (aria-expanded)
   2) Aktive Bereichsmarkierung beim Scrollen (IntersectionObserver)
   3) Schriftgröße-Steuerung (A− / A / A+) mit Speicherung
   4) Jahreszahl
   Läuft auch ohne JS: alle Anker-Links funktionieren regulär.
   ========================================================= */
(function () {
  "use strict";

  /* 1) Mobiles Menü ------------------------------------- */
  var toggle = document.querySelector(".topbar__toggle");
  var mobilenav = document.getElementById("mobilenav");
  if (toggle && mobilenav) {
    toggle.addEventListener("click", function () {
      var offen = mobilenav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(offen));
    });
    // Nach Klick auf einen Link schließen
    mobilenav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mobilenav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2) Aktive Bereichsmarkierung ------------------------ */
  var sidenavLinks = Array.prototype.slice.call(document.querySelectorAll(".sidenav a"));
  var byHash = {};
  sidenavLinks.forEach(function (a) { byHash[a.getAttribute("href")] = a; });

  var sektionen = document.querySelectorAll("main .section");
  if ("IntersectionObserver" in window && sektionen.length) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (e.isIntersecting) {
          var link = byHash["#" + e.target.id];
          if (!link) return;
          sidenavLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sektionen.forEach(function (s) { beobachter.observe(s); });
  }

  /* 3) Schriftgröße-Steuerung --------------------------- */
  var MIN = 100, MAX = 140, SCHRITT = 10, SPEICHER = "vianova-v3-schrift";
  var wurzel = document.documentElement;

  function setzeGroesse(prozent) {
    prozent = Math.min(MAX, Math.max(MIN, prozent));
    wurzel.style.fontSize = prozent + "%";
    try { localStorage.setItem(SPEICHER, String(prozent)); } catch (e) {}
  }
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

  /* 4) Jahreszahl --------------------------------------- */
  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = String(new Date().getFullYear());
})();
