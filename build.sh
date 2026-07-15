#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re
import shutil
import zipfile

archive = Path('dg-website-final-netlify-postprocessing-fix.zip')
tmp = Path('.tmp-site')
out = Path('dist')

shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(out, ignore_errors=True)
tmp.mkdir()
out.mkdir()

# Preserve the existing website, legal pages and specialist pages.
with zipfile.ZipFile(archive) as package:
    package.extractall(tmp)
index_files = sorted(tmp.rglob('index.html'), key=lambda p: len(p.parts))
if not index_files:
    raise SystemExit('No index.html found in original website package')
source = index_files[0].parent
for item in source.iterdir():
    target = out / item.name
    if item.is_dir():
        shutil.copytree(item, target)
    else:
        shutil.copy2(item, target)

# Overlay the authority pages and conversion completion page.
for name in ('index.html', 'case-studies.html', 'danke.html', 'robots.txt', 'sitemap.xml'):
    shutil.copy2(name, out / name)

# Copy visual layers, local assets and the homepage CRO system.
style_and_script_files = (
    'trust-upgrade.css',
    'case-worlds.css',
    'local-assets.css',
    'trust-upgrade.js',
    'home-case-style.css',
    'home-case-polish.css',
    'home-case-style.js',
    'cro-upgrade.css',
    'cro-upgrade.js',
)
for name in style_and_script_files:
    shutil.copy2(name, out / name)

# Copy the uploaded WebP files into the actual publish directory.
repo_images = Path('assets/images')
if not repo_images.exists():
    raise SystemExit('Missing uploaded assets/images directory')
shutil.copytree(repo_images, out / 'assets/images', dirs_exist_ok=True)

image_data = {
    'Strong Relationship Website': ('/assets/images/case-studies/case-study-strong-relationship.webp', 1567, 723),
    'ASMR Time Onlineshop': ('/assets/images/case-studies/case-study-asmr-time.webp', 1571, 720),
    'Vertrauensvolle Zusammenarbeit': ('/assets/images/case-studies/case-study-dj-walli.webp', 1575, 724),
    'JJ Media Website': ('/assets/images/case-studies/case-study-jj-media.webp', 1578, 723),
    'DeFi Intelligence Website': ('/assets/images/case-studies/case-study-defi-intelligence.webp', 1575, 723),
    'Digitales Markenerlebnis': ('/assets/images/case-studies/case-study-kitan-design.webp', 1582, 726),
    'Körperkult Website': ('/assets/images/case-studies/case-study-koerperkult.webp', 1579, 725),
    'Körperkult Onlineshop': ('/assets/images/case-studies/case-study-koerperkult.webp', 1579, 725),
    'Libi Elektronik Website': ('/assets/images/case-studies/case-study-libi-elektronik.webp', 1575, 723),
    'Beratung und Führungskräfteentwicklung': ('/assets/images/case-studies/case-study-fuehrungskraefte.webp', 1573, 721),
    'NeuroMind Website': ('/assets/images/case-studies/case-study-neuromind-breathwork.webp', 1573, 723),
    'NeuroMind Breathwork Website': ('/assets/images/case-studies/case-study-neuromind-breathwork.webp', 1573, 723),
    'Raphael Hermann von Digitale Gewinner': ('/assets/images/raphael/raphael-hermann-hero.webp', 1122, 1402),
    'Raphael Hermann in einer Beratungssituation': ('/assets/images/raphael/raphael-hermann-portrait.webp', 1122, 1402),
    'Strategie und Umsetzung bei Digitale Gewinner': ('/assets/images/raphael/raphael-hermann-strategiearbeit.webp', 1400, 933),
}

def replace_image_tag(html: str, alt: str, src: str, width: int, height: int) -> str:
    pattern = re.compile(r'<img\b[^>]*\balt="' + re.escape(alt) + r'"[^>]*>', re.IGNORECASE)
    eager = alt == 'Raphael Hermann von Digitale Gewinner'
    loading = ' fetchpriority="high"' if eager else ' loading="lazy"'
    replacement = (
        f'<img src="{src}" alt="{alt}" width="{width}" height="{height}"'
        f' decoding="async"{loading}>'
    )
    return pattern.sub(replacement, html)

