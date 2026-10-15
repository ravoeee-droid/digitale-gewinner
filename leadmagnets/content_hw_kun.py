# -*- coding: utf-8 -*-
# Leitfaden 4: Die 25 Anfrage-Bremsen im Handwerk
G, M, H = 'gering', 'mittel', 'hoch'
DOC = dict(
    slug='handwerk-anfragen',
    kicker='Leitfaden für Handwerksbetriebe · 2026/27',
    title=['Die 25 Gründe,', 'warum Kunden nicht', 'bei Ihnen anfragen.'],
    sub='Welche kleinen Hürden auf Handwerker-Webseiten Anfragen kosten, und wie Sie sie mit wenig Aufwand beseitigen.',
    audience='Für Inhaber und Geschäftsführer im Handwerk',
    intro=[
        'Wer einen Handwerker sucht, hat meist ein konkretes Problem: Heizung ausgefallen, Bad soll neu, die Photovoltaik-Anlage wird geplant. Wer die Seite öffnet, entscheidet in Sekunden, ob er anfragt oder zurückgeht.',
        'Dieser Leitfaden listet 25 typische Anfrage-Bremsen in fünf Bereichen. Zu jeder Bremse lesen Sie, warum sie Anfragen kostet und wie Sie sie lösen, vom ersten Eindruck bis zur Reaktion nach der Anfrage.',
        'Prüfen Sie Ihre eigene Seite mit der Checkliste am Ende. Meist sind es fünf bis acht Punkte, die den größten Unterschied machen.',
    ],
    cats=[
        ('Erster Eindruck', 'Die ersten fünf Sekunden entscheiden.', [
            ('Unklar, was Sie anbieten', 'Wenn nicht sofort klar ist, ob Sie Elektro, Heizung oder Dach machen, gehen Besucher weiter. Ein Satz entscheidet.', 'Setzen Sie Gewerk und Region in die Überschrift: „Elektriker für Stuttgart und Umgebung“.', G),
            ('Stockfotos statt echter Bilder', 'Fremde Bilder wirken austauschbar. Bilder Ihres Teams und Ihrer Arbeit schaffen sofort Vertrauen.', 'Fotografieren Sie Team, Fahrzeug und Baustelle in guter Qualität.', M),
            ('Langsame Ladezeit auf dem Handy', 'Die meisten Besucher kommen mobil. Wenn die Seite lange lädt, sind sie schon weg.', 'Komprimieren Sie Bilder und lassen Sie die Ladezeit mobil prüfen.', M),
            ('Veraltetes Design', 'Eine Seite, die nach 2015 aussieht, lässt auch den Betrieb altmodisch wirken, selbst wenn er es nicht ist.', 'Setzen Sie auf klares Layout, viel Weißraum und echte Bilder.', H),
            ('Keine klare Handlungsaufforderung', 'Wenn der nächste Schritt nicht sichtbar ist, passiert nichts. Besucher wollen geführt werden.', 'Setzen Sie einen deutlichen Button oben: „Kostenlos anfragen“.', G),
        ]),
        ('Vertrauen', 'Warum gerade Sie?', [
            ('Kein Gesicht, kein Name', 'Kunden lassen Handwerker in ihr Zuhause. Ohne Gesicht bleibt der Betrieb anonym.', 'Zeigen Sie Inhaber und Team mit Foto und Namen.', G),
            ('Keine Referenzen', 'Kunden wollen sehen, dass andere zufrieden sind. Beispiele machen Ihr Können greifbar.', 'Zeigen Sie drei Projekte mit Foto, Ort und kurzem Ergebnis.', M),
            ('Keine Bewertungen sichtbar', 'Google-Bewertungen sind für viele der erste Check. Wenn Sie sie nicht zeigen, wird geraten.', 'Binden Sie echte Bewertungen auf der Startseite ein.', G),
            ('Keine Angabe zu Qualifikation', 'Meisterbetrieb, Innungsmitgliedschaft, Zertifikate: Das sind starke, wenig genutzte Vertrauenssignale.', 'Nennen Sie Qualifikationen und Mitgliedschaften sichtbar im Kopfbereich.', G),
            ('Fehlendes Impressum oder Datenschutz', 'Wirkt unseriös und birgt rechtliche Risiken. Besucher achten mehr darauf, als man denkt.', 'Prüfen Sie Impressum und Datenschutz auf Vollständigkeit, mit Rechtsberatung.', G),
        ]),
        ('Angebot verständlich machen', 'Was bekomme ich und wie läuft es ab?', [
            ('Leistungen nur als Stichwortliste', 'Eine Liste aus Fachbegriffen hilft Laien nicht. Besucher wollen wissen, was es für sie bedeutet.', 'Erklären Sie jede Leistung in einem Satz mit Nutzen aus Kundensicht.', M),
            ('Kein Leistungsgebiet genannt', 'Wenn Kunden nicht wissen, ob Sie zu ihnen kommen, fragen sie gar nicht erst.', 'Nennen Sie Orte und Radius, am besten mit Karte.', G),
            ('Ablauf unklar', 'Wer nicht weiß, was nach der Anfrage passiert, zögert. Ein klarer Ablauf nimmt Hemmungen.', 'Zeigen Sie drei Schritte: Anfrage, Beratung, Angebot.', G),
            ('Keine Orientierung zu Preisen', 'Viele Kunden scheuen die Anfrage, weil sie keine Vorstellung von Kosten haben. Eine Spanne hilft.', 'Nennen Sie typische Preisrahmen oder erklären Sie, wie Ihre Preise entstehen.', M),
            ('Fachchinesisch', 'Wer Begriffe nicht versteht, fühlt sich dumm und geht. Einfache Sprache schafft Nähe.', 'Lesen Sie Ihre Texte laut vor. Was Sie nicht in einem Gespräch sagen würden, streichen Sie.', G),
        ]),
        ('Kontakt einfach machen', 'Jede Hürde kostet Anfragen.', [
            ('Formular zu lang', 'Jedes zusätzliche Feld kostet Anfragen. Für den ersten Kontakt genügen Name und Telefonnummer.', 'Reduzieren Sie auf Name, Nummer oder E-Mail und eine kurze Nachricht.', G),
            ('Telefonnummer nicht anklickbar', 'Auf dem Handy muss ein Tipp genügen. Wer die Nummer abtippen muss, bricht oft ab.', 'Hinterlegen Sie die Nummer als Anruf-Link und setzen Sie sie in den Kopf.', G),
            ('Kein WhatsApp', 'Viele Kunden schreiben lieber, als zu telefonieren. Ein WhatsApp-Button senkt die Schwelle stark.', 'Ergänzen Sie WhatsApp mit einer vorbereiteten Nachricht.', G),
            ('Kontaktdaten nur im Impressum', 'Wer Ihre Nummer suchen muss, sucht stattdessen einen anderen Betrieb.', 'Zeigen Sie Kontakt in Kopfbereich, am Seitenende und neben jedem Angebot.', G),
            ('Keine Erreichbarkeitszeiten', 'Wenn niemand abnimmt, ohne zu sagen, wann man zurückruft, geht der Kunde zum Nächsten.', 'Nennen Sie Zeiten und versprechen Sie einen Rückruf, den Sie halten.', G),
        ]),
        ('Nach der Anfrage', 'Hier entscheidet sich der Auftrag.', [
            ('Zu späte Antwort', 'Wer zuerst antwortet, bekommt oft den Auftrag. Nach Stunden ist die Anfrage häufig schon vergeben.', 'Setzen Sie eine Zielzeit, etwa Rückmeldung am selben Werktag, und halten Sie sie.', M),
            ('Keine Bestätigung der Anfrage', 'Kunden wollen wissen, dass ihre Nachricht angekommen ist. Fehlende Rückmeldung wirkt wie Desinteresse.', 'Richten Sie eine automatische Bestätigung per E-Mail oder WhatsApp ein.', M),
            ('Kein Nachfassen bei Angeboten', 'Viele Angebote versanden. Eine freundliche Nachfrage nach einigen Tagen rettet Aufträge.', 'Notieren Sie Angebote und fassen Sie nach drei bis fünf Tagen nach.', M),
            ('Anfragen gehen verloren', 'Zettel, WhatsApp, E-Mail, Anrufe: Wenn Anfragen an vielen Stellen landen, geht etwas unter.', 'Sammeln Sie Anfragen an einem Ort, etwa einem einfachen Cockpit.', M),
            ('Keine Bitte um Bewertung', 'Zufriedene Kunden bewerten selten von allein. Eine freundliche Bitte nach dem Auftrag bringt neue Vertrauenssignale.', 'Bitten Sie jeden zufriedenen Kunden per WhatsApp oder Link um eine Bewertung.', G),
        ]),
    ],
    quick=['Unklar, was Sie anbieten', 'Telefonnummer nicht anklickbar', 'Formular zu lang', 'Keine Bewertungen sichtbar', 'Zu späte Antwort'],
    online_title='So gehen Sie vor',
    online=[
        ('Prüfen Sie Ihre Seite mit dem Handy.', 'Öffnen Sie Ihre Seite wie ein Kunde. Wie viele Sekunden brauchen Sie bis zur Telefonnummer?'),
        ('Beheben Sie zuerst die einfachen Punkte.', 'Anklickbare Nummer, kurzes Formular, WhatsApp: Das geht an einem Nachmittag.'),
        ('Zeigen Sie Beweise.', 'Bewertungen, Referenzen und Gesichter schaffen Vertrauen schneller als jeder Text.'),
        ('Antworten Sie schnell.', 'Die schnellste Antwort entscheidet oft den Auftrag.'),
    ],
    cta_title='Sie möchten das nicht allein umsetzen?',
    cta_text='In einem kostenlosen 15-Minuten-Gespräch prüfen wir gemeinsam, welche dieser Bremsen auf Ihrer Seite Anfragen kosten, und wie ein System Anfragen erfasst, bestätigt und nachfasst.',
)
