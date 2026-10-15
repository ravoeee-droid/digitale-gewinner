# -*- coding: utf-8 -*-
# Leitfaden 1: Benefits, die Pflegekräfte 2026/27 überzeugen (für Pflegebetriebe, Mitarbeitergewinnung)
G, M, H = 'gering', 'mittel', 'hoch'
DOC = dict(
    slug='pflege-benefits',
    kicker='Leitfaden für Pflegebetriebe · 2026/27',
    title=['Die 25 Benefits,', 'die Pflegekräfte', 'sich wünschen.'],
    sub='Was Bewerberinnen und Bewerber in Pflegeeinrichtungen und ambulanten Diensten 2026/27 überzeugt, und wie Sie es so zeigen, dass sich passende Menschen bewerben.',
    audience='Für Geschäftsführung, Pflegedienstleitung und Personalverantwortliche',
    intro=[
        'Pflegekräfte können sich ihren Arbeitgeber aussuchen. Wer wechselt, sucht selten nur mehr Geld. Meistens sucht sie oder er Verlässlichkeit, Entlastung und das Gefühl, gesehen zu werden.',
        'Dieser Leitfaden ordnet 25 Benefits in fünf Bereiche. Zu jedem Benefit finden Sie, warum er bei Bewerbern zieht, wie Sie ihn glaubwürdig sichtbar machen und wie hoch der Aufwand für Ihren Betrieb in etwa ist.',
        'Sie müssen nicht alles anbieten. Wählen Sie fünf Benefits, die zu Ihrem Betrieb passen, und leben Sie sie konsequent. Ein Benefit, den Sie nicht halten können, schadet mehr, als er nützt.',
    ],
    cats=[
        ('Dienstplan und Zeit', 'Verlässlichkeit schlägt jeden Bonus.', [
            ('Verlässlicher Dienstplan', 'Wer nachts vom Anruf „kannst du einspringen?“ geweckt wird, sucht die Tür. Ein Plan, der hält, ist für viele Bewerber der stärkste Grund zu wechseln.', 'Nennen Sie in der Anzeige eine konkrete Regel, zum Beispiel: „Der Plan steht 4 Wochen im Voraus.“ Nur versprechen, was Sie halten.', M),
            ('Kein „Holen aus dem Frei“', 'Freie Tage sind für Pflegekräfte Erholung und Familienzeit. Eine klare Zusage, dass freie Tage frei bleiben, wirkt stark, weil sie selten ist.', 'Schreiben Sie die Regel in die Stellenseite und lassen Sie Teammitglieder erzählen, wie sie im Alltag gelebt wird.', H),
            ('Wunschdienstplan', 'Wer seine Dienste mitgestalten darf, fühlt sich ernst genommen. Das gilt vor allem für Eltern und Pflegende von Angehörigen.', 'Erklären Sie kurz den Ablauf, etwa Wunschfenster und Fristen, und zeigen Sie ein anonymisiertes Beispiel.', M),
            ('Flexible Arbeitszeitmodelle', 'Teilzeit, kürzere Dienste, Vier-Tage-Woche oder Schulzeiten-Modelle erweitern den Kreis der Bewerber deutlich, auch Wiedereinsteiger.', 'Zählen Sie die Modelle in Ihrer Anzeige konkret auf, statt „flexibel“ zu schreiben.', M),
            ('Planbare freie Wochenenden', 'Ein garantierter Anteil freier Wochenenden pro Monat ist ein klarer, messbarer Vorteil und leicht zu vergleichen.', 'Nennen Sie die Zahl der freien Wochenenden, die Sie wirklich einhalten.', M),
        ]),
        ('Geld und Sicherheit', 'Fair, pünktlich und nachvollziehbar.', [
            ('Transparente Vergütung', 'Bewerber ärgern sich über „Gehalt nach Vereinbarung“. Eine klare Spanne oder eine tarifnahe Einordnung schafft Vertrauen und spart Rückfragen.', 'Nennen Sie in jeder Anzeige eine Gehaltsspanne und erklären Sie, woraus sie sich zusammensetzt.', M),
            ('Verlässliche Zuschläge', 'Zuschläge für Nacht, Wochenende und Feiertage zählen. Wichtiger als die Höhe ist, dass sie vollständig und pünktlich ankommen.', 'Stellen Sie eine Beispielrechnung eines Monats dar, ohne Personenbezug.', G),
            ('Betriebliche Altersvorsorge', 'Gerade erfahrene Pflegekräfte denken an die Zeit nach dem Berufsleben. Ein Arbeitgeberzuschuss ist ein sichtbares Zeichen von Langfristigkeit.', 'Zeigen Sie den Zuschuss als einen einfachen Satz, etwa „Wir zahlen X zur Vorsorge dazu“.', M),
            ('Prämien für Treue und Mitarbeiter-werben', 'Prämien nach 6, 12 oder 24 Monaten und Empfehlungsprämien zeigen, dass Sie in langfristige Zusammenarbeit investieren.', 'Veröffentlichen Sie die Prämienstufen und erklären Sie, wann sie ausgezahlt werden.', G),
            ('Pünktliche, fehlerfreie Abrechnung', 'Fehlerhafte oder späte Abrechnungen kosten mehr Vertrauen als jede Gehaltsdifferenz. Das spricht sich schnell herum.', 'Erwähnen Sie in Gesprächen und Bewertungen, wie Ihre Abrechnung abläuft, etwa fester Auszahlungstag.', G),
        ]),
        ('Gesundheit und Entlastung', 'Wer entlastet wird, bleibt.', [
            ('Supervision und psychische Unterstützung', 'Belastende Situationen gehören zum Pflegealltag. Regelmäßige Supervision oder eine externe Anlaufstelle zeigen, dass Sie die Folgen ernst nehmen.', 'Beschreiben Sie, wie oft und von wem Unterstützung angeboten wird.', M),
            ('Gesundheitsförderung', 'Rückenschule, Zuschüsse zum Fitnessstudio oder Kurse zur Stressbewältigung sind greifbar und werden von Teams geschätzt.', 'Fotografieren Sie ein reales Angebot im Betrieb und nennen Sie die Konditionen.', M),
            ('Entlastung durch Assistenzkräfte', 'Wenn Hauswirtschaft, Dokumentation oder Fahrdienste nicht an Fachkräften hängen bleiben, bleibt mehr Zeit für Pflege.', 'Zeigen Sie in der Stellenbeschreibung, welche Aufgaben bewusst NICHT bei Fachkräften liegen.', H),
            ('Gute Ausstattung und Hilfsmittel', 'Hebehilfen, funktionierende Technik und aktuelle Dokumentationssysteme sparen Kraft und Nerven im Alltag.', 'Zeigen Sie die Ausstattung in Bild und Video statt sie nur zu behaupten.', H),
            ('Bezahlte Wegezeiten und Dienstfahrzeug (ambulant)', 'Im ambulanten Dienst sind Wege Arbeitszeit. Klare Regeln zu Wegezeit und Fahrzeugnutzung sind ein starkes Argument.', 'Nennen Sie Fahrzeugtyp, Regeln zur privaten Nutzung und die Vergütung der Wegezeit.', H),
        ]),
        ('Entwicklung und Wertschätzung', 'Wer wachsen kann, gestaltet mit.', [
            ('Bezahlte Fortbildung', 'Weiterbildungen werden geschätzt, wenn Zeit und Kosten nicht an den Mitarbeitern hängen bleiben.', 'Nennen Sie ein bis zwei konkrete Weiterbildungen, die im letzten Jahr gefördert wurden.', M),
            ('Aufstiegswege und Spezialisierung', 'Praxisanleitung, Wundmanagement, Palliative Care oder Leitungsrollen zeigen, dass Entwicklung möglich ist, auch ohne den Betrieb zu verlassen.', 'Skizzieren Sie einen typischen Weg in drei Schritten und lassen Sie jemanden aus dem Team dazu sprechen.', M),
            ('Strukturierte Einarbeitung mit Pate', 'Der Start entscheidet, ob jemand bleibt. Ein Einarbeitungsplan und eine feste Ansprechperson senken die Unsicherheit.', 'Veröffentlichen Sie den Plan der ersten vier Wochen als einfache Übersicht.', M),
            ('Mitsprache und Teamkultur', 'Wer gehört wird, bleibt. Teamrunden, in denen Vorschläge sichtbar umgesetzt werden, sind ein starkes Signal.', 'Zeigen Sie ein Beispiel: „Das hat das Team vorgeschlagen, das haben wir geändert.“', G),
            ('Echte Anerkennung im Alltag', 'Ein ehrliches Danke, ein kleines Zeichen nach einer schweren Woche, Feste im Team: Es wirkt, weil es selten ist.', 'Zeigen Sie echte Teamfotos und Zitate, keine Stockbilder.', G),
        ]),
        ('Alltag und Extras', 'Kleine Dinge, die Ihren Betrieb unterscheiden.', [
            ('Mitarbeiter-Vorteilsprogramm', 'Rabatte bei Partnern aus der Region oder über Benefit-Plattformen ergänzen das Gehalt spürbar und lassen sich gut kommunizieren.', 'Nennen Sie drei konkrete Partner statt „viele Vorteile“.', G),
            ('Dienstrad-Leasing', 'Fahrrad-Leasing ist beliebt, weil es Gesundheit und Geldbeutel verbindet. Es lässt sich im Betrieb meist gut organisieren.', 'Zeigen Sie das Angebot mit Beispiel und Hinweis, dass Details mit Steuerberatung geklärt werden.', G),
            ('Familienfreundlichkeit', 'Unterstützung bei der Kinderbetreuung, Rücksicht in den Ferien und verständnisvolle Gespräche in Notlagen zählen für viele Eltern mehr als jede Prämie.', 'Beschreiben Sie, wie Sie in Ferien und Krankheitsfällen von Kindern mit dem Team planen.', M),
            ('Hilfe beim Ankommen: Wohnen und Umzug', 'Für Bewerber von außerhalb entscheidet die Wohnung oft mit. Ein Zuschuss, Vermittlung oder Mitarbeiterwohnung ist ein klarer Wettbewerbsvorteil.', 'Zeigen Sie das Angebot mit Bildern und nennen Sie die Voraussetzungen.', H),
            ('Begleitung bei der Anerkennung ausländischer Abschlüsse', 'Fachkräfte aus dem Ausland brauchen Orientierung bei Anerkennung, Sprache und Behörden. Wer begleitet, wird zum Wunscharbeitgeber.', 'Beschreiben Sie Ihre Schritte von der Zusage bis zum ersten Arbeitstag und nennen Sie eine Ansprechperson.', H),
        ]),
    ],
    quick=['Verlässlicher Dienstplan', 'Transparente Vergütung', 'Strukturierte Einarbeitung mit Pate', 'Echte Anerkennung im Alltag', 'Mitarbeiter-Vorteilsprogramm'],
    online_title='So zeigen Sie Ihre Benefits online',
    online=[
        ('Schreiben Sie konkret.', '„Der Plan steht vier Wochen im Voraus“ überzeugt, „flexible Arbeitszeiten“ nicht.'),
        ('Zeigen Sie Menschen.', 'Echte Fotos und kurze Videos aus dem Team wirken stärker als jede Beschreibung.'),
        ('Machen Sie die Bewerbung leicht.', 'Eine Kurzbewerbung mit Name und Telefonnummer reicht für den ersten Schritt. Antworten Sie am selben Tag.'),
        ('Halten Sie nach, was Sie versprechen.', 'Benefits, die Sie nicht leben können, bleiben in Bewertungen hängen.'),
    ],
    cta_title='Sie möchten das nicht allein umsetzen?',
    cta_text='In einem kostenlosen 15-Minuten-Gespräch schauen wir gemeinsam, welche Benefits zu Ihrem Betrieb passen und wie Ihr Auftritt sie sichtbar macht, damit passende Pflegekräfte aus Ihrer Region sich melden.',
)
