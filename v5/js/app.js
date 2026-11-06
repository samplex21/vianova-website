/* =========================================================
   Vianova – Variante v5 · JavaScript
   1) Mobiles Menü
   2) Schriftgröße (A− / A / A+)
   3) Kontrast-Themes (Standard / Schwarz-Weiß / Gelb-Blau)
   4) Cookie-Hinweis
   5) Jahreszahl
   6) Wortwolke auf der Startseite
   Alle Einstellungen werden gespeichert und beim Laden wiederhergestellt.
   ========================================================= */
(function () {
  "use strict";
  var wurzel = document.documentElement;
  var wolkeAktualisieren = null;   // wird weiter unten gesetzt (Wortwolke)

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
    if (wolkeAktualisieren) wolkeAktualisieren();
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
    if (wolkeAktualisieren) wolkeAktualisieren();
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

  /* 6) Wortwolke auf der Startseite ---------------------
     Platziert die Begriffe spiralfoermig um die Mitte, einige um 90 Grad
     gedreht - wie eine klassische Wortwolke. Die Anordnung wechselt bei
     jedem Seitenaufruf. Ohne JavaScript bleibt das einfache Flex-Layout.   */
  var wolke = document.querySelector(".wordfield");
  if (wolke && typeof wolke.getBoundingClientRect === "function") {
    var woerter = Array.prototype.slice.call(wolke.querySelectorAll("span"));
    var ABSTAND = 6;        // Luft zwischen zwei Woertern in px
    var DREH_ANTEIL = 0.3;  // Anteil der um 90 Grad gedrehten Woerter
    var letzteBreite = 0;

    // Zufallszahlen mit festem Startwert: beim Neuberechnen (z. B. Fenster
    // verkleinern) bleibt dieselbe Anordnung erhalten, erst beim naechsten
    // Seitenaufruf gibt es ein neues Bild.
    var startwert = Math.floor(Math.random() * 100000);
    function zufall(stand) {
      var x = Math.sin(stand * 12.9898 + startwert) * 43758.5453;
      return x - Math.floor(x);
    }

    function ueberlappt(a, liste) {
      for (var i = 0; i < liste.length; i++) {
        var b = liste[i];
        if (a.x < b.x + b.breite + ABSTAND && a.x + a.breite + ABSTAND > b.x &&
            a.y < b.y + b.hoehe + ABSTAND && a.y + a.hoehe + ABSTAND > b.y) return true;
      }
      return false;
    }

    // Versucht, alle Woerter in ein Rechteck zu packen. Gibt null zurueck,
    // wenn eines keinen Platz findet.
    function packe(kaesten, breite, hoehe, skala, drehen) {
      var gesetzt = [];
      var mx = breite / 2, my = hoehe / 2;
      for (var i = 0; i < kaesten.length; i++) {
        var k = kaesten[i];
        var b = k.breite * skala, h = k.hoehe * skala;
        var gedreht = drehen && zufall(k.nr) < DREH_ANTEIL;
        var bb = gedreht ? h : b, hh = gedreht ? b : h;
        if (bb > breite || hh > hoehe) return null;

        // Archimedische Spirale von der Mitte nach aussen. Der Winkelschritt
        // haengt vom Radius ab, damit der Abstand zweier Proben immer etwa
        // gleich klein bleibt - sonst werden aussen Luecken uebersprungen.
        var platz = null;
        var start = zufall(k.nr + 500) * Math.PI * 2;
        var winkel = start;
        var maxRadius = Math.sqrt(breite * breite + hoehe * hoehe) / 2;
        for (var t = 0; t < 20000; t++) {
          var radius = 1.9 * (winkel - start);
          if (radius > maxRadius) break;
          var x = mx + radius * Math.cos(winkel) - bb / 2;
          var y = my + radius * Math.sin(winkel) * 0.78 - hh / 2;
          winkel += 7 / Math.max(radius, 7);
          if (x < 0 || y < 0 || x + bb > breite || y + hh > hoehe) continue;
          var kandidat = { x: x, y: y, breite: bb, hoehe: hh };
          if (!ueberlappt(kandidat, gesetzt)) { platz = kandidat; break; }
        }
        if (!platz) return null;
        platz.el = k.el;
        platz.gedreht = gedreht;
        platz.rohBreite = b;
        platz.rohHoehe = h;
        gesetzt.push(platz);
      }
      return gesetzt;
    }

    var rechnetGerade = false;
    function baueWolke() {
      if (rechnetGerade) return;
      rechnetGerade = true;
      try { baueWolkeIntern(); } finally { rechnetGerade = false; }
    }

    function baueWolkeIntern() {
      // Messen im normalen Fluss, ohne Skalierung
      wolke.classList.remove("wordfield--gepackt");
      wolke.style.removeProperty("--wolke-skala");
      wolke.style.removeProperty("height");
      woerter.forEach(function (el) {
        el.style.position = ""; el.style.left = ""; el.style.top = "";
        el.style.transform = ""; el.style.whiteSpace = "nowrap";
      });

      var aussen = wolke.getBoundingClientRect();
      var stil = getComputedStyle(wolke);
      var randX = parseFloat(stil.paddingLeft) + parseFloat(stil.paddingRight);
      var randY = parseFloat(stil.paddingTop) + parseFloat(stil.paddingBottom);
      var breite = aussen.width - randX;
      // sofort merken: sonst wuerde ein Fehlschlag den Groessenbeobachter
      // immer wieder neu ausloesen (Dauerschleife)
      letzteBreite = Math.round(aussen.width);
      if (breite <= 0) return;

      var kaesten = woerter.map(function (el, i) {
        var r = el.getBoundingClientRect();
        return { el: el, nr: i + 1, breite: r.width, hoehe: r.height, flaeche: r.width * r.height };
      }).sort(function (a, b) { return b.flaeche - a.flaeche; });

      // Hoehe aus dem Platzbedarf der Woerter ableiten (Zielfuellgrad ca. 42 %).
      // Wichtig fuer die Schriftvergroesserung: die Flaeche waechst mit, statt
      // die Woerter kleiner zu rechnen.
      // In den Kontrast-Themes bleibt alles waagrecht: gedrehter Text ist
      // schwerer zu lesen und diese Ansichten sind fuer Sehbeeintraechtigung.
      var drehen = !wurzel.getAttribute("data-theme");
      var wortFlaeche = kaesten.reduce(function (summe, k) { return summe + k.flaeche; }, 0);
      var zielFuellung = drehen ? 0.42 : 0.32;   // waagrecht braucht mehr Luft
      var grundHoehe = Math.max(breite * 0.62,
                        Math.min(breite * 1.6, wortFlaeche / zielFuellung / breite));

      // Erst mit voller Schrift versuchen; klappt das nicht, mehr Hoehe geben
      // und zuletzt die Schrift leicht verkleinern.
      var ergebnis = null, genutzteSkala = 1, hoehe = grundHoehe;
      for (var runde = 0; runde < 3 && !ergebnis; runde++) {
        hoehe = grundHoehe * (1 + runde * 0.35);
        for (var skala = 1; skala >= 0.5; skala -= 0.07) {
          ergebnis = packe(kaesten, breite, hoehe, skala, drehen);
          if (ergebnis) { genutzteSkala = skala; break; }
        }
      }
      if (!ergebnis) return;  // passt nicht: einfaches Flex-Layout behalten

      wolke.style.setProperty("--wolke-skala", genutzteSkala.toFixed(2));
      wolke.style.height = Math.round(hoehe + randY) + "px";
      wolke.classList.add("wordfield--gepackt");
      ergebnis.forEach(function (p) {
        var mittelX = p.x + p.breite / 2, mittelY = p.y + p.hoehe / 2;
        p.el.style.left = (mittelX - p.rohBreite / 2) + "px";
        p.el.style.top = (mittelY - p.rohHoehe / 2) + "px";
        if (p.gedreht) p.el.style.transform = "rotate(-90deg)";
      });
    }

    wolkeAktualisieren = function () {
      // nach einer Schrift- oder Theme-Umstellung neu rechnen
      letzteBreite = 0;
      baueWolke();
    };

    baueWolke();

    if (typeof ResizeObserver === "function") {
      new ResizeObserver(function (eintraege) {
        var jetzt = Math.round(eintraege[0].contentRect.width);
        // nur bei echter Breitenaenderung neu rechnen; kleine Schwankungen
        // (etwa ein auftauchender Scrollbalken) wuerden sonst aufschaukeln
        if (Math.abs(jetzt - letzteBreite) > 8) baueWolke();
      }).observe(wolke);
    }
  }
})();
