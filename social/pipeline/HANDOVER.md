# Übergabe: Instagram-Content-System @raphael_digitale_gewinner (Stand 21.10.2026)

Zweck dieser Datei: Ein lokaler Claude-Chat (auf Raphaels Rechner, mit Originaldateien in voller Auflösung) soll hier nahtlos weitermachen. Zuerst lesen: diese Datei, `QUALITY.md`, `.claude/skills/skript-playbook/SKILL.md`, `social/skripte/tag02_neu.md`.

## Auftrag und Regeln
- Raphael Hermann, Digitale Gewinner. Zielkunden: PV-Installationsbetriebe in Deutschland, 6 bis 20 Mitarbeiter. Angebot: Website-System für Anfragen und Recruiting (Monteure finden). Ziel: 4 Kurzvideos pro Tag, 10 Tage, 3 Stile (provokant, verständnisvoll, humorvoll), danach Auswertung.
- Raphael filmt, Claude schreibt Skripte, schneidet, gestaltet, postet (nur nach ausdrücklicher Freigabe), wertet aus. Meta-Anzeigen schaltet Raphael selbst, Claude bereitet vor.
- Raphael will kurze Antworten, einfaches Deutsch, kein Fachchinesisch. Credits (Higgsfield) nur nach vorheriger Preisansage ausgeben.
- Keine erfundenen Fakten. Belege nur aus der Faktenliste unten. Kein Preis, keine Garantie, keine Ergebnisversprechen im Video. UWG beachten (nur Orientierung, kein Rechtsrat).
- Kein fremdes Filmmaterial (Hollywood-Szenen) verwenden: Urheberrechtsrisiko. B-Roll nur eigen, KI-erzeugt oder lizenzfrei (Mixkit, Pexels, Pixabay, Coverr, Artgrid mit Lizenz).

## Faktenliste (belegt)
- Bitkom 12.06.2025, Handwerkersuche: 83 % persönliches Gespräch, 26 % Websites, 40 % "ohne Website raus" (Handwerk allgemein).
- Bitkom 28.08.2025: 72 % der Handwerksbetriebe "zu beschäftigt" für Digitalisierung.
- BSW-Solar: Heimsegment bis 30 kWp 2025 etwa minus 25 %; Halbjahr 2026 plus 9 % durch "Sondereffekte". Kabinettsbeschluss 29.07.2026 zur EEG-Novelle ist ein Entwurf, kein Gesetz.
- ZVEH Herbst 2025: 46,5 % der Betriebe (Elektrohandwerk) suchen Personal.
- Beispielrechnung im Rechner-Video: 80 € pro Anfrage, 1 von 10 unterschreibt = 800 € pro Auftrag. Immer als "Beispiel" kennzeichnen.
- Rechner live: digitalegewinner.de/rechner (speichert nichts).
- Auftragswert PV: 10.000 bis 15.000 € (Aussage Raphael). Pro Landkreis nur ein Betrieb (Aussage Raphael).
- Offen [B]: EEG-Status, Garantie-Bedingungen, Kalender-Link in der Bio, Impressum/Datenschutz bei Datenerfassung, rechtliche Prüfung durch Anwalt, Januar-Check (Antworttext in `social/tools/januar-check.md`).

## Was bisher passiert ist
- Gepostet: Video 1 (16.10., "genug Aufträge") und am 20.10. drei Reels (Rechner, Nur noch ein Angebot, Empfehlungen).
- Insights nach etwa 1 Tag: 19 bis 83 Aufrufe, Ø Sehdauer 5 bis 7 s, keine Interaktion. Daraus: kürzer (20 bis 30 s), schärferer Hook, besserer Dreh, Stichwort-CTA, Beweise und Angebot klarer.
- Neuer Dreh (21.10.): `IMG_4019` Empfehlungen, `IMG_4020` Dritter Betrieb (Ende abgeschnitten, CTA bewusst gestrichen, endet bei "...wird nicht verglichen."), `IMG_4021` Google-Check, `IMG_4022` Monteure. Die Dateien kamen über den Chat nur als 464x848 an. Rohschnitt (Pausen gekürzt) liegt als `toolkit/data/keep*.json` und `words*.json` (Whisper) vor.
- Für Schärfe: 1080p HEVC filmen (Einstellungen, Kamera, Formate, Hohe Effizienz), Originale lokal verwenden. Sonst KI-Hochskalierung (Higgsfield `upscale_video`, bytedance, preset ugc, 1080p, 30 fps, ca. 0,2 Credits pro Sekunde; Ergebnis 1080x1970, dann beschneiden).

