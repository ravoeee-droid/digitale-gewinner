#!/usr/bin/env python3
"""Erzeugt die statischen Seiten der Digitale-Gewinner-Website (Startseite, Branchenseiten, Outbound-Template).

Aufruf: python3 site/build_site.py <ausgabeordner>
Copy-Quelle ist der vom Auftraggeber freigegebene Text – hier keine neuen Fakten ergänzen.
"""
import html as H
import json
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else HERE.parent / 'dist'
SITE = 'https://digitale-gewinner.de'
WA = 'https://wa.me/4971134063951'
ARROW = '<span class="arr" aria-hidden="true">→</span>'

LOGO = ('<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true">'
        '<path d="M7 24V8h9c6 0 9 3 9 8s-3 8-9 8H7Z"/><path d="m11 20 4-4 3 2 6-7"/><path d="M20 11h4v4"/></svg>')

REVIEWS = [
    ('Julian Arndt', 'Danke an Raphael für den mega Support! Er hat es übernommen und innerhalb von 3 Tagen eine perfekte Website für uns gebaut.'),
    ('Andreas Walkenhorst', 'Großartige Arbeit, das besprochene Projekt sehr zeitnah und in enger Abstimmung umgesetzt.'),
    ('Lider Yilmaz', 'Homepage und Webshop 1A, Support sehr schnell und freundlich. Echtes Know-how mit hilfreichen Tipps.'),
    ('Miriam Braunmüller', 'Ich habe mich sehr gut aufgehoben gefühlt. Meine Wünsche und Ideen wurden super gut umgesetzt.'),
    ('Rainer Deckert', 'Außergewöhnlicher Webdesigner! Raphael baut nicht einfach nur Websites, sondern echte Verkaufssysteme mit Rechner, Chatbot und CRM.'),
    ('KrentzWorks Studio', 'Web-App und Paid-Ads-Kampagne – beides 1A umgesetzt. Schnell, professionell und mit echtem Mehrwert.'),
    ('Annika Fischer', 'Ich bin wirklich rundum begeistert von der Zusammenarbeit mit Raphael.'),
    ('Massoud Weissi', 'Sehr professionelle und zuverlässige Arbeit. Die Erstellung meiner Webseite lief reibungslos.'),
    ('DJ Walli', 'Gutes Angebot und schnell. Die Homepage ist genau nach meinen Angaben gemacht worden. TOP.'),
]

FAQ = [
    ('Ist das einfach eine neue Website?', 'Nein. Die sichtbare Seite ist nur ein Teil. Dahinter entsteht ein klarer Ablauf, der Kontakte erfasst, wichtige Angaben abfragt, erinnert, nachfasst und bis zum Gespräch begleitet.'),
    ('Können wir damit Mitarbeiter und Kunden gewinnen?', 'Ja. Für den Start konzentrieren wir uns auf Ihren dringendsten Engpass. Sobald dieser Weg zuverlässig funktioniert, kann der zweite ergänzt werden.'),
    ('Muss unsere bestehende Website ersetzt werden?', 'Nicht zwingend. Je nach Ausgangslage ergänzen wir Ihre vorhandene Website oder bauen einen eigenständigen Gewinnungsweg.'),
    ('Garantieren Sie Einstellungen oder Aufträge?', 'Nein. Einstellungen und Abschlüsse hängen auch von Ihrem Angebot, Ihrer Region, Ihrer Reaktionsgeschwindigkeit und den persönlichen Gesprächen ab. Wir schaffen einen messbaren Weg zu mehr passenden Kontakten und optimieren ihn anhand echter Ergebnisse.'),
    ('Ist das Werbebudget enthalten?', 'Nein. Das Werbebudget wird nach Zielgruppe, Region und Wettbewerb festgelegt und separat direkt an die jeweilige Plattform gezahlt.'),
    ('Was müssen wir selbst übernehmen?', 'Sie stellen die wichtigsten Informationen bereit, geben Inhalte frei und führen die persönlichen Gespräche. Aufbau, Technik und wiederkehrende Schritte davor übernehmen wir.'),
    ('Was passiert im ersten Gespräch?', 'In 15 Minuten prüfen wir Ihren aktuellen Weg zur Mitarbeiter- oder Kundengewinnung, erkennen mögliche Lücken und klären, ob unser System zu Ihrem Unternehmen passt.'),
]

