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

shutil.rmtree(tmp, ignore_errors=True)
for name in ('index.html', 'case-studies.html'):
    if not (out / name).exists():
        raise SystemExit(f'Missing {name}')
print('New Digitale Gewinner authority website built successfully.')
PY
