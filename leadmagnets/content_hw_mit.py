# -*- coding: utf-8 -*-
# Leitfaden 3: Benefits für Elektriker und andere Handwerker 2026/27
G, M, H = 'gering', 'mittel', 'hoch'
DOC = dict(
    slug='handwerk-benefits',
    kicker='Leitfaden für Handwerksbetriebe · 2026/27',
    title=['Die 25 Benefits,', 'die Elektriker und', 'Handwerker überzeugen.'],
    sub='Was Gesellen, Meister und Fachkräfte im Elektro- und Bauhandwerk 2026/27 bei der Wahl ihres Betriebs wirklich zählt, und wie Sie es sichtbar machen.',
    audience='Für Inhaber, Geschäftsführer und Betriebsleiter im Handwerk',
    intro=[
        'Gute Handwerker haben die Wahl. Ein Elektriker, der heute eine Anzeige liest, hat morgen drei andere Angebote. Gewonnen wird nicht mit dem lautesten Versprechen, sondern mit dem glaubwürdigsten.',
        'Dieser Leitfaden sammelt 25 Benefits aus fünf Bereichen, mit Schwerpunkt Elektro und angrenzenden Gewerken wie Sanitär, Heizung, Dach und Holz. Zu jedem Benefit lesen Sie, warum er zieht, wie Sie ihn zeigen und wie hoch der Aufwand ist.',
        'Sie müssen nicht alles anbieten. Wählen Sie fünf Benefits, die Sie wirklich halten, und machen Sie diese zum Kern Ihrer Anzeigen und Ihrer Webseite.',
    ],
    cats=[
        ('Geld und Sicherheit', 'Fair bezahlt, sicher geplant.', [
            ('Offene Gehaltsspanne', 'Handwerker vergleichen. Wer eine klare Spanne nennt, spart sich Absagen von Bewerbern, die ohnehin etwas anderes erwarten.', 'Nennen Sie in jeder Anzeige eine ehrliche Spanne und was darauf einzahlt, etwa Erfahrung oder Meistertitel.', M, 'Alle Gewerke'),
            ('Überstunden bezahlt oder als Freizeit', 'Ein klares Arbeitszeitkonto, in dem nichts verschwindet, ist ein starkes Argument gegen „Mehrarbeit ohne Ende“.', 'Beschreiben Sie, wie Überstunden erfasst und ausgeglichen werden.', M, 'Alle Gewerke'),
            ('Zuschläge und bezahlte Bereitschaft', 'Notdienst, Bereitschaft und Sonderfahrten gehören fair vergütet. Klare Regeln nehmen die Angst vor dem Handy am Wochenende.', 'Zeigen Sie die Bereitschaftsregel in zwei Sätzen, inklusive Vergütung.', M, 'Elektro, SHK'),
            ('Betriebliche Altersvorsorge', 'Mit der Zeit wird Absicherung für viele wichtiger. Ein Arbeitgeberzuschuss ist ein stilles, aber wirksames Signal.', 'Nennen Sie den Zuschuss als konkreten Betrag oder Satz.', M, 'Alle Gewerke'),
            ('Prämien für Leistung und Empfehlung', 'Eine Empfehlungsprämie macht Ihre Mitarbeiter zu Recruitern. Prämien für abgeschlossene Projekte belohnen echte Leistung.', 'Veröffentlichen Sie die Prämienlogik, nicht nur das Wort „Bonus“.', G, 'Alle Gewerke'),
        ]),
        ('Arbeitszeit und Alltag', 'Feierabend ist ein Benefit.', [
            ('Vier-Tage-Woche oder verkürzte Freitage', 'Eine kürzere Woche ist im Handwerk selten und fällt auf. Sie muss nicht für alle gelten, auch Teilmodelle wirken.', 'Beschreiben Sie das Modell genau, etwa Zeiten und Voraussetzungen.', H, 'Alle Gewerke'),
            ('Verlässlicher Feierabend', 'Wer zuverlässig um 16 Uhr zu Hause ist, bleibt. Planen Sie Einsätze so, dass die Zusage Bestand hat.', 'Schreiben Sie: „Wir planen auf Feierabend“, und belegen Sie es mit echten Einsatzzeiten.', M, 'Alle Gewerke'),
            ('Planbare Montage und kurze Wege', 'Wochenlange Montagen auswärts schrecken viele ab. Wer Einsätze regional bündelt, spricht eine große Gruppe an.', 'Nennen Sie den typischen Einsatzradius und wie oft auswärts übernachtet wird.', M, 'Elektro, Bau'),
            ('Urlaub, der wirklich genehmigt wird', 'Frühzeitige Urlaubsplanung ohne Diskussion ist ein Vertrauensbeweis. Gerade in der Hochsaison zählt das.', 'Nennen Sie Ihre Regel zu Urlaubsplanung und Fristen.', G, 'Alle Gewerke'),
            ('Wohnortnahe Einsatzplanung', 'Wer nicht jeden Tag eine Stunde fährt, hat mehr vom Leben. Das ist besonders für Familien ein Argument.', 'Zeigen Sie Ihr Einsatzgebiet auf einer einfachen Karte.', M, 'Alle Gewerke'),
        ]),
        ('Ausstattung und Technik', 'Gutes Werkzeug und moderne Abläufe.', [
            ('Markenwerkzeug statt Billigausstattung', 'Gutes Werkzeug zeigt Respekt vor der Arbeit und spart Nerven auf der Baustelle.', 'Zeigen Sie Ihre Werkzeugausstattung in Foto und Video, mit Marken, die Fachleute kennen.', M, 'Alle Gewerke'),
            ('Dienstfahrzeug mit privater Nutzung', 'Ein gepflegtes Fahrzeug, das auch privat genutzt werden darf, ist für viele ein spürbares Extra.', 'Nennen Sie Fahrzeugtyp und Regeln zur privaten Nutzung.', H, 'Alle Gewerke'),
            ('Hochwertige Arbeitskleidung', 'Gute Kleidung, die der Betrieb stellt und pflegt, wirkt klein und wird im Alltag sehr geschätzt.', 'Zeigen Sie Ihr Team in der Arbeitskleidung, mit Logo und Alltagsbildern.', G, 'Alle Gewerke'),
            ('Tablet und digitale Auftragsabwicklung', 'Weniger Zettel, weniger Rückrufe, klare Aufträge: Wer digital arbeitet, spart Zeit und wirkt modern.', 'Zeigen Sie in einem kurzen Video, wie ein Auftrag digital abläuft.', M, 'Alle Gewerke'),
            ('Moderne Technik im Betrieb', 'Photovoltaik, Wallboxen, Smart-Home und Gebäudeautomation machen den Beruf spannend, besonders für junge Fachkräfte.', 'Nennen Sie die Projekttypen, an denen Bewerber bei Ihnen arbeiten.', M, 'Elektro, SHK'),
        ]),
        ('Entwicklung und Aufstieg', 'Ein Betrieb, in dem man besser wird.', [
            ('Meisterförderung', 'Die Unterstützung beim Meister, finanziell und zeitlich, bindet ehrgeizige Gesellen langfristig an den Betrieb.', 'Beschreiben Sie, was Sie übernehmen, etwa Gebühren oder freie Tage für den Kurs.', H, 'Alle Gewerke'),
            ('Bezahlte Weiterbildung und Zertifikate', 'Zusatzqualifikationen etwa zu Photovoltaik, KNX, Wallbox oder Brandschutz erhöhen den Marktwert und die Zufriedenheit.', 'Nennen Sie zwei bis drei Weiterbildungen, die Sie in den letzten Jahren gefördert haben.', M, 'Elektro, SHK'),
            ('Klare Aufstiegswege', 'Vorarbeiter, Bauleiter, Projektleiter: Wer sieht, wohin die Reise geht, plant seine Zukunft bei Ihnen.', 'Skizzieren Sie einen typischen Weg in drei Schritten, mit echten Namen aus dem Betrieb.', M, 'Alle Gewerke'),
            ('Ausbildung, die ernst genommen wird', 'Ein Betrieb, der gut ausbildet, wird weiterempfohlen. Das spricht sich in Schulen und Familien herum.', 'Zeigen Sie einen Azubi-Alltag mit Ausbilder und Lernplan.', M, 'Alle Gewerke'),
            ('Mentor für die ersten Monate', 'Ein erfahrener Kollege, der anleitet, macht den Einstieg sicher und verringert Frühabgänge.', 'Beschreiben Sie das Mentoring in einem Absatz, mit Foto des Mentors.', G, 'Alle Gewerke'),
        ]),
        ('Team und Extras', 'Was einen Betrieb zum Wunscharbeitgeber macht.', [
            ('Respektvoller Ton auf der Baustelle', 'Wertschätzung ist nicht teuer, aber selten. Wer als Chef Danke sagt, wird weiterempfohlen.', 'Lassen Sie Mitarbeiter im Video beschreiben, wie der Umgang im Team ist.', G, 'Alle Gewerke'),
            ('Dienstrad-Leasing', 'Beliebt, einfach anzubieten und im Handwerk noch nicht selbstverständlich. Ein sympathischer Unterschied.', 'Zeigen Sie das Angebot mit einem Beispiel und klären Sie Details vorab mit Ihrer Steuerberatung.', G, 'Alle Gewerke'),
            ('Mitarbeiter-Vorteile und Rabatte', 'Rabatte bei Partnern, Großhändlern und im Handel in der Region erhöhen die Kaufkraft spürbar.', 'Nennen Sie konkrete Partner statt „viele Vorteile“.', G, 'Alle Gewerke'),
            ('Teamevents und gemeinsame Feste', 'Ein Sommerfest, eine Weihnachtsfeier oder ein gemeinsames Wochenende stärken das Gefühl, zusammenzugehören.', 'Zeigen Sie echte Fotos von Events, mit Erlaubnis der Beteiligten.', G, 'Alle Gewerke'),
            ('Hilfe bei Wohnung und Umzug', 'Für Bewerber von außerhalb entscheidet die Wohnung mit. Ein Zuschuss oder Kontakte zu Vermietern sind ein Wettbewerbsvorteil.', 'Beschreiben Sie, was Sie anbieten, und nennen Sie die Voraussetzungen.', H, 'Alle Gewerke'),
        ]),
    ],
    quick=['Offene Gehaltsspanne', 'Verlässlicher Feierabend', 'Markenwerkzeug statt Billigausstattung', 'Mentor für die ersten Monate', 'Respektvoller Ton auf der Baustelle'],
    online_title='So zeigen Sie Ihre Benefits online',
    online=[
        ('Zeigen Sie die Baustelle.', 'Echte Bilder von Team, Fahrzeug und Werkzeug wirken stärker als Stockfotos und Textblöcke.'),
        ('Schreiben Sie, wie ein Kollege spricht.', 'Kurz, direkt, ohne Floskeln. „Feierabend um 16 Uhr“ statt „attraktive Arbeitszeiten“.'),
        ('Machen Sie den ersten Schritt klein.', 'Name, Telefonnummer, fertig. Viele Handwerker bewerben sich lieber per WhatsApp als per Formular.'),
        ('Antworten Sie schnell.', 'Wer am selben Tag zurückruft, gewinnt gegen den, der in drei Tagen schreibt.'),
    ],
    cta_title='Sie möchten das nicht allein umsetzen?',
    cta_text='In einem kostenlosen 15-Minuten-Gespräch schauen wir gemeinsam, welche Benefits zu Ihrem Betrieb passen und wie Ihr Auftritt sie sichtbar macht, damit Elektriker und andere Fachkräfte aus Ihrer Region sich melden.',
)