STEPS = [
    ('Ziel festlegen', 'Gemeinsam definieren wir, welche Mitarbeiter oder Kunden wirklich zu Ihrem Unternehmen passen.'),
    ('System aufbauen', 'Wir erstellen Botschaft, Auftritt, Kontaktweg und die notwendigen Abläufe. Sie müssen keine unterschiedlichen Dienstleister koordinieren.'),
    ('Passende Menschen erreichen', 'Ihr Angebot wird dort sichtbar, wo Ihre Zielgruppe aus der Region erreichbar ist.'),
    ('Kontakte begleiten', 'Das System erklärt, fragt wichtige Angaben ab, erinnert und unterstützt beim Nachfassen.'),
    ('Gespräche führen', 'Sie erhalten vorbereitete Bewerber oder Kundenanfragen und konzentrieren sich auf die persönliche Entscheidung.'),
]

CAN = ['passende Menschen auf Ihr Unternehmen aufmerksam machen', 'Ihr Angebot einfach erklären', 'die wichtigsten Angaben abfragen',
       'Kontakte übersichtlich erfassen', 'automatisch bestätigen und erinnern', 'bei ausbleibender Rückmeldung nachfassen',
       'Termine vorbereiten', 'offene nächste Schritte sichtbar machen']

FLOW = ['Anfrage geht ein', 'Angaben werden erfasst', 'Bestätigung geht raus', 'Erinnerung und Nachfassen', 'Termin ist vorbereitet']

AUTO = ['Kontaktdaten erfassen', 'häufige Fragen beantworten', 'wichtige Informationen abfragen', 'Kontakte vorqualifizieren',
        'Termine anbieten', 'Bestätigungen und Erinnerungen versenden', 'automatisch nachfassen', 'nächste Schritte dokumentieren']

RESULTS = ['mehr passende Bewerbungen', 'mehr qualifizierte Kundenanfragen', 'weniger verlorene Kontakte',
           'schnelleres Nachfassen', 'mehr gebuchte Gespräche', 'weniger Verwaltungsaufwand']

TICKS_MIT = ['überzeugender Arbeitgeberauftritt', 'regionale Sichtbarkeit', 'einfacher Kontakt – auf Wunsch ohne Lebenslauf',
             'automatische Erfassung und Vorqualifizierung', 'Erinnerungen und Nachfassen', 'übersichtliche Bewerberverwaltung']
TICKS_KUN = ['klare Positionierung Ihres Angebots', 'passende regionale Sichtbarkeit', 'unkomplizierter Anfrageweg',
             'Erfassung der wichtigsten Anforderungen', 'automatisches Nachfassen', 'direkter Weg zum Beratungsgespräch']

OFFER = ['ein Hauptziel', 'eine Zielgruppe', 'persönliche Ziel- und Angebotsklärung', 'individuelles Websystem', 'Texte und Gestaltung',
         'Bewerbungs- oder Anfrageweg', 'Erfassung und Vorqualifizierung', 'automatisches Erinnern und Nachfassen',
         'Einrichtung der regionalen Sichtbarkeit', 'acht Wochen persönliche Begleitung und Optimierung']


def e(s):
    return H.escape(s, quote=True)


def lis(items, cls=''):
    return ''.join(f'<li>{e(i)}</li>' for i in items)


def head(title, desc, path, noindex=False, extra=''):
    robots = '<meta name="robots" content="noindex,nofollow">' if noindex else ''
    canon = '' if noindex else f'<link rel="canonical" href="{SITE}{path}">'
    og = '' if noindex else (f'<meta property="og:type" content="website"><meta property="og:title" content="{e(title)}">'
                             f'<meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{SITE}{path}">'
                             f'<meta property="og:image" content="{SITE}/assets/images/raphael/raphael-hermann-hero.webp">')
    return (f'<!doctype html><html lang="de"><head><meta charset="utf-8">'
            f'<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
            f'<title>{e(title)}</title><meta name="description" content="{e(desc)}">{robots}{canon}{og}'
            f'<meta name="theme-color" content="#090806">'
            f'<script>document.documentElement.classList.add("js")</script>'
            f'<link rel="stylesheet" href="/site.css">{extra}</head>')


def schema(faq=True):
    org = {"@context": "https://schema.org", "@type": "ProfessionalService", "name": "Digitale Gewinner", "url": SITE + "/",
           "founder": {"@type": "Person", "name": "Raphael Hermann"},
           "description": "Intelligente Websysteme für Mitarbeiter- und Kundengewinnung bei Pflege- und Handwerksbetrieben.",
           "areaServed": ["DE", "AT", "CH"],
           "aggregateRating": {"@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "9", "bestRating": "5"}}
    out = f'<script type="application/ld+json">{json.dumps(org, ensure_ascii=False)}</script>'
    if faq:
        f = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]}
        out += f'<script type="application/ld+json">{json.dumps(f, ensure_ascii=False)}</script>'
    return out


