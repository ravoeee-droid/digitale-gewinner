from __future__ import annotations

import html
import json
import runpy
import shutil
from pathlib import Path

root = Path(__file__).parent
page_path = root / "dist" / "case-studies.html"
data_path = root / "case-data.json"

cases = json.loads(data_path.read_text(encoding="utf-8"))
if len(cases) != 10:
    raise SystemExit(f"Expected 10 case studies, found {len(cases)}")


def e(value: object) -> str:
    return html.escape(str(value), quote=True)


def render_case(case: dict[str, str], index: int) -> str:
    reverse = " reverse" if index % 2 else ""
    return f'''<article class="case-world{reverse}" id="{e(case['id'])}" data-num="{e(case['num'])}" style="--accent:{e(case['accent'])};--ink:{e(case['ink'])};--soft:{e(case['soft'])};--case-bg:{e(case['bg'])}">
<div class="case-shell">
<div class="case-copy reveal">
<div class="case-kicker">Case Study {e(case['num'])}</div>
<h2>{e(case['name'])}</h2>
<div class="case-sector">{e(case['sector'])}</div>
<p class="case-summary">{e(case['summary'])}</p>
<div class="case-result"><span></span>{e(case['result'])}</div>
<div class="case-logic">
<div><b>Ausgangslage</b><p>{e(case['problem'])}</p></div>
<div><b>Umsetzung</b><p>{e(case['solution'])}</p></div>
<div class="impact"><b>Wirkung</b><p>{e(case['impact'])}</p></div>
</div>
<a class="case-link" href="index.html#analyse">Ähnliches Projekt anfragen <i>→</i></a>
</div>
<div class="case-visual reveal">
<div class="device"><div class="browser"><i></i><i></i><i></i><span>{e(case['url'])}</span></div><div class="screen"><img src="{e(case['img'])}" alt="Case Study {e(case['name'])}" width="1575" height="723" loading="lazy" decoding="async"></div></div>
<div class="visual-note"><b>Ergebnis</b>{e(case['result'])}</div>
</div>
</div>
</article>'''

page = page_path.read_text(encoding="utf-8")
marker = '<main id="case-list"></main>'
if marker not in page:
    raise SystemExit("Case-study marker missing")
rendered = "<main id=\"case-list\">\n" + "\n".join(render_case(case, index) for index, case in enumerate(cases)) + "\n</main>"
page_path.write_text(page.replace(marker, rendered), encoding="utf-8")
print("Rendered 10 individual case studies.")

# Copy and apply the isolated trust-problem, SEO/GEO and case-format layer only
# after the static homepage and all ten cases exist in dist.
shutil.copy2(root / "seo-geo-upgrade.css", root / "dist" / "seo-geo-upgrade.css")
runpy.run_path(str(root / "seo-geo-upgrade.py"), run_name="__main__")
