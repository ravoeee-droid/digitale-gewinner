from __future__ import annotations

from pathlib import Path
import html as html_lib
import json
import re

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist"
SITE = "https://digitale-gewinner.de"

FAQS = [
    (
        "Was bedeutet digitaler Vertrauensaufbau?",
        "Digitaler Vertrauensaufbau bedeutet, dass Google-Profil, Website und Social Media die tatsächliche Qualität eines Unternehmens klar, glaubwürdig und konsistent zeigen. Interessenten und Bewerber sollen schnell verstehen, warum das Unternehmen eine sichere und passende Wahl ist.",
    ),
    (
        "Woran erkenne ich, dass mein Unternehmen online ein Vertrauensproblem hat?",
        "Typische Signale sind zu wenige oder stark schwankende Anfragen, viel Preisvergleich, gute Reichweite ohne Abschlüsse, wenige passende Bewerbungen oder Empfehlungen, die nach dem Online-Check nicht zu einer Kontaktaufnahme führen.",
    ),
    (
        "Warum bringt eine Website Besucher, aber keine Anfragen?",
        "Häufig fehlen eine klare Positionierung, sichtbare Beweise, verständliche Leistungen, persönliche Ansprechpartner oder ein sicherer nächster Schritt. Reichweite erzeugt Aufmerksamkeit. Erst Vertrauen macht daraus eine Anfrage.",
    ),
    (
        "Kann ein schwacher Online-Auftritt auch die Mitarbeitergewinnung bremsen?",
        "Ja. Bewerber prüfen Führung, Kultur, Sicherheit, Entwicklung und die Glaubwürdigkeit des Arbeitgebers. Sind diese Punkte online nicht sichtbar, bewerben sich passende Menschen oft gar nicht oder unpassende Bewerbungen überwiegen.",
    ),
    (
        "Warum müssen Google, Website und Social Media zusammenpassen?",
        "Menschen wechseln vor einer Entscheidung zwischen mehreren Kontaktpunkten. Widersprechen sich Bewertungen, Website, Bilder und Social-Media-Auftritt, entsteht Unsicherheit. Ein konsistenter Eindruck reduziert Zweifel und erleichtert die Entscheidung.",
    ),
    (
        "Was enthält die kostenlose Vertrauensanalyse?",
        "Raphael Hermann prüft den ersten Eindruck auf Google, Website und Social Media, identifiziert die drei größten Vertrauenslücken und zeigt, welche Verbesserung zuerst den größten Unterschied machen kann. Die Analyse ist unverbindlich und kein automatisierter Standardreport.",
    ),
    (
        "Für welche Unternehmen ist Digitale Gewinner geeignet?",
        "Das Angebot richtet sich an Unternehmen, Dienstleister, Experten und Arbeitgeber im deutschsprachigen Raum, deren reale Qualität online noch nicht schnell genug verstanden oder geglaubt wird.",
    ),
]