def nav(home, theme=''):
    p = '' if home else '/'
    return f'''<body class="{theme}"><a class="skip" href="#main">Zum Inhalt springen</a>
<header class="nav"><div class="container nav-in">
<a class="brand" href="{'#top' if home else '/'}" aria-label="Digitale Gewinner – Startseite"><span class="brand-mark">{LOGO}</span><span>DIGITALE GEWINNER</span></a>
<nav class="nav-links" id="menu" aria-label="Hauptnavigation">
<a href="{p}#ziel" data-pick="p-mit">Mitarbeiter gewinnen</a>
<a href="{p}#ziel" data-pick="p-kun">Kunden gewinnen</a>
<a href="{p}#ergebnisse">Ergebnisse</a>
<a href="{p}#raphael">Über Raphael</a>
<a class="btn btn-gold" href="#analyse" data-cta="nav">Kostenlose Analyse</a>
</nav>
<button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menü öffnen"><i></i><i></i></button>
</div></header>'''


def hero(eyebrow, lines, lead, punch, btns, proof=True, wide=False):
    ln = ''.join(f'<span class="ln"><span>{l}</span></span>' for l in lines)
    prf = '''<div class="proof" data-r>
<div><b data-count="8" data-suf="">8</b>Jahre Erfahrung</div>
<div><b data-count="3000" data-suf="+">3.000+</b>Bewerbungen generiert</div>
<div><b data-count="500" data-suf="+">500+</b>Fachkräfte gewonnen</div>
<div><b data-count="200000" data-suf=" €+">200.000 €+</b>betreutes Werbebudget</div>
<div><b data-count="5" data-dec="1" data-suf=" ★">5,0 ★</b>bei Google</div>
<div class="who"><img src="/assets/images/raphael/raphael-hermann-portrait.webp" alt="Raphael Hermann" width="46" height="46" loading="lazy"><span>persönlich durch<br><strong>Raphael</strong></span></div>
</div>''' if proof else ''
    return f'''<main id="main"><section class="hero" id="top"><canvas id="net" aria-hidden="true"></canvas>
<div class="container"><span class="eyebrow" data-r>{eyebrow}</span>
<h1 class="{'wide' if wide else ''}">{ln}</h1>
<p class="lead" data-r>{lead}</p>
<p class="punch" data-r>{punch}</p>
<div class="btns" data-r>{btns}</div>
{prf}</div><span class="scroll-hint" aria-hidden="true"></span></section>'''


HERO_BTNS = (f'<a class="btn btn-gold" href="#ziel" data-goal="Mitarbeiter" data-cta="hero-mitarbeiter">Mitarbeiter gewinnen {ARROW}</a>'
             f'<a class="btn" href="#ziel" data-goal="Kunden" data-cta="hero-kunden">Kunden gewinnen</a>')


def problem():
    return '''<section class="section statement" id="problem"><div class="container">
<span class="eyebrow" data-r>Problembewusstsein</span>
<h2 class="big" style="margin-top:22px">Empfehlungen sind wertvoll. Planbar sind sie nicht.</h2>
<div class="two"><p data-r>Wenn Stellen lange offen bleiben, Kundenanfragen schwanken oder Interessenten nicht konsequent bearbeitet werden, wird Wachstum vom <b>Zufall</b> abhängig.</p>
<p data-r>Ihr Websystem schafft einen klaren Weg: Passende Menschen werden aufmerksam, verstehen Ihr Angebot und können unkompliziert den nächsten Schritt machen.</p></div>
<p class="result-line gold" data-r>Das Ergebnis: mehr passende Gespräche und weniger Arbeit davor.</p>
</div></section>'''


