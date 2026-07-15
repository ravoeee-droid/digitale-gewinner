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

# Overlay the new authority pages.
for name in ('index.html', 'case-studies.html', 'robots.txt', 'sitemap.xml'):
    shutil.copy2(name, out / name)

# Copy the sales-psychology upgrade and local asset rendering rules.
for name in ('trust-upgrade.css', 'case-worlds.css', 'local-assets.css', 'trust-upgrade.js'):
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

    if 'trust-upgrade.css' not in html:
        html = html.replace(
            '</head>',
            '<link rel="stylesheet" href="trust-upgrade.css">'
            '<link rel="stylesheet" href="case-worlds.css">'
            '<link rel="stylesheet" href="local-assets.css"></head>'
        )
    elif 'local-assets.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="local-assets.css"></head>')

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

for name in ('index.html', 'case-studies.html', 'trust-upgrade.css', 'case-worlds.css', 'local-assets.css', 'trust-upgrade.js'):
    if not (out / name).exists():
        raise SystemExit(f'Missing publish file: {name}')

shutil.rmtree(tmp, ignore_errors=True)
print('Digitale Gewinner built with 16 verified local WebP assets.')
PY
