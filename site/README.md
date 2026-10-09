# Relaunch-Startseite (Digitale Gewinner)

Quelle der neuen Seiten: `build_site.py` (Copy + Markup), `site.css`, `site.js`, `vendor/` (GSAP, ScrollTrigger, Lenis – lokal).
`bash build.sh` erzeugt daraus `dist/`: `index.html`, `pflege.html`, `handwerk-mitarbeiter.html`, `handwerk-kunden.html`, `analyse.html`.

## Offen / zu bestätigen
- Kalender: Google-Terminlink ist als Button eingebunden (kein Embed möglich). Formular öffnet direkt WhatsApp.
- Aktuelle Anzahl der Google-Rezensionen (aktuell 9 laut bisherigem Schema), Belegbarkeit „200.000 €+“.
- Echte Kundenfälle/-zitate (Case-Template erst einbauen, wenn belegt). Die 90-%-Aussage ist bewusst NICHT verwendet.
- Formular-Versand nutzt Netlify Forms (`form-name=analyse-15`) wie bisher; auf Vercel muss ein Endpoint ergänzt werden.

## Outbound-Seite
`/analyse.html?d=<slug>` lädt `analyse-data/<slug>.json` (Vorlage: `analyse-data/_vorlage.json`, Dateien mit `_` werden nicht veröffentlicht). Beleg-Bilder unter `assets/images/analyse/`. Seite ist `noindex`.

## Stand Release-Vorbereitung
- **Erklärvideo:** nur auf `/pflege` (`assets/video/`). Aussagen im Video noch zu bestätigen: „gehört Ihnen", „Knebelverträge gibt es nicht", „oft nach wenigen Tagen".
- **Partner-Logos:** Offizielle Dateien aus dem Google-Partner- bzw. Meta-Partnerportal als `assets/partners/google-partner.svg|png|webp` und `meta-partner.…` ablegen; ebenso `google.…`/`meta.…` für die Dashboard-Kopfzeilen. Ohne Dateien erscheinen Textmarken („Google Partner", „Meta Business Partner"). Nur offizielle, freigegebene Logos/Badges verwenden.
- **Tracking:** `data-gtm=""` im `<html>`-Tag (`site/build_site.py`, Funktion `head`) mit der Tag-Manager-ID füllen. Erst dann erscheint der Einwilligungs-Banner; das Skript lädt erst nach „Akzeptieren". Datenschutzerklärung vorher anpassen.
- **Kennzahlen/Fall:** Fall „2.000 € / 43 / 3" und Beispielwerte sind gekennzeichnet; Beispieldaten in den Dashboards sind keine Ergebnisse.
- **Preise:** Einführungspaket (4.900 €) in `offer()` mit dem aktuellen Preismodell abgleichen.
- **Build:** `rjsmin` (pip) minimiert `site.js`, falls installiert; CSS wird immer minimiert. Cache-Header in `netlify.toml`.