def usp():
    fl = ''.join(f'<div class="fl"><i>{i + 1}</i><span>{e(t)}</span></div>' for i, t in enumerate(FLOW))
    return f'''<section class="section" id="unterschied"><div class="container">
<div class="usp-top"><span class="eyebrow" data-r>Der Unterschied</span>
<h2 class="h2" data-r>Keine Website zum Anschauen. <span class="gold it">Ein System, das arbeitet.</span></h2>
<p class="lead" data-r>Eine gewöhnliche Website zeigt Informationen. Unser intelligentes Websystem hilft zusätzlich dabei, Menschen zu erreichen, Interesse in Kontakt zu verwandeln und offene Anfragen zuverlässig weiterzuführen.</p></div>
<div class="vs">
<div class="vs-card vs-old" data-r><span class="tag">Gewöhnliche Website</span><h3>Zeigt Informationen.</h3><div class="skeleton" aria-hidden="true"><i></i><i></i><i></i></div></div>
<div class="vs-card vs-new" data-r><span class="tag">Websystem</span><h3>Führt Kontakte bis zum Gespräch.</h3><div class="flowline" role="list" aria-label="Beispielhafter Ablauf"><span class="fill" aria-hidden="true"></span>{fl}</div></div>
</div>
<h3 class="can-title" data-r>Das System kann</h3>
<ul class="can" data-r>{lis(CAN)}</ul>
<p class="quote" data-r>Nicht das persönliche Gespräch wird automatisiert – <em>sondern die Arbeit, die Sie davon abhält.</em></p>
</div></section>'''


def choose():
    def ticks(t):
        return ''.join(f'<li>{e(i)}</li>' for i in t)
    return f'''<section class="section" id="ziel"><div class="container">
<div class="choose-head"><span class="eyebrow" data-r>Auswahl des Ziels</span>
<h2 class="h2" data-r>Wen möchten Sie gewinnen?</h2>
<p class="lead" data-r>Sie wählen das wichtigste Ziel. Wir bauen den vollständigen Weg bis zum Gespräch.</p></div>
<div class="seg" role="tablist" aria-label="Ziel wählen"><button type="button" role="tab" data-p="p-mit" aria-selected="true">Mitarbeiter</button><button type="button" role="tab" data-p="p-kun" aria-selected="false">Kunden</button></div>
<div class="choose">
<article class="panel" id="p-mit" data-r><span class="num">01</span><h3>Mitarbeiter gewinnen</h3>
<p><strong>Mehr Gespräche mit passenden Fachkräften aus Ihrer Region.</strong> Wir zeigen, warum es sich lohnt, bei Ihnen zu arbeiten, erreichen geeignete Menschen und machen den ersten Kontakt so einfach wie möglich.</p>
<ul class="ticks">{ticks(TICKS_MIT)}</ul>
<a class="btn btn-gold" href="#analyse" data-goal="Mitarbeiter" data-cta="panel-mitarbeiter">Mitarbeiter gewinnen {ARROW}</a>
<p class="micro">Branchen: <a class="gold" href="/pflege">Pflege</a> · <a class="gold" href="/handwerk-mitarbeiter">Handwerk</a></p></article>
<article class="panel" id="p-kun" data-r><span class="num">02</span><h3>Kunden gewinnen</h3>
<p><strong>Mehr passende Anfragen für die Aufträge, die Sie wirklich möchten.</strong> Wir machen Ihr Angebot verständlich, bringen es vor die richtigen Menschen und begleiten Interessenten bis zur konkreten Anfrage.</p>
<ul class="ticks">{ticks(TICKS_KUN)}</ul>
<a class="btn btn-gold" href="#analyse" data-goal="Kunden" data-cta="panel-kunden">Kunden gewinnen {ARROW}</a>
<p class="micro">Branche: <a class="gold" href="/handwerk-kunden">Handwerk</a></p></article>
</div>
<p class="both" data-r><b>Sie benötigen beides?</b> Wir beginnen mit Ihrem größten Engpass und bauen den zweiten Weg anschließend gezielt auf.</p>
</div></section>'''


def flow():
    st = ''.join(f'<article class="step"><div class="n" aria-hidden="true">{i + 1}</div><h3>{e(t)}</h3><p>{e(d)}</p></article>' for i, (t, d) in enumerate(STEPS))
    return f'''<section class="section flow" id="ablauf"><div class="container">
<div class="flow-head"><span class="eyebrow" data-r>So einfach funktioniert es</span>
<h2 class="h2" data-r>Sie sagen uns, wen Sie suchen. <span class="gold it">Wir kümmern uns um den Weg dorthin.</span></h2></div>
<div class="track-wrap"><div class="rail" aria-hidden="true"><span class="fill"></span></div><div class="track">{st}</div></div>
<div class="flow-cta" data-r><a class="btn btn-gold" href="#analyse" data-cta="ablauf">Kostenlose 15-Minuten-Analyse buchen {ARROW}</a></div>
</div></section>'''


