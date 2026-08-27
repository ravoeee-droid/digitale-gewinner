from __future__ import annotations

from pathlib import Path
import html as html_lib
import json
import re

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "dist"
SITE = "https://digitalegewinner.de"
PHONE = "4971134063951"

SECTORS = [
    {"key":"unternehmen","name":"Unternehmen","prefix":"","audience":"Unternehmen, Dienstleister und Experten","pain":"Der Online-Auftritt erklärt Qualität oft zu langsam. Interessenten vergleichen dann Preis statt Wert oder springen ab, bevor ein Gespräch entsteht.","proof":"Klare Positionierung, echte Projekte, Bewertungen, persönliche Ansprechpartner und nachvollziehbare nächste Schritte.","outcome":"mehr qualifizierte Anfragen, weniger Preisvergleich und ein professioneller digitaler Vertriebsweg","example":"Besucher sollen innerhalb weniger Sekunden verstehen, für wen das Angebot gedacht ist, welches Problem gelöst wird und warum das Unternehmen die sichere Wahl ist."},
    {"key":"photovoltaik","name":"Photovoltaik","prefix":"photovoltaik","audience":"PV-Betriebe, Solarteure und Photovoltaik-Unternehmen","pain":"PV-Endkunden vergleichen mehrere Anbieter, Preise, Speicherlösungen und Bewertungen. Eine austauschbare Website verliert deshalb Anfragen trotz vorhandener Nachfrage.","proof":"Regionale Leistungsseiten, PV-Referenzen, Ersparnislogik, Dach- und Speicherfragen, Bewertungen und eine schnelle Angebotsvorqualifizierung.","outcome":"mehr qualifizierte PV-Anfragen und weniger Leads, die nur den billigsten Preis suchen","example":"Ein PV-Funnel kann Dachart, Stromverbrauch, PLZ, Speicherwunsch und Projektzeitraum vorqualifizieren, bevor der Vertrieb zurückruft."},
    {"key":"pflegedienst","name":"Pflegedienst","prefix":"pflegedienst","audience":"ambulante Pflegedienste, Pflegeanbieter und Pflegeunternehmen","pain":"Pflegedienste müssen gleichzeitig Vertrauen bei Angehörigen aufbauen und Fachkräfte überzeugen. Veraltete Seiten bremsen beide Ziele.","proof":"Menschliche Teamdarstellung, klare Pflegeleistungen, lokale Vertrauenssignale, Bewerberstrecke, Google-Bewertungen und direkte Kontaktwege.","outcome":"mehr passende Bewerbungen, mehr qualifizierte Kundenanfragen und stärkere lokale Wahrnehmung","example":"Eine Pflege-Website muss Angehörigen Sicherheit geben und Bewerbern zeigen, wie Team, Führung, Dienstplanung und Arbeitsalltag wirklich aussehen."},
    {"key":"handwerk","name":"Handwerk","prefix":"handwerk","audience":"Handwerksbetriebe und regionale Fachbetriebe","pain":"Viele Handwerksbetriebe leben von Empfehlungen, verlieren aber digitale Interessenten an Wettbewerber mit klareren Leistungen, Referenzen und Kontaktwegen.","proof":"Leistungsseiten, Projektbeispiele, Einsatzgebiet, Bewertungen, schnelle Anfrageformulare und klare Qualifizierung nach Projektart.","outcome":"mehr passende Projekte statt unqualifizierter Preis-Anfragen","example":"Gute Handwerkerseiten zeigen Leistungen, echte Baustellen, Region, Ablauf und einen einfachen Weg zur qualifizierten Anfrage."},
    {"key":"shk","name":"SHK","prefix":"shk","audience":"SHK-Betriebe, Heizungsbauer und Sanitärunternehmen","pain":"Bei Heizung, Wärmepumpe und Sanitär entscheidet Vertrauen früh. Unklare Leistungen und fehlende regionale Relevanz kosten hochwertige Projekte.","proof":"Leistungscluster für Heizung, Wärmepumpe und Sanitär, Referenzen, Förderhinweise, regionale Seiten und Projektvorqualifizierung.","outcome":"mehr hochwertige SHK-Anfragen und weniger unnötige Rückfragen","example":"Ein SHK-Funnel trennt Notdienst, Modernisierung, Wärmepumpe und Badsanierung und fragt Budget, Objekt und Zeitraum passend ab."},
    {"key":"elektro","name":"Elektro","prefix":"elektro","audience":"Elektriker, Elektrobetriebe und Gebäudetechnik-Unternehmen","pain":"Von klassischer Elektroinstallation bis Wallbox und Smart Home sind Leistungen breit. Ohne klare Struktur versteht Google und der Kunde das Angebot nur teilweise.","proof":"Saubere Leistungsarchitektur, regionale Relevanz, Projektbeispiele, Zertifikate und qualifizierende Anfragewege.","outcome":"mehr passende Elektro-Projekte und bessere Sichtbarkeit für profitable Leistungen","example":"Leistungen wie Wallbox, PV-Elektrik, Smart Home und Gewerbeinstallation brauchen jeweils klare Suchintention und Beweise."},
    {"key":"dachdecker","name":"Dachdecker","prefix":"dachdecker","audience":"Dachdecker, Zimmereien und Dach-Fachbetriebe","pain":"Dachprojekte haben hohen Auftragswert und hohen Vertrauensbedarf. Eine schwache Website lässt Interessenten Angebote nur über den Preis vergleichen.","proof":"Vorher-Nachher-Projekte, Leistungsarten, Region, Materialkompetenz, Bewertungen und Projektvorqualifizierung.","outcome":"mehr profitable Dachprojekte und weniger reine Preisvergleiche","example":"Eine gute Dachdecker-Seite trennt Sanierung, Neubau, Reparatur, Flachdach und Dämmung und führt Interessenten direkt zum passenden Anfrageweg."},
    {"key":"steuerberater","name":"Steuerberater","prefix":"steuerberater","audience":"Steuerkanzleien und Steuerberater","pain":"Mandanten und Bewerber suchen Kompetenz, Erreichbarkeit und Spezialisierung. Generische Kanzlei-Seiten zeigen selten, warum genau diese Kanzlei passt.","proof":"Spezialisierungen, Branchenkompetenz, Team, digitale Zusammenarbeit, Mandantenprozess und Karrierebereich.","outcome":"mehr passende Mandatsanfragen und qualifiziertere Bewerbungen","example":"Eine Steuerberater-Website sollte früh klären, welche Mandate passen, wie digital gearbeitet wird und was neue Mandanten im Erstkontakt erwartet."},
    {"key":"kanzlei","name":"Kanzlei","prefix":"kanzlei","audience":"Rechtsanwaltskanzleien und spezialisierte Kanzleien","pain":"Rechtliche Probleme erzeugen Unsicherheit. Besucher brauchen schnell Fachgebiet, Kompetenz, Vorgehen und einen sicheren nächsten Schritt.","proof":"Klare Rechtsgebiete, Anwaltprofile, Falllogik ohne Ergebnisversprechen, Bewertungen und strukturierte Erstkontaktstrecken.","outcome":"mehr passende Mandatsanfragen und weniger unpassende Erstkontakte","example":"Statt allgemeiner Kanzlei-Sprache braucht jedes wichtige Rechtsgebiet eine klare Erklärung von Situation, Vorgehen und nächstem Schritt."},
    {"key":"immobilienmakler","name":"Immobilienmakler","prefix":"immobilienmakler","audience":"Immobilienmakler und Maklerunternehmen","pain":"Eigentümer vergeben hochwertige Objekte an Anbieter, denen sie Vermarktungskompetenz und lokale Marktkenntnis zutrauen. Austauschbare Maklerseiten verlieren diesen Vertrauensvergleich.","proof":"Referenzobjekte, Verkaufsprozess, lokale Expertise, Bewertungen, Eigentümer-Funnel und Bewertungsanfrage.","outcome":"mehr Eigentümer-Leads und besser vorqualifizierte Verkaufsmandate","example":"Ein Eigentümer-Funnel kann Objektart, Lage, Verkaufszeitraum und Motivation abfragen und direkt einen passenden nächsten Schritt anbieten."},
]

