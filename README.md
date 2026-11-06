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
python3 -m http.server 8000
```
Dann http://localhost:8000 aufrufen.

## Kontaktformular (Seite „Kontakt")

Das Formular sendet an **`kontakt-senden.php`**. Diese Datei schickt die
Nachricht an `office@vianova-austria.at` und speichert nichts.

> **Wichtig: Auf GitHub Pages funktioniert das Formular nicht.**
> GitHub Pages liefert nur fertige Dateien aus und führt kein PHP aus.
> Wer dort auf „Nachricht senden" klickt, lädt die PHP-Datei als Text
> herunter, statt eine Mail zu verschicken. Bis zum Umzug auf einen
> richtigen Webspace bleibt der direkte Weg per Telefon und E-Mail,
> der oben auf der Kontaktseite steht.

### Beim Umzug auf einen Webspace mit PHP

1. **`kontakt-senden.php` muss im selben Ordner liegen wie `kontakt.html`.**
2. **Testnachricht abschicken** und prüfen, ob sie ankommt – auch im
   Spam-Ordner nachsehen.
3. **Kommt nichts an?** Beim Hoster nachfragen, ob der PHP-Mailversand
   (`mail()`) erlaubt ist. Manche Anbieter verlangen stattdessen den
   Versand über SMTP mit Zugangsdaten – dann muss das Skript umgebaut
   werden.

Die Empfängeradresse steht oben in `kontakt-senden.php` bei `EMPFAENGER`.
Die Absenderadresse (`ABSENDER`) muss zur eigenen Domain gehören – trüge man
dort die Adresse des Besuchers ein, würden viele Mailserver die Nachricht als
Fälschung einstufen und verwerfen. Die Besucheradresse steht deshalb als
„Antwort an" in der Mail: Ein Klick auf „Antworten" geht direkt an die Person.

### Schutz vor Missbrauch
Im Formular steckt ein unsichtbares Zusatzfeld. Menschen sehen es nicht,
viele Spam-Programme füllen es aus – in dem Fall wird nichts versendet.
Außerdem prüft das Skript alle Eingaben noch einmal selbst und entfernt
Zeilenumbrüche aus Name und E-Mail. Ohne das könnte jemand über ein
Formularfeld zusätzliche Empfänger einschleusen und den Server zum
Spamversand missbrauchen.

## Inhalt
Basiert auf den Inhalten von vianova-austria.at (Stand: Juli 2026).
