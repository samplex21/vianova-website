/* =========================================================
   Vianova – Variante v4 · JavaScript
   1) Mobiles Menü
   2) Schriftgröße (A− / A / A+)
   3) Kontrast-Themes (Standard / Schwarz-Weiß / Gelb-Blau)
   4) Cookie-Hinweis
   5) Jahreszahl
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
  var MIN = 100, MAX = 150, SCHRITT = 10, KEY_SIZE = "vianova-v4-schrift";
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
  var KEY_THEME = "vianova-v4-theme";
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
  var KEY_COOKIE = "vianova-v4-cookie";
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
})();