PROBLEM_SECTION = """
<section class="trust-diagnosis" id="vertrauensproblem" aria-labelledby="vertrauensproblem-title">
  <div class="container">
    <div class="trust-diagnosis-head reveal">
      <div>
        <span class="eyebrow">Das eigentliche Problem erkennen</span>
        <h2 class="serif" id="vertrauensproblem-title">Zu wenig Anfragen. Schwankende Anfragen. Zu wenig Bewerber. <em>Dann fehlt sehr wahrscheinlich online Vertrauen.</em></h2>
      </div>
      <p>Viele Unternehmen glauben, sie bräuchten nur mehr Reichweite. Doch wenn Menschen Ihr Unternehmen sehen und nicht schnell genug Sicherheit, Kompetenz und Klarheit spüren, verstärkt zusätzliche Reichweite häufig nur ein bestehendes Vertrauensproblem.</p>
    </div>
    <div class="trust-problem-grid">
      <article class="trust-problem reveal"><span class="trust-problem-icon">01</span><div><h3>Zu wenig Kundenanfragen</h3><p>Die Leistung ist gut, aber Interessenten erkennen online nicht schnell genug, <strong>warum sie gerade Ihnen vertrauen sollten.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">02</span><div><h3>Schwankende Kundenanfragen</h3><p>Empfehlungen und Werbung funktionieren punktuell, aber der Online-Auftritt erzeugt <strong>keine verlässlich starke Entscheidungssicherheit.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">03</span><div><h3>Zu viele unpassende Anfragen</h3><p>Positionierung, Anspruch und Arbeitsweise sind nicht klar genug. Dadurch melden sich Menschen, <strong>die nicht zum Angebot passen.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">04</span><div><h3>Zu wenig Bewerber</h3><p>Stelle und Gehalt allein überzeugen nicht. Passende Fachkräfte sehen online zu wenig von <strong>Kultur, Führung, Sicherheit und Zukunft.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">05</span><div><h3>Zu viele schlechte Bewerber</h3><p>Wenn Arbeitgeberwert und Erwartungen nicht sichtbar sind, fehlt die natürliche Vorqualifizierung und <strong>die Bewerbungsqualität sinkt.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">06</span><div><h3>Ständiger Preisvergleich</h3><p>Wird der Unterschied zur Konkurrenz nicht verstanden, bleibt der Preis als einziges klares Kriterium und <strong>Wert wird austauschbar.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">07</span><div><h3>Werbung bringt Klicks, aber keine Abschlüsse</h3><p>Ads kaufen Aufmerksamkeit. Trifft diese auf einen unsicheren Auftritt, gehen <strong>Budget und Nachfragewirkung verloren.</strong></p></div></article>
      <article class="trust-problem reveal"><span class="trust-problem-icon">08</span><div><h3>Empfehlungen versanden nach dem Online-Check</h3><p>Fast jede Empfehlung wird gegoogelt. Bestätigt der digitale Eindruck das gute Gefühl nicht, entsteht <strong>Zweifel statt Kontakt.</strong></p></div></article>
    </div>
    <div class="trust-diagnosis-answer reveal">
      <div><h3>Nicht jede Anfragekrise ist ein Reichweitenproblem.</h3><p>Entscheidend ist, ob potenzielle Kunden und Mitarbeiter innerhalb weniger Sekunden verstehen: Dieses Unternehmen kennt mein Problem, liefert glaubwürdige Qualität und ist für mich die sichere Wahl.</p></div>
      <a class="btn btn-primary" href="#analyse">Meine Vertrauenslücken prüfen lassen →</a>
    </div>
  </div>
</section>
"""

FAQ_SECTION = """
<section class="geo-faq" id="faq" aria-labelledby="faq-title">
  <div class="container">
    <div class="geo-faq-head reveal">
      <span class="eyebrow">Häufige Fragen</span>
      <h2 class="serif" id="faq-title">Digitales Vertrauen, Kundenanfragen und Bewerber <span class="gold">einfach erklärt.</span></h2>
      <p class="lead">Klare Antworten darauf, warum gute Unternehmen online trotzdem zu wenig passende Kunden oder Mitarbeiter gewinnen.</p>
    </div>
    <div class="geo-faq-list">
      %s
    </div>
    <nav class="geo-topic-links" aria-label="Weiterführende Themen">
      <a href="/vertrauensaufbau-online.html">Digitalen Vertrauensaufbau verstehen</a>
      <a href="/website-keine-anfragen.html">Warum Websites keine Anfragen bringen</a>
      <a href="/zu-wenig-bewerber.html">Zu wenig passende Bewerber</a>
      <a href="/case-studies.html">Alle Case Studies</a>
    </nav>
  </div>
</section>
""" % "\n".join(
    f'<details class="reveal"><summary>{html_lib.escape(question)}</summary><p>{html_lib.escape(answer)}</p></details>'
    for question, answer in FAQS
)


