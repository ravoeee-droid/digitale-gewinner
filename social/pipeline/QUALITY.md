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
`python3 qa_video.py video.mp4` prüft: 1080x1920, 30 fps, Länge, Gesichtshelligkeit, Schärfe, Lautheit, Dateigröße. Bei Fehlern: nicht ausliefern, Ursache beheben, neu rendern.

## 7. Sichtprüfung (immer)
- 6 Standbilder gleichmäßig verteilt ansehen: Helligkeit, Schärfe, Untertitel nicht abgeschnitten, nichts über dem Gesicht.
- Untertitel-Timing: gerendertes Audio erneut transkribieren, Versatz im Median unter 0,2 s.
- Erste und letzte Sekunde ansehen (Hook, CTA).

## 8. Freigabe
- Raphael sieht das Video und gibt es frei. Erst dann Posting (Cover, Caption, Zeitslot).
- Nach 40 Videos: Auswertung mit Instagram-Insights.
