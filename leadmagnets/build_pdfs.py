# -*- coding: utf-8 -*-
"""Erzeugt aus den Inhalten vier hochwertige A4-PDFs (HTML -> PDF per Playwright) plus Mockup-Bilder."""
import html, importlib, json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parent
OUT_PDF = REPO / 'assets' / 'downloads'
OUT_IMG = REPO / 'assets' / 'images' / 'leadmagnets'
TMP = ROOT / '_tmp'
PORTRAIT = (REPO / 'assets/images/raphael/raphael-hermann-portrait.webp').as_uri()
PHONE, WA, CAL, WEB = '+49 711 34063951', 'https://wa.me/4971134063951', 'https://calendar.app.google/jZqwYfHqfjufkFmx5', 'https://digitalegewinner.de'
MODS = ['content_pflege_mit', 'content_pflege_kun', 'content_hw_mit', 'content_hw_kun']
e = html.escape

CSS = '''
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&display=swap');
:root{--bg:#090806;--panel:#15110c;--cream:#f7f0e5;--paper:#fbf7f0;--ink:#17120c;--muted:#6b6154;--gold:#d8a648;--gold2:#f1ce84;--gold3:#8a6420;--line:#e2d8c6}
*{box-sizing:border-box;margin:0;padding:0}
@page{size:210mm 297mm;margin:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:var(--ink);font-size:9.6pt;line-height:1.5}
.page{width:210mm;height:297mm;position:relative;overflow:hidden;page-break-after:always;background:var(--paper);padding:20mm 18mm 22mm}
.page:last-child{page-break-after:auto}
.serif{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;letter-spacing:-.01em}
.dark{background:var(--bg);color:var(--cream)}
.eyebrow{font-size:7.4pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.eyebrow.on-light{color:var(--gold3)}
.foot{position:absolute;left:18mm;right:18mm;bottom:9mm;display:flex;justify-content:space-between;font-size:7pt;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.dark .foot{color:#8f8472}
.brand{display:flex;align-items:center;gap:3mm;font-size:7.6pt;font-weight:800;letter-spacing:.2em;text-transform:uppercase}
.brand i{display:inline-block;width:7mm;height:7mm;border:1.4pt solid var(--gold);border-radius:1.6mm;position:relative}
.brand i:after{content:"";position:absolute;left:1.3mm;right:1.3mm;bottom:1.6mm;height:2.2mm;border-bottom:1.4pt solid var(--gold);border-left:1.4pt solid var(--gold);transform:skewX(-20deg)}
.brand b{color:var(--gold);font-weight:800}
/* Cover */
.cover{padding:0}
.cover .glow{position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 85% 12%,rgba(216,166,72,.30),transparent 60%),radial-gradient(ellipse 70% 40% at 0% 100%,rgba(216,166,72,.14),transparent 60%)}
.cover .rules{position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 22mm,rgba(241,206,132,.045) 22mm 22.2mm)}
.cover .in{position:absolute;inset:0;padding:22mm 20mm 20mm;display:flex;flex-direction:column}
.cover h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:58pt;line-height:.98;letter-spacing:-.03em;margin-top:auto}
.cover h1 em{color:var(--gold2);font-style:italic}
.cover .sub{margin-top:9mm;max-width:130mm;font-size:11.2pt;line-height:1.55;color:#d9cfbf}
.cover .meta{margin-top:12mm;padding-top:6mm;border-top:.6pt solid rgba(241,206,132,.35);display:flex;justify-content:space-between;align-items:flex-end;font-size:8pt;color:#a99d8b;letter-spacing:.04em}
.cover .meta strong{display:block;color:var(--cream);font-size:9.4pt;letter-spacing:0}
.cover .badge{margin-top:8mm;align-self:flex-start;border:.8pt solid var(--gold);color:var(--gold2);border-radius:99px;padding:2mm 5mm;font-size:7.4pt;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
/* Intro */
.intro h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:30pt;line-height:1.02;margin:5mm 0 7mm}
.intro p{max-width:150mm;margin-bottom:4mm;font-size:10.2pt;color:#3a3228}
.toc{margin-top:8mm;display:grid;grid-template-columns:1fr 1fr;gap:5mm 10mm}
.toc div{border-top:1.2pt solid var(--gold);padding-top:3mm}
.toc b{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:15pt;font-weight:600;line-height:1.1}
.toc small{display:block;color:var(--muted);font-size:8pt;margin-top:1mm}
.toc span{font-size:7.4pt;color:var(--gold3);font-weight:700;letter-spacing:.14em}
.aud{margin-top:8mm;padding:4mm 5mm;background:#f1e8d6;border-left:2.4pt solid var(--gold);font-size:8.6pt;color:#3a3228}
/* Kapitel-Opener */
.open{padding:0}
.open .in{position:absolute;inset:0;padding:22mm 20mm;display:flex;flex-direction:column}
.open .no{font-family:"Cormorant Garamond",Georgia,serif;font-size:150pt;line-height:.8;color:transparent;-webkit-text-stroke:.8pt var(--gold);margin-top:auto}
.open h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:40pt;line-height:1;margin-top:8mm;letter-spacing:-.02em}
.open p.tag{font-style:italic;font-family:"Cormorant Garamond",Georgia,serif;font-size:17pt;color:var(--gold2);margin-top:4mm}
.open ul{list-style:none;margin-top:12mm;border-top:.6pt solid rgba(241,206,132,.3)}
.open li{padding:2.6mm 0;border-bottom:.6pt solid rgba(241,206,132,.18);font-size:10pt;display:flex;gap:4mm;color:#e9dfcd}
.open li span{color:var(--gold);font-weight:700;width:9mm;font-variant-numeric:tabular-nums}
/* Item */
.items{display:flex;flex-direction:column;gap:0}
.hd{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5mm;padding-bottom:3mm;border-bottom:.8pt solid var(--ink)}
.hd .serif{font-size:15pt}
.item{display:grid;grid-template-columns:16mm 1fr;gap:0 4mm;padding:6.6mm 0;border-bottom:.5pt solid var(--line)}
.item:last-child{border-bottom:0}
.item .n{font-family:"Cormorant Garamond",Georgia,serif;font-size:30pt;line-height:.9;color:var(--gold);font-weight:600;font-variant-numeric:lining-nums}
.item h3{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:16.4pt;line-height:1.08;display:flex;justify-content:space-between;gap:6mm;align-items:flex-start}
.eff{flex:none;font-family:Inter,Arial,sans-serif;font-size:6.6pt;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);white-space:nowrap;padding-top:1.2mm}
.eff i{display:inline-block;width:2mm;height:2mm;border-radius:50%;border:.7pt solid var(--gold3);margin-left:1mm;vertical-align:middle}
.eff i.on{background:var(--gold)}
.item p{margin-top:2.2mm;color:#3a3228;font-size:10.2pt;line-height:1.55}
.how{margin-top:3mm;padding:2.6mm 3.6mm;background:#f4ecdc;border-left:2pt solid var(--gold);font-size:9pt;color:#2a241b}
.how b{color:var(--gold3);font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;margin-right:1.6mm}
.tagw{display:inline-block;font-size:6.4pt;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border:.6pt solid var(--gold3);color:var(--gold3);border-radius:99px;padding:.4mm 2mm;margin-left:2mm;vertical-align:middle}
/* Quick start */
.q h2,.cl h2,.on h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:30pt;line-height:1.02;margin:4mm 0 6mm}
.qs{display:grid;gap:3mm}
.qs div{display:grid;grid-template-columns:11mm 1fr;gap:4mm;padding:4mm 5mm;background:#fff;border:.6pt solid var(--line);border-left:2.4pt solid var(--gold)}
.qs .n{font-family:"Cormorant Garamond",Georgia,serif;font-size:22pt;color:var(--gold);font-weight:600;line-height:1}
.qs b{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:14pt;font-weight:600;line-height:1.1}
.qs span{display:block;margin-top:1mm;font-size:8.6pt;color:#4a4034}
.wk{display:grid;grid-template-columns:repeat(4,1fr);gap:3mm;margin-top:7mm}
.wk div{border-top:1.6pt solid var(--gold);padding-top:3mm;font-size:8.4pt;color:#3a3228}
.wk b{display:block;font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:var(--gold3);margin-bottom:1mm}
/* Checkliste */
.ck{display:grid;grid-template-columns:1fr 1fr;gap:0 9mm;margin-top:3mm}
.ck h4{font-size:7.4pt;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--gold3);margin:3.4mm 0 1mm}
.ck div.r{display:flex;align-items:center;gap:2.4mm;padding:1.25mm 0;border-bottom:.4pt solid var(--line);font-size:8.2pt;line-height:1.25}
.ck .b{flex:none;width:3.4mm;height:3.4mm;border:.8pt solid var(--ink);border-radius:.7mm}
.ck .b.p{border-color:var(--gold3)}
.leg{margin-top:5mm;font-size:8pt;color:var(--muted)}
/* Online */
.op{display:grid;gap:4mm;margin-top:3mm}
.op div{padding:5mm 6mm;background:#fff;border:.6pt solid var(--line)}
.op b{font-family:"Cormorant Garamond",Georgia,serif;font-size:15pt;font-weight:600;display:block}
.op span{font-size:9.2pt;color:#4a4034;display:block;margin-top:1mm}
/* CTA */
.cta{padding:0}
.cta .in{position:absolute;inset:0;padding:22mm 20mm 18mm;display:flex;flex-direction:column}
.cta h2{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:38pt;line-height:1;margin-top:5mm;letter-spacing:-.02em}
.cta h2 em{color:var(--gold2)}
.cta p.lead{margin-top:6mm;max-width:140mm;font-size:11pt;color:#d9cfbf;line-height:1.55}
.cta .btn{display:inline-block;margin-top:8mm;background:linear-gradient(135deg,var(--gold2),var(--gold));color:#1b1408;padding:4mm 8mm;border-radius:99px;font-weight:800;font-size:10pt;text-decoration:none;align-self:flex-start}
.cta .who{display:flex;gap:6mm;align-items:center;margin-top:12mm;padding-top:8mm;border-top:.6pt solid rgba(241,206,132,.3)}
.cta .who img{width:30mm;height:30mm;border-radius:50%;object-fit:cover;object-position:50% 20%;border:1pt solid var(--gold)}
.cta .who strong{display:block;font-family:"Cormorant Garamond",Georgia,serif;font-size:19pt;font-weight:600}
.cta .who span{display:block;font-size:9pt;color:#b9ae9c}
.cta .ct{margin-top:8mm;display:grid;gap:2mm;font-size:10pt}
.cta .ct a{color:var(--gold2);text-decoration:none}
.cta .disc{margin-top:auto;font-size:7pt;color:#8f8472;line-height:1.5;border-top:.6pt solid rgba(241,206,132,.18);padding-top:4mm}
'''