def auto():
    chk = ''.join(f'<li><i><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.5 3.2 3.2L13 4.8"/></svg></i>{e(t)}</li>' for t in AUTO)
    return f'''<section class="section" id="automatisierung"><div class="container auto">
<div><span class="eyebrow" data-r>Automatisierung</span>
<h2 class="strike" aria-label="Weniger klicken. Weniger hinterherlaufen. Weniger liegen lassen."><span>Weniger klicken.</span><span>Weniger hinterherlaufen.</span><span>Weniger liegen lassen.</span></h2>
<p class="lead" data-r>Je nach Ausgangslage kann das System einen großen Teil der wiederkehrenden Schritte zwischen dem ersten Interesse und dem persönlichen Gespräch übernehmen.</p></div>
<div><p class="can-title" style="margin-top:0">Beispiele</p><ul class="checks">{chk}</ul></div>
</div></section>'''


def results(reviews=True, list_=True):
    revs = ''.join(f'<article class="rev"><div class="stars" aria-label="5 von 5 Sternen">★★★★★</div><p>„{e(t)}“</p><footer><span class="av" aria-hidden="true">{e(n[0])}</span><span><b>{e(n)}</b><br>Google-Rezension</span></footer></article>' for n, t in REVIEWS)
    lst = ''.join(f'<li><small>{i + 1:02d}</small>{e(t)}</li>' for i, t in enumerate(RESULTS))
    top = f'''<div class="res-top"><div><span class="eyebrow" data-r>Ergebnisse statt Fachbegriffe</span>
<h2 class="h2" data-r style="margin-bottom:0">Entscheidend ist, <span class="gold it">was bei Ihnen ankommt.</span></h2></div></div>
<ul class="res-list" data-r>{lst}</ul>
<div class="stats" data-r><div><b data-count="3000" data-suf="+">3.000+</b><span>Bewerbungen generiert</span></div><div><b data-count="500" data-suf="+">500+</b><span>Fachkräfte gewonnen</span></div><div><b data-count="5" data-dec="1" data-suf=" ★">5,0 ★</b><span>bei Google</span></div></div>
<p class="honest" data-r>Wir zeigen nur belegbare Ergebnisse – keine erfundenen Kennzahlen. Dokumentierte Fälle mit Ausgangslage, Weg, Ergebnis und Kundenzitat folgen.</p>''' if list_ else ''
    return f'''<section class="section" id="ergebnisse"><div class="container">{top}
<div class="rev-head" data-r><div class="score"><span class="g" aria-hidden="true">G</span><div><b>5,0</b> <span class="stars" aria-hidden="true">★★★★★</span><br><small class="muted">9 Google-Rezensionen</small></div></div></div>
<div class="revs" data-r tabindex="0" aria-label="Google-Rezensionen">{revs}</div>
</div></section>'''


def offer():
    t = ''.join(f'<li>{e(i)}</li>' for i in OFFER)
    return f'''<section class="section offer" id="paket"><div class="container offer-grid">
<div><span class="eyebrow" data-r>Einführungspartner werden</span>
<h2 class="h2" data-r>Ein klares Ziel. <span class="gold it">Ein vollständiger Weg bis zum Gespräch.</span></h2>
<p class="lead" data-r>Für unsere ersten zehn dokumentierten Erfolgspartnerschaften bauen und begleiten wir ein intelligentes Websystem für Mitarbeiter- oder Kundengewinnung.</p></div>
<div class="offer-box" data-r><h3>Einführungspaket</h3>
<div class="price"><span data-count="4900" data-suf=" €">4.900 €</span><small>netto</small></div>
<p class="note">Zuzüglich Werbebudget und gesetzlicher Umsatzsteuer.</p>
<ul class="ticks">{t}</ul>
<a class="btn btn-gold" href="#analyse" data-cta="angebot">Einführungspartnerschaft prüfen {ARROW}</a>
<div class="offer-foot"><span>Nach Abschluss der zehn Einführungspartnerschaften beginnt der reguläre, erweiterte Systemaufbau bei 14.900 € netto.</span><span>Keine durchgestrichenen Fantasiepreise, kein künstlicher Countdown.</span></div></div>
</div></section>'''