def schema_graph() -> dict:
    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": f"{SITE}/#organization",
                "name": "Digitale Gewinner",
                "url": f"{SITE}/",
                "logo": f"{SITE}/assets/images/raphael/raphael-hermann-hero.webp",
                "founder": {"@id": f"{SITE}/#raphael-hermann"},
                "areaServed": [
                    {"@type": "Country", "name": "Deutschland"},
                    {"@type": "Country", "name": "Österreich"},
                    {"@type": "Country", "name": "Schweiz"},
                ],
                "knowsAbout": [
                    "Digitaler Vertrauensaufbau",
                    "Webdesign",
                    "Conversion-Optimierung",
                    "Google Unternehmensprofil",
                    "Social Media",
                    "Kunden- und Mitarbeitergewinnung",
                ],
            },
            {
                "@type": "Person",
                "@id": f"{SITE}/#raphael-hermann",
                "name": "Raphael Hermann",
                "url": f"{SITE}/#ueber-raphael",
                "image": f"{SITE}/assets/images/raphael/raphael-hermann-portrait.webp",
                "jobTitle": "Spezialist für digitalen Vertrauensaufbau",
                "worksFor": {"@id": f"{SITE}/#organization"},
                "knowsAbout": ["Google", "Websites", "Social Media", "Paid Ads", "Conversion-Optimierung"],
            },
            {
                "@type": "ProfessionalService",
                "@id": f"{SITE}/#service",
                "name": "Digitale Gewinner – digitaler Vertrauensaufbau",
                "url": f"{SITE}/",
                "telephone": "+4971134063951",
                "provider": {"@id": f"{SITE}/#organization"},
                "founder": {"@id": f"{SITE}/#raphael-hermann"},
                "description": "Digitale Gewinner macht Vertrauen über Google, Website und Social Media sichtbar, damit Unternehmen mehr passende Kundenanfragen und bessere Bewerbungen gewinnen.",
                "areaServed": ["DE", "AT", "CH"],
                "serviceType": [
                    "Digitaler Vertrauensaufbau",
                    "Webdesign und Conversion-Optimierung",
                    "Google-Profil und Bewertungsstrategie",
                    "Social Media und Arbeitgeberpositionierung",
                ],
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Leistungen",
                    "itemListElement": [
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Kostenlose Vertrauensanalyse"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Vertrauensstarke Website"}},
                        {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Google- und Social-Media-Vertrauensaufbau"}},
                    ],
                },
            },
            {
                "@type": "WebSite",
                "@id": f"{SITE}/#website",
                "url": f"{SITE}/",
                "name": "Digitale Gewinner",
                "publisher": {"@id": f"{SITE}/#organization"},
                "inLanguage": "de-DE",
            },
            {
                "@type": "WebPage",
                "@id": f"{SITE}/#webpage",
                "url": f"{SITE}/",
                "name": "Mehr Kundenanfragen und bessere Bewerber durch sichtbares Vertrauen",
                "isPartOf": {"@id": f"{SITE}/#website"},
                "about": {"@id": f"{SITE}/#service"},
                "primaryImageOfPage": {"@type": "ImageObject", "url": f"{SITE}/assets/images/raphael/raphael-hermann-hero.webp"},
                "inLanguage": "de-DE",
            },
            {
                "@type": "FAQPage",
                "@id": f"{SITE}/#faq-schema",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": question,
                        "acceptedAnswer": {"@type": "Answer", "text": answer},
                    }
                    for question, answer in FAQS
                ],
            },
        ],
    }


