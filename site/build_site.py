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
SITE = 'https://digitalegewinner.de'
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

STEP_ICONS = ['<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/>', '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 17.5h7M17.5 14v7"/>', '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>', '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>', '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 14.5l2.2 2.2 4.3-4.2"/>']

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
    return (f'<!doctype html><html lang="de" data-gtm=""><head><meta charset="utf-8">'
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


BRANCH_NAV = {
    'pflege': ('Pflege', 'pflege', 'Mitarbeiter gewinnen', 'pflege-patienten', 'Patienten gewinnen'),
    'pflege-patienten': ('Pflege', 'pflege', 'Mitarbeiter gewinnen', 'pflege-patienten', 'Patienten gewinnen'),
    'handwerk-mitarbeiter': ('Handwerk', 'handwerk-mitarbeiter', 'Mitarbeiter gewinnen', 'handwerk-kunden', 'Kunden gewinnen'),
    'handwerk-kunden': ('Handwerk', 'handwerk-mitarbeiter', 'Mitarbeiter gewinnen', 'handwerk-kunden', 'Kunden gewinnen'),
}


def nav(home, theme='', cta='#analyse', slug=None):
    p = '' if home else '/'
    if slug in BRANCH_NAV:
        _, a, la, b, lb = BRANCH_NAV[slug]
        cur = lambda x: ' aria-current="page"' if x == slug else ''
        links = (f'<a href="/{a}"{cur(a)}>{la}</a><a href="/{b}"{cur(b)}>{lb}</a>'
                 '<a href="/#ergebnisse">Ergebnisse</a><a href="/#raphael">Über Raphael</a>')
    else:
        links = (f'<a href="/pflege">Pflege</a><a href="/handwerk-mitarbeiter">Handwerk</a>'
                 f'<a href="{p}#ergebnisse">Ergebnisse</a><a href="{p}#raphael">Über Raphael</a>')
    return f'''<body class="{theme}"><a class="skip" href="#main">Zum Inhalt springen</a>
<header class="nav"><div class="container nav-in">
<a class="brand" href="{'#top' if home else '/'}" aria-label="Digitale Gewinner – Startseite"><span class="brand-mark">{LOGO}</span><span>DIGITALE GEWINNER</span></a>
<nav class="nav-links" id="menu" aria-label="Hauptnavigation">
{links}
<a class="btn btn-gold" href="{cta}" data-cta="nav">Kostenlose Analyse</a>
</nav>
<button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menü öffnen"><i></i><i></i></button>
</div></header>'''


def loop_html(name):
    if not name:
        return ''
    p = f'/assets/images/loops/{name}'
    return (f'<video class="hero-bg" autoplay muted loop playsinline preload="metadata" poster="{p}.webp" aria-hidden="true" tabindex="-1">'
            f'<source src="{p}.webm" type="video/webm"><source src="{p}.mp4" type="video/mp4"></video>')


def photo_band(name, alt, caption, ratio=''):
    return (f'<section class="band"><div class="container"><figure class="pb {ratio}" data-r>'
            f'<img src="/assets/images/photos/{name}.webp" alt="{e(alt)}" width="1600" height="1062" loading="lazy" decoding="async">'
            f'<figcaption><b>{e(caption)}</b><span>Symbolbild</span></figcaption></figure></div></section>')


def triptych():
    items = [('pflege-pflegekraft', 'Pflegekraft hält die Hand einer älteren Dame', 'Passende Pflegekräfte', '/pflege'),
             ('hw-werkstatt', 'Handwerker-Team lacht gemeinsam in der Werkstatt', 'Fachkräfte fürs Handwerk', '/handwerk-mitarbeiter'),
             ('kunden-beratung', 'Handwerker zeigt einem Paar einen Plan auf dem Tablet', 'Anfragen für Aufträge, die passen', '/handwerk-kunden')]
    cards = ''.join(f'<a class="tp" href="{h}" data-r><img src="/assets/images/photos/{n}.webp" alt="{e(a)}" width="1600" height="1062" loading="lazy" decoding="async"><span><b>{e(c)}</b><i>Mehr erfahren →</i></span></a>' for n, a, c, h in items)
    return f'<section class="band"><div class="container"><div class="tps">{cards}</div><p class="micro" style="text-align:right">Symbolbilder</p></div></section>'


def hero_visual(items, title='Ihr Kontakt-Cockpit'):
    cards = ''
    labels = ['Angaben erfasst', 'Bestätigung gesendet', 'Erinnerung geplant', 'Termin vorbereitet']
    for i, (role, meta, lvl) in enumerate(items):
        dots = ''.join(f'<i class="{"on" if k < lvl else ""}" style="--d:{k * .35:.2f}s"></i>' for k in range(4))
        cards += (f'<div class="hv-card"><span class="hv-av" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg></span>'
                  f'<div class="hv-t"><b>{e(role)}</b><small>{e(meta)}</small><div class="hv-dots" aria-hidden="true">{dots}</div></div>'
                  f'<span class="hv-chip">{labels[lvl - 1]}</span></div>')
    return (f'<aside class="hv" aria-label="Beispielansicht: So landen Kontakte bei Ihnen"><div class="hv-bar"><span class="hv-live"></span>{e(title)}<em>Beispielansicht</em></div>'
            f'<div class="hv-list">{cards}</div>'
            f'<div class="hv-foot">Alles vorbereitet – <b>Sie führen nur noch das Gespräch.</b></div></aside>')


VIS_HOME = [('Pflegefachkraft (m/w/d)', '8 km entfernt', 4), ('Elektroniker (m/w/d)', '12 km entfernt', 3), ('Anfrage: Badumbau', '6 km entfernt', 2), ('Pflegehelfer (m/w/d)', '15 km entfernt', 1)]
VIS_PFLEGE = [('Pflegefachkraft (m/w/d)', '8 km entfernt', 4), ('Pflegehelfer (m/w/d)', '15 km entfernt', 3), ('Pflegefachkraft Teilzeit', '5 km entfernt', 2), ('Auszubildende Pflege', '11 km entfernt', 1)]
VIS_PF_KUN = [('Anfrage: Pflege zu Hause', '4 km entfernt', 4), ('Anfrage: Tagespflege', '7 km entfernt', 3), ('Anfrage: Pflegeberatung', '9 km entfernt', 2), ('Anfrage: Verhinderungspflege', '12 km entfernt', 1)]
VIS_HW_MIT = [('Elektroniker (m/w/d)', '8 km entfernt', 4), ('Anlagenmechaniker SHK', '14 km entfernt', 3), ('Dachdecker-Geselle', '6 km entfernt', 2), ('Tischler (m/w/d)', '12 km entfernt', 1)]
VIS_HW_KUN = [('Anfrage: Heizungstausch', '6 km entfernt', 4), ('Anfrage: Dachsanierung', '9 km entfernt', 3), ('Anfrage: Badumbau', '4 km entfernt', 2), ('Anfrage: Photovoltaik', '13 km entfernt', 1)]


def hero(eyebrow, lines, lead, punch, btns, proof=True, wide=False, visual='', loop='', kunden=False):
    ln = ''.join(f'<span class="ln"><span>{l}</span></span>' for l in lines)
    prf_mid = '''<div><b>Tag für Tag</b>neue Anfragen im Blick</div>
<div><b>Jede Anfrage</b>wird erfasst und nachgefasst</div>
''' if kunden else '''<div><b data-count="3000" data-suf="+">3.000+</b>Bewerbungen generiert</div>
<div><b data-count="500" data-suf="+">500+</b>Fachkräfte gewonnen</div>
'''
    prf = f'''<div class="proof" data-r>
{prf_mid}<div><b data-count="200000" data-suf=" €+">200.000 €+</b>betreutes Werbebudget</div>
<div class="who"><img src="/assets/images/raphael/raphael-hermann-portrait.webp" alt="Raphael Hermann" width="46" height="46" loading="lazy"><span>persönlich durch<br><strong>Raphael</strong></span></div>
</div>''' if proof else ''
    cls = ('wide ' if wide else '') + ('has-vis' if visual else '')
    return f'''<main id="main"><section class="hero" id="top">{loop_html(loop)}<canvas id="net" aria-hidden="true"></canvas>
<div class="container"><div class="hero-grid {'with-vis' if visual else ''}"><div class="hero-main"><span class="eyebrow" data-r>{eyebrow}</span>
<h1 class="{cls}">{ln}</h1>
<p class="lead" data-r>{lead}</p>
<p class="punch" data-r>{punch}</p>
<div class="btns" data-r>{btns}</div></div>
{('<div class="hero-vis" data-r>' + visual + '</div>') if visual else ''}</div>
{prf}</div><span class="scroll-hint" aria-hidden="true"></span></section>'''


HERO_BTNS = (f'<a class="btn btn-gold" href="/pflege" data-cta="hero-pflege">Für Pflegebetriebe {ARROW}</a>'
             f'<a class="btn" href="/handwerk-mitarbeiter" data-cta="hero-handwerk">Für Handwerksbetriebe</a>')


def video_section():
    return f'''<section class="section video-sec" id="video" aria-labelledby="video-h"><div class="container">
<div class="video-head"><span class="eyebrow" data-r>In 80 Sekunden erklärt · für Pflegeeinrichtungen</span>
<h2 class="h2" id="video-h" data-r>Eine Website war gestern. <span class="gold it">Ein Websystem arbeitet für Sie.</span></h2>
<p class="lead" data-r>Sehen Sie, wie aus einer Seite zum Anschauen ein System wird, das Ihnen wiederkehrende Arbeit abnimmt – und Sie behalten die Gespräche.</p></div>
<figure class="vid" data-r><div class="vid-frame">
<video id="expl" controls preload="none" playsinline poster="/assets/video/websystem-erklaervideo-poster.webp" width="1280" height="720">
<source src="/assets/video/websystem-erklaervideo.mp4" type="video/mp4">
Ihr Browser kann das Video nicht abspielen. <a href="/assets/video/websystem-erklaervideo.mp4">Video herunterladen</a>.</video>
<button class="vid-play" type="button" aria-label="Erklärvideo abspielen (80 Sekunden, mit Untertiteln)"><span class="vid-ico" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z"/></svg></span><span class="vid-lab">Video ansehen<small>80 Sek. · mit Untertiteln</small></span></button></div>
</figure>
<div class="btns vid-cta" data-r><a class="btn btn-gold" href="#analyse" data-cta="video-analyse">Kostenlose 15-Min-Analyse {ARROW}</a><a class="btn" href="#unterschied" data-cta="video-mehr">Wie das System funktioniert</a></div>
</div></section>'''


def case_pflege():
    return f'''<section class="section case-sec" id="fall" aria-labelledby="fall-h"><div class="container">
<div class="case-head"><span class="eyebrow" data-r>Ergebnis aus der Praxis · Pflege</span>
<h2 class="h2" id="fall-h" data-r>2.000 € Werbebudget. <span class="gold it">43 Bewerbungen. 3 Einstellungen.</span></h2>
<p class="lead" data-r>So sah eine Recruiting-Kampagne für eine Pflegeeinrichtung aus – mit durchschnittlich 46 € pro Bewerbung.</p></div>
<ol class="case-flow" id="case-flow" data-r>
<li><span class="cf-n" data-count="2000" data-suf=" €">2.000 €</span><span class="cf-l">Werbebudget<small>direkt an die Plattform gezahlt</small></span></li>
<li><span class="cf-n" data-count="43">43</span><span class="cf-l">Bewerbungen<small>durchschnittlich 46 € pro Bewerbung</small></span></li>
<li class="cf-end"><span class="cf-n" data-count="3">3</span><span class="cf-l">Einstellungen<small>aus den persönlichen Gesprächen</small></span></li>
</ol>
<div class="case-more" data-r>
<h3>Weitere Ergebnisse aus Pflege-Projekten</h3>
<ul>
<li><b>Pflegeresidenz</b> · 8 Wochen: 22 Bewerbungen, 10 Bewerbungsgespräche, 3 Einstellungen von Pflegefachkräften.</li>
<li><b>Ambulanter Pflegedienst</b> · rund 4 Wochen: 11 Bewerbungsgespräche, 2 Einstellungen von Fachkräften.</li>
</ul></div>
<p class="case-src" data-r>Quelle: Kampagnen, die Raphael Hermann bei Fachkraftmarketing verantwortet hat; Veröffentlichung mit schriftlicher Freigabe. Es sind Einzelergebnisse und keine Garantie – Bewerbungen und Einstellungen hängen auch von Region, Angebot und Ihrer Reaktionsgeschwindigkeit ab. Das Werbebudget ist nicht Teil unseres Honorars.</p>
<div class="btns" data-r><a class="btn btn-gold" href="#analyse" data-goal="Mitarbeiter" data-cta="fall-analyse">Was wäre bei Ihnen möglich? {ARROW}</a></div>
</div></section>'''


def brand_img(name, alt, cls='bimg'):
    """Offizielle Logo-/Badge-Dateien (aus dem Partnerportal) liegen unter assets/partners/. Nur wenn vorhanden, werden sie eingebunden."""
    for ext in ('svg', 'webp', 'png'):
        if (HERE.parent / 'assets' / 'partners' / f'{name}.{ext}').exists():
            return f'<img class="{cls}" src="/assets/partners/{name}.{ext}" alt="{e(alt)}" width="750" height="360" loading="lazy" decoding="async">'
    return ''


def partner_strip():
    g = brand_img('google-partner', 'Google Partner')
    m = brand_img('meta-partner', 'Meta Business Partner')
    gi = g or '<span class="pt-txt">Google Partner</span>'
    mi = m or '<span class="pt-txt">Meta Business Partner</span>'
    t = brand_img('tuev-zertifikat', 'TÜV SÜD: ISO/IEC 27001, zertifiziertes Informationssicherheits-Managementsystem')  # nur mit echter, freigegebener Datei; kein Text-Ersatz
    return f'''<section class="partners" aria-label="Partnerstatus"><div class="container pt-in">
<span class="pt-l">Partner, Bewertungen und Erfahrung</span>
<div class="pt-i">{gi}{mi}{t}<div class="seal"><b class="sl-n">5,0</b><span class="sl-s" aria-hidden="true">★★★★★</span><small>Google-Bewertungen</small></div><div class="seal"><b class="sl-n">8</b><span class="sl-t">Jahre</span><small>Erfahrung</small></div></div></div></section>'''


def problem():
    return '''<section class="section statement" id="problem"><div class="container">
<span class="eyebrow" data-r>Problembewusstsein</span>
<h2 class="big" style="margin-top:22px">Empfehlungen sind wertvoll. Planbar sind sie nicht.</h2>
<div class="two"><p data-r>Wenn Stellen lange offen bleiben, Kundenanfragen schwanken oder Interessenten nicht konsequent bearbeitet werden, wird Wachstum vom <b>Zufall</b> abhängig.</p>
<p data-r>Ihr Websystem schafft einen klaren Weg: Passende Menschen werden aufmerksam, verstehen Ihr Angebot und können unkompliziert den nächsten Schritt machen.</p></div>
<p class="result-line gold" data-r>Das Ergebnis: mehr passende Gespräche und weniger Arbeit davor.</p>
</div></section>'''


def usp():
    fl = ''.join(f'<div class="fl" role="listitem"><i>{i + 1}</i><span>{e(t)}</span></div>' for i, t in enumerate(FLOW))
    return f'''<section class="section" id="unterschied"><div class="container">
<div class="usp-top"><span class="eyebrow" data-r>Der Unterschied</span>
<h2 class="h2" data-r>Keine Website zum Anschauen. <span class="gold it">Ein System, das arbeitet.</span></h2>
<p class="lead" data-r>Eine gewöhnliche Website zeigt Informationen. Unser intelligentes Websystem hilft zusätzlich dabei, Menschen zu erreichen, Interesse in Kontakt zu verwandeln und offene Anfragen zuverlässig weiterzuführen.</p></div>
<div class="vs">
<div class="vs-card vs-old" data-r><span class="tag">Gewöhnliche Website</span><h3>Zeigt Informationen.</h3>
<div class="bm" aria-hidden="true"><div class="bm-top"><i></i><i></i><i></i><span>ihre-website.de</span></div><div class="bm-body"><i></i><i></i><i></i><div class="bm-img"></div></div></div>
<p class="bm-note"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/></svg>Besucher schauen – und gehen wieder.</p></div>
<div class="vs-card vs-new" data-r><span class="tag">Websystem</span><h3>Führt Kontakte bis zum Gespräch.</h3><div class="flowline" role="list" aria-label="Beispielhafter Ablauf"><span class="fill" aria-hidden="true"></span>{fl}</div></div>
</div>
<h3 class="can-title" data-r>Das System kann</h3>
<ul class="can" data-r>{lis(CAN)}</ul>
<p class="quote" data-r>Nicht das persönliche Gespräch wird automatisiert – <em>sondern die Arbeit, die Sie davon abhält.</em></p>
</div></section>'''


def choose():
    def card(num, name, text, ticks, ma, ka):
        return (f'<article class="panel" data-r><span class="num">{num}</span><h3>{name}</h3><p>{text}</p>'
                f'<ul class="ticks">{lis(ticks)}</ul>'
                f'<div class="btns"><a class="btn btn-gold" href="/{ma}" data-cta="panel-{ma}">Mitarbeiter gewinnen {ARROW}</a>'
                f'<a class="btn" href="/{ka}" data-cta="panel-{ka}">{"Patienten gewinnen" if ka == "pflege-patienten" else "Kunden gewinnen"}</a></div></article>')
    return f'''<section class="section" id="ziel"><div class="container">
<div class="choose-head"><span class="eyebrow" data-r>Ihre Branche</span>
<h2 class="h2" data-r>Für wen arbeiten <span class="gold it">Sie?</span></h2>
<p class="lead" data-r>Wählen Sie Ihre Branche. Dort entscheiden Sie, ob Sie Mitarbeiter oder Kunden gewinnen möchten – wir bauen den vollständigen Weg bis zum Gespräch.</p></div>
<div class="choose bran">
{card('01', 'Pflegebetriebe', '<strong>Pflegekräfte finden. Patienten und Angehörige erreichen.</strong> Für ambulante Dienste, Tagespflege und stationäre Einrichtungen.', ['Arbeitgeberauftritt, der Pflegekräfte überzeugt', 'einfache Bewerbung – auf Wunsch ohne Lebenslauf', 'Anfragen von Patienten und Angehörigen'], 'pflege', 'pflege-patienten')}
{card('02', 'Handwerksbetriebe', '<strong>Fachkräfte finden. Passende Aufträge gewinnen.</strong> Für Betriebe, die Mitarbeiter suchen oder mehr Anfragen aus der Region brauchen.', ['Arbeitgeberauftritt, der Fachkräfte überzeugt', 'klare Anfragewege für Ihre Leistungen', 'automatisches Erfassen und Nachfassen'], 'handwerk-mitarbeiter', 'handwerk-kunden')}
</div>
<p class="both" data-r><b>Sie benötigen beides?</b> Wir beginnen mit Ihrem größten Engpass und bauen den zweiten Weg anschließend gezielt auf.</p>
</div></section>'''


DEMO = {
    'home': dict(ads=[('pflege-pflegekraft', 'Pflege mit Zeit für Menschen', 'Jetzt in Ihrer Region bewerben'), ('hw-elektriker', 'Elektroniker (m/w/d) gesucht', 'Bei uns in Ihrer Region'), ('kunden-beratung', 'Neue Heizung? Jetzt beraten lassen', 'Unverbindlich anfragen')],
                 page_h='Kurz bewerben – auch ohne Lebenslauf', page_f=['Name', 'Telefon oder E-Mail', 'Was passt zu Ihnen?'], chips=['Pflege', 'Handwerk'], btn='Bewerbung absenden',
                 cols=[('Neu', [('M. K.', 'Pflegefachkraft'), ('T. B.', 'Elektroniker')]), ('Kontaktiert', [('S. L.', 'Pflegehelferin'), ('J. W.', 'Anlagenmechaniker')]), ('Gespräch', [('A. R.', 'Pflegefachkraft')])]),
    'pflege': dict(ads=[('pflege-pflegekraft', 'Pflege mit Zeit für Menschen', 'Jetzt in Ihrer Region bewerben'), ('pflege-team', 'Ein Team, das zusammenhält', 'Kurz bewerben – auch ohne Lebenslauf'), ('pflege-portrait', 'Wir suchen Sie (m/w/d)', 'Pflegefachkraft · Pflegehelfer')],
                   page_h='Kurz bewerben – auch ohne Lebenslauf', page_f=['Name', 'Telefon oder E-Mail', 'Ihre Qualifikation'], chips=['Fachkraft', 'Helfer', 'Azubi'], btn='Bewerbung absenden',
                   cols=[('Neu', [('M. K.', 'Pflegefachkraft'), ('T. B.', 'Pflegehelfer')]), ('Kontaktiert', [('S. L.', 'Teilzeit'), ('J. W.', 'Nachtdienst')]), ('Gespräch', [('A. R.', 'Pflegefachkraft')])]),
    'hw-mit': dict(ads=[('hw-elektriker', 'Elektroniker (m/w/d) gesucht', 'Bei uns in Ihrer Region'), ('hw-werkstatt', 'Ein Team mit Handschlag-Qualität', 'Kurz bewerben – auch ohne Lebenslauf'), ('hw-dachdecker', 'Dachdecker-Geselle (m/w/d)', 'Jetzt melden')],
                   page_h='Kurz bewerben – auch ohne Lebenslauf', page_f=['Name', 'Telefon oder E-Mail', 'Ihr Beruf'], chips=['Geselle', 'Meister', 'Azubi'], btn='Bewerbung absenden',
                   cols=[('Neu', [('M. K.', 'Elektroniker'), ('T. B.', 'Tischler')]), ('Kontaktiert', [('S. L.', 'Anlagenmechaniker'), ('J. W.', 'Dachdecker')]), ('Gespräch', [('A. R.', 'Elektroniker')])]),
    'pf-kun': dict(ads=[('pflege-pflegekraft', 'Pflege zu Hause – wir beraten Sie', 'Unverbindlich anfragen'), ('pflege-team', 'Ein Team, dem Sie vertrauen können', 'Jetzt Anfrage stellen'), ('pflege-portrait', 'Wir sind für Sie da', 'Beratung anfragen')],
                   page_h='Kurz anfragen – wir melden uns', page_f=['Name', 'Telefon oder E-Mail', 'Worum geht es?'], chips=['Zu Hause', 'Tagespflege', 'Beratung'], btn='Anfrage senden',
                   cols=[('Neu', [('M. K.', 'Pflege zu Hause'), ('T. B.', 'Beratung')]), ('Kontaktiert', [('S. L.', 'Tagespflege'), ('J. W.', 'Pflege zu Hause')]), ('Beratung', [('A. R.', 'Pflege zu Hause')])]),
    'hw-kun': dict(ads=[('kunden-beratung', 'Neue Heizung? Jetzt beraten lassen', 'Unverbindlich anfragen'), ('kunden-paar', 'Ihr Zuhause, sauber umgesetzt', 'Jetzt Anfrage stellen'), ('hw-dachdecker', 'Dach sanieren – aber richtig', 'Beratung anfragen')],
                   page_h='Kurz anfragen – wir melden uns', page_f=['Name', 'Telefon oder E-Mail', 'Worum geht es?'], chips=['Heizung', 'Dach', 'Bad'], btn='Anfrage senden',
                   cols=[('Neu', [('M. K.', 'Heizungstausch'), ('T. B.', 'Badumbau')]), ('Kontaktiert', [('S. L.', 'Dachsanierung'), ('J. W.', 'Photovoltaik')]), ('Beratung', [('A. R.', 'Heizungstausch')])]),
}


# Beispielwerte zur Veranschaulichung – KEINE echten Kundenergebnisse. Durch belegte Zahlen ersetzen, sobald freigegeben.
CAMPAIGN = dict(
    title='Kampagnen-Übersicht',
    kpis=[('Reichweite', '48.200'), ('Klicks', '1.340'), ('Bewerbungen', '86'), ('Kosten je Bewerbung', '45 €')],
    series=[6, 9, 8, 14, 18, 17, 25, 31, 30, 42, 55, 61, 74, 86],
    ads=[('Anzeige A', 41), ('Anzeige B', 29), ('Anzeige C', 16)],
)


def campaign():
    c = CAMPAIGN
    pts = c['series']; mx = max(pts)
    xs = [round(i * 300 / (len(pts) - 1), 1) for i in range(len(pts))]
    ys = [round(100 - v / mx * 88, 1) for v in pts]
    line = ' '.join(f'{x},{y}' for x, y in zip(xs, ys))
    area = f'0,100 {line} 300,100'
    kp = ''.join(f'<div class="cp-k"><small>{e(k)}</small><b>{e(v)}</b></div>' for k, v in c['kpis'])
    tot = max(v for _, v in c['ads'])
    rows = ''.join(f'<div class="cp-r"><span>{e(n)}</span><i><u style="--w:{v / tot * 100:.0f}%"></u></i><b>{v}</b></div>' for n, v in c['ads'])
    return (f'<div class="cp" data-r><div class="kb-bar"><span class="hv-live"></span>{e(c["title"])}<em>Beispielwerte</em></div>'
            f'<div class="cp-grid"><div><div class="cp-kpis">{kp}</div>'
            f'<svg class="cp-chart" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cpg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity=".45"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></linearGradient></defs>'
            f'<polygon points="{area}" fill="url(#cpg)"/><polyline class="cp-line" points="{line}" fill="none" stroke="var(--gold)" stroke-width="2.2" vector-effect="non-scaling-stroke"/></svg></div>'
            f'<div class="cp-rows"><small>Bewerbungen je Anzeige</small>{rows}</div></div>'
            f'<div class="cp-note">Beispielwerte zur Veranschaulichung – keine Kundenergebnisse.</div></div>')


def demo(key):
    d = DEMO[key]
    proof_line = '' if key.endswith('kun') else ' · <strong class="gold">3.000+ Bewerbungen generiert · 500+ Fachkräfte gewonnen</strong>'
    ads = ''
    for i, (img, h, s) in enumerate(d['ads']):
        ads += (f'<div class="ad ad{i}"><div class="ad-h"><span class="ad-av">{LOGO}</span><span><b>Ihr Betrieb</b><small>Anzeige</small></span></div>'
                f'<img src="/assets/images/photos/{img}.webp" alt="" width="1600" height="900" loading="lazy" decoding="async">'
                f'<div class="ad-f"><span><b>{e(h)}</b><small>{e(s)}</small></span><i>Mehr</i></div></div>')
    fields = ''.join(f'<div class="ph-f"><small>{e(f)}</small><i></i></div>' for f in d['page_f'][:2])
    chips = ''.join(f'<span class="{"on" if k == 0 else ""}">{e(c)}</span>' for k, c in enumerate(d['chips']))
    cols = ''
    for name, cards in d['cols']:
        cc = ''.join(f'<div class="kb-c"><i>{e(n[0])}</i><span><b>{e(n)}</b><small>{e(r)}</small></span></div>' for n, r in cards)
        cols += f'<div class="kb-col"><h4 aria-level="3">{e(name)}<em>{len(cards)}</em></h4>{cc}</div>'
    return f'''<section class="section demo" id="beispiel"><div class="container">
<div class="demo-head"><span class="eyebrow" data-r>So sieht das aus</span>
<h2 class="h2" data-r>Von der Anzeige bis zum Gespräch – <span class="gold it">alles aus einer Hand.</span></h2>
<p class="lead" data-r>Beispielansichten: So erreichen wir passende Menschen, so einfach können sie den nächsten Schritt machen und so bekommen Sie sie vorbereitet zurück.</p></div>
<div class="dm-grid">
<div class="dm-col" data-r><div class="dm-lbl"><b>1</b> Passende Menschen werden aufmerksam</div><div class="ads" aria-label="Beispiel-Anzeigen">{ads}</div></div>
<div class="dm-arrow" aria-hidden="true"><i></i></div>
<div class="dm-col" data-r><div class="dm-lbl"><b>2</b> Sie machen unkompliziert den nächsten Schritt</div>
<div class="phone" aria-label="Beispiel: Bewerbungsseite auf dem Handy"><div class="ph-top"></div><div class="ph-body"><span class="ph-brand">{LOGO} Ihr Betrieb</span><h4 aria-level="3">{e(d['page_h'])}</h4>{fields}<div class="ph-chips">{chips}</div><div class="ph-btn">{e(d['btn'])}</div><small class="ph-note">✓ Bestätigung kommt automatisch</small></div></div></div>
<div class="dm-arrow" aria-hidden="true"><i></i></div>
<div class="dm-col" data-r><div class="dm-lbl"><b>3</b> Sie erhalten vorbereitete Kontakte</div>
<div class="kb" aria-label="Beispiel: Bewerber-Cockpit"><div class="kb-bar"><span class="hv-live"></span>Ihr Cockpit<em>Beispielansicht</em></div><div class="kb-cols">{cols}</div></div></div>
</div>
{campaign()}
<p class="micro" style="text-align:center" data-r>Alle Namen und Inhalte sind Beispiele. Echte Ergebnisse zeigen wir ausschließlich belegt.{proof_line}</p>
</div></section>'''


def flow():
    st = ''.join(f'<article class="step"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true">{STEP_ICONS[i]}</svg><div class="n" aria-hidden="true">{i + 1}</div><h3>{e(t)}</h3><p>{e(d)}</p></article>' for i, (t, d) in enumerate(STEPS))
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


def live():
    return f'''<section class="section live" id="alltag" aria-labelledby="live-h"><div class="container">
<div class="live-head"><span class="eyebrow" data-r>Das System im Alltag</span>
<h2 class="h2" id="live-h" data-r>Drei Dinge, die Ihnen <span class="gold it">niemand mehr hinterhertragen muss.</span></h2></div>
<div class="live-grid" data-anim>
<article class="lv" data-r><div class="lv-ui lv-form" aria-hidden="true"><i class="l1"></i><i class="l2"></i><i class="l3"></i><b></b></div>
<h3>Erfasst</h3><p>Die wichtigsten Angaben werden direkt abgefragt und übersichtlich gesammelt – ohne Zettel und ohne Nachtelefonieren.</p></article>
<article class="lv" data-r><div class="lv-ui lv-bell" aria-hidden="true"><span class="n1">Bestätigung gesendet</span><span class="n2">Erinnerung geplant</span><span class="n3">Termin vorbereitet</span></div>
<h3>Erinnert</h3><p>Bestätigungen und Erinnerungen gehen automatisch raus. Termine werden vorbereitet, bevor das Gespräch beginnt.</p></article>
<article class="lv" data-r><div class="lv-ui lv-chat" aria-hidden="true"><em class="c1"></em><em class="c2"></em><em class="c3"></em></div>
<h3>Fasst nach</h3><p>Bleibt eine Rückmeldung aus, wird nachgefasst. Offene nächste Schritte bleiben sichtbar.</p></article>
</div>
<p class="micro" data-r>Schematische Beispielansichten. Sie führen die Gespräche – das System übernimmt die wiederkehrende Arbeit davor.</p>
</div></section>'''


def compare():
    rows = [('Ein Ansprechpartner für alles', 0, 0, 1), ('Kontakte werden automatisch erfasst', 0, 0, 1),
            ('Bestätigen, erinnern und nachfassen', 0, 0, 1), ('Auftritt, Werbung und Ablauf sind aufeinander abgestimmt', 0, 1, 1),
            ('Persönliche Gespräche bleiben bei Ihnen', 1, 1, 1)]
    ok = '<span class="yes" aria-label="ja">✓</span>'; no = '<span class="no" aria-label="meist nicht">–</span>'
    body = ''.join(f'<tr><th scope="row">{e(t)}</th>' + ''.join(f'<td>{ok if v else no}</td>' for v in (a, b, c)) + '</tr>' for t, a, b, c in rows)
    return f'''<section class="section cmp" id="vergleich" aria-labelledby="cmp-h"><div class="container">
<div class="live-head"><span class="eyebrow" data-r>Der Vergleich</span>
<h2 class="h2" id="cmp-h" data-r>Selbst koordinieren oder <span class="gold it">ein Websystem nutzen?</span></h2></div>
<div class="cmp-wrap" data-r><table class="cmp-t"><thead><tr><th><span class="sr" style="position:absolute;left:-9999px">Merkmal</span></th><th>Selbst machen</th><th>Mehrere Dienstleister</th><th class="me">Websystem</th></tr></thead><tbody>{body}</tbody></table></div>
<p class="micro" data-r>Vereinfachte, typische Darstellung. Im Einzelfall kann es anders aussehen.</p>
</div></section>'''


def check(goal=''):
    return f'''<section class="section chk" id="check" aria-labelledby="chk-h"><div class="container">
<div class="live-head"><span class="eyebrow" data-r>30-Sekunden-Check</span>
<h2 class="h2" id="chk-h" data-r>Wo steckt bei Ihnen <span class="gold it">der Engpass?</span></h2></div>
<div class="chk-box" data-r data-quiz>
<ol class="q-list">
<li class="q"><fieldset><legend>1 · Was möchten Sie gewinnen?</legend><div class="qo"><label><input type="radio" name="q1" value="Mitarbeiter"><span>Mitarbeiter</span></label><label><input type="radio" name="q1" value="Kunden"><span>Kunden</span></label><label><input type="radio" name="q1" value="Beides"><span>Beides</span></label></div></fieldset></li>
<li class="q"><fieldset><legend>2 · Wie läuft der erste Kontakt heute?</legend><div class="qo"><label><input type="radio" name="q2" value="a"><span>Telefon oder E-Mail, ohne feste Abfolge</span></label><label><input type="radio" name="q2" value="b"><span>Es gibt ein Formular</span></label><label><input type="radio" name="q2" value="c"><span>Es gibt keinen klaren Weg</span></label></div></fieldset></li>
<li class="q"><fieldset><legend>3 · Wie schnell melden Sie sich bei neuen Kontakten?</legend><div class="qo"><label><input type="radio" name="q3" value="a"><span>Am selben Tag</span></label><label><input type="radio" name="q3" value="b"><span>Nach zwei bis drei Tagen</span></label><label><input type="radio" name="q3" value="c"><span>Unregelmäßig</span></label></div></fieldset></li>
</ol>
<div class="q-res" role="status" aria-live="polite" hidden><p class="q-txt"></p><a class="btn btn-gold" href="#analyse" data-cta="check-analyse" data-quiz-cta>Das in 15 Minuten besprechen {ARROW}</a></div>
</div>
<p class="micro" data-r>Ihre Auswahl wird nicht gespeichert. Das Ergebnis ist eine erste Orientierung und ersetzt keine Analyse.</p>
</div></section>'''


ICO = {
    'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>', 'home': '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>', 'camp': '<path d="M4 19V9m6 10V5m6 14v-7m4 7H2"/>',
    'grp': '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    'ad': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>', 'aud': '<circle cx="9" cy="9" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 8a3 3 0 1 1 0 6"/>',
    'set': '<circle cx="12" cy="12" r="3"/><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1m0-12.8-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    'key': '<circle cx="8" cy="12" r="4"/><path d="M12 12h9m-3 0v3"/>', 'goal': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
    'srch': '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>', 'plus': '<path d="M12 5v14M5 12h14"/>', 'chev': '<path d="m6 9 6 6 6-6"/>',
}


def ico(n):
    return f'<svg viewBox="0 0 24 24" aria-hidden="true">{ICO[n]}</svg>'


def chart(pts, cls=''):
    """Linienchart (Platzhalterverlauf, ohne Achsenwerte) als SVG."""
    w, h = 600, 150
    xs = [i * w / (len(pts) - 1) for i in range(len(pts))]
    ys = [h - 12 - v * (h - 30) / 100 for v in pts]
    d = 'M' + ' L'.join(f'{x:.0f},{y:.0f}' for x, y in zip(xs, ys))
    grid = ''.join(f'<line x1="0" x2="{w}" y1="{y}" y2="{y}"/>' for y in (30, 70, 110))
    return (f'<svg class="ch {cls}" viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><g class="gr">{grid}</g>'
            f'<path class="ar" d="{d} L{w},{h} L0,{h}Z"/><path class="ln" d="{d}" pathLength="1"/></svg>')


def fmt_de(n):
    return f'{n:,}'.replace(',', '.')


def spark(pts):
    w, h = 120, 36
    xs = [i * w / (len(pts) - 1) for i in range(len(pts))]
    ys = [h - 4 - v * (h - 8) / 100 for v in pts]
    return f'<svg class="sp" viewBox="0 0 {w} {h}" preserveAspectRatio="none" aria-hidden="true"><path d="M' + ' L'.join(f'{x:.0f},{y:.0f}' for x, y in zip(xs, ys)) + '" pathLength="1"/></svg>'


def nav_rail(items):
    return '<div class="rail-ui" aria-hidden="true">' + ''.join(f'<span class="{"on" if i == 0 else ""}">{ico(n)}</span>' for i, n in enumerate(items)) + '</div>'


META_DATA = {
    'pflege': dict(img='pflege-team', head='Pflege mit Zeit für Menschen', sub='Jetzt in Ihrer Region bewerben', who='Pflegekräfte', real=True,
                   rows=[('Pflegefachkraft (m/w/d) · Region', 'Aktiv', '2.000 €', 2000, '43', '46 €', '2.000 €', '184.220', '421.980'),
                         ('Pflegehelfer (m/w/d) · Region', 'Entwurf', '—', 0, '—', '—', '—', '—', '—'),
                         ('Karriere-Video · Team', 'Entwurf', '—', 0, '—', '—', '—', '—', '—')],
                   tot=('2.000 €', '43', '46 €')),
    'handwerk-mitarbeiter': dict(img='hw-elektriker', head='Elektroniker (m/w/d) gesucht', sub='Bei uns in Ihrer Region', who='Fachkräfte', real=False,
                   rows=[('Elektroniker (m/w/d) · Region', 'Aktiv', '25 € / Tag', 0, '18', '41 €', '738 €', '61.420', '140.310'),
                         ('Dachdecker-Geselle · Region', 'Aktiv', '20 € / Tag', 0, '11', '45 €', '495 €', '38.905', '92.760'),
                         ('Karriere-Video · Betrieb', 'Entwurf', '—', 0, '—', '—', '—', '—', '—')],
                   tot=('1.233 €', '29', '43 €')),
}
GOOGLE_DATA = {
    'pflege-patienten': dict(q='Tagespflege in Ihrer Stadt', ad='Tagespflege – wir beraten Sie persönlich', desc='Unverbindlich anfragen. Wir melden uns zeitnah bei Ihnen.', links=['Beratung anfragen', 'Leistungen', 'So läuft es ab'], req='Anfrage: Tagespflege', who='Patienten und Angehörige',
                             camps=['Tagespflege · Region', 'Pflege zu Hause · Region', 'Pflegeberatung · Region']),
    'handwerk-kunden': dict(q='Heizung erneuern in Ihrer Stadt', ad='Heizungstausch vom Fachbetrieb aus Ihrer Region', desc='Jetzt unverbindlich anfragen und Beratungstermin vereinbaren.', links=['Angebot anfragen', 'Leistungen', 'Referenzen'], req='Anfrage: Heizungstausch', who='Kunden',
                            camps=['Heizungstausch · Region', 'Dachsanierung · Region', 'Badumbau · Region']),
}


def meta_manager(slug):
    d = META_DATA[slug]
    ad_visual = ('<img src="/assets/images/creatives/stufe-1.webp" alt="" width="760" height="950" loading="lazy" decoding="async" class="cr-img">' if slug == 'pflege' else f'<img src="/assets/images/photos/{d["img"]}.webp" alt="" width="1600" height="900" loading="lazy" decoding="async">')
    rows = ''
    for i, (n, st, bud, _v, res, cpr, spent, reach, imp) in enumerate(d['rows']):
        act = st == 'Aktiv'
        rows += (f'<tr style="--i:{i}"><td><span class="ck"></span></td><td><span class="tg{" on" if act else ""}"></span></td>'
                 f'<th scope="row"><b>{e(n)}</b><small>Kampagne · Bewerbungen</small></th>'
                 f'<td><span class="dot {"g" if act else "x"}"></span>{"Aktiv" if act else "Entwurf"}</td><td>{bud}</td><td class="n">{res}</td><td class="n">{cpr}</td><td class="n">{spent}</td><td class="n hide-s">{reach}</td><td class="n hide-s">{imp}</td></tr>')
    foot = (f'<tfoot><tr><td></td><td></td><th scope="row">Ergebnisse aus {len(d["rows"])} Kampagnen</th><td></td><td></td><td class="n">{d["tot"][1]}</td><td class="n">{d["tot"][2]}</td><td class="n">{d["tot"][0]}</td><td class="n hide-s"></td><td class="n hide-s"></td></tr></tfoot>')
    note = ('Die Werte der aktiven Kampagne stammen aus dem Fall weiter unten (eine Pflegeeinrichtung, Einzelergebnis). Reichweite und Impressionen sind Beispielwerte.' if d['real']
            else 'Beispieldaten zur Veranschaulichung – keine echten Ergebnisse. Die tatsächlichen Werte hängen von Region, Zielgruppe und Wettbewerb ab.')
    return f'''<section class="section toolsec" id="werbung" aria-labelledby="meta-h"><div class="container">
<div class="tool-head"><span class="eyebrow" data-r>Ihre Anzeigen · Meta</span>
<h2 class="h2" id="meta-h" data-r>Ihre Kampagne läuft dort, wo {d['who']} <span class="gold it">täglich unterwegs sind.</span></h2>
<p class="lead" data-r>Wir richten Ihre Kampagne im Meta Werbeanzeigenmanager ein, steuern sie nach Region und Zielgruppe und werten sie laufend aus. Das Werbebudget zahlen Sie direkt an Meta.</p></div>
<div class="ui ui-mgr" data-anim data-r role="img" aria-label="Beispielansicht eines Werbeanzeigenmanagers mit Kampagnenübersicht und Kennzahlen">
<div class="mg-top"><span class="mg-burger">{ico('menu')}</span>{brand_img('meta', 'Meta', 'mg-logo')}<b>Werbeanzeigenmanager</b><span class="acc">Ihr Betrieb · Werbekonto<i>{ico('chev')}</i></span><span class="mg-search">{ico('srch')}Suchen und filtern</span><em>Beispieldaten</em></div>
<div class="mg-body">{nav_rail(['home', 'camp', 'grp', 'ad', 'aud', 'set'])}
<div class="mg-main">
<div class="mg-tabs"><b class="on">Kampagnen</b><b>Anzeigengruppen</b><b>Anzeigen</b></div>
<div class="mg-tools"><span class="btn-b">{ico('plus')}Erstellen</span><span class="btn-o">Bearbeiten</span><span class="btn-o">Duplizieren</span><span class="btn-o dt">Letzte 30 Tage{ico('chev')}</span></div>
<div class="mg-mid"><div class="mg-chart"><div class="mg-cl"><b>Bewerbungen pro Tag</b><small>Verlauf · Beispieldarstellung</small></div>{chart([18, 26, 22, 38, 34, 52, 46, 61, 58, 74, 70, 88], 'meta')}</div>
<div class="ui ui-ad ad-in" aria-hidden="true"><div class="ad-h"><span class="ad-av">{LOGO}</span><span><b>Ihr Betrieb</b><small>Anzeige</small></span></div>
{ad_visual}
<div class="ad-f"><span><b>{e(d['head'])}</b><small>{e(d['sub'])}</small></span><i>Jetzt bewerben</i></div></div>
</div>
<div class="tbl-wrap"><table class="mg-t"><thead><tr><th></th><th></th><th>Kampagne</th><th>Lieferung</th><th>Budget</th><th>Ergebnisse</th><th>Kosten pro Ergebnis</th><th>Ausgegeben</th><th class="hide-s">Reichweite</th><th class="hide-s">Impressionen</th></tr></thead><tbody>{rows}</tbody>{foot}</table></div>
</div></div>
</div>
<ul class="tool-pts" data-r><li>Zielgruppe nach Region und Interessen</li><li>Anzeigen mit Bild oder Video</li><li>Einfacher Kontakt – auf Wunsch ohne Lebenslauf</li><li>Laufende Auswertung und Optimierung</li></ul>
<p class="micro" data-r>{note} Keine Garantie auf Bewerbungen oder Einstellungen.</p>
</div></section>'''


def google_search(slug):
    d = GOOGLE_DATA[slug]
    links = ''.join(f'<span>{e(l)}</span>' for l in d['links'])
    kpis = [('Klicks', 'k'), ('Impressionen', 'i'), ('Anfragen', 'a'), ('Kosten', 'c')]
    sp = {'k': [20, 34, 30, 46, 52, 64, 78], 'i': [30, 36, 44, 42, 58, 66, 72], 'a': [12, 22, 18, 40, 44, 60, 82], 'c': [40, 44, 42, 50, 54, 58, 60]}
    vals = {'k': (1284, ''), 'i': (38410, ''), 'a': (47, ''), 'c': (1150, ' €')}
    kp = ''.join(f'<div class="kp"><small>{a}</small><b data-count="{vals[k][0]}" data-suf="{vals[k][1]}">{fmt_de(vals[k][0])}{vals[k][1]}</b>{spark(sp[k])}</div>' for a, k in kpis)
    data = [('20 € / Tag', '612', '18.200', '24'), ('15 € / Tag', '401', '11.900', '14'), ('10 € / Tag', '271', '8.310', '9')]
    camps = ''.join(f'<tr style="--i:{i}"><td><span class="ck"></span></td><th scope="row"><b>{e(c)}</b><small>Suchnetzwerk</small></th><td><span class="dot g"></span>Aktiv</td><td>{v[0]}</td><td class="n">{v[1]}</td><td class="n hide-s">{v[2]}</td><td class="n">{v[3]}</td></tr>' for i, (c, v) in enumerate(zip(d['camps'], data)))
    return f'''<section class="section toolsec" id="werbung" aria-labelledby="g-h"><div class="container">
<div class="tool-head"><span class="eyebrow" data-r>Gefunden werden · Google</span>
<h2 class="h2" id="g-h" data-r>Wer sucht, soll Sie finden – <span class="gold it">und direkt anfragen.</span></h2>
<p class="lead" data-r>{d['who']} suchen bei Google. Wir richten Ihre Kampagne in Google Ads ein, pflegen Ihr Profil und sorgen für einen einfachen Weg zur Anfrage. Das Werbebudget zahlen Sie direkt an Google.</p></div>
<div class="ui ui-gads" data-anim data-r role="img" aria-label="Beispielansicht eines Google-Ads-Dashboards mit Kennzahlen, Verlauf und Kampagnen">
<div class="mg-top ga"><span class="mg-burger">{ico('menu')}</span>{brand_img('google', 'Google', 'mg-logo')}<b>Google Ads</b><span class="acc">Ihr Betrieb · Konto<i>{ico('chev')}</i></span><span class="mg-search">{ico('srch')}Suchen</span><em>Beispieldaten</em></div>
<div class="mg-body">{nav_rail(['home', 'camp', 'grp', 'ad', 'key', 'goal'])}
<div class="mg-main">
<div class="mg-tabs"><b class="on">Übersicht</b><b>Kampagnen</b><b>Keywords</b><b>Ziele</b><span class="dtp">Letzte 30 Tage{ico('chev')}</span></div>
<div class="kp-row">{kp}</div>
<div class="mg-chart"><div class="mg-cl"><b>Anfragen im Zeitverlauf</b><small>Verlauf · Beispieldarstellung</small></div>{chart([14, 20, 18, 30, 28, 42, 38, 55, 52, 66, 72, 84], 'goog')}</div>
<div class="tbl-wrap"><table class="mg-t"><thead><tr><th></th><th>Kampagne</th><th>Status</th><th>Budget</th><th>Klicks</th><th class="hide-s">Impressionen</th><th>Anfragen</th></tr></thead><tbody>{camps}</tbody></table></div>
</div></div></div>
<div class="serp-lbl" data-r><b>So erscheint Ihr Angebot bei der Suche</b></div>
<div class="tool-grid one" data-r>
<div class="ui ui-g" data-anim role="img" aria-label="Beispielansicht einer Google-Suche mit Anzeige, Karteneintrag und eingehender Anfrage">
<div class="ui-bar"><i></i><i></i><i></i><span>Suche · Beispielansicht</span></div>
<div class="g-search"><span class="gq"><em>{e(d['q'])}</em></span></div>
<div class="g-res">
<div class="g-ad r1"><small><b>Anzeige</b> · ihr-betrieb.de</small><h4 aria-level="3">{e(d['ad'])}</h4><p>{e(d['desc'])}</p><div class="g-links">{links}</div></div>
<div class="g-map r2"><div class="map" aria-hidden="true"><i class="p1"></i><i class="p2"></i><i class="p3"></i></div>
<ul><li class="me"><b>Ihr Betrieb</b><span class="st">★★★★★</span><small>Geöffnet · in Ihrer Nähe</small></li><li><b class="sk"></b></li><li><b class="sk"></b></li></ul></div>
</div>
<div class="g-toast" aria-hidden="true"><span class="dot"></span><span><b>Neue Anfrage</b><small>{e(d['req'])}</small></span></div>
</div>
</div>
<ul class="tool-pts" data-r><li>Anzeigen bei der Suche in Ihrer Region</li><li>Gepflegtes Google-Profil mit Bewertungen</li><li>Einfacher Anfrageweg mit den wichtigsten Angaben</li><li>Automatisches Bestätigen und Nachfassen</li></ul>
<p class="micro" data-r>Beispieldaten zur Veranschaulichung, keine echten Ergebnisse. Keine Garantie auf Platzierungen oder Anfragen.</p>
</div></section>'''


STAGES = [
    ('Wiedererkennung', 'Die Pflegekraft erkennt sich wieder.', 'Kein „Wir suchen dich". Die Anzeige beginnt bei ihr: Vielleicht ist sie gar nicht müde von der Pflege, sondern vom Drumherum.', 'Mehr über uns', 'stufe-1'),
    ('Konflikt bewusst machen', 'Das Problem bekommt einen Namen.', 'Dienstplanung, Einspringen, fehlende Absprachen: Es liegt oft nicht am Beruf, sondern am System drumherum.', 'Warum wir anders sind', 'stufe-2'),
    ('Möglichkeit öffnen', 'Es gibt einen anderen Weg.', 'Voll- oder Teilzeit, echte Planbarkeit, ein Umfeld mit mehr Raum für Menschen. Die Alternative wird vorstellbar.', 'Arbeiten bei uns', 'stufe-3'),
    ('Vertrauen & Beweis', 'Nicht nur nette Worte.', 'Gute Einarbeitung, kurze Entscheidungswege, ein Team, auf das man sich verlassen kann. Jetzt braucht es Belege.', 'Team kennenlernen', 'stufe-4'),
    ('Risiko reduzieren', 'Du musst dich noch nicht bewerben.', 'Erst mal unverbindlich reinschauen. Kein Bewerbungsmarathon, kein Druck, kein Lebenslauf. Die Hürde sinkt.', 'Unverbindlich ansehen', 'stufe-5'),
    ('Selbstqualifikation', 'Was ist dir bei einem Wechsel wichtig?', 'Planbarkeit, Teamgefühl, Entwicklung, Wertschätzung: Die Person prüft selbst, ob es passt. Sie entscheidet mit.', 'Quick-Match starten', 'stufe-6'),
    ('Entscheidung', 'Wenn es sich gut anfühlt, lass uns sprechen.', 'In 60 Sekunden zum ersten Kennenlernen, ohne Lebenslauf, ohne Anschreiben, ohne Druck. Der nächste Schritt ist klein.', 'Jetzt Kennenlernen', 'stufe-7'),
]


def stages():
    tabs = ''.join(f'<button type="button" role="tab" id="st-t{i}" aria-controls="st-p{i}" aria-selected="{"true" if i == 0 else "false"}" tabindex="{0 if i == 0 else -1}"><i>{i + 1}</i><span>{e(n)}</span></button>' for i, (n, *_r) in enumerate(STAGES))
    panels = ''
    for i, (n, h, t, cta, img) in enumerate(STAGES):
        if img:
            vis = f'<img src="/assets/images/creatives/{img}.webp" alt="Beispiel-Anzeige Stufe {i + 1}: {e(n)}" width="760" height="950" loading="lazy" decoding="async">'
        else:
            vis = f'<div class="cr-text"><small>Karriere · Beispiel</small><h4 aria-level="3">{e(h)}</h4><p>{e(t)}</p><span class="cr-cta">{e(cta)} →</span><em>Stufe {i + 1} · {e(n)}</em></div>'
        panels += (f'<div class="st-panel" role="tabpanel" id="st-p{i}" aria-labelledby="st-t{i}"{"" if i == 0 else " hidden"}>'
                   f'<figure class="cr">{vis}</figure><div class="st-txt"><span class="eyebrow">Stufe {i + 1} von 7</span><h3>{e(n)}</h3><p class="st-h">{e(h)}</p><p>{e(t)}</p>'
                   f'<div class="st-nav"><button type="button" class="btn" data-st="prev" aria-label="Vorherige Stufe">←</button><button type="button" class="btn" data-st="next" aria-label="Nächste Stufe">→</button></div></div></div>')
    return f'''<section class="section stg" id="stufen" aria-labelledby="stg-h"><div class="container">
<div class="tool-head"><span class="eyebrow" data-r>Unsere Kampagnen-Methode</span>
<h2 class="h2" id="stg-h" data-r>Keine „Wir suchen dich"-Anzeige. <span class="gold it">Sieben Stufen, die aufeinander aufbauen.</span></h2>
<p class="lead" data-r>Nicht jede gute Pflegekraft will sofort wechseln. Deshalb führen wir sie Schritt für Schritt: vom Wiedererkennen bis zum ersten, unverbindlichen Kennenlernen.</p></div>
<div class="st-box" data-r data-stages><div class="st-tabs" role="tablist" aria-label="Sieben Stufen der Kampagne">{tabs}</div>{panels}</div>
<p class="micro" data-r>Beispielkampagne für das Pflegehaus Kögler. Texte und Motive werden für Ihr Haus individuell entwickelt. Keine Garantie auf Bewerbungen.</p>
<div class="btns" data-r><a class="btn btn-gold" href="#analyse" data-goal="Mitarbeiter" data-cta="stufen-analyse">Diesen Weg für unser Haus besprechen {ARROW}</a></div>
</div></section>'''


HW_CREATIVES = [
    ('hw-1', 'Nutzen als Nachrichten', 'Sechs ungelesene Nachrichten: Gehalt, Arbeitszeiten, Fahrzeug, Arbeitgeber, Entwicklung. Neugier und Nutzenstapel in einem Bild.', 'Anlagenmechaniker SHK'),
    ('hw-2', 'Einstiegshürde senken', '„Ausbildung egal! Hauptsache technisch." Ein Gesicht aus dem Team und eine klare Botschaft: Du darfst dich bewerben.', 'Mischmeister'),
    ('hw-3', 'Muster durchbrechen', 'Südsee-Strand statt Stellenanzeige. Der Humor stoppt den Daumen, die Stelle steht trotzdem klar im Bild.', 'Anlagenmechaniker:in'),
    ('hw-4', 'Direkt ansprechen', '„Ist Spannung dein Ding?" Eine Frage, die genau die Zielgruppe trifft, mit echtem Arbeitsplatz im Hintergrund.', 'Elektromonteur:in'),
]


def hw_creatives():
    cards = ''.join(f'<figure class="hwc" data-r><img src="/assets/images/creatives/{i}.webp" alt="Beispiel-Anzeige: {e(t)} ({e(r)})" width="720" height="720" loading="lazy" decoding="async"><figcaption><b>{e(t)}</b><span>{e(d)}</span></figcaption></figure>' for i, t, d, r in HW_CREATIVES)
    return f'''<section class="section stg" id="creatives" aria-labelledby="hwc-h"><div class="container">
<div class="tool-head"><span class="eyebrow" data-r>Anzeigen, die Handwerker stoppen</span>
<h2 class="h2" id="hwc-h" data-r>Keine Standard-Stellenanzeige. <span class="gold it">Motive mit Haltung.</span></h2>
<p class="lead" data-r>Gute Fachkräfte scrollen an austauschbaren Anzeigen vorbei. Deshalb entwickeln wir Motive, die auffallen, Ihren Betrieb zeigen und den Einstieg leicht machen.</p></div>
<div class="hwc-grid">{cards}</div>
<p class="micro" data-r>Beispiele aus Handwerks-Kampagnen. Motive und Logos gehören den jeweiligen Betrieben. Keine Garantie auf Bewerbungen.</p>
<div class="btns" data-r><a class="btn btn-gold" href="#analyse" data-goal="Mitarbeiter" data-cta="creatives-analyse">Motive für meinen Betrieb besprechen {ARROW}</a></div>
</div></section>'''


PFLEGE_REFS = [('pflegehaus-koegler', 'Pflegehaus Kögler'), ('asklepios-parchim', 'Asklepios Klinik Parchim'), ('awo-pflege', 'AWO Pflege gGmbH'), ('caritas', 'Caritas'),
               ('diakonie', 'Diakonie'), ('drk', 'Deutsches Rotes Kreuz'), ('asb', 'Arbeiter-Samariter-Bund'), ('korian', 'Korian'), ('bdh', 'BDH Bundesverband Rehabilitation'),
               ('pflege-service-knoblauch', 'Pflege Service Knoblauch'), ('cura-tagespflege', 'CURA Tagespflege Hahn-Lehmden'), ('gbs-seniorenhilfe', 'GBS Seniorenhilfe'),
               ('linimed', 'linimed'), ('die-bruecke', 'Die Brücke')]


def refs_pflege():
    def tile(n, a, hidden=False):
        return f'<li{" aria-hidden=\"true\"" if hidden else ""}><img src="/assets/images/referenzen/{n}.webp" alt="{"" if hidden else e(a)}" loading="lazy" decoding="async" height="64"></li>'
    one = ''.join(tile(n, a) for n, a in PFLEGE_REFS)
    two = ''.join(tile(n, a, True) for n, a in PFLEGE_REFS)
    return f'''<section class="refs" aria-label="Pflegeeinrichtungen und Träger"><div class="container"><p class="refs-l" data-r>Pflegeeinrichtungen und Träger, mit denen Raphael Hermann zusammengearbeitet hat</p></div>
<div class="refs-w" data-anim><ul class="refs-t">{one}{two}</ul></div></section>'''


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
<p class="alt">Lieber direkt? <a href="https://calendar.app.google/jZqwYfHqfjufkFmx5" target="_blank" rel="noopener" data-cta="kalender-alt">Termin wählen</a> · <a href="tel:+4971134063951">Anrufen</a> · <a href="{WA}" target="_blank" rel="noopener">WhatsApp schreiben</a></p>
</div>
<div class="done" role="status"><h3>Danke – WhatsApp öffnet sich.</h3><p class="done-txt"></p>
<a class="btn btn-gold wa-link" href="{WA}" target="_blank" rel="noopener">WhatsApp-Nachricht erneut öffnen {ARROW}</a><a class="btn cal-link" href="https://calendar.app.google/jZqwYfHqfjufkFmx5" target="_blank" rel="noopener" data-cta="kalender" style="margin-top:12px">Direkt Termin im Kalender wählen {ARROW}</a></div>
</form></div></section>'''


def footer(cta='#analyse'):
    return f'''</main><footer class="site"><div class="container foot">
<div><a class="brand" href="/"><span class="brand-mark">{LOGO}</span><span>DIGITALE GEWINNER</span></a><p style="margin:14px 0 0">© 2026 Digitale Gewinner · Raphael Hermann</p><p class="micro" style="margin-top:6px">Google Partner · Meta Business Partner</p></div>
<nav aria-label="Fußzeile"><a href="/pflege">Pflege · Mitarbeiter</a><a href="/pflege-patienten">Pflege · Patienten</a><a href="/handwerk-mitarbeiter">Handwerk · Mitarbeiter</a><a href="/handwerk-kunden">Handwerk · Kunden</a><a href="/case-studies.html">Case Studies</a><a href="tel:+4971134063951">+49 711 34063951</a><a href="{WA}">WhatsApp</a><a href="/impressum.html">Impressum</a><a href="/datenschutz.html">Datenschutz</a></nav>
</div></footer>
<div class="mcta"><a class="btn btn-gold" href="{cta}" data-cta="mobile-bar">Kostenlose 15-Min-Analyse {ARROW}</a></div>
<div class="consent" id="consent" role="dialog" aria-labelledby="consent-t" aria-modal="false" hidden><b id="consent-t">Ihre Privatsphäre</b><p>Mit Ihrer Einwilligung messen wir anonym, welche Inhalte helfen, um die Seite zu verbessern. Details in der <a href="/datenschutz.html">Datenschutzerklärung</a>.</p><div class="consent-b"><button type="button" class="btn" data-consent="no">Ablehnen</button><button type="button" class="btn" data-consent="yes">Akzeptieren</button></div></div>
<script src="/vendor/gsap.min.js"></script><script src="/vendor/ScrollTrigger.min.js"></script><script src="/vendor/lenis.min.js"></script><script src="/site.js"></script></body></html>'''


# ---------- Seiten ----------
def home():
    h = head('Digitale Gewinner – Mehr Bewerbungen. Mehr Kundenanfragen. Weniger Arbeit.',
             'Intelligente Websysteme für Pflege- und Handwerksbetriebe: passende Menschen aus Ihrer Region erreichen, Angaben erfassen und bis zum persönlichen Gespräch begleiten. Persönlich durch Raphael Hermann.',
             '/', extra=schema(True) + '<link rel="preload" as="image" href="/assets/images/loops/werkstatt.webp" fetchpriority="high">')
    body = hero('Für Pflege- und Handwerksbetriebe',
                ['Mehr passende Bewerbungen.', 'Mehr Kundenanfragen.', '<span class="gold it">Weniger Arbeit.</span>'],
                'Wir bauen intelligente Websysteme, die passende Menschen aus Ihrer Region erreichen, ihre wichtigsten Angaben erfassen und sie bis zum persönlichen Gespräch begleiten.',
                'Sie führen die Gespräche. Das System übernimmt die wiederkehrende Arbeit davor.', HERO_BTNS, visual=hero_visual(VIS_HOME), loop='werkstatt')
    body += partner_strip() + problem() + triptych() + usp() + live() + choose() + flow() + demo('home') + auto() + compare() + results() + offer() + check() + about() + faq() + final()
    return h + nav(True) + body + footer()


BRANCH = {
    'pflege': dict(title='Mehr Bewerbungen von Pflegekräften aus Ihrer Region – Digitale Gewinner', eyebrow='Für Pflegebetriebe',
                   h1=['Mehr Bewerbungen von', 'Pflegekräften', '<span class="gold it">aus Ihrer Region.</span>'],
                   lead='Wir zeigen, warum sich passende Pflegekräfte für Ihr Unternehmen entscheiden sollten, vereinfachen die Kontaktaufnahme und begleiten Interessenten bis zum Gespräch.',
                   btn='Mitarbeitergewinnung prüfen lassen', goal='Mitarbeiter', ticks=TICKS_MIT, head='Mitarbeiter gewinnen', theme='theme-pflege', tc='#f7f2e8', vis=VIS_PFLEGE, loop='pflege', demo='pflege', band=('pflege-team', 'Drei Pflegekräfte lachen gemeinsam im Flur einer Pflegeeinrichtung', 'Menschen, die gern bei Ihnen arbeiten würden.')),
    'pflege-patienten': dict(title='Mehr Anfragen von Patienten und Angehörigen für Pflegebetriebe – Digitale Gewinner', eyebrow='Für Pflegebetriebe',
                             h1=['Mehr Anfragen von', 'Patienten und Angehörigen', '<span class="gold it">aus Ihrer Region.</span>'],
                             lead='Wir machen Ihre Pflegeleistungen verständlich, erreichen Pflegebedürftige und Angehörige aus Ihrer Region und führen sie strukturiert bis zur Anfrage.',
                             btn='Patientengewinnung prüfen lassen', goal='Kunden', ticks=TICKS_KUN, head='Kunden gewinnen', theme='theme-pflege', tc='#f7f2e8', vis=VIS_PF_KUN, loop='pflege', demo='pf-kun',
                             band=('pflege-pflegekraft', 'Pflegekraft hält die Hand einer älteren Dame', 'Menschen, die Sie als Pflegebetrieb finden und anfragen.')),
    'handwerk-mitarbeiter': dict(title='Mehr Bewerbungen von Fachkräften für Handwerksbetriebe – Digitale Gewinner', eyebrow='Für Handwerksbetriebe',
                                 h1=['Mehr Bewerbungen von', 'Fachkräften', '<span class="gold it">aus Ihrer Region.</span>'],
                                 lead='Wir machen Ihren Betrieb als Arbeitgeber sichtbar, zeigen verständlich, was Sie auszeichnet, und erleichtern den ersten Kontakt.',
                                 btn='Fachkräftegewinnung prüfen lassen', goal='Mitarbeiter', ticks=TICKS_MIT, head='Mitarbeiter gewinnen', theme='theme-handwerk', tc='#111315', vis=VIS_HW_MIT, loop='elektriker', demo='hw-mit', band=('hw-werkstatt', 'Handwerker-Team lacht gemeinsam in der Werkstatt', 'Fachkräfte, die zu Ihrem Betrieb passen.')),
    'handwerk-kunden': dict(title='Mehr Anfragen für Handwerksbetriebe – Digitale Gewinner', eyebrow='Für Handwerksbetriebe',
                            h1=['Mehr Anfragen für die Aufträge,', '<span class="gold it">die zu Ihrem Betrieb passen.</span>'],
                            lead='Wir machen Ihre Leistungen verständlich, erreichen passende Menschen aus Ihrer Region und führen sie strukturiert bis zur Anfrage.',
                            btn='Kundengewinnung prüfen lassen', goal='Kunden', ticks=TICKS_KUN, head='Kunden gewinnen', theme='theme-handwerk', tc='#111315', vis=VIS_HW_KUN, loop='paar', demo='hw-kun', band=('kunden-beratung', 'Handwerker zeigt einem Paar einen Plan auf dem Tablet', 'Kunden, die Ihr Angebot verstehen und anfragen.')),
}


def branch(slug, c):
    h = head(c['title'], c['lead'], '/' + slug, extra=schema(False) + f'<link rel="preload" as="image" href="/assets/images/loops/{c["loop"]}.webp" fetchpriority="high">')
    btns = f'<a class="btn btn-gold" href="#analyse" data-goal="{c["goal"]}" data-cta="branche-{slug}">{c["btn"]} {ARROW}</a>'
    body = hero(c['eyebrow'], c['h1'], c['lead'], 'Sie führen die Gespräche. Das System übernimmt die wiederkehrende Arbeit davor.', btns, wide=True, visual=hero_visual(c['vis']), loop=c['loop'], kunden=c['goal'] == 'Kunden')
    body += partner_strip()
    if slug.startswith('pflege'):
        body += refs_pflege()
    if slug == 'pflege':
        body += video_section()
    t = ''.join(f'<li>{e(i)}</li>' for i in c['ticks'])
    _, ma, _la, ka, _lb = BRANCH_NAV[slug]
    ot, ol = (ka, _lb) if slug == ma else (ma, _la)
    other = f'<p class="micro" style="margin-top:18px">Stattdessen: <a class="gold" href="/{ot}">{ol} →</a></p>'
    body += f'''<section class="section" id="ziel"><div class="container auto">
<div><span class="eyebrow" data-r>{c['head']}</span><h2 class="h2" data-r>Ein vollständiger Weg <span class="gold it">bis zum Gespräch.</span></h2></div>
<div data-r><ul class="ticks" style="margin-top:0">{t}</ul><div class="btns"><a class="btn btn-gold" href="#analyse" data-goal="{c['goal']}" data-cta="branche-mitte">{c['btn']} {ARROW}</a></div>{other}</div></div></section>'''
    body += meta_manager(slug) if slug in META_DATA else google_search(slug)
    if slug == 'pflege':
        body += stages()
    if slug == 'handwerk-mitarbeiter':
        body += hw_creatives()
    if slug == 'pflege':
        body += case_pflege()
    body += live()
    body += photo_band(*c['band']) + flow() + demo(c['demo']) + compare() + results(list_=False) + offer() + check() + faq() + final(c['goal'])
    return h + nav(False, c['theme'], slug=slug) + body + footer()


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
    return h + nav(False) + body + footer()


def legal_page(key):
    raw = (HERE / 'legal' / f'{key}.html').read_text(encoding='utf-8')
    meta, body = raw.split('-->', 1)
    parts = dict(p.split(':', 1) for p in meta.replace('<!--', '').strip().split('|'))
    title, intro, stand = parts['title'], parts.get('intro', ''), parts.get('stand', '')
    h = head(f'{title} | Digitale Gewinner', intro or title, f'/{key}')
    top = (f'<main id="main"><section class="legal-hero"><div class="container"><span class="eyebrow">Rechtliches</span><h1>{title}</h1>'
           f'{f"<p class=lead>{intro}</p>" if intro else ""}{f"<p class=micro>{stand}</p>" if stand else ""}</div></section>'
           f'<section class="legal"><div class="container"><div class="legal-body">{body}</div></div></section>')
    return h + nav(False, cta='/#analyse') + top + footer('/#analyse')


def minify_assets():
    """Verkleinert site.css und site.js im Ausgabeordner (nur dist, Quellen bleiben lesbar)."""
    import re
    css = OUT / 'site.css'
    t = css.read_text(encoding='utf-8')
    t = re.sub(r'/\*.*?\*/', '', t, flags=re.S)
    t = re.sub(r'\s+', ' ', t)
    t = re.sub(r'\s*([{};,>])\s*', r'\1', t)
    t = t.replace(';}', '}')
    css.write_text(t.strip(), encoding='utf-8')
    try:
        import rjsmin
        js = OUT / 'site.js'
        js.write_text(rjsmin.jsmin(js.read_text(encoding='utf-8')), encoding='utf-8')
    except ImportError:
        pass


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    pages = {'index.html': home(), 'analyse.html': outbound()}
    for slug, c in BRANCH.items():
        pages[f'{slug}.html'] = branch(slug, c)
    for name, content in pages.items():
        (OUT / name).write_text(content, encoding='utf-8')
    for name in ('impressum', 'datenschutz'):  # neue Optik; beide URL-Varianten bedienen (/impressum.html und /impressum/)
        html_ = legal_page(name)
        (OUT / f'{name}.html').write_text(html_, encoding='utf-8')
        (OUT / name).mkdir(exist_ok=True)
        (OUT / name / 'index.html').write_text(html_, encoding='utf-8')
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
    minify_assets()
    print(f'Site built: {", ".join(pages)}')


if __name__ == '__main__':
    main()