## Standards (Details in QUALITY.md)
- Skript: Label (Zielgruppe), Hook, Gegenzeile, Schmerz zuerst, Glaubenssatz brechen, belegter Fakt, EIN Stichwort als CTA. 25 bis 30 s, 70 bis 80 Wörter.
- Hook-Look: Label zwischen Linien, Hook in Cormorant Garamond, Gegenzeile in Inter, Sting-Sound bei 0,05 s.
- Look "Atelier": Cormorant Garamond (Display) plus Inter, Markenfarben aus brand.json, dünne Linien, ruhige Bewegung. Referenz-Look von Raphael: Wort-für-Wort-Untertitel (1 bis 3 Wörter), fette Grotesk, emotionale Wörter in Serifen-Kursiv, viel B-Roll unter der Stimme, einheitlich dunkel-warm eingefärbt.
- B-Roll-Plan: Sprecher nur bei Hook und CTA im Bild, dazwischen alle 1,5 bis 3 s passende Szenen. Mixkit-Clips ohne Schlüssel ladbar (`https://assets.mixkit.co/videos/<id>/<id>-1080.mp4`), Beispiele: 46623 Solarfeld Sonnenuntergang, 23694 und 23491 Solarmontage, 23785 Arbeiter zwischen Modulen, 24217 und 39839 Büro nachts, 39854 erschöpft Überstunden, 22977 und 24047 Handschlag, 23962 Suche im Internet. Vorsicht bei Clips mit fremden Markenoberflächen (z. B. Amazon). Einfärben mit `toolkit/scripts/broll_grade.sh`.
- Gebaut (22.10.): B-Roll-Ebene in `Reel3.jsx` (`cfg.broll = [{a, b, src}]`, stumm über dem Sprecher, 4 Frames Überblendung, sanfter Push), Wort-Modus der Untertitel (`cfg.capMode = 'word'`, Schlüsselwörter in Serifen-Kursiv), tolerante Wortsuche in `Configs.jsx` (`f.at`, `f.sentence(n)`), Konfigurationen R4019 bis R4022. Für 4019 sind B-Roll-Szenen eingetragen (Pilot), für 4020 bis 4022 noch keine. Die QA prüft das Label über zwei Goldlinien (brand.json), nicht über Pixelfarben.

## Lokal einrichten
1. Voraussetzungen: Node 20 oder neuer, ffmpeg, Python 3 mit `faster-whisper` und `numpy`.
2. `cd social/pipeline/toolkit && npm install && scripts/fonts.sh`
3. Rohvideo transkribieren: Videos als `v<nr>.mp4` in einen Arbeitsordner, `python3 scripts/tr.py <nr>`; Pausen kürzen: `python3 scripts/cut.py <nr>` (erzeugt `keep<nr>.json` und `cut<nr>.mp4`). Bei 4020 ist das Ende nach "verglichen" fest eingestellt.
4. Grading, Stimme, Wortzeiten: `python3 scripts/prep.py <nr> cut<nr>.mp4 words<nr>.json keep<nr>.json`
5. In `src/Configs.jsx` eine Konfiguration (Hook, Grafiken, Endkarte, Sounds) anlegen und in `src/Root.jsx` registrieren.
6. Rendern und prüfen: `scripts/render.sh R<nr>` (ruft `qa_video.py` auf).
7. Posten nur nach Freigabe von Raphael: Instagram API (graph.instagram.com, `media` mit `REELS`, `video_url`, `cover_url`, `caption`, Status abfragen, dann `media_publish`). Der Token gehört NICHT ins Repo oder in den Chat.

## Start-Prompt für den lokalen Chat
Kopiere das in den neuen Chat:

> Lies `social/pipeline/HANDOVER.md`, `social/pipeline/QUALITY.md`, `.claude/skills/skript-playbook/SKILL.md` und `social/skripte/tag02_neu.md`. Du übernimmst das Instagram-Content-System für @raphael_digitale_gewinner. Ich lege die Originalvideos (1080p oder 4K) in einen Ordner. Schneide sie nach dem Framework, baue das Video mit dem neuen Look (Hook-Standard, Wort-für-Wort-Untertitel, B-Roll von Mixkit, dunkel-warmes Grading), prüfe mit `qa_video.py` und zeig mir das Ergebnis, bevor du irgendetwas postest. Antworte kurz und einfach auf Deutsch. Gib keine Credits aus, ohne vorher den Preis zu nennen.