def inject_homepage() -> None:
    path = OUT / "index.html"
    source = path.read_text(encoding="utf-8")

    source = re.sub(r"<title>.*?</title>", "<title>Mehr Kundenanfragen & bessere Bewerber | Digitale Gewinner</title>", source, count=1, flags=re.S)
    source = re.sub(
        r'<meta name="description" content="[^"]*">',
        '<meta name="description" content="Raphael Hermann macht Vertrauen über Google, Website und Social Media sichtbar – für mehr qualifizierte Kundenanfragen, bessere Bewerber und weniger Preisvergleich.">',
        source,
        count=1,
    )
    source = re.sub(r'<script type="application/ld\+json">.*?</script>', "", source, count=1, flags=re.S)

    head_markup = """
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="author" content="Raphael Hermann">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_DE">
<meta property="og:site_name" content="Digitale Gewinner">
<meta property="og:title" content="Mehr Kundenanfragen & bessere Bewerber | Digitale Gewinner">
<meta property="og:description" content="Vertrauen über Google, Website und Social Media sichtbar machen – damit Kunden und Mitarbeiter schneller erkennen, warum Ihr Unternehmen die richtige Wahl ist.">
<meta property="og:url" content="https://digitale-gewinner.de/">
<meta property="og:image" content="https://digitale-gewinner.de/assets/images/raphael/raphael-hermann-hero.webp">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Mehr Kundenanfragen & bessere Bewerber | Digitale Gewinner">
<meta name="twitter:description" content="Digitaler Vertrauensaufbau über Google, Website und Social Media.">
<meta name="twitter:image" content="https://digitale-gewinner.de/assets/images/raphael/raphael-hermann-hero.webp">
<link rel="alternate" hreflang="de" href="https://digitale-gewinner.de/">
<link rel="alternate" hreflang="x-default" href="https://digitale-gewinner.de/">
<link rel="stylesheet" href="seo-geo-upgrade.css">
<script type="application/ld+json">%s</script>
""" % json.dumps(schema_graph(), ensure_ascii=False, separators=(",", ":"))
    source = source.replace("</head>", head_markup + "</head>", 1)

    if 'id="vertrauensproblem"' not in source:
        match = re.search(r'<section\b[^>]*\bid=["\']cases["\'][^>]*>', source, flags=re.I)
        if match:
            source = source[: match.start()] + PROBLEM_SECTION + source[match.start() :]
        else:
            source = source.replace("</main>", PROBLEM_SECTION + "</main>", 1)

    if 'id="faq"' not in source:
        match = re.search(r'<section\b[^>]*\bid=["\']analyse["\'][^>]*>', source, flags=re.I)
        if match:
            source = source[: match.start()] + FAQ_SECTION + source[match.start() :]
        else:
            source = source.replace("</main>", FAQ_SECTION + "</main>", 1)

    path.write_text(source, encoding="utf-8")


def replace_home_cases() -> None:
    path = OUT / "trust-upgrade.js"
    source = path.read_text(encoding="utf-8")
    new_cases = """const cases=[
 {cls:'dg-jj',name:'JJ Media',sector:'Personal Brand & Social Media',url:'jj-media-design.de',img:'/assets/images/case-studies/case-study-jj-media.webp',summary:'Eine moderne Expertenmarke musste Leistung, Persönlichkeit und Projekterfahrung innerhalb weniger Sekunden als klares Gesamtbild vermitteln.',problem:'Die Person und ihre Kompetenz waren nicht schnell genug als unverwechselbare Expertenpositionierung erkennbar.',solution:'Klare Angebotsarchitektur, persönliche Bildwelt und Referenzen als sichtbarer Beweis.',result:'Leistung und Persönlichkeit werden gemeinsam verstanden und passende Projektanfragen besser vorqualifiziert.',floatA:'zu wenig klare Expertenpositionierung',floatB:'Persönlichkeit · Kompetenz · passende Anfragen',anchor:'jj-media'},
 {cls:'dg-defi',name:'DeFi Intelligence',sector:'Investmentprozess & Premium-Positionierung',url:'defi-intelligence.de',img:'/assets/images/case-studies/case-study-defi-intelligence.webp',summary:'Ein komplexes Finanzthema musste als nachvollziehbarer, seriöser und hochwertiger Entscheidungsprozess statt als spekulatives Versprechen wahrgenommen werden.',problem:'Hohe Komplexität und natürliche Skepsis gegenüber dem Thema.',solution:'Methodik, Prozess, Person und Analyse wurden vor marktschreierische Aussagen gestellt.',result:'Interessenten erkennen schneller Struktur, fachliche Autorität und einen kontrollierten nächsten Schritt.',floatA:'Komplexität und Skepsis',floatB:'Struktur · Autorität · Premium-Vertrauen',anchor:'defi-intelligence'},
 {cls:'dg-neuromind',name:'NeuroMind Breathwork',sector:'Ausbildung & Mentoring',url:'neuromind-breathwork.de',img:'/assets/images/case-studies/case-study-neuromind-breathwork.webp',summary:'Eine tiefgehende Premium-Ausbildung musste sich klar von oberflächlichen Technik-Angeboten abgrenzen und fachliche Sicherheit vermitteln.',problem:'Erklärungsbedürftiges Angebot und eine anspruchsvolle, skeptische Zielgruppe.',solution:'Haltungsbasierte Positionierung, fachliche Tiefe, Video und ein klarer Ausbildungsweg.',result:'Die richtigen Menschen erkennen schneller, dass es um Substanz, Sicherheit und professionelle Begleitung geht.',floatA:'zu wenig Differenzierung',floatB:'Tiefe · Sicherheit · Premium-Wahrnehmung',anchor:'neuromind'}
];"""
    pattern = re.compile(r"const cases=\[.*?\];(?=\s*function upgradeCases)", re.S)
    source, count = pattern.subn(new_cases, source, count=1)
    if count != 1:
        raise SystemExit("Could not replace homepage case preview order")
    path.write_text(source, encoding="utf-8")


