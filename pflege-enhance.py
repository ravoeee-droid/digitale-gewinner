#!/usr/bin/env python3
"""Pflege-spezifische Conversion-Inhalte und Tracking im generierten HTML."""
from pathlib import Path
import re
import sys

dist = Path(sys.argv[1] if len(sys.argv)>1 else 'dist')
p = dist / 'pflege.html'
# Auch wenn der allgemeine Builder die alte Root-Seite schont: hier ausdrücklich
# die neue Pflege-Version generieren. Alle anderen Routen unverändert lassen.
import importlib.util
spec = importlib.util.spec_from_file_location('dg_site_builder', 'site/build_site.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
p.write_text(module.branch('pflege', module.BRANCH['pflege']), encoding='utf-8')
s = p.read_text(encoding='utf-8')
# Die hochwertige Fassung kommt aus site/build_site.py.
if 'id="expl"' not in s or 'id="fallstudien"' not in s:
    raise SystemExit('Pflege-Build fehlt Video oder Fallstudien; Veröffentlichung abgebrochen')
s = s.replace('<div><span class="eyebrow" data-r>Schlussbereich</span>',
              '<div><span class="eyebrow" data-r>Kostenloser Praxis-Mehrwert – auch ohne Auftrag</span>', 1)
s = s.replace('Wo verlieren Sie heute <span class="gold it">Bewerber oder Kunden?</span>',
              'Ihre Recruiting-Potenzialanalyse. <span class="gold it">3 Lösungen für Ihr Haus.</span>', 1)
s = s.replace('In 15 Minuten finden wir gemeinsam heraus, welcher Engpass Sie aktuell am meisten bremst und welcher erste Schritt den größten Hebel bietet.',
              'In 15 Minuten analysieren wir Ihren Bewerberweg. Sie nehmen drei konkrete Verbesserungen, einen individuell formulierten Stellenanzeigen-Einstieg und einen 7-Tage-Aktionsplan mit. Auch wenn wir danach nicht zusammenarbeiten.', 1)
s = s.replace('Unverbindlich · persönlich mit Raphael · klare Einschätzung',
              'Ihr Ergebnis: 3 sofort umsetzbare Maßnahmen · 1 Stellenanzeigen-Hook · 7-Tage-Plan · keine Kaufpflicht', 1)
s = s.replace('Kostenlose 15-Minuten-Analyse buchen',
              'Kostenlose Recruiting-Potenzialanalyse sichern', 1)
# Sichtbarer Nutzen auch oberhalb der Falz.
needle='Wir machen Ihr Haus als Arbeitgeber sichtbar – und führen passende Pflegekräfte Schritt für Schritt bis zum Gespräch.'
s=s.replace(needle, needle + ' <strong>Bonus: Im kostenlosen Gespräch erhalten Sie drei konkrete Recruiting-Hebel und einen individuellen 7-Tage-Plan – ohne Kaufpflicht.</strong>', 1)
# Kalendereinstieg kurz und persönlich.
s=s.replace('>Termin wählen</a>', '>Kostenlosen Analyse-Termin wählen</a>',1)
# Bestehendes Consent-Banner auch ohne GTM verfügbar; separate Einwilligung für Website-Analyse.
s=s.replace('Mit Ihrer Einwilligung messen wir anonym, welche Inhalte helfen, um die Seite zu verbessern.',
            'Nur mit Ihrer Einwilligung erfassen wir Video-Watchtime, Klicks, Funnel-Schritte und Kampagnenquelle zur Verbesserung unserer Website; ausgewählte Ereignisse können eine interne Telegram-Benachrichtigung auslösen.')
s=s.replace('src="/site.js"></script>', 'src="/site.js"></script><script src="/pflege-tracking.js" defer></script>', 1)
p.write_text(s,encoding='utf-8')
print('Pflege: Video, Fälle, Mehrwert-Angebot und Tracking installiert.')