INTENTS = [
    {"key":"webdesign","label":"Webdesign","slug":"webdesign","title":"{sector} Webdesign: Website als Kundengewinnungssystem","h1":"Webdesign für {audience}, das nicht nur gut aussieht.","promise":"Die Website wird als Vertriebs- und Vertrauenssystem aufgebaut: schnell, klar, mobil und auf echte Anfragen ausgerichtet.","sections":[("Nicht Design zuerst, sondern Entscheidung","Die wichtigste Aufgabe ist nicht Animation, sondern dass Besucher schnell verstehen, ob das Angebot passt und warum der Anbieter glaubwürdig ist."),("Jede Seite bekommt eine Aufgabe","Leistung, Beweis, Einwand und nächster Schritt werden bewusst angeordnet. So entsteht ein klarer Weg statt einer digitalen Broschüre."),("Technisch schlank","Statische Inhalte, wenig JavaScript, komprimierte Medien und saubere Semantik halten Ladezeit und Wartungsaufwand niedrig.")]},
    {"key":"website-erstellen-lassen","label":"Website erstellen lassen","slug":"website-erstellen-lassen","title":"Website für {sector} erstellen lassen | Digitale Gewinner","h1":"Website für {audience} erstellen lassen – mit klarem Verkaufsziel.","promise":"Von Positionierung bis Leadweg entsteht ein fertiges System statt nur einer neuen Oberfläche.","sections":[("Vor dem Bau wird die Kaufentscheidung verstanden","Wir klären Zielgruppe, wertvollste Leistungen, häufige Einwände und die Beweise, die eine Anfrage sicherer machen."),("Dann wird nur gebaut, was verkauft","Unnötige Unterseiten und Effekte entfallen. Priorität haben Suchintention, Verständlichkeit, Vertrauen und Kontakt."),("Messbar statt Bauchgefühl","Anfragewege und wichtige Klicks werden so aufgebaut, dass später sichtbar wird, welche Seiten tatsächlich Leads erzeugen.")]},
    {"key":"website-kosten","label":"Website Kosten","slug":"website-kosten","title":"{sector} Website Kosten: Was lohnt sich wirklich?","h1":"Was kostet eine starke Website für {audience}?","promise":"Nicht die Seitenzahl entscheidet über den Wert, sondern wie viel Vertriebsarbeit, Vorqualifizierung und Vertrauen die Website übernimmt.","sections":[("Billig wird teuer, wenn die Seite keine Aufgabe erfüllt","Eine günstige Website ohne klare Such- und Conversion-Logik kann jahrelang online sein und trotzdem kaum messbaren Geschäftswert erzeugen."),("Preis hängt vom System ab","Relevant sind Umfang, Inhalte, Funnel, Rechner, Integrationen, Tracking, Mehrsprachigkeit und die Tiefe der Branchenlogik."),("ROI statt Designpreis vergleichen","Die bessere Frage lautet: Wie viele zusätzliche qualifizierte Anfragen oder Bewerbungen muss das System erzeugen, damit sich die Investition trägt?")]},
    {"key":"seo","label":"SEO","slug":"seo","title":"SEO für {sector}: Sichtbarkeit mit Kaufabsicht","h1":"SEO für {audience}: nicht mehr Traffic, sondern mehr richtige Besucher.","promise":"Wir priorisieren Suchbegriffe nach Kaufabsicht, wirtschaftlichem Wert und realistischer Rankingchance.","sections":[("Suchvolumen allein ist kein Ziel","Ein kleiner kaufnaher Begriff kann wertvoller sein als ein großes Informationskeyword ohne B2B-Absicht."),("Themencluster statt Keyword-Kopien","Ähnliche Varianten werden auf starken Seiten gebündelt. Eigene Seiten entstehen nur, wenn die Suchintention wirklich eine andere ist."),("Search Console steuert den Ausbau","Impressionen, Positionen, Klickrate und Leads zeigen, welche Themen weiter ausgebaut und welche nicht weiter verfolgt werden.")]},
    {"key":"google-sichtbarkeit","label":"Google Sichtbarkeit","slug":"google-sichtbarkeit","title":"{sector} bei Google sichtbarer werden","h1":"{sector}: bei Google sichtbar werden, wenn Kunden wirklich suchen.","promise":"Website, lokale Signale, Bewertungen und passende Landingpages werden aufeinander abgestimmt.","sections":[("Sichtbarkeit beginnt mit Relevanz","Google muss eindeutig verstehen, welche Leistungen für welche Zielgruppe und Region angeboten werden."),("Vertrauen beeinflusst den Klick","Titel, Bewertungen, Marke und der sichtbare Nutzen entscheiden mit, ob aus einer Impression überhaupt ein Besucher wird."),("Landingpage entscheidet über den Lead","Ranking ist nur die Hälfte. Nach dem Klick muss die Seite die Suchfrage beantworten und einen passenden nächsten Schritt anbieten.")]},
    {"key":"leads-gewinnen","label":"Leads gewinnen","slug":"leads-gewinnen","title":"Mehr {sector} Leads über Website & Google","h1":"Mehr qualifizierte Leads für {audience}.","promise":"Der Fokus liegt auf Leads, die zum Angebot passen – nicht auf möglichst vielen Formularen.","sections":[("Traffic wird vorqualifiziert","Die Seite nennt Zielgruppe, Leistungsrahmen und relevante Voraussetzungen so klar, dass unpassende Interessenten früher aussortiert werden."),("Formulare fragen nur Entscheidendes","Projektart, Region, Zeitraum und wenige wirtschaftlich relevante Kriterien reichen meist für einen qualifizierten Erstkontakt."),("Schneller Übergang in den Vertrieb","WhatsApp, Telefon, Kalender oder CRM können so verbunden werden, dass wertvolle Anfragen nicht liegen bleiben.")]},
    {"key":"conversion-optimierung","label":"Conversion Optimierung","slug":"conversion-optimierung","title":"Conversion Optimierung für {sector} Websites","h1":"Mehr Anfragen aus bestehendem Traffic für {audience}.","promise":"Bevor mehr Reichweite gekauft wird, beseitigen wir Reibung, Zweifel und unnötige Schritte auf der bestehenden Customer Journey.","sections":[("Klarheit vor Überzeugung","Besucher müssen zuerst verstehen, was angeboten wird. Erst danach können Beweise, Vorteile und Differenzierung wirken."),("Einwände dort beantworten, wo sie entstehen","Preis, Ablauf, Erfahrung, Region, Verfügbarkeit und Risiko sollten nicht erst im Verkaufsgespräch erklärt werden."),("Messen und iterieren","CTA-Klicks, Formularstarts und Leads geben Hinweise, an welcher Stelle der Weg verbessert werden sollte.")]},
    {"key":"marketing","label":"Marketing","slug":"marketing","title":"{sector} Marketing: Google, Website & Funnel verbinden","h1":"Marketing für {audience}, bei dem Website und Akquise zusammenarbeiten.","promise":"Statt einzelner Maßnahmen entsteht ein einfacher Kreislauf aus Nachfrage, Landingpage, Leadqualifizierung und Follow-up.","sections":[("Kanäle brauchen ein gemeinsames Versprechen","Google Ads, SEO, Social Media und Empfehlungen sollten auf Seiten führen, die dieselbe klare Positionierung bestätigen."),("Die Website ist die Conversion-Schicht","Sie sammelt Beweise, erklärt den Wert und führt Interessenten in den passenden nächsten Schritt."),("Ergebnisse bis zum Lead verfolgen","Reichweite und Klicks sind Zwischenwerte. Entscheidend sind qualifizierte Kontakte, Termine und wirtschaftlicher Wert.")]},
    {"key":"landingpage","label":"Landingpage","slug":"landingpage","title":"Landingpage für {sector}: mehr qualifizierte Anfragen","h1":"Landingpage für {audience}: eine Suchintention, ein klarer nächster Schritt.","promise":"Für Ads, SEO oder Kampagnen bauen wir fokussierte Seiten ohne unnötige Ablenkung.","sections":[("Eine Landingpage beantwortet eine konkrete Absicht","Angebot, Überschrift und Beweise orientieren sich an genau dem Problem, wegen dem der Besucher geklickt hat."),("Vertrauen direkt neben der Entscheidung","Referenzen, Bewertungen, Ablauf und konkrete Erwartungen stehen dort, wo Besucher den nächsten Schritt abwägen."),("Mobile zuerst","Die wichtigsten Informationen, Formulare und CTAs funktionieren schnell und ohne unnötige Elemente auf dem Smartphone.")]},
    {"key":"website-relaunch","label":"Website Relaunch","slug":"website-relaunch","title":"{sector} Website Relaunch ohne SEO- und Leadverlust","h1":"Website-Relaunch für {audience}, ohne das Wertvolle wegzuwerfen.","promise":"Bestehende Rankings, Inhalte und Conversion-Daten werden geprüft, bevor Struktur und Design ersetzt werden.","sections":[("Erst Bestand aufnehmen","Rankende URLs, Backlinks, wichtige Inhalte und funktionierende Anfragewege werden dokumentiert."),("Dann Struktur verbessern","Neue Seiten entstehen nach Suchintention und Vertriebslogik. Alte URLs werden sauber weitergeleitet, wenn sie ersetzt werden."),("Nach Launch kontrollieren","Indexierung, 404-Fehler, Search Console, Core Web Vitals und Leads werden nach dem Relaunch beobachtet.")]},
]

