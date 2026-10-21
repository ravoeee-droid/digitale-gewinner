# Video-Framework: so wird jedes Video sauber

Reihenfolge ist fest. Kein Schritt wird übersprungen. Erst wenn `qa_video.py` "BESTANDEN" meldet und ich die Standbilder geprüft habe, geht das Video an Raphael.

## 1. Rohmaterial
- Original in voller Auflösung (Dateien-App/AirDrop, 4K 30 fps, HDR aus, "Kompatibelste"). Instagram/WhatsApp-Uploads sind nur 464x848 und werden unscharf.
- Ist nur die kleine Fassung da: KI-Hochskalierung (Higgsfield, bytedance, ugc, 1080p, 30 fps), vorher Kosten ankündigen.

## 2. Schnitt (Reihenfolge wichtig, sonst muss neu hochskaliert werden)
- Erst schneiden, dann hochskalieren, dann gestalten.
- Pausen nur KÜRZEN, nicht entfernen: Pausen über 0,4 s auf ca. 0,28 s. Kurze Pausen bleiben. Satzende-Pausen nie unter 0,25 s. Sonst klingt es gehetzt.
- Schnittpunkte per Stille-Erkennung (silencedetect), nicht per Whisper-Zeiten.
- Zielwerte: Redeanteil 80 bis 88 Prozent der Laufzeit.

## 3. Bild
- Zuschneiden (crop), nie strecken.
- Gesichtshelligkeit (Y) im fertigen Video: 105 bis 125. Über 125 = überbelichtet.
- Spitzen (YMAX) dürfen im Gesicht nicht auf 255 kleben.
- Schärfen mild nach dem Hochskalieren (cas 0,35, unsharp 0,4).

## 4. Ton
- Stimme: Hochpass, Entrauschen, EQ, De-Esser, Kompressor.
- Lautheit -14 LUFS, True Peak max -1,5 dB.
- Soundeffekte deutlich leiser als die Stimme.

## 5. Gestaltung
- Untertitel max. 4 Wörter, Schlüsselwort Gold, kein Zoom.
- Zahlen und Quellen nur aus dem Facts Ledger. Alles Unbelegte raus.

## 6. Automatische Prüfung
`python3 qa_video.py video.mp4 --hook --words src/v40xx.json` prüft: 1080x1920, 30 fps, Länge (8 bis 60 s, Ziel 20 bis 35), Hauthelligkeit (nur Hautpixel, nicht die Wand), Schärfe, Lautheit, Zielgruppen-Label und Hook in den ersten 3 s, Untertitel-Timing gegen das Audio (Median-Versatz unter 0,25 s). Bei Fehlern: nicht ausliefern, Ursache beheben, neu rendern. Getestet mit Positiv- und Negativfall (Videos 1 bis 4 fallen beim Label-Test erwartungsgemäß durch, sie sind vor dem Hook-Standard entstanden).

## 7. Sichtprüfung (immer)
- 6 Standbilder gleichmäßig verteilt ansehen: Helligkeit, Schärfe, Untertitel nicht abgeschnitten, nichts über dem Gesicht.
- Untertitel-Timing: gerendertes Audio erneut transkribieren, Versatz im Median unter 0,2 s.
- Erste und letzte Sekunde ansehen (Hook, CTA).

## 8. Freigabe
- Raphael sieht das Video und gibt es frei. Erst dann Posting (Cover, Caption, Zeitslot).
- Nach 40 Videos: Auswertung mit Instagram-Insights.

## 9. Dreh-Standard (Raphael)
- Kamera auf Augenhöhe oder minimal darüber, Handy gerade, Kopf neutral. Nie von oben herab, nicht zurückgelehnt.
- Licht: weich von vorne schräg auf Gesichtshöhe (Fenster seitlich vor ihm oder große Lichtfläche). Nicht von hinten oder oben.
- Hintergrund: ruhig mit Tiefe, 1,5 bis 2 m Abstand zur Wand, warme Lichtquelle weit hinten, nichts Weißes direkt hinter dem Kopf.
- Ton: Ansteckmikro, Fenster zu, Geräte aus.
- Sitzen, aufrecht, Blick in die Linse, kurze Sätze, jeden Satz zweimal sprechen.
- Datei: Original 4K, 30 fps, HDR aus, per AirDrop oder Dateien-App (nicht Messenger).

