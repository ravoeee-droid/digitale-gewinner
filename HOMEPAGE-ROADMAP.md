# DIGITALE GEWINNER — HOMEPAGE FIRST (Scope lock 2026-11-09)

## Decision
**Only redesign the MAIN HOMEPAGE (/) for the intelligent Websystem offer at this stage.** Not Pflege, PV-Trust, Handwerk, or any other existing subpages. Those should remain functionally and visually unchanged for now. Avoid sitewide CSS regressions.

### Priority: one immaculate section at a time
1. Establish brand tokens (fonts, editorial hierarchy, black/ivory/champagne gold, only the rarest growth accent). These should not spill into untouched branch pages.
2. Design and implement the homepage hero with authentic Raphael + Bruno photography and a luxurious, restrained scroll-following gold filament background effect (details in CREATIVE-DIRECTION.md).
3. Review at 390/768/1440/1920px, verify actual scroll movement, accessibility, reduced motion, layout stability, nav, CTA.
4. Only after hero approved: build story section "Die Website von gestern. Das Websystem von heute."
5. Only after previous section approved: live interactive demo of lead inquiry → qualification → appointment → dashboard.
6. Continue section by section through niche selection, proof, founder, process, CTA. Every section must meet visual, technical, mobile, and conversion quality criteria.

## Homepage market positioning
Umbrella brand for small and midsize businesses; **one product category: intelligent Websystems**. Not a generic full-service marketing agency and not disconnected Pflege/PV product ads. Keep clear differentiation between what the system AUTOMATES (capture/qualify/follow up) and what remains contingent (traffic, ad budget, actual sales or hires).

### Message and narrative
Headline direction:
**"Deine Website sollte für dich arbeiten. Nicht nur gut aussehen."**
Subline direction:
"Intelligente Websysteme, die Kundenanfragen erfassen, Bewerber qualifizieren, Termine organisieren und Prozesse automatisieren – alles übersichtlich steuerbar."
Headline and subline are draft copy, not yet locked. Test for brevity on mobile.

### Primary conversion
1. **Primary CTA:** "Live-Demo ansehen" — anchors to an interactive demo, accessible at all screen sizes.
2. **Secondary CTA:** "Potenzial prüfen" — leads to current working form / 15-minute consultation, preserving existing lead processing and consent.
3. Pre-qualify B2B visitors with real outcome messaging, not just futuristic visuals.
4. The hero must show proof of product usefulness; make animation support a clear narrative, not replace conversion.

### What stays intact
- All existing subpages and their URLs, nav routes, SEO/canonicals, existing campaigns and customer proof.
- Privacy, lead tracking, form submissions, performance and GDPR consent.
- Build source of truth: build.sh -> site/build_site.py, site/site.css, site/site.js; not only root index.html.
- Never change production main or deploy live without review.

### Price and substantiation
A possible 3,500 EUR entry offer was discussed. The current Pflege page contains another price (4,900 EUR net). **Do not change or advertise pricing on homepage until exact scope, exclusions, and display are approved**; no fabricated old 30,000 EUR comparison or lead/hiring guarantees.
- Claims like "KI gewinnt automatisch Kunden" require precise explanation. AI may automate answering, qualifying and follow-up; actual incoming traffic needs acquisition.

### What counts as a successful first deliverable
A fully implemented and reviewable hero, distinct typography and a subtle cinematic visual language with *background filaments drifting down as the user scrolls*, plus a polished transition to the next section, with screenshots/demo showing the real interaction.
No generic SaaS overlays, no loud neon, no simplistic template, no bundle of 20 random effects.