def esc(value: object) -> str:
    return html_lib.escape(str(value), quote=True)

def slug_for(sector: dict, intent: dict) -> str:
    return intent["slug"] if sector["key"] == "unternehmen" else f'{intent["slug"]}-{sector["prefix"]}'

def page_url(slug: str) -> str:
    return f"{SITE}/{slug}/"

def faq_items(sector: dict, intent: dict) -> list[tuple[str, str]]:
    return [
        (f'Für wen ist {intent["label"]} im Bereich {sector["name"]} sinnvoll?', f'Für {sector["audience"]}, wenn der aktuelle Online-Auftritt zu wenig {sector["outcome"]} unterstützt oder die Leistung online nicht schnell genug verstanden wird.'),
        (f'Was ist bei {intent["label"]} für {sector["name"]} besonders wichtig?', f'{sector["proof"]} Entscheidend ist, dass diese Elemente nicht isoliert, sondern entlang einer klaren Nutzerentscheidung angeordnet werden.'),
        ("Wie schnell kann so ein System Wirkung zeigen?", "Technische und Conversion-Verbesserungen wirken sofort nach Veröffentlichung. Organische Google-Rankings entwickeln sich abhängig von Wettbewerb, Ausgangslage, Autorität und Indexierung über Zeit und können nicht garantiert werden."),
        ("Wie wird Erfolg gemessen?", "Nicht nur über Besucherzahlen. Wichtiger sind Sichtbarkeit für kaufnahe Suchanfragen, CTA-Klicks, qualifizierte Leads, Termine und der wirtschaftliche Wert der Anfragen."),
    ]

