<?php
/* =========================================================
   Vianova - Kontaktformular
   Nimmt das Formular von kontakt.html entgegen und schickt die
   Nachricht an das Vereinsbuero.

   WICHTIG: Diese Datei braucht einen Webspace mit PHP und
   funktionierendem Mailversand. Auf GitHub Pages laeuft sie NICHT -
   dort wird PHP nicht ausgefuehrt, die Datei wuerde als Text
   heruntergeladen.

   Es werden keine Daten gespeichert (nur weitergeleitet).
   ========================================================= */

declare(strict_types=1);

const EMPFAENGER   = 'office@vianova-austria.at';
const ABSENDER     = 'office@vianova-austria.at';  // muss zur eigenen Domain gehoeren
const ZURUECK_SEITE = 'kontakt.html';

/* ---- Hilfsfunktionen ---------------------------------- */

/** Entfernt Zeilenumbrueche: sonst koennten Angreifer eigene
 *  Mail-Kopfzeilen einschleusen (Header-Injection). */
function saubereZeile(string $wert): string {
    return trim(str_replace(["\r", "\n", "%0a", "%0d"], ' ', $wert));
}

/** Leitet zurueck zur Kontaktseite und beendet das Skript.
 *  Es werden nur Statuswerte uebergeben, keine Eingabedaten. */
function zurueck(string $status): void {
    header('Location: ' . ZURUECK_SEITE . '?status=' . $status . '#formular-titel', true, 303);
    exit;
}

function feld(string $name): string {
    return isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
}

/* ---- Nur abgeschickte Formulare annehmen --------------- */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    zurueck('fehler');
}

/* ---- Spamschutz ---------------------------------------- */

// Unsichtbares Feld: Menschen fuellen es nie aus, viele Bots schon.
if (saubereZeile(feld('webseite')) !== '') {
    zurueck('ok');          // Bots eine Erfolgsmeldung zeigen, nichts senden
}

/* ---- Eingaben pruefen ---------------------------------- */

$name      = saubereZeile(feld('name'));
$email     = saubereZeile(feld('email'));
$telefon   = saubereZeile(feld('telefon'));
$nachricht = trim(feld('nachricht'));   // hier sind Zeilenumbrueche erwuenscht

$fehler = false;
if ($name === '' || mb_strlen($name) > 120)              $fehler = true;
if (!filter_var($email, FILTER_VALIDATE_EMAIL))          $fehler = true;
if (mb_strlen($email) > 160)                             $fehler = true;
if ($nachricht === '' || mb_strlen($nachricht) > 5000)   $fehler = true;
if (mb_strlen($telefon) > 60)                            $fehler = true;

if ($fehler) {
    zurueck('fehler');
}

/* ---- Nachricht zusammenstellen ------------------------- */

$betreff = 'Nachricht über das Kontaktformular';

$text = "Über das Kontaktformular auf vianova-austria.at:\n\n"
      . "Name:      $name\n"
      . "E-Mail:    $email\n"
      . "Telefon:   " . ($telefon !== '' ? $telefon : '(nicht angegeben)') . "\n"
      . "Gesendet:  " . date('d.m.Y, H:i') . " Uhr\n"
      . "\n----------------------------------------\n\n"
      . $nachricht . "\n";

$kopfzeilen = [
    'From: Vianova Kontaktformular <' . ABSENDER . '>',
    'Reply-To: ' . mb_encode_mimeheader($name, 'UTF-8') . ' <' . $email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'MIME-Version: 1.0',
    'X-Mailer: PHP/' . phpversion(),
];

$erfolg = @mail(
    EMPFAENGER,
    mb_encode_mimeheader($betreff, 'UTF-8'),
    $text,
    implode("\r\n", $kopfzeilen),
    '-f' . ABSENDER          // Ruecklaeufer gehen ans Buero
);

zurueck($erfolg ? 'ok' : 'fehler');
