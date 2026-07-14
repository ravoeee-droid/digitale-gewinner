#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import shutil
import zipfile

archive = Path("dg-website-final-netlify-postprocessing-fix.zip")
tmp = Path(".tmp-site")
out = Path("dist")

shutil.rmtree(tmp, ignore_errors=True)
shutil.rmtree(out, ignore_errors=True)
tmp.mkdir()
out.mkdir()

with zipfile.ZipFile(archive) as package:
    package.extractall(tmp)

index_files = sorted(tmp.rglob("index.html"), key=lambda path: len(path.parts))
if not index_files:
    raise SystemExit("No index.html found in original website package")

source = index_files[0].parent
for item in source.iterdir():
    target = out / item.name
    if item.is_dir():
        shutil.copytree(item, target)
    else:
        shutil.copy2(item, target)

shutil.rmtree(tmp, ignore_errors=True)
print("Original website restored successfully.")
PY

test -f dist/index.html