def schema_for(sector: dict, intent: dict, slug: str, title: str, description: str, faqs: list[tuple[str, str]]) -> dict:
    return {"@context":"https://schema.org","@graph":[
        {"@type":"Service","@id":f"{page_url(slug)}#service","name":title,"description":description,"provider":{"@type":"Organization","name":"Digitale Gewinner","url":SITE+"/"},"areaServed":["DE","AT","CH"],"audience":{"@type":"Audience","audienceType":sector["audience"]},"serviceType":intent["label"]},
        {"@type":"FAQPage","@id":f"{page_url(slug)}#faq","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in faqs]}
    ]}

PAGE_CSS = """
:root{--bg:#090806;--panel:#12100d;--text:#f7f0e5;--muted:#b9afa3;--gold:#edc873;--line:rgba(237,200,115,.2);--max:1060px}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#090806;color:var(--text);font:16px/1.65 Inter,system-ui,-apple-system,Segoe UI,sans-serif}
a{color:inherit}.wrap{width:min(var(--max),calc(100% - 32px));margin:auto}nav{height:70px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}
nav a{text-decoration:none;font-weight:800}.nav-cta{color:#111;background:var(--gold);padding:10px 14px;border-radius:10px}
.hero{padding:82px 0 54px}.eyebrow{color:var(--gold);font-size:.75rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
h1,h2,h3{line-height:1.05;letter-spacing:-.035em}h1{font-size:clamp(2.8rem,7vw,5.8rem);max-width:930px;margin:18px 0 22px}
h2{font-size:clamp(2rem,4vw,3.2rem);margin:0 0 18px}h3{font-size:1.25rem}.lead{max-width:820px;color:#d7cec2;font-size:1.18rem}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:28px}.btn{display:inline-flex;text-decoration:none;font-weight:900;padding:13px 17px;border:1px solid var(--line);border-radius:11px}.primary{background:var(--gold);color:#171006;border-color:transparent}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:34px 0}.card,.box{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:22px}
.card p,.box p,section p{color:var(--muted)}section{padding:48px 0;border-top:1px solid var(--line)}.two{display:grid;grid-template-columns:1.1fr .9fr;gap:28px}
.checks{display:grid;gap:9px;margin-top:20px}.checks div:before{content:"✓";color:var(--gold);font-weight:900;margin-right:10px}
.calc label{display:grid;gap:5px;margin:12px 0;color:#d8cfc3;font-size:.9rem}.calc input{width:100%;padding:12px;border-radius:9px;border:1px solid var(--line);background:#0a0908;color:white}
.result{font-size:1.35rem;font-weight:900;color:var(--gold);margin-top:15px}.faq details{padding:17px 0;border-bottom:1px solid var(--line)}.faq summary{cursor:pointer;font-weight:800}
.links{display:flex;flex-wrap:wrap;gap:8px}.links a{font-size:.9rem;padding:8px 11px;border:1px solid var(--line);border-radius:999px;text-decoration:none}
footer{padding:35px 0 55px;border-top:1px solid var(--line);color:#887f74;font-size:.82rem}
@media(max-width:760px){.grid,.two{grid-template-columns:1fr}.hero{padding-top:55px}.nav-cta{font-size:.82rem}h1{font-size:clamp(2.6rem,12vw,4.5rem)}}
"""

def render_page(sector: dict, intent: dict) -> tuple[str, str]:
    slug = slug_for(sector, intent)
    sector_title = sector["name"]
    title = intent["title"].format(sector=sector_title)
    h1 = intent["h1"].format(sector=sector_title, audience=sector["audience"])
    description = f'{intent["label"]} für {sector["audience"]}: {intent["promise"]} Ziel: {sector["outcome"]}.'
    faqs = faq_items(sector, intent)
    schema = schema_for(sector, intent, slug, title, description, faqs)
    section_html = "".join(f'<article class="card"><h3>{esc(head)}</h3><p>{esc(text)}</p></article>' for head,text in intent["sections"])
    peers = "".join(f'<a href="/{esc(slug_for(sector, peer))}/">{esc(peer["label"])}</a>' for peer in INTENTS if peer["key"] != intent["key"])
    faq_html = "".join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q,a in faqs)
    wa_text = f"Hallo Raphael, ich komme über die Seite {intent['label']} / {sector_title} und möchte wissen, was bei uns das größte Potenzial ist."
    wa_url = f"https://wa.me/{PHONE}?text=" + wa_text.replace(" ", "%20").replace("/", "%2F")
    page = f"""<!doctype html>
<html lang="de"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<link rel="canonical" href="{page_url(slug)}">
<meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{page_url(slug)}">
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False, separators=(",", ":"))}</script>
<style>{PAGE_CSS}</style></head>
<body><div class="wrap">
<nav><a href="/">DIGITALE GEWINNER</a><a class="nav-cta" href="{wa_url}">Potenzial prüfen →</a></nav>
<main>
<header class="hero"><span class="eyebrow">{esc(intent["label"])} · {esc(sector_title)}</span>
<h1>{esc(h1)}</h1><p class="lead">{esc(intent["promise"])} {esc(sector["pain"])}</p>
<div class="actions"><a class="btn primary" href="{wa_url}">Kostenlose Potenzialanalyse →</a><a class="btn" href="/case-studies.html">Case Studies</a></div>
</header>
<section><h2>Was hier anders gemacht wird</h2><div class="grid">{section_html}</div></section>
<section><div class="two"><div><span class="eyebrow">Branchenlogik</span><h2>Für {esc(sector["audience"])} gebaut.</h2>
<p>{esc(sector["example"])}</p><div class="checks"><div>{esc(sector["proof"])}</div><div>Mobile-first und ohne unnötige technische Last.</div><div>Klare Messpunkte für Suchsichtbarkeit, Klicks und Leads.</div></div></div>
<div class="box"><h3>Das wirtschaftliche Ziel</h3><p>{esc(sector["outcome"].capitalize())}.</p><p>Keine Ergebnisgarantie: SEO und Leadzahlen hängen unter anderem von Markt, Angebot, Wettbewerb, Reputation und Vertriebsprozess ab.</p></div></div></section>
<section><div class="two"><div><span class="eyebrow">Schneller Rechner</span><h2>Wie viel kann bessere Conversion wert sein?</h2>
<p>Einfach vorhandenen Website-Traffic und einen realistischen Leadwert einsetzen. Der Rechner ist eine Szenario-Schätzung, keine Prognose.</p></div>
<div class="box calc"><label>Besucher pro Monat<input id="v" type="number" min="0" value="500"></label>
<label>Aktuelle Leadrate in %<input id="c" type="number" min="0" step=".1" value="2"></label>
<label>Ziel-Leadrate in %<input id="t" type="number" min="0" step=".1" value="4"></label>
<label>Wert eines qualifizierten Leads in €<input id="l" type="number" min="0" value="250"></label>
<div class="result" id="r">–</div></div></div></section>
<section class="faq"><span class="eyebrow">FAQ</span><h2>Häufige Fragen</h2>{faq_html}</section>
<section><span class="eyebrow">Weiter im Cluster</span><h2>Passende Themen für {esc(sector_title)}</h2><div class="links">{peers}</div></section>
<section><div class="box"><h2>Welche 3 Dinge kosten Ihre Website gerade Anfragen?</h2><p>Ich prüfe Positionierung, Google-Sichtbarkeit, Vertrauen und Leadweg und sage Ihnen, wo zuerst angesetzt werden sollte.</p><a class="btn primary" href="{wa_url}">Kostenlos prüfen lassen →</a></div></section>
</main>
<footer>© 2026 Digitale Gewinner · <a href="/impressum.html">Impressum</a> · <a href="/datenschutz.html">Datenschutz</a></footer>
</div>
<script>
(function(){{
const els=["v","c","t","l"].map(id=>document.getElementById(id)), out=document.getElementById("r");
function calc(){{const [v,c,t,l]=els.map(e=>Math.max(0,parseFloat(e.value)||0));const extra=v*Math.max(0,t-c)/100;const value=extra*l;out.textContent=extra.toLocaleString("de-DE",{{maximumFractionDigits:1}})+" zusätzliche Leads / Monat ≈ "+value.toLocaleString("de-DE",{{style:"currency",currency:"EUR",maximumFractionDigits:0}})+" Szenario-Wert";}}
els.forEach(e=>e.addEventListener("input",calc));calc();
}})();
</script></body></html>"""
    return slug, page