## 10. Retention-Standard (ab Tag 2)
- Schärfste Aussage im ersten Satz, keine Einleitung. Hook-Text in den ersten 3 s.
- Länge 20 bis 30 s (Wortzahl laut Playbook halbieren), länger nur mit Grund.
- Bildwechsel (Zoom, Einblendung, Zahl) etwa alle 0,5 bis 1 s.
- Messung nach jedem Post: Sehdauer, Aussteiger-Sekunde, Vergleich mit dem Video davor. Ziel: Sehdauer steigt von Video zu Video.

Stand 21.10.2026: Videos 1 bis 4 hatten 19 bis 83 Aufrufe, Ø Sehdauer 5 bis 7 s, keine Interaktion. Daraus abgeleitet: kürzer, schärferer Hook, besserer Dreh.

## 11. Hook-Standard (Raphael, 21.10.2026)
Die ersten 3 Sekunden bestehen immer aus drei Teilen plus Klang:
1. **Zielgruppe sofort:** Goldlabel oben, z. B. „PV-Unternehmer" oder „Photovoltaik-Betrieb". Wer nicht gemeint ist, scrollt weiter. Wer gemeint ist, bleibt.
2. **Hook:** größte Zeile, die schärfste Aussage oder Frage.
3. **Gegenzeile:** kleinere Zeile in Gold-Kursiv, die den Hook zuspitzt und Kontroverse erzeugt (z. B. „Dann bist du abhängig vom Zufall."). Sie muss belegbar oder klar als Meinung erkennbar sein.
4. **Sound:** `sting.wav` (aufsteigender Dur-Akkord mit weichem Tiefton) bei 0,05 s. Positiv und neugierig machend, nicht warnend. Lautstärke 0,22, deutlich unter der Stimme.
Im Code: `hook: {tag, lines, sub, until}` in `Configs.jsx`, Darstellung in `Reel3.jsx`.

## 12. Skript-Standard (Raphael: "viel besser", 21.10.2026)
Aufbau jedes Skripts, in dieser Reihenfolge:
1. **Label** (Zielgruppe, z. B. PV-Unternehmer), **Hook**, **Gegenzeile** (siehe Abschnitt 11).
2. **Schmerz zuerst:** Der Zuschauer muss sich brutal verstanden fühlen, bevor er etwas lernt. Gefühl vor Zahl. Konkrete Situation aus seinem Alltag (Kunden absagen, abends im Büro, der dritte Betrieb am Telefon).
3. **Anerkennen, dann brechen:** Erst würdigen, was er richtig macht ("du bist zu Recht stolz"), dann den Glaubenssatz radikal brechen ("das ist keine Strategie, das ist Hoffnung").
4. **Autorität:** ein belegter Fakt mit Quelle, Hinweis wenn "Handwerk allgemein". Keine erfundenen Zahlen. Meinung und Erfahrung nie als Studie sprechen.
5. **CTA mit EINEM Stichwort** (z. B. EMPFEHLUNG, MONTEUR, DRITTER, GOOGLE), sofort danach ein Versprechen, was er bekommt. Nie eine Frage, die er in den Kommentaren beantworten soll (niemand tippt Zahlen oder Aufsätze, das sind Menschen).
6. Länge 25 bis 30 s, 70 bis 80 Wörter, gesprochen wie im Gespräch, Du-Form, ruhig statt schreiend.
7. Kein Ergebnisversprechen, keine Garantie, kein Preis. Unklare Aussagen mit [B] markieren und vor dem Dreh klären.
Referenz: social/skripte/tag02_neu.md
