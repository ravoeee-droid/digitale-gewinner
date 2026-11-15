#!/usr/bin/env python3
"""Hängt den DG-Brand-Skin an alle gebauten Seiten, die noch nicht im neuen Look sind."""
import sys
from pathlib import Path
out = Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
TAGS = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;800&display=swap">'
        '<link rel="stylesheet" href="/dg-brand.css?v=1"><script src="/dg-brand.js?v=1" defer></script>')
n = 0
for f in out.rglob('*.html'):
    if any(p in f.parts for p in ('backend', 'admin', 'analyse-data')):
        continue
    s = f.read_text(encoding='utf-8', errors='ignore')
    if 'family=Sora' in s or 'dg-brand.css' in s or '</head>' not in s:
        continue
    f.write_text(s.replace('</head>', TAGS + '</head>', 1), encoding='utf-8')
    n += 1
print(f'Brand-Skin: {n} Seiten ergänzt.')