def normalize_existing_pages() -> None:
    for name in ("index.html","case-studies.html","danke.html"):
        path = OUT / name
        if path.exists():
            source = path.read_text(encoding="utf-8").replace("https://digitale-gewinner.de", SITE)
            path.write_text(source, encoding="utf-8")

def patch_metadata() -> None:
    path = OUT / "index.html"
    if not path.exists():
        return
    source = path.read_text(encoding="utf-8")
    source = re.sub(r"<title>.*?</title>", "<title>Digitale Gewinner | Websites, SEO & Lead-Systeme</title>", source, count=1, flags=re.S)
    source = re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Digitale Gewinner baut schnelle Websites, SEO-Cluster und Lead-Systeme für Unternehmen – mit Fokus auf Google-Sichtbarkeit, Vertrauen und qualifizierte Anfragen.">',source,count=1)
    if 'rel="canonical"' in source:
        source = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{SITE}/">', source, count=1)
    else:
        source = source.replace("</head>", f'<link rel="canonical" href="{SITE}/"></head>', 1)
    path.write_text(source, encoding="utf-8")

def inject_homepage_content() -> None:
    path = OUT / "index.html"
    if not path.exists():
        return
    source = path.read_text(encoding="utf-8")
    if "seo-geo-upgrade.css" not in source:
        source = source.replace("</head>", '<link rel="stylesheet" href="/seo-geo-upgrade.css"></head>', 1)
    if 'id="vertrauensproblem"' not in source:
        diagnosis = """<section class="section" id="vertrauensproblem"><div class="container">
<span class="eyebrow">Warum gute Unternehmen online verlieren</span>
<h2 class="serif">Mehr Reichweite hilft wenig, wenn danach Vertrauen fehlt.</h2>
<div class="grid3">
<article class="card"><div class="card-num">01 · Klarheit</div><h3>Besucher verstehen den Unterschied nicht.</h3><p>Wenn Leistung, Zielgruppe und Nutzen austauschbar wirken, bleibt der Preis als Vergleich.</p></article>
<article class="card"><div class="card-num">02 · Beweise</div><h3>Qualität wird behauptet statt gezeigt.</h3><p>Projekte, Bewertungen, Menschen und nachvollziehbare Abläufe müssen Zweifel dort reduzieren, wo sie entstehen.</p></article>
<article class="card"><div class="card-num">03 · Weg</div><h3>Der nächste Schritt ist zu unklar.</h3><p>Ein guter Leadweg erklärt, was passiert, fragt nur Relevantes ab und führt schnell in den Vertrieb.</p></article>
</div></div></section>"""
        source = source.replace("</main>", diagnosis + "</main>", 1)
    if 'id="faq"' not in source:
        faq = """<section class="section" id="faq"><div class="container"><span class="eyebrow">Häufige Fragen</span>
<h2 class="serif">Google-Sichtbarkeit und Conversion kurz erklärt.</h2><div class="faq">
<details><summary>Wie schnell kann SEO Ergebnisse bringen?</summary><p>Das hängt von Wettbewerb, bestehender Autorität, technischer Ausgangslage und Suchintention ab. Rankings und konkrete Leadzahlen können nicht garantiert werden.</p></details>
<details><summary>Warum nicht für jedes Keyword eine eigene Seite?</summary><p>Ähnliche Suchvarianten werden gebündelt. Eigene Seiten sind sinnvoll, wenn Nutzer wirklich ein anderes Problem oder eine andere Entscheidung haben.</p></details>
<details><summary>Was wird zuerst optimiert?</summary><p>Kaufnahe Suchintentionen, technische Indexierbarkeit, interne Verlinkung, Vertrauen und der Leadweg. Danach wird anhand der Search Console weiter ausgebaut.</p></details>
<details><summary>Warum Branchen-Seiten?</summary><p>Ein PV-Betrieb, Pflegedienst oder Steuerberater hat andere Einwände, Beweise und Prozesse. Diese Unterschiede erhöhen Relevanz für Google und Besucher.</p></details>
</div></div></section>"""
        source = source.replace("</main>", faq + "</main>", 1)
    path.write_text(source, encoding="utf-8")

