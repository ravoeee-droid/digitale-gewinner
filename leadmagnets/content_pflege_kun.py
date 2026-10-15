# -*- coding: utf-8 -*-
# Leitfaden 2: Die 25 Fragen von Angehörigen, bevor sie einen Pflegedienst anrufen
G, M, H = 'gering', 'mittel', 'hoch'
DOC = dict(
    slug='pflege-angehoerige',
    kicker='Leitfaden für Pflegebetriebe · 2026/27',
    title=['Die 25 Fragen,', 'die Angehörige stellen,', 'bevor sie anrufen.'],
    sub='Worauf Familien bei der Wahl eines Pflegedienstes oder einer Tagespflege achten, und wie Ihr Auftritt die Antworten gibt, bevor jemand fragen muss.',
    audience='Für Geschäftsführung, Pflegedienstleitung und Marketing',
    intro=[
        'Wenn Angehörige einen Pflegedienst suchen, ist die Lage meist belastend. Sie haben wenig Zeit, wenig Überblick und viele Sorgen. Sie rufen dort an, wo sie sich verstanden fühlen.',
        'Dieser Leitfaden bündelt 25 typische Fragen in fünf Bereichen. Zu jeder Frage lesen Sie, was dahinter steckt und wie Sie sie auf Ihrer Webseite und in Ihrer Kommunikation beantworten.',
        'Beantworten Sie nur, was Sie belastbar sagen können. Ehrliche, einfache Antworten bauen Vertrauen auf, auch wenn sie bedeuten, dass Sie manches nicht anbieten.',
    ],
    cats=[
        ('Vertrauen und Menschen', 'Wer kommt zu uns nach Hause?', [
            ('Wer kommt zu meiner Mutter?', 'Angehörige geben das Wichtigste aus der Hand. Sie wollen Gesichter und Namen sehen, bevor sie jemanden in die Wohnung lassen.', 'Zeigen Sie das Team mit Foto, Vorname und einem Satz zur Person.', G),
            ('Bleibt die Pflegekraft dieselbe?', 'Ständig wechselnde Gesichter verunsichern ältere Menschen. Eine feste Bezugsperson ist für viele ein Hauptargument.', 'Erklären Sie, wie Sie feste Bezugspflegekräfte organisieren und was passiert, wenn jemand krank wird.', M),
            ('Wie gehen Sie mit Demenz um?', 'Demenz ist für Familien eine große Sorge. Konkrete Erfahrung und ruhige Beschreibung zählen mehr als Fachbegriffe.', 'Beschreiben Sie in einfachen Worten, wie Sie im Alltag vorgehen, und nennen Sie Qualifikationen.', M),
            ('Kennen Sie sich in meiner Gegend aus?', 'Nähe schafft Vertrauen und kurze Wege. Wer lokal verwurzelt ist, wirkt verlässlicher.', 'Nennen Sie Ihr Einsatzgebiet mit Ortsnamen und zeigen Sie Ihren Standort.', G),
            ('Was sagen andere Familien?', 'Empfehlungen sind der stärkste Entscheider. Echte Stimmen von Angehörigen sind viel wirksamer als Eigenlob.', 'Zeigen Sie freigegebene Stimmen und Google-Bewertungen mit Namen oder Initialen.', G),
        ]),
        ('Leistungen und Kosten', 'Was bekomme ich, was kostet es?', [
            ('Was leisten Sie genau?', 'Familien wissen oft nicht, welche Leistungen es gibt. Eine verständliche Übersicht nimmt Hemmungen vor dem Anruf.', 'Listen Sie Ihre Leistungen in Alltagssprache, etwa „Hilfe beim Waschen“, „Medikamente“, „Begleitung zu Terminen“.', G),
            ('Was zahlt die Pflegekasse, was ich?', 'Kosten sind ein heikles Thema. Wer es offen und einfach erklärt, wirkt ehrlich und entlastet.', 'Erklären Sie grundsätzlich, wie die Abrechnung läuft, und verweisen Sie bei Details auf ein persönliches Gespräch.', M),
            ('Helfen Sie beim Antrag auf einen Pflegegrad?', 'Viele Angehörige scheitern an Formularen und Fristen. Ein Hinweis auf Hilfe senkt die Hürde enorm.', 'Beschreiben Sie, wie Sie unterstützen oder an wen Sie vermitteln.', M),
            ('Was ist mit Entlastung für mich?', 'Pflegende Angehörige sind oft selbst erschöpft. Angebote zur Entlastung sind ein starkes Argument.', 'Erklären Sie Angebote wie Betreuung, Tagespflege oder Verhinderungspflege und wie man sie nutzt.', M),
            ('Gibt es versteckte Kosten?', 'Angst vor Überraschungen hält viele vom Anruf ab. Klare Aussagen zur Preisgestaltung schaffen Vertrauen.', 'Schreiben Sie, welche Kosten entstehen können, und wie transparent Sie darüber informieren.', G),
        ]),
        ('Erreichbarkeit und Zuverlässigkeit', 'Können wir uns darauf verlassen?', [
            ('Sind Sie erreichbar, wenn etwas ist?', 'Nachts und am Wochenende fühlen sich Familien am meisten allein. Eine klare Aussage zur Erreichbarkeit beruhigt.', 'Nennen Sie, wer wann erreichbar ist, und wie Notfälle laufen.', M),
            ('Kommen Sie pünktlich?', 'Pünktlichkeit bedeutet für ältere Menschen Sicherheit und Struktur. Verspätungen verunsichern.', 'Erklären Sie, wie Sie Zeitfenster handhaben und informieren, wenn es sich verzögert.', M),
            ('Was passiert bei Krankheit im Team?', 'Familien fürchten, dass Termine einfach ausfallen. Eine klare Vertretungsregel nimmt die Angst.', 'Beschreiben Sie Ihre Vertretung in einem Absatz.', M),
            ('Wie schnell können Sie anfangen?', 'Wenn die Lage akut ist, entscheidet die Geschwindigkeit. Ehrliche Aussagen zur Kapazität sind wertvoll.', 'Nennen Sie, wie schnell Sie typischerweise antworten, und wann Wartezeiten möglich sind.', G),
            ('Wen rufe ich an?', 'Viele Familien scheitern an unklaren Kontaktwegen. Eine einfache, sichtbare Nummer senkt die Schwelle.', 'Setzen Sie Telefon und WhatsApp gut sichtbar auf jede Seite, mit Zeiten der Erreichbarkeit.', G),
        ]),
        ('Start und Ablauf', 'Wie läuft das konkret an?', [
            ('Wie läuft das erste Gespräch ab?', 'Angehörige haben Respekt vor dem ersten Termin. Wer den Ablauf kennt, ruft eher an.', 'Beschreiben Sie das Erstgespräch in drei Schritten, ohne Fachsprache.', G),
            ('Muss ich mich sofort entscheiden?', 'Druck schreckt ab. Ein unverbindliches Gespräch ist für viele der richtige Einstieg.', 'Schreiben Sie klar: „Unverbindlich, kostenlos, ohne Verpflichtung.“', G),
            ('Kommen Sie zu uns nach Hause?', 'Viele möchten das Gespräch bei sich, im vertrauten Umfeld. Das erleichtert die Entscheidung.', 'Bieten Sie Hausbesuche an und sagen Sie das deutlich.', M),
            ('Was brauche ich dafür?', 'Unterlagen und Fristen verunsichern. Eine kleine Checkliste hilft, bevor die Sorge groß wird.', 'Stellen Sie eine kurze Liste bereit, was beim Erstkontakt hilfreich ist.', G),
            ('Wie lange dauert es bis zur Hilfe?', 'Der Zeitraum zwischen Anruf und erster Unterstützung ist für Familien zentral.', 'Beschreiben Sie den typischen Ablauf von der Anfrage bis zum ersten Einsatz.', M),
        ]),
        ('Qualität und Nachweise', 'Woran erkenne ich guten Pflegedienst?', [
            ('Sind Ihre Pflegekräfte qualifiziert?', 'Familien wollen wissen, wer ausgebildet ist. Klare Aussagen zu Qualifikationen schaffen Sicherheit.', 'Nennen Sie Qualifikationen und regelmäßige Weiterbildungen in verständlichen Worten.', G),
            ('Wie sichern Sie Qualität?', 'Familien kennen oft nur Schulnoten oder Gerüchte. Erklären Sie Ihren Anspruch konkret statt allgemein.', 'Beschreiben Sie, wie Sie Pflege überprüfen, ohne Fachjargon.', M),
            ('Wie gehen Sie mit Beschwerden um?', 'Wer offen mit Kritik umgeht, wirkt vertrauenswürdig. Ein klarer Weg für Rückmeldungen gibt Sicherheit.', 'Erklären Sie, wie Familien Rückmeldungen geben können und wie Sie reagieren.', G),
            ('Wie halten Sie Angehörige informiert?', 'Wer nicht informiert wird, sorgt sich mehr. Ein einfacher Rückmeldeweg ist für viele ein Hauptgrund für die Wahl.', 'Beschreiben Sie, wie und wie oft Angehörige Rückmeldung bekommen.', M),
            ('Was unterscheidet Sie von anderen?', 'Am Ende wählen Familien nach Bauchgefühl. Zeigen Sie, wofür Ihr Dienst steht, in wenigen ehrlichen Sätzen.', 'Formulieren Sie drei Sätze zu Ihrer Haltung und belegen Sie sie mit einem Beispiel.', G),
        ]),
    ],
    quick=['Wer kommt zu meiner Mutter?', 'Was leisten Sie genau?', 'Wen rufe ich an?', 'Wie läuft das erste Gespräch ab?', 'Was sagen andere Familien?'],
    online_title='So beantworten Sie die Fragen online',
    online=[
        ('Eine Frage, eine Antwort.', 'Beantworten Sie jede Frage mit kurzen, einfachen Sätzen auf einer eigenen Seite oder in einem FAQ.'),
        ('Zeigen Sie Gesichter.', 'Ein Foto Ihres Teams beantwortet drei Fragen auf einmal.'),
        ('Machen Sie den Anruf leicht.', 'Telefon und WhatsApp auf jeder Seite, dazu ein kurzes Formular für den Rückruf.'),
        ('Antworten Sie am selben Tag.', 'Familien in akuten Lagen entscheiden sich für den, der zuerst zurückmeldet.'),
    ],
    cta_title='Sie möchten das nicht allein umsetzen?',
    cta_text='In einem kostenlosen 15-Minuten-Gespräch zeigen wir, wie Ihr Auftritt die Fragen der Angehörigen beantwortet und wie aus Besuchern persönliche Anfragen werden.',
)
