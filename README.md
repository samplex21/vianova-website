# Elternverein Vianova – neue Website

Moderne, barrierefreie Neufassung der Website des Elternvereins Vianova (Reutte, Tirol).

## Ziele
- **Barrierefreiheit** nach WCAG 2.1 AA: semantisches HTML, Tastaturbedienung,
  ausreichende Kontraste, sichtbarer Fokus, Sprunglink, reduzierte Bewegung.
- **Modernes, ruhiges Design**, das auf allen Geräten funktioniert.
- **Ohne Build-Tools**: reines HTML/CSS/JS – einfach zu hosten und zu warten.

## Projektstruktur
```
index.html          Startseite
css/styles.css      Gesamtes Design (Design-Tokens + Komponenten)
js/main.js          Menü, Schriftgröße, Jahreszahl
```

## Lokal ansehen
Einfach `index.html` im Browser öffnen – oder einen kleinen Server starten:
```
python -m http.server 8000
```
Dann http://localhost:8000 aufrufen.

## Inhalt
Basiert auf den Inhalten von vianova-austria.at (Stand: Juli 2026).
```