def patch_case_metadata() -> None:
    path = OUT / "case-studies.html"
    if not path.exists():
        return
    source = path.read_text(encoding="utf-8")
    source = re.sub(r"<title>.*?</title>", "Webdesign Case Studies | Digitale Gewinner", source, count=1, flags=re.S)
    source = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="Ausgewählte Webdesign- und Conversion-Projekte von Digitale Gewinner: Positionierung, Vertrauen, Nutzerführung und digitale Lead-Systeme.">', source, count=1)
    source = source.replace("https://digitale-gewinner.de", SITE)
    path.write_text(source, encoding="utf-8")

def inject_homepage_hub() -> None:
    path = OUT / "index.html"
    if not path.exists():
        return
    source = path.read_text(encoding="utf-8")
    if 'id="seo-leistungen"' in source:
        return
    priority = [
        ("Website erstellen lassen","website-erstellen-lassen"),("Webdesign","webdesign"),("Website Kosten","website-kosten"),
        ("Photovoltaik Webdesign","webdesign-photovoltaik"),("Photovoltaik SEO","seo-photovoltaik"),("PV Leads","leads-gewinnen-photovoltaik"),
        ("Pflegedienst Webdesign","webdesign-pflegedienst"),("Pflegedienst SEO","seo-pflegedienst"),("Handwerk Webdesign","webdesign-handwerk"),("Steuerberater Webdesign","webdesign-steuerberater")
    ]
    links = "".join(f'<a href="/{slug}/" style="padding:9px 12px;border:1px solid rgba(241,206,132,.18);border-radius:999px">{esc(label)} →</a>' for label,slug in priority)
    hub = f'<section id="seo-leistungen" class="section"><div class="container"><span class="eyebrow">Spezialisierte Lösungen</span><h2 class="serif">Direkt zum passenden Wachstumsthema.</h2><div style="display:flex;flex-wrap:wrap;gap:10px">{links}</div></div></section>'
    source = source.replace("</main>", hub + "</main>", 1)
    path.write_text(source, encoding="utf-8")