for name in ('index.html', 'case-studies.html'):
    page = out / name
    html = page.read_text(encoding='utf-8')

    for alt, (src, width, height) in image_data.items():
        html = replace_image_tag(html, alt, src, width, height)

    # Three homepage pillars use local founder photos as CSS backgrounds.
    html = html.replace(
        ".p-google{--image:url('https://digitale-gewinner.de/assets/consulting.webp')}",
        ".p-google{--image:url('/assets/images/raphael/raphael-hermann-kundengespraech.webp')}"
    )
    html = html.replace(
        ".p-site{--image:url('https://digitale-gewinner.de/assets/raphael-office.webp')}",
        ".p-site{--image:url('/assets/images/raphael/raphael-hermann-strategiearbeit.webp')}"
    )
    html = html.replace(
        ".p-social{--image:url('https://digitale-gewinner.de/assets/process.webp')}",
        ".p-social{--image:url('/assets/images/raphael/raphael-hermann-praesentation.webp')}"
    )

    base_links = (
        '<link rel="stylesheet" href="trust-upgrade.css">'
        '<link rel="stylesheet" href="case-worlds.css">'
        '<link rel="stylesheet" href="local-assets.css">'
    )
    if 'trust-upgrade.css' not in html:
        html = html.replace('</head>', base_links + '</head>')
    elif 'local-assets.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="local-assets.css"></head>')

    if name == 'index.html':
        # Netlify Forms stores the lead before WhatsApp is opened. Hidden attribution
        # fields are populated by cro-upgrade.js and remain available for GTM/GA4.
        html = html.replace(
            '<form class="form" id="trustForm">',
            '<form class="form" id="trustForm" name="trust-analysis" method="POST" '
            'data-netlify="true" netlify-honeypot="bot-field" action="/danke.html">'
            '<input type="hidden" name="form-name" value="trust-analysis">'
            '<p hidden><label>Nicht ausfüllen: <input name="bot-field"></label></p>'
            '<input type="hidden" name="session_id">'
            '<input type="hidden" name="utm_source">'
            '<input type="hidden" name="utm_medium">'
            '<input type="hidden" name="utm_campaign">'
            '<input type="hidden" name="utm_content">'
            '<input type="hidden" name="utm_term">'
            '<input type="hidden" name="gclid">'
            '<input type="hidden" name="fbclid">'
        )
        priority_field = (
            '<div class="field full"><label for="priority">Was ist aktuell wichtiger?</label>'
            '<select id="priority" name="priority" required>'
            '<option value="" selected disabled>Bitte auswählen</option>'
            '<option value="Mehr qualifizierte Kundenanfragen">Mehr qualifizierte Kundenanfragen</option>'
            '<option value="Passende Mitarbeiter gewinnen">Passende Mitarbeiter gewinnen</option>'
            '<option value="Hochwertiger und vertrauenswürdiger wirken">Hochwertiger und vertrauenswürdiger wirken</option>'
            '<option value="Werbung und Website besser konvertieren">Werbung und Website besser konvertieren</option>'
            '<option value="Mehrere Bereiche gleichzeitig">Mehrere Bereiche gleichzeitig</option>'
            '</select><span class="cro-field-help">Damit Raphael die Analyse auf Ihr wichtigstes Ziel ausrichten kann.</span></div>'
        )
        goal_marker = '<div class="field full"><label for="goal">Was soll online stärker werden?</label>'
        if 'name="priority"' not in html:
            html = html.replace(goal_marker, priority_field + goal_marker)

        if 'home-case-style.css' not in html:
            html = html.replace(
                '</head>',
                '<link rel="stylesheet" href="home-case-style.css">'
                '<link rel="stylesheet" href="home-case-polish.css">'
                '<link rel="stylesheet" href="cro-upgrade.css"></head>'
            )
        elif 'cro-upgrade.css' not in html:
            html = html.replace('</head>', '<link rel="stylesheet" href="cro-upgrade.css"></head>')
        if 'trust-upgrade.js' not in html:
            html = html.replace('</body>', '<script src="trust-upgrade.js" defer></script></body>')
        if 'home-case-style.js' not in html:
            html = html.replace('</body>', '<script src="home-case-style.js" defer></script></body>')
        if 'cro-upgrade.js' not in html:
            html = html.replace('</body>', '<script src="cro-upgrade.js" defer></script></body>')
    else:
        # Case Studies intentionally remain unchanged except for their existing isolated system.
        if 'trust-upgrade.js' not in html:
            html = html.replace('</body>', '<script src="trust-upgrade.js" defer></script></body>')

    page.write_text(html, encoding='utf-8')

