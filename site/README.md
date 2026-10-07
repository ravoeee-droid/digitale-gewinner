# Relaunch-Startseite (Digitale Gewinner)

Quelle der neuen Seiten: `build_site.py` (Copy + Markup), `site.css`, `site.js`, `vendor/` (GSAP, ScrollTrigger, Lenis – lokal).
`bash build.sh` erzeugt daraus `dist/`: `index.html`, `pflege.html`, `handwerk-mitarbeiter.html`, `handwerk-kunden.html`, `analyse.html`.

## Offen / zu bestätigen
- **Kalender-Link:** `CAL_URL` oben in `site.js` setzen (Cal.com/Calendly-Embed). Leer = Terminwunsch per WhatsApp nach dem Kurzformular.
- Aktuelle Anzahl der Google-Rezensionen (aktuell 9 laut bisherigem Schema), Belegbarkeit „200.000 €+“.
- Echte Kundenfälle/-zitate (Case-Template erst einbauen, wenn belegt). Die 90-%-Aussage ist bewusst NICHT verwendet.
- Formular-Versand nutzt Netlify Forms (`form-name=analyse-15`) wie bisher; auf Vercel muss ein Endpoint ergänzt werden.

## Outbound-Seite
`/analyse.html?d=<slug>` lädt `analyse-data/<slug>.json` (Vorlage: `analyse-data/_vorlage.json`, Dateien mit `_` werden nicht veröffentlicht). Beleg-Bilder unter `assets/images/analyse/`. Seite ist `noindex`.
