/* =========================================================
   Vianova – Variante v5 · JavaScript
   1) Mobiles Menü
   2) Schriftgröße (A− / A / A+)
   3) Kontrast-Themes (Standard / Schwarz-Weiß / Gelb-Blau)
   4) Cookie-Hinweis
   5) Jahreszahl
   6) Stellenanzeige drucken
   Alle Einstellungen werden gespeichert und beim Laden wiederhergestellt.
   ========================================================= */
(function () {
  "use strict";
  var wurzel = document.documentElement;

  /* 1) Mobiles Menü ------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("hauptnavigation");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var offen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(offen));
    });
    nav.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* 2) Schriftgröße ------------------------------------- */
  var MIN = 100, MAX = 150, SCHRITT = 10, KEY_SIZE = "vianova-v5-schrift";
  function setzeGroesse(p) {
    p = Math.min(MAX, Math.max(MIN, p));
    wurzel.style.fontSize = p + "%";
    try { localStorage.setItem(KEY_SIZE, String(p)); } catch (e) {}
  }
  var savedSize = 100;
  try { var s = parseInt(localStorage.getItem(KEY_SIZE), 10); if (!isNaN(s)) savedSize = s; } catch (e) {}
  setzeGroesse(savedSize);
  document.querySelectorAll("[data-size]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var cur = parseInt(wurzel.style.fontSize, 10) || 100;
      var a = btn.getAttribute("data-size");
      if (a === "increase") setzeGroesse(cur + SCHRITT);
      else if (a === "decrease") setzeGroesse(cur - SCHRITT);
      else setzeGroesse(100);
    });
  });

  /* 3) Kontrast-Themes ---------------------------------- */
  var KEY_THEME = "vianova-v5-theme";
  var themeBtns = document.querySelectorAll("[data-theme-set]");
  function setzeTheme(name) {
    if (name && name !== "standard") wurzel.setAttribute("data-theme", name);
    else wurzel.removeAttribute("data-theme");
    try { localStorage.setItem(KEY_THEME, name || "standard"); } catch (e) {}
    themeBtns.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-theme-set") === (name || "standard")));
    });
  }
  var savedTheme = "standard";
  try { savedTheme = localStorage.getItem(KEY_THEME) || "standard"; } catch (e) {}
  setzeTheme(savedTheme);
  themeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () { setzeTheme(btn.getAttribute("data-theme-set")); });
  });

  /* 4) Cookie-Hinweis ----------------------------------- */
  var KEY_COOKIE = "vianova-v5-cookie";
  var banner = document.getElementById("cookie-hinweis");
  if (banner) {
    var gewaehlt = null;
    try { gewaehlt = localStorage.getItem(KEY_COOKIE); } catch (e) {}
    if (!gewaehlt) banner.hidden = false;
    banner.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        try { localStorage.setItem(KEY_COOKIE, btn.getAttribute("data-cookie")); } catch (e) {}
        banner.hidden = true;
      });
    });
  }

  /* 5) Jahreszahl --------------------------------------- */
  var jahr = document.getElementById("jahr");
  if (jahr) jahr.textContent = String(new Date().getFullYear());

  /* 6) Stellenanzeige drucken ---------------------------
     Die Knoepfe werden hier erzeugt, nicht im HTML hinterlegt: eine neue
     Stellenanzeige bekommt ihren Knopf dadurch von selbst, eine geloeschte
     nimmt ihn mit. Am Druckvorgang muss nie etwas nachgezogen werden.      */
  var anzeigen = document.querySelectorAll(".job:not(.job--initiativ)");
  if (anzeigen.length && typeof window.print === "function") {

    // Fusszeile nur fuer den Ausdruck: Absender und Datum des Ausdrucks
    var fuss = document.createElement("div");
    fuss.className = "druck-fuss";
    var heute = new Date().toLocaleDateString("de-AT", {
      day: "numeric", month: "long", year: "numeric"
    });
    fuss.innerHTML =
      "<p>Elternverein Vianova · Planseestraße 13, 6600 Reutte, Österreich · " +
      "Tel. +43 5672 62486 · office@vianova-austria.at</p>" +
      "<p>Ausdruck vom " + heute + " · vianova-austria.at</p>";
    document.body.appendChild(fuss);

    anzeigen.forEach(function (anzeige) {
      var knopf = document.createElement("button");
      knopf.type = "button";
      knopf.className = "btn btn--primary job__drucken";
      knopf.textContent = "Drucken";

      var titel = anzeige.querySelector(".job__title");
      if (titel) {
        knopf.setAttribute("aria-label", "Stellenanzeige „" + titel.textContent + "“ drucken");
      }

      knopf.addEventListener("click", function () {
        document.querySelectorAll(".job").forEach(function (j) {
          j.classList.remove("wird-gedruckt");
        });
        anzeige.classList.add("wird-gedruckt");
        wurzel.classList.add("druckt-einzelne-anzeige");
        window.print();
      });

      var leiste = anzeige.querySelector(".job__apply");
      (leiste || anzeige).appendChild(knopf);
    });

    // nach dem Druckdialog wieder aufraeumen
    window.addEventListener("afterprint", function () {
      wurzel.classList.remove("druckt-einzelne-anzeige");
      document.querySelectorAll(".job").forEach(function (j) {
        j.classList.remove("wird-gedruckt");
      });
    });
  }

})();
