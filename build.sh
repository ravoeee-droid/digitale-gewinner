#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import shutil
import zipfile

archive = Path('dg-website-final-netlify-postprocessing-fix.zip')
tmp = Path('.tmp-site')
out = Path('dist')

shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(out, ignore_errors=True)
tmp.mkdir()
out.mkdir()

# Preserve all existing assets, legal pages and specialist pages.
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

# Replace only the brand homepage and add the case-study page.
for name in ('index.html', 'case-studies.html', 'robots.txt', 'sitemap.xml'):
    shutil.copy2(name, out / name)

# Add the sales-psychology, results and immersive case-study upgrade.
for name in ('trust-upgrade.css', 'case-worlds.css', 'trust-upgrade.js'):
    shutil.copy2(name, out / name)

for name in ('index.html', 'case-studies.html'):
    page = out / name
    html = page.read_text(encoding='utf-8')
    if 'trust-upgrade.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="trust-upgrade.css"><link rel="stylesheet" href="case-worlds.css"></head>')
    elif 'case-worlds.css' not in html:
        html = html.replace('</head>', '<link rel="stylesheet" href="case-worlds.css"></head>')
    if 'trust-upgrade.js' not in html:
        html = html.replace('</body>', '<script src="trust-upgrade.js" defer></script></body>')
    page.write_text(html, encoding='utf-8')

shutil.rmtree(tmp, ignore_errors=True)
for name in ('index.html', 'case-studies.html', 'trust-upgrade.css', 'case-worlds.css', 'trust-upgrade.js'):
    if not (out / name).exists():
        raise SystemExit(f'Missing {name}')
print('Digitale Gewinner results and case-study upgrade built successfully.')
PY