def patch_case_page() -> None:
    path = OUT / "case-studies.html"
    source = path.read_text(encoding="utf-8")
    if "seo-geo-upgrade.css" not in source:
        source = source.replace("</head>", '<link rel="stylesheet" href="seo-geo-upgrade.css"></head>', 1)
    source = re.sub(
        r"<title>.*?</title>",
        "<title>Webdesign Case Studies: Vertrauen, Anfragen & Bewerber | Digitale Gewinner</title>",
        source,
        count=1,
        flags=re.S,
    )
    source = re.sub(
        r'<meta name="description" content="[^"]*">',
        '<meta name="description" content="10 Webdesign Case Studies von Digitale Gewinner: Wie Positionierung, Design und Vertrauensbeweise Kundenanfragen, Kaufklarheit und Bewerberqualität stärken.">',
        source,
        count=1,
    )
    path.write_text(source, encoding="utf-8")


def topic_page(slug: str, title: str, description: str, h1: str, intro: str, sections: list[tuple[str, str]]) -> str:
    body_sections = "\n".join(
        f'<section><h2>{html_lib.escape(heading)}</h2><p>{html_lib.escape(text)}</p></section>'
        for heading, text in sections
    )
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": h1,
        "description": description,
        "author": {"@type": "Person", "name": "Raphael Hermann"},
        "publisher": {"@type": "Organization", "name": "Digitale Gewinner", "url": f"{SITE}/"},
        "mainEntityOfPage": f"{SITE}/{slug}",
        "inLanguage": "de-DE",
    }
    return f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{html_lib.escape(title)}</title><meta name="description" content="{html_lib.escape(description)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="{SITE}/{slug}"><meta property="og:type" content="article"><meta property="og:title" content="{html_lib.escape(title)}"><meta property="og:description" content="{html_lib.escape(description)}"><meta property="og:url" content="{SITE}/{slug}"><script type="application/ld+json">{json.dumps(schema, ensure_ascii=False, separators=(',', ':'))}</script><style>:root{{--bg:#080705;--cream:#f7f0e5;--muted:#b8ad9f;--gold:#f1ce84;--line:rgba(241,206,132,.18)}}*{{box-sizing:border-box}}body{{margin:0;background:radial-gradient(circle at 80% 0,rgba(216,166,72,.16),transparent 30rem),var(--bg);color:var(--cream);font:17px/1.75 Inter,system-ui,sans-serif}}a{{color:inherit}}.wrap{{width:min(900px,calc(100% - 34px));margin:auto}}nav{{padding:25px 0;display:flex;justify-content:space-between;gap:20px}}nav a{{text-decoration:none;font-weight:800}}header{{padding:95px 0 55px}}.eyebrow{{color:var(--gold);text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;font-weight:900}}h1,h2{{font-family:Georgia,serif;line-height:1;letter-spacing:-.045em}}h1{{font-size:clamp(3.3rem,8vw,6.8rem);margin:20px 0 28px}}h2{{font-size:clamp(2rem,4vw,3.5rem);margin:0 0 15px}}.lead{{font-size:1.25rem;color:#d4c9bb}}section{{padding:32px 0;border-top:1px solid var(--line)}}section p{{color:var(--muted)}}.cta{{margin:55px 0 90px;padding:36px;border:1px solid var(--line);border-radius:25px;background:linear-gradient(135deg,rgba(216,166,72,.13),rgba(255,255,255,.025))}}.btn{{display:inline-flex;margin-top:15px;padding:14px 20px;border-radius:999px;background:linear-gradient(135deg,#f1ce84,#d8a648);color:#171006;text-decoration:none;font-weight:900}}footer{{padding:30px 0;border-top:1px solid var(--line);color:#847a6e;font-size:.8rem}}</style></head><body><div class="wrap"><nav><a href="/">Digitale Gewinner</a><a href="/case-studies.html">Case Studies</a></nav><header><span class="eyebrow">Ratgeber für digitalen Vertrauensaufbau</span><h1>{html_lib.escape(h1)}</h1><p class="lead">{html_lib.escape(intro)}</p></header><main>{body_sections}<div class="cta"><h2>Wo verliert Ihr Online-Auftritt gerade Vertrauen?</h2><p>Die kostenlose Vertrauensanalyse zeigt die drei wichtigsten Lücken auf Google, Website und Social Media und priorisiert den sinnvollsten nächsten Schritt.</p><a class="btn" href="/#analyse">Kostenlose Vertrauensanalyse anfragen →</a></div></main><footer>© 2026 Digitale Gewinner · Raphael Hermann · <a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></footer></div></body></html>'''


