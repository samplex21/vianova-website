# Elternverein Vianova – neue Website

Moderne, barrierefreie Neufassung der Website des Elternvereins Vianova (Reutte, Tirol).

## Ziele
- **Barrierefreiheit** nach WCAG 2.1 AA: semantisches HTML, Tastaturbedienung,
  ausreichende Kontraste, sichtbarer Fokus, Sprunglink, reduzierte Bewegung.
- **Modernes, ruhiges Design**, das auf allen Geräten funktioniert.
- **Ohne Build-Tools**: reines HTML/CSS/JS – einfach zu hosten und zu warten.

## Projektstruktur
Jede Design-Variante liegt in einem eigenen Ordner (`v1`, `v2`, …) und ist
über GitHub Pages einzeln erreichbar. Die Datei im Wurzelverzeichnis ist eine
Übersichtsseite, die auf alle Varianten verlinkt.
```
index.html              Übersicht: verlinkt alle Varianten (v1, v2, …)
v1/                     Variante 1 (aktuelle Version)
  index.html            Startseite
  angebote.html …       weitere Seiten
  css/styles.css        Gesamtes Design (Design-Tokens + Komponenten)
  js/main.js            Menü, Schriftgröße, Jahreszahl
  assets/               Logo (SVG)
```

### Neue Variante anlegen
1. Bestehende Variante kopieren: `cp -r v1 v2`
2. In `v2/` Design/Layout anpassen.
3. In der Wurzel-`index.html` einen Link auf `v2/index.html` ergänzen.
4. Live unter `…/vianova-website/v2/`.

## Lokal ansehen
Einfach `index.html` im Browser öffnen – oder einen kleinen Server starten:
```
python -m http.server 8000
```
Dann http://localhost:8000 aufrufen.

## Inhalt
Basiert auf den Inhalten von vianova-austria.at (Stand: Juli 2026).
```