# Replace external screenshot services inside the dynamically generated homepage cases.
upgrade_js = out / 'trust-upgrade.js'
js = upgrade_js.read_text(encoding='utf-8')
js_replacements = {
    'https://image.thum.io/get/width/1400/crop/760/noanimate/https://strongrelationship.de': '/assets/images/case-studies/case-study-strong-relationship.webp',
    'https://image.thum.io/get/width/1400/crop/760/noanimate/https://libielektronik.de': '/assets/images/case-studies/case-study-libi-elektronik.webp',
    'https://image.thum.io/get/width/1400/crop/760/noanimate/https://neuromind-breathwork.de': '/assets/images/case-studies/case-study-neuromind-breathwork.webp',
    'https://image.thum.io/get/width/1400/crop/760/noanimate/https://koerperkult-shop.de': '/assets/images/case-studies/case-study-koerperkult.webp',
}
for old, new in js_replacements.items():
    js = js.replace(old, new)
upgrade_js.write_text(js, encoding='utf-8')

# Validate all 16 local assets and their WebP signatures.
expected = [
    'assets/images/raphael/raphael-hermann-hero.webp',
    'assets/images/raphael/raphael-hermann-portrait.webp',
    'assets/images/raphael/raphael-hermann-kundengespraech.webp',
    'assets/images/raphael/raphael-hermann-praesentation.webp',
    'assets/images/raphael/raphael-hermann-strategiearbeit.webp',
    'assets/images/raphael/raphael-hermann-zusammenarbeit.webp',
    'assets/images/case-studies/case-study-strong-relationship.webp',
    'assets/images/case-studies/case-study-asmr-time.webp',
    'assets/images/case-studies/case-study-dj-walli.webp',
    'assets/images/case-studies/case-study-jj-media.webp',
    'assets/images/case-studies/case-study-defi-intelligence.webp',
    'assets/images/case-studies/case-study-kitan-design.webp',
    'assets/images/case-studies/case-study-koerperkult.webp',
    'assets/images/case-studies/case-study-libi-elektronik.webp',
    'assets/images/case-studies/case-study-fuehrungskraefte.webp',
    'assets/images/case-studies/case-study-neuromind-breathwork.webp',
]
for rel in expected:
    path = out / rel
    if not path.exists():
        raise SystemExit(f'Missing local image: {rel}')
    header = path.read_bytes()[:12]
    if header[:4] != b'RIFF' or header[8:12] != b'WEBP':
        raise SystemExit(f'Invalid WebP file: {rel}')

required_publish_files = (
    'index.html',
    'case-studies.html',
    'danke.html',
    'trust-upgrade.css',
    'case-worlds.css',
    'local-assets.css',
    'trust-upgrade.js',
    'home-case-style.css',
    'home-case-polish.css',
    'home-case-style.js',
    'cro-upgrade.css',
    'cro-upgrade.js',
)
for name in required_publish_files:
    if not (out / name).exists():
        raise SystemExit(f'Missing publish file: {name}')

shutil.rmtree(tmp, ignore_errors=True)
print('Digitale Gewinner built with measurable CRO lead flow and unchanged case studies.')
PY