def about():
    return f'''<section class="section" id="raphael"><div class="container about">
<div class="portrait" data-r><img src="/assets/images/raphael/raphael-hermann-hero.webp" alt="Raphael Hermann, Gründer von Digitale Gewinner" width="1122" height="1402" loading="lazy"></div>
<div><span class="eyebrow" data-r>Persönlich statt weitergereicht</span>
<h2 class="h2" data-r>Sie arbeiten direkt mit <span class="gold it">Raphael Hermann.</span></h2>
<p data-r>Seit acht Jahren unterstütze ich Unternehmen dabei, digital sichtbarer zu werden und aus Interesse konkrete Gespräche zu machen.</p>
<p data-r>Dabei habe ich gelernt: Eine schöne Website allein verändert noch kein Unternehmen. Sie muss den richtigen Menschen eine klare Entscheidung ermöglichen und anschließend zuverlässig weiterarbeiten.</p>
<p data-r><strong>Keine Massenabfertigung:</strong> Ich kümmere mich wirklich persönlich um meine Kunden.</p>
<p data-r>Deshalb verbindet Digitale Gewinner alles Notwendige in einem verständlichen System – ohne anonymen Agenturprozess und ohne Weitergabe an wechselnde Ansprechpartner.</p>
<div class="btns" data-r><a class="btn btn-gold" href="#analyse" data-cta="raphael">Kostenlose Analyse mit Raphael buchen {ARROW}</a></div></div>
</div></section>'''


def faq():
    items = ''.join(f'<details><summary>{e(q)}</summary><div class="a"><p>{e(a)}</p></div></details>' for q, a in FAQ)
    return f'''<section class="section" id="faq"><div class="container faq-grid">
<div><span class="eyebrow" data-r>FAQ</span><h2 class="h2" data-r>Klarheit vor dem ersten Gespräch.</h2></div>
<div class="faq" data-r>{items}</div></div></section>'''


def final(preset=''):
    chips = ''.join(
        f'<label><input type="radio" name="goal" value="{v}"{" checked" if v == preset else ""}><span>{l}</span></label>'
        for v, l in (('Mitarbeiter', 'Mitarbeiter gewinnen'), ('Kunden', 'Kunden gewinnen'), ('Beides', 'Beides')))
    return f'''<section class="section final" id="analyse"><div class="container final-grid">
<div><span class="eyebrow" data-r>Schlussbereich</span>
<h2 class="h2" data-r>Wo verlieren Sie heute <span class="gold it">Bewerber oder Kunden?</span></h2>
<p class="lead" data-r>In 15 Minuten finden wir gemeinsam heraus, welcher Engpass Sie aktuell am meisten bremst und welcher erste Schritt den größten Hebel bietet.</p>
<p class="micro" data-r>Unverbindlich · persönlich mit Raphael · klare Einschätzung</p></div>
<form class="form" id="leadForm" name="analyse-15" method="POST" action="/danke.html" data-netlify="true" netlify-honeypot="bot-field" data-r>
<input type="hidden" name="form-name" value="analyse-15">
<p class="hp" aria-hidden="true"><label>Nicht ausfüllen <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
<input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign"><input type="hidden" name="utm_content"><input type="hidden" name="gclid"><input type="hidden" name="fbclid"><input type="hidden" name="d">
<div class="fields">
<div class="stepbar" aria-hidden="true"><i class="on"></i><i></i></div>
<div class="s1"><h3>Was ist Ihr wichtigstes Ziel?</h3>
<fieldset class="chips"><legend class="sr" style="position:absolute;left:-9999px">Ziel</legend>{chips}</fieldset>
<p class="err" role="alert"></p>
<button class="btn btn-gold next-btn" type="button" data-cta="form-weiter">Weiter {ARROW}</button></div>
<div class="s2" hidden><h3>Wohin dürfen wir uns melden?</h3>
<div class="field"><label for="f-name">Ihr Name</label><input id="f-name" name="name" autocomplete="name" required></div>
<div class="field"><label for="f-contact">Telefon oder E-Mail</label><input id="f-contact" name="contact" autocomplete="tel" inputmode="text" required></div>
<p class="err err2" role="alert"></p>
<button class="btn btn-gold" type="submit" data-cta="form-senden">Kostenlose 15-Minuten-Analyse buchen {ARROW}</button>
<button class="back-btn" type="button" style="background:none;border:0;color:var(--muted);margin:14px auto 0;display:block;cursor:pointer;min-height:44px">← Zurück</button></div>
<p class="fine">Unverbindlich. Ihre Angaben nutzen wir nur für die Kontaktaufnahme – siehe <a href="/datenschutz.html">Datenschutz</a>.</p>
</div>
<div class="done" role="status"><h3>Danke – WhatsApp öffnet sich.</h3><p class="done-txt"></p>
<a class="btn btn-gold wa-link" href="{WA}" target="_blank" rel="noopener">WhatsApp-Nachricht erneut öffnen {ARROW}</a><a class="btn cal-link" href="https://calendar.app.google/jZqwYfHqfjufkFmx5" target="_blank" rel="noopener" data-cta="kalender" style="margin-top:12px">Direkt Termin im Kalender wählen {ARROW}</a></div>
</form></div></section>'''


