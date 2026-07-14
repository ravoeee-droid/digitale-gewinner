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

# Preserve the existing legal and specialist pages.
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

# Overlay the new authority website without touching the retained pages.
files = [
    'index.html', 'case-studies.html',
    'site-images-1.js', 'site-images-2.js', 'site-images-3.js', 'site-images-4.js',
    'robots.txt', 'sitemap.xml'
]
for name in files:
    shutil.copy2(name, out / name)

shutil.rmtree(tmp, ignore_errors=True)
required = [out / name for name in files]
missing = [str(p) for p in required if not p.exists()]
if missing:
    raise SystemExit('Missing required files: ' + ', '.join(missing))
print(f'Built {sum(1 for p in out.rglob("*") if p.is_file())} files.')
PY
