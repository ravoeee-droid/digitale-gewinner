#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re
import shutil
import subprocess
import zipfile

root = Path('.')
archive = root / 'dg-website-final-netlify-postprocessing-fix.zip'
tmp = root / '.tmp-site'
out = root / 'dist'

shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(out, ignore_errors=True)
tmp.mkdir()
out.mkdir()

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

for name in ('index.html', 'case-studies.html', 'pflege.html', 'handwerk.html', 'danke.html', 'robots.txt', 'sitemap.xml'):
    shutil.copy2(root / name, out / name)

publish_assets = (
    'trust-upgrade.css',
    'case-worlds.css',
    'local-assets.css',
    'trust-upgrade.js',
    'home-case-style.css',
    'home-case-polish.css',
    'home-case-style.js',
    'cro-upgrade.css',
    'cro-upgrade.js',
    'case-overview.css',
    'case-overview.js',
    'cta-widget.css',
    'cta-widget.js',
    'fx.css',
    'fx.js',
)
for name in publish_assets:
    shutil.copy2(root / name, out / name)

repo_images = root / 'assets/images'
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
    # Raphael Hermann hero/about/process images intentionally excluded here:
    # index.html now hardcodes the current Bruno photos directly with correct
    # width/height, and this alt-text-keyed replacement used to silently
    # revert them back to the old portrait Raphael-solo images on every build.
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

home = out / 'index.html'
html = home.read_text(encoding='utf-8')
for alt, (src, width, height) in image_data.items():
    html = replace_image_tag(html, alt, src, width, height)

base_links = (
    '<link rel="stylesheet" href="case-worlds.css">'
    '<link rel="stylesheet" href="local-assets.css">'
)
if 'case-worlds.css' not in html:
    html = html.replace('</head>', base_links + '</head>')
elif 'local-assets.css' not in html:
    html = html.replace('</head>', '<link rel="stylesheet" href="local-assets.css"></head>')

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

# trust-upgrade.js, cro-upgrade.js, home-case-style.js/.css and
# home-case-polish.css are all intentionally excluded from index.html now:
# - trust-upgrade.js / cro-upgrade.js DOM-inject pre-rebrand agency copy
#   (hero offer chips, "Website der Woche" giveaway campaign, old
#   Vertrauensanalyse form text) and cro-upgrade.js additionally hijacks
#   #trustForm's submit event in the capture phase with
#   stopImmediatePropagation, silently overriding the rewritten handler
#   already inlined in index.html.
# - home-case-style.js/.css apply a per-section "scene" background system
#   (cs-cream/cs-wine/cs-blue/...) built around the OLD 3-pillar
#   Google/Website/Social-Media content. It rewrites #system's headline
#   back to "3 Orte. 1 Eindruck." and forces an old asymmetric grid layout.
# - home-case-polish.css additionally @imports
#   /assets/images/ui/home-brand-lock.css, which re-locks #system's pillar
#   colors/grid and sets `.pillar>*{position:relative}` with #id-level
#   specificity, breaking .pillar-label's `position:absolute` and making
#   the label badge overlap the link text instead of sitting top-left.
# None of this loads on pflege.html/handwerk.html, which is also why the
# homepage looked visually inconsistent with the other two pages.
# cro-upgrade.js stays loaded on danke.html (its own <script> tag there),
# where it only prefills the thank-you page and is harmless.
home.write_text(html, encoding='utf-8')

subprocess.run(['python3', 'render-cases.py'], check=True)

expected_images = [
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
for rel in expected_images:
    path = out / rel
    if not path.exists():
        raise SystemExit(f'Missing local image: {rel}')
    header = path.read_bytes()[:12]
    if header[:4] != b'RIFF' or header[8:12] != b'WEBP':
        raise SystemExit(f'Invalid WebP file: {rel}')

required = (
    'index.html', 'case-studies.html', 'pflege.html', 'handwerk.html', 'danke.html',
    'trust-upgrade.css', 'case-worlds.css', 'local-assets.css',
    'trust-upgrade.js', 'home-case-style.css', 'home-case-polish.css',
    'home-case-style.js', 'cro-upgrade.css', 'cro-upgrade.js',
    'case-overview.css', 'case-overview.js', 'cta-widget.css', 'cta-widget.js',
    'fx.css', 'fx.js',
)
for name in required:
    if not (out / name).exists():
        raise SystemExit(f'Missing publish file: {name}')

case_html = (out / 'case-studies.html').read_text(encoding='utf-8')
if case_html.count('class="case-world') != 10:
    raise SystemExit('Not all 10 case studies were rendered')

shutil.rmtree(tmp, ignore_errors=True)
print('Digitale Gewinner built with 10 individually presented case studies.')
PY