def generate_pages() -> list[str]:
    slugs = []
    for sector in SECTORS:
        for intent in INTENTS:
            slug,page = render_page(sector,intent)
            target = OUT / slug
            target.mkdir(parents=True, exist_ok=True)
            (target / "index.html").write_text(page, encoding="utf-8")
            slugs.append(slug)
    if len(slugs) != 100 or len(set(slugs)) != 100:
        raise SystemExit(f"Expected 100 unique SEO pages, got {len(set(slugs))}")
    return slugs

def write_discovery(slugs: list[str]) -> None:
    urls = [(SITE+"/","1.0","weekly"),(SITE+"/case-studies.html","0.8","monthly"),(SITE+"/impressum.html","0.1","yearly"),(SITE+"/datenschutz.html","0.1","yearly")]
    urls.extend((page_url(slug),"0.8","monthly") for slug in slugs)
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n']
    for url,priority,freq in urls:
        sitemap.append(f"  <url><loc>{esc(url)}</loc><changefreq>{freq}</changefreq><priority>{priority}</priority></url>\n")
    sitemap.append("</urlset>\n")
    (OUT/"sitemap.xml").write_text("".join(sitemap),encoding="utf-8")
    (OUT/"robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n",encoding="utf-8")
    llms = ["# Digitale Gewinner\n\n","> Websites, SEO-Cluster und Lead-Systeme für Unternehmen mit Fokus auf kaufnahe Google-Sichtbarkeit und Conversion.\n\n","## Kernseiten\n"]
    for sector in SECTORS:
        for intent in INTENTS[:3]:
            slug = slug_for(sector,intent)
            llms.append(f"- {intent['label']} für {sector['name']}: {page_url(slug)}\n")
    (OUT/"llms.txt").write_text("".join(llms),encoding="utf-8")

def main() -> None:
    if not OUT.exists():
        raise SystemExit("dist directory not found")
    normalize_existing_pages()
    patch_metadata()
    inject_homepage_content()
    patch_case_metadata()
    slugs = generate_pages()
    inject_homepage_hub()
    write_discovery(slugs)
    print(f"SEO system built: {len(slugs)} fast, static, internally linked pages on {SITE}.")

if __name__ == "__main__":
    main()
