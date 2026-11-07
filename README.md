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

## Mitarbeiterfotos (Seite „Das sind wir")

Auf der Seite `v5/das-sind-wir.html` gibt es unten die Variante **„Unser Team –
Variante mit Porträts"**. Dort steht neben jedem Namen ein rundes Bild.

**Wo die Bilder liegen**

```
v5/assets/team/           echte Fotos, eines je Person (z. B. ruth-vogler.jpg)
v5/assets/platzhalter/    gezeichnete Platzhalter, solange kein Foto da ist
quellbilder/              unzugeschnittene Originale (z. B. teamcollage.jpg)
```

**Ein neues Foto einbauen – zwei Schritte**

1. **Bild zuschneiden und ablegen.** Quadratisch, Gesicht mittig, Kopf etwa
   drei Viertel der Höhe. Als JPEG mit **144 × 144 Pixel** speichern – das ist
   doppelt so groß wie die Anzeige (72 px) und damit auch auf scharfen
   Bildschirmen sauber. Dateiname klein geschrieben, ohne Umlaute:
   `vorname-nachname.jpg`, abgelegt in `v5/assets/team/`.
2. **In der Seite eintragen.** In `v5/das-sind-wir.html` die betreffende Zeile
   suchen und den Platzhalter ersetzen:

   ```html
   <!-- vorher -->
   <img class="portraet" src="assets/platzhalter/portraet-1.svg" alt="" width="72" height="72">
   <!-- nachher -->
   <img class="portraet" src="assets/team/ruth-vogler.jpg"
        alt="Ruth Vogler, Geschäftsführung von Vianova" width="72" height="72">
   ```

   Bei den kleineren Listen (Prozessbegleitung, Verwaltung) heißt die Klasse
   `portraet portraet--klein` und `width`/`height` sind `48` – dieselbe
   Bilddatei passt trotzdem, sie wird nur kleiner dargestellt.

**Worauf zu achten ist**

- `alt` beschreibt kurz, wer zu sehen ist (Name und Funktion). Screenreader
  lesen das vor.
- `width` und `height` nicht weglassen: ohne sie springt das Layout beim Laden.
- Das Bild wird per CSS rund beschnitten (`border-radius: 50%`) und mittig
  gefüllt (`object-fit: cover`). Ein nicht ganz quadratisches Bild wird dabei
  an den Rändern beschnitten – deshalb lieber vorher quadratisch zuschneiden.
- Im Schwarz-Weiß-Modus der Seite werden die Fotos automatisch entsättigt.
- Den Hinweistext über den Kacheln anpassen, sobald sich das Verhältnis von
  echten Fotos zu Platzhaltern ändert.

**Aktueller Stand der Fotos**

Neun der vierzehn Personen haben ein echtes Foto, alle aus der Teamcollage
geschnitten. Noch ohne Foto (gezeichneter Platzhalter):

| Person | Bereich |
| --- | --- |
| Stefanie Brummer, MA | Prozessbegleitung |
| Denise Burkert, MA | Prozessbegleitung |
| Andreas Königsrainer, BA | Prozessbegleitung |
| Claudia Hohenrainer | Verwaltung |
| Stephan Mayr | Verwaltung |

Umgekehrt zeigt die Collage zwei Personen, die auf der Seite nicht (mehr)
genannt sind: **Angela Woldrich** und **Eveline Wolf**. Die Collage ist also
älter als die Namensliste – beides sollte einmal abgeglichen werden.

**Zur Teamcollage in `quellbilder/`**

Alle Fotos stammen aus einem einzigen Bild (`quellbilder/teamcollage.jpg`,
768 × 267 px) mit zwölf schräg angeschnittenen Streifen. Daraus geschnittene
Porträts sind nur rund 66 Pixel breit – für die runden Kacheln reicht das,
für größere Darstellungen nicht. Für künftige Fotos sind Einzelaufnahmen in
höherer Auflösung besser.

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