def footer():
    return f'''</main><footer class="site"><div class="container foot">
<div><a class="brand" href="/"><span class="brand-mark">{LOGO}</span><span>DIGITALE GEWINNER</span></a><p style="margin:14px 0 0">© 2026 Digitale Gewinner · Raphael Hermann</p></div>
<nav aria-label="Fußzeile"><a href="/pflege">Pflege</a><a href="/handwerk-mitarbeiter">Handwerk · Mitarbeiter</a><a href="/handwerk-kunden">Handwerk · Kunden</a><a href="/case-studies.html">Case Studies</a><a href="tel:+4971134063951">+49 711 34063951</a><a href="{WA}">WhatsApp</a><a href="/impressum.html">Impressum</a><a href="/datenschutz.html">Datenschutz</a></nav>
</div></footer>
<div class="mcta"><a class="btn btn-gold" href="#analyse" data-cta="mobile-bar">Kostenlose 15-Min-Analyse {ARROW}</a></div>
<script src="/vendor/gsap.min.js"></script><script src="/vendor/ScrollTrigger.min.js"></script><script src="/vendor/lenis.min.js"></script><script src="/site.js"></script></body></html>'''


# ---------- Seiten ----------
def home():
    h = head('Digitale Gewinner – Mehr Bewerbungen. Mehr Kundenanfragen. Weniger Arbeit.',
             'Intelligente Websysteme für Pflege- und Handwerksbetriebe: passende Menschen aus Ihrer Region erreichen, Angaben erfassen und bis zum persönlichen Gespräch begleiten. Persönlich durch Raphael Hermann.',
             '/', extra=schema(True))
    body = hero('Für Pflege- und Handwerksbetriebe',
                ['Mehr passende Bewerbungen.', 'Mehr Kundenanfragen.', '<span class="gold it">Weniger Arbeit.</span>'],
                'Wir bauen intelligente Websysteme, die passende Menschen aus Ihrer Region erreichen, ihre wichtigsten Angaben erfassen und sie bis zum persönlichen Gespräch begleiten.',
                'Sie führen die Gespräche. Das System übernimmt die wiederkehrende Arbeit davor.', HERO_BTNS)
    body += problem() + usp() + choose() + flow() + auto() + results() + offer() + about() + faq() + final()
    return h + nav(True) + body + footer()


BRANCH = {
    'pflege': dict(title='Mehr Bewerbungen von Pflegekräften aus Ihrer Region – Digitale Gewinner', eyebrow='Für Pflegebetriebe',
                   h1=['Mehr Bewerbungen von', 'Pflegekräften', '<span class="gold it">aus Ihrer Region.</span>'],
                   lead='Wir zeigen, warum sich passende Pflegekräfte für Ihr Unternehmen entscheiden sollten, vereinfachen die Kontaktaufnahme und begleiten Interessenten bis zum Gespräch.',
                   btn='Mitarbeitergewinnung prüfen lassen', goal='Mitarbeiter', ticks=TICKS_MIT, head='Mitarbeiter gewinnen', theme='theme-pflege', tc='#f7f2e8'),
    'handwerk-mitarbeiter': dict(title='Mehr Bewerbungen von Fachkräften für Handwerksbetriebe – Digitale Gewinner', eyebrow='Für Handwerksbetriebe',
                                 h1=['Mehr Bewerbungen von', 'Fachkräften', '<span class="gold it">aus Ihrer Region.</span>'],
                                 lead='Wir machen Ihren Betrieb als Arbeitgeber sichtbar, zeigen verständlich, was Sie auszeichnet, und erleichtern den ersten Kontakt.',
                                 btn='Fachkräftegewinnung prüfen lassen', goal='Mitarbeiter', ticks=TICKS_MIT, head='Mitarbeiter gewinnen', theme='theme-handwerk', tc='#111315'),
    'handwerk-kunden': dict(title='Mehr Anfragen für Handwerksbetriebe – Digitale Gewinner', eyebrow='Für Handwerksbetriebe',
                            h1=['Mehr Anfragen für die Aufträge,', '<span class="gold it">die zu Ihrem Betrieb passen.</span>'],
                            lead='Wir machen Ihre Leistungen verständlich, erreichen passende Menschen aus Ihrer Region und führen sie strukturiert bis zur Anfrage.',
                            btn='Kundengewinnung prüfen lassen', goal='Kunden', ticks=TICKS_KUN, head='Kunden gewinnen', theme='theme-handwerk', tc='#111315'),
}