def create_topic_pages() -> None:
    pages = {
        "vertrauensaufbau-online.html": (
            "Digitalen Vertrauensaufbau verstehen | Digitale Gewinner",
            "Was digitaler Vertrauensaufbau bedeutet und wie Google, Website und Social Media gemeinsam mehr Kundenanfragen, bessere Bewerber und weniger Preisvergleich ermöglichen.",
            "Digitaler Vertrauensaufbau: Warum gute Unternehmen online trotzdem verlieren",
            "Menschen entscheiden selten nur nach Leistung. Sie entscheiden danach, welche Leistung sie schnell verstehen, glaubwürdig einschätzen und als sichere Wahl empfinden können.",
            [
                ("Vertrauen ist der Filter vor jeder Anfrage", "Bevor ein Interessent Kontakt aufnimmt, prüft er unbewusst Klarheit, Kompetenz, Beweise, Persönlichkeit und Risiko. Bleiben offene Fragen, wird die Entscheidung verschoben oder ein sichtbar sichererer Anbieter gewählt."),
                ("Google schafft den ersten Eindruck", "Bewertungen, Bilder, Antworten und Aktualität beeinflussen, ob ein Unternehmen seriös, erreichbar und relevant wirkt. Ein schwaches Profil kann Empfehlungen entwerten, noch bevor die Website besucht wird."),
                ("Die Website übersetzt Qualität in eine Entscheidung", "Eine vertrauensstarke Website erklärt für wen das Angebot gedacht ist, welches Problem gelöst wird, warum die Lösung glaubwürdig ist und welcher nächste Schritt sicher und sinnvoll ist."),
                ("Social Media macht Kompetenz menschlich", "Echte Gesichter, Einblicke, Haltung und fachliche Inhalte reduzieren Distanz. Kunden und Bewerber können besser einschätzen, mit wem sie arbeiten und ob die Kultur zu ihnen passt."),
                ("Konsistenz reduziert Zweifel", "Entsteht auf allen Kontaktpunkten derselbe klare Eindruck, müssen Menschen weniger Widersprüche auflösen. Das erleichtert Anfragen, Bewerbungen und Kaufentscheidungen."),
            ],
        ),
        "website-keine-anfragen.html": (
            "Website bringt keine Anfragen? Ursachen & Lösungen | Digitale Gewinner",
            "Warum Websites trotz Traffic keine Kundenanfragen erzeugen: Positionierung, Vertrauen, Beweise, Nutzerführung und Conversion verständlich erklärt.",
            "Ihre Website bringt Besucher, aber keine Anfragen?",
            "Mehr Traffic löst nicht automatisch das Problem. Häufig fehlt nicht Aufmerksamkeit, sondern die Sicherheit, dass Angebot, Anbieter und nächster Schritt wirklich passen.",
            [
                ("Die Zielgruppe erkennt sich nicht sofort", "Eine starke Startseite benennt das konkrete Problem, die gewünschte Veränderung und die relevante Zielgruppe. Allgemeine Aussagen zwingen Besucher, die Bedeutung selbst zu entschlüsseln."),
                ("Der Wert bleibt abstrakt", "Leistungen werden häufig beschrieben, ohne zu zeigen, was sie praktisch verändern. Ergebnisse wie bessere Vorqualifizierung, weniger Preisvergleich oder schnellere Entscheidungen machen den Nutzen greifbar."),
                ("Beweise fehlen am richtigen Ort", "Bewertungen, Case Studies, echte Projekte und persönliche Erfahrung müssen dort erscheinen, wo Zweifel entstehen. Ein Referenzlogo im Footer reicht selten aus."),
                ("Der nächste Schritt wirkt zu groß", "Kontaktformulare ohne klare Erwartung erzeugen Unsicherheit. Eine gute Conversion-Strecke erklärt, was nach dem Klick passiert, welche Angaben benötigt werden und welchen direkten Nutzen die Anfrage liefert."),
                ("Werbung und Landingpage sprechen nicht dieselbe Sprache", "Wenn Anzeige, Suchintention und Website unterschiedliche Versprechen vermitteln, sinkt Vertrauen. Konsistenz zwischen Klick und Zielseite ist ein zentraler Hebel für bessere Werbewirkung."),
            ],
        ),
        "zu-wenig-bewerber.html": (
            "Zu wenig oder schlechte Bewerber? Oft fehlt Vertrauen | Digitale Gewinner",
            "Warum Unternehmen zu wenig passende Bewerber erhalten und wie Arbeitgeberpositionierung, Website, Google und Social Media die Bewerberqualität verbessern.",
            "Zu wenig Bewerber oder zu viele unpassende Bewerbungen?",
            "Passende Fachkräfte prüfen mehr als eine Stellenanzeige. Sie suchen Belege für Führung, Kultur, Sicherheit, Entwicklung und die Glaubwürdigkeit des Arbeitgebers.",
            [
                ("Eine Stellenanzeige allein baut kaum Vertrauen auf", "Aufgaben und Anforderungen erklären die Position, aber nicht das Arbeitsgefühl. Menschen möchten erkennen, wie geführt wird, wer im Team arbeitet und welche Realität sie erwartet."),
                ("Unklare Arbeitgeberwerte ziehen unpassende Bewerbungen an", "Wenn jeder angesprochen wird, fühlt sich niemand gezielt angesprochen. Klare Erwartungen, Arbeitsweise und Werte verbessern die Selbstselektion vor der Bewerbung."),
                ("Bewerber prüfen die gesamte digitale Spur", "Google-Bewertungen, Website, Social Media und persönliche Profile werden gemeinsam bewertet. Widersprüche oder veraltete Inhalte können eine gute Stellenanzeige entkräften."),
                ("Sichtbare Menschen reduzieren Risiko", "Geschäftsführung, Team, Arbeitsplatz und echte Einblicke machen ein unbekanntes Unternehmen einschätzbarer. Das ist besonders wichtig für Menschen, die aktuell noch sicher beschäftigt sind."),
                ("Die Bewerberstrecke muss einfach und verbindlich sein", "Kurze Formulare, transparente nächste Schritte und schnelles Follow-up reduzieren Abbrüche. Gute Kandidaten erwarten einen professionellen Prozess als ersten Beweis der Arbeitgeberqualität."),
            ],
        ),
    }
    for slug, args in pages.items():
        (OUT / slug).write_text(topic_page(slug, *args), encoding="utf-8")