def dots(level):
    n = {'gering': 1, 'mittel': 2, 'hoch': 3}[level]
    return ''.join(f'<i class="{"on" if k < n else ""}"></i>' for k in range(3))

def brand():
    return '<div class="brand"><i></i><span>DIGITALE <b>GEWINNER</b></span></div>'

def foot(doc, n, dark=False):
    return f'<div class="foot"><span>{e(doc["kicker"].split(" · ")[0])}</span><span>Digitale Gewinner · Seite {n}</span></div>'

def render_html(doc):
    pages = []
    cats = doc['cats']
    # Cover
    t = doc['title']
    pages.append(f'''<section class="page cover dark"><div class="glow"></div><div class="rules"></div><div class="in">{brand()}
<h1>{e(t[0])}<br>{e(t[1])}<br><em>{e(t[2])}</em></h1>
<p class="sub">{e(doc['sub'])}</p><span class="badge">Kostenloser Leitfaden · Stand Oktober 2026</span>
<div class="meta"><div><strong>Raphael Hermann</strong>Digitale Gewinner</div><div>{e(doc['audience'])}</div></div></div></section>''')
    # Intro
    toc = ''.join(f'<div><span>BEREICH {i + 1:02d}</span><b>{e(c[0])}</b><small>{e(c[1])}</small></div>' for i, c in enumerate(cats))
    intro = ''.join(f'<p>{e(p)}</p>' for p in doc['intro'])
    pages.append(f'''<section class="page intro"><span class="eyebrow on-light">Vorwort</span><h2>Bevor Sie anfangen.</h2>{intro}
<div class="toc">{toc}<div><span>ZUM SCHLUSS</span><b>Schnellstarter und Checkliste</b><small>Ihre ersten 30 Tage und der Selbsttest</small></div></div>
<div class="aud"><b>Wie Sie damit arbeiten:</b> Lesen Sie einen Bereich, markieren Sie die Punkte, die zu Ihrem Betrieb passen, und tragen Sie am Ende in die Checkliste ein, was Sie schon haben und was Sie planen.</div>{foot(doc, 2)}</section>''')
    pn = 3
    k = 0
    for ci, (cname, ctag, items) in enumerate(cats):
        lst = ''.join(f'<li><span>{k + j + 1:02d}</span>{e(it[0])}</li>' for j, it in enumerate(items))
        pages.append(f'''<section class="page open dark"><div class="glow" style="position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 100% 0%,rgba(216,166,72,.22),transparent 60%)"></div><div class="in">{brand()}
<div class="no">{ci + 1:02d}</div><h2>{e(cname)}</h2><p class="tag">{e(ctag)}</p><ul>{lst}</ul></div>{foot(doc, pn)}</section>''')
        pn += 1
        blocks = ''
        for it in items:
            k += 1
            title, why, how, eff = it[:4]
            tag = f'<span class="tagw">{e(it[4])}</span>' if len(it) > 4 and it[4] != 'Alle Gewerke' else ''
            blocks += f'''<div class="item"><div class="n">{k:02d}</div><div><h3><span>{e(title)}{tag}</span><span class="eff">Aufwand {e(eff)} {dots(eff)}</span></h3><p>{e(why)}</p><div class="how"><b>So zeigen Sie es</b>{e(how)}</div></div></div>'''
        pages.append(f'''<section class="page"><div class="hd"><span class="eyebrow on-light">Bereich {ci + 1:02d}</span><span class="serif">{e(cname)}</span></div><div class="items">{blocks}</div>{foot(doc, pn)}</section>''')
        pn += 1
    # Lookup fuer Schnellstarter
    allitems = {it[0]: it for _, _, its in cats for it in its}
    qs = ''
    for j, name in enumerate(doc['quick']):
        it = allitems[name]
        qs += f'<div><span class="n">{j + 1}</span><p><b>{e(name)}</b><span>{e(it[2])}</span></p></div>'
    pages.append(f'''<section class="page q"><span class="eyebrow on-light">Schnellstarter</span><h2>Diese fünf Punkte können Sie<br>in 30 Tagen angehen.</h2><div class="qs">{qs}</div>
<div class="wk"><div><b>Woche 1</b>Entscheiden Sie, welche Punkte Sie wirklich halten können.</div><div><b>Woche 2</b>Klären Sie Regeln und Zuständigkeiten intern.</div><div><b>Woche 3</b>Machen Sie die Punkte auf Webseite und in Anzeigen sichtbar.</div><div><b>Woche 4</b>Prüfen Sie, was Rückmeldungen und Anfragen zeigen, und justieren Sie nach.</div></div>
<p class="leg" style="margin-top:8mm">Die Auswahl der Schnellstarter ist eine Einschätzung von Digitale Gewinner. Wählen Sie die fünf, die zu Ihrem Betrieb passen.</p>{foot(doc, pn)}</section>''')
    pn += 1
    # Checkliste
    cl = ''
    kk = 0
    left, right = [], []
    for ci, (cname, _t, its) in enumerate(cats):
        rows = f'<h4>{ci + 1:02d} · {e(cname)}</h4>'
        for it in its:
            kk += 1
            rows += f'<div class="r"><span class="b"></span><span class="b p"></span><span>{kk:02d} {e(it[0])}</span></div>'
        (left if ci < 3 else right).append(rows)
    pages.append(f'''<section class="page cl"><span class="eyebrow on-light">Ihre Checkliste</span><h2>Was haben Sie schon?</h2>
<p class="leg" style="margin-top:0">Erstes Kästchen: haben wir. Zweites Kästchen: planen wir. Jedes „haben wir“ ist ein Argument, das Sie ab morgen zeigen können.</p>
<div class="ck"><div>{''.join(left)}</div><div>{''.join(right)}</div></div>{foot(doc, pn)}</section>''')
    pn += 1
    op = ''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in doc['online'])
    pages.append(f'''<section class="page on"><span class="eyebrow on-light">Sichtbar machen</span><h2>{e(doc['online_title'])}.</h2><div class="op">{op}</div>
<div class="aud" style="margin-top:8mm"><b>Merksatz:</b> Ein Benefit zählt erst, wenn ihn ein Bewerber oder Kunde sieht, versteht und ohne Hürde darauf reagieren kann.</div>{foot(doc, pn)}</section>''')
    pn += 1
    pages.append(f'''<section class="page cta dark"><div class="in">{brand()}
<h2>{e(doc['cta_title'])}</h2><p class="lead">{e(doc['cta_text'])}</p>
<a class="btn" href="{CAL}">Kostenlose 15-Minuten-Analyse buchen</a>
<div class="who"><img src="{PORTRAIT}" alt=""><div><strong>Raphael Hermann</strong><span>Digitale Gewinner · persönlich für Sie da</span></div></div>
<div class="ct"><span>Telefon: <a href="tel:{PHONE.replace(' ', '')}">{PHONE}</a></span><span>WhatsApp: <a href="{WA}">wa.me/4971134063951</a></span><span>Web: <a href="{WEB}">digitalegewinner.de</a></span></div>
<p class="disc">Redaktionelle Zusammenstellung von Digitale Gewinner auf Basis von Erfahrungen aus Recruiting- und Marketingprojekten und allgemein bekannten Branchenthemen, Stand Oktober 2026. Keine repräsentative Studie, keine Rechts-, Steuer- oder Tarifberatung. Rechtliche, steuerliche und tarifliche Fragen klären Sie bitte mit Fachleuten. Die Aufwandsangaben sind grobe Einschätzungen.</p></div></section>''')
    return f'<!doctype html><html lang="de"><head><meta charset="utf-8"><title>{e(" ".join(t))}</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'

def main():
    sys.path.insert(0, str(ROOT))
    TMP.mkdir(exist_ok=True); OUT_PDF.mkdir(parents=True, exist_ok=True); OUT_IMG.mkdir(parents=True, exist_ok=True)
    jobs = []
    for m in MODS:
        doc = importlib.import_module(m).DOC
        for _, _, its in doc['cats']:
            assert len(its) == 5
        for q in doc['quick']:
            assert any(it[0] == q for _, _, its in doc['cats'] for it in its), q
        f = TMP / f"{doc['slug']}.html"
        f.write_text(render_html(doc), encoding='utf-8')
        jobs.append(dict(html=str(f), pdf=str(OUT_PDF / f"{doc['slug']}.pdf"), slug=doc['slug']))
    (TMP / 'jobs.json').write_text(json.dumps(jobs))
    subprocess.run(['node', str(ROOT / 'render.cjs'), str(TMP / 'jobs.json')], check=True)

if __name__ == '__main__':
    main()