def branch(slug, c):
    h = head(c['title'], c['lead'], '/' + slug, extra=schema(False))
    btns = f'<a class="btn btn-gold" href="#analyse" data-goal="{c["goal"]}" data-cta="branche-{slug}">{c["btn"]} {ARROW}</a>'
    body = hero(c['eyebrow'], c['h1'], c['lead'], 'Sie führen die Gespräche. Das System übernimmt die wiederkehrende Arbeit davor.', btns, wide=True)
    t = ''.join(f'<li>{e(i)}</li>' for i in c['ticks'])
    body += f'''<section class="section" id="ziel"><div class="container auto">
<div><span class="eyebrow" data-r>{c['head']}</span><h2 class="h2" data-r>Ein vollständiger Weg <span class="gold it">bis zum Gespräch.</span></h2></div>
<div data-r><ul class="ticks" style="margin-top:0">{t}</ul><div class="btns"><a class="btn btn-gold" href="#analyse" data-goal="{c['goal']}" data-cta="branche-mitte">{c['btn']} {ARROW}</a></div></div></div></section>'''
    body += flow() + auto() + results(list_=False) + offer() + faq() + final(c['goal'])
    return h + nav(False, c['theme']) + body + footer()


def outbound():
    h = head('Persönliche Analyse – Digitale Gewinner', 'Persönliche Analyse von Raphael Hermann.', '/analyse', noindex=True)
    body = f'''<main id="main"><div id="outbound">
<section class="hero compact" id="top"><canvas id="net" aria-hidden="true"></canvas><div class="container">
<span class="eyebrow" id="ob-eyebrow" data-r>Persönliche Analyse</span>
<h1 class="wide" id="ob-h1" style="font-size:clamp(2.2rem,6vw,5.4rem)">Zwei konkrete Ideen für mehr Anfragen.</h1>
<div id="ob-notice" class="notice" hidden>Diese Seite wird mit einem persönlichen Link aufgerufen. Bitte nutzen Sie den Link aus der Nachricht von Raphael.</div>
<div id="ob-main" hidden>
<p class="lead">Ich habe mir Ihren aktuellen Auftritt und den Weg bis zur Kontaktaufnahme angesehen. Dabei sind mir zwei Punkte aufgefallen, durch die heute möglicherweise passende Menschen verloren gehen.</p>
<div class="btns"><a class="btn btn-gold" href="#analyse" data-cta="outbound-hero">15 Minuten mit Raphael sprechen {ARROW}</a></div>
</div></div></section>
<div id="ob-body"><section class="section" style="padding-top:0"><div class="container">
<div><div class="video" id="ob-video" role="region" aria-label="Persönliches Video"></div></div>
<div class="obs">
<article class="obs-card"><div class="shot" id="ob-s1" aria-hidden="true"></div><div class="body"><span class="k">Beobachtung 1</span><h3 id="ob-t1"></h3><p id="ob-p1"></p><p class="micro" id="ob-n1"></p></div></article>
<article class="obs-card"><div class="shot" id="ob-s2" aria-hidden="true"></div><div class="body"><span class="k">Beobachtung 2</span><h3 id="ob-t2"></h3><p id="ob-p2"></p><p class="micro" id="ob-n2"></p></div></article>
</div>
<div class="next"><span class="eyebrow">Möglicher nächster Schritt</span><p class="lead" id="ob-next" style="margin-top:14px"></p></div>
</div></section></div></div>'''
    body += about().replace('id="raphael"', 'id="raphael"') + results(list_=False) + final()
    body = body.replace('<div id="ob-body">', '<div id="ob-body" data-ob>')
    return h + nav(False).replace('data-pick="p-mit"', '').replace('href="/#ziel"', 'href="/#ziel"') + body + footer()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {'index.html': home(), 'analyse.html': outbound()}
    for slug, c in BRANCH.items():
        pages[f'{slug}.html'] = branch(slug, c)
    for name, content in pages.items():
        (OUT / name).write_text(content, encoding='utf-8')
    for f in ('site.css', 'site.js'):
        shutil.copy2(HERE / f, OUT / f)
    shutil.copytree(HERE / 'vendor', OUT / 'vendor', dirs_exist_ok=True)
    data = HERE / 'analyse-data'
    if data.exists():
        dest = OUT / 'analyse-data'
        dest.mkdir(exist_ok=True)
        for f in data.glob('*.json'):
            if not f.name.startswith('_'):
                shutil.copy2(f, dest / f.name)
    print(f'Site built: {", ".join(pages)}')


if __name__ == '__main__':
    main()
