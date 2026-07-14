#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import base64
import shutil
import zipfile

archive = Path('dg-website-final-netlify-postprocessing-fix.zip')
tmp = Path('.tmp-site')
out = Path('dist')

shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(out, ignore_errors=True)
tmp.mkdir()
out.mkdir()

# Keep all existing legal pages and specialist pages from the previous package.
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

# Overlay the new authority website and portfolio page.
for name in ('index.html','case-studies.html','robots.txt','sitemap.xml'):
    shutil.copy2(name, out / name)

assets = out / 'assets'
assets.mkdir(exist_ok=True)
for bundle in ('founder-assets.zip','case-assets.zip'):
    encoded = Path(bundle + '.b64').read_text().strip()
    binary = tmp / bundle
    binary.write_bytes(base64.b64decode(encoded))
    with zipfile.ZipFile(binary) as package:
        package.extractall(assets)

shutil.rmtree(tmp, ignore_errors=True)
required = [out/'index.html', out/'case-studies.html', assets/'hero-raphael.webp', assets/'strong-relationship.webp']
missing = [str(p) for p in required if not p.exists()]
if missing:
    raise SystemExit('Missing required files: ' + ', '.join(missing))
print(f'Built {sum(1 for p in out.rglob("*") if p.is_file())} files.')
PY