def write_discovery_files() -> None:
    (OUT / "robots.txt").write_text(
        "User-agent: *\nAllow: /\nDisallow: /danke.html\n\nSitemap: https://digitale-gewinner.de/sitemap.xml\n",
        encoding="utf-8",
    )
    urls = [
        ("/", "1.0"),
        ("/case-studies.html", "0.9"),
        ("/vertrauensaufbau-online.html", "0.8"),
        ("/website-keine-anfragen.html", "0.8"),
        ("/zu-wenig-bewerber.html", "0.8"),
        ("/impressum.html", "0.2"),
        ("/datenschutz.html", "0.2"),
    ]
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for location, priority in urls:
        sitemap.append(f"<url><loc>{SITE}{location}</loc><lastmod>2026-07-15</lastmod><changefreq>monthly</changefreq><priority>{priority}</priority></url>")
    sitemap.append("</urlset>")
    (OUT / "sitemap.xml").write_text("".join(sitemap), encoding="utf-8")

    llms = """# Digitale Gewinner\n\n> Digitale Gewinner macht Vertrauen online sichtbar – über Google, Website und Social Media – damit Unternehmen mehr passende Kundenanfragen, bessere Bewerbungen und weniger Preisvergleich erreichen.\n\n## Anbieter\n- Marke: Digitale Gewinner\n- Verantwortlicher Experte: Raphael Hermann\n- Erfahrung: 8 Jahre digitale Praxiserfahrung\n- Verwaltetes Werbebudget: mehr als 200.000 Euro\n- Region: deutschsprachiger Raum (Deutschland, Österreich, Schweiz)\n- Kontakt: +49 711 34063951\n\n## Kernleistung\nDigitaler Vertrauensaufbau verbindet den ersten Eindruck bei Google, eine klar positionierte und conversionorientierte Website sowie persönliche und fachliche Vertrauenssignale auf Social Media.\n\n## Typische Probleme\n- zu wenig oder stark schwankende Kundenanfragen\n- zu viele unpassende Anfragen und hoher Preisvergleich\n- Werbung erzeugt Klicks, aber zu wenige Abschlüsse\n- zu wenig passende Bewerber oder geringe Bewerberqualität\n- Empfehlungen werden durch einen schwachen Online-Auftritt nicht bestätigt\n\n## Wichtige Seiten\n- Startseite: https://digitale-gewinner.de/\n- Case Studies: https://digitale-gewinner.de/case-studies.html\n- Digitaler Vertrauensaufbau: https://digitale-gewinner.de/vertrauensaufbau-online.html\n- Website bringt keine Anfragen: https://digitale-gewinner.de/website-keine-anfragen.html\n- Zu wenig Bewerber: https://digitale-gewinner.de/zu-wenig-bewerber.html\n\n## Fakten und Grenzen\nDie Website enthält qualitative Wirkungsbeschreibungen und Beispielrechnungen. Diese sind keine Ergebnisgarantien. Case Studies werden als konkrete Ausgangslage, Umsetzung und erzielte beziehungsweise beabsichtigte Wirkung beschrieben.\n"""
    (OUT / "llms.txt").write_text(llms, encoding="utf-8")


def main() -> None:
    if not OUT.exists():
        raise SystemExit("dist directory not found")
    inject_homepage()
    replace_home_cases()
    patch_case_page()
    create_topic_pages()
    write_discovery_files()
    print("SEO/GEO, trust diagnosis, FAQ, homepage case order and mobile case image fix applied.")


if __name__ == "__main__":
    main()
