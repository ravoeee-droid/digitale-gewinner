from pathlib import Path
import shutil

root = Path(__file__).resolve().parent
out = root / 'dist'
bridge = root / 'cms-bridge.js'

if not bridge.exists():
    raise SystemExit('cms-bridge.js is missing')

shutil.copy2(bridge, out / 'cms-bridge.js')

for name in ('index.html', 'case-studies.html'):
    path = out / name
    source = path.read_text(encoding='utf-8')
    if 'cms-bridge.js' not in source:
        source = source.replace('</body>', '<script src="/cms-bridge.js" defer></script></body>', 1)
    path.write_text(source, encoding='utf-8')

print('Payload CMS bridge injected into homepage and case studies.')
