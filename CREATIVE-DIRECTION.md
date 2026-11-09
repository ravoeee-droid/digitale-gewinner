# DIGITALE GEWINNER — Signature Brand Experience
## Creative direction and engineering brief for Claude Code
**Status:** Provisional creative specification. Development branch only. Never merge or deploy without explicit approval.

### The principle
Create a premium, restrained, editorial cinematic experience; NOT a gaming-neon site. The animation should feel like a fine champagne-gold thread catching light in an almost black space: barely perceptible at rest, graceful as the user scrolls, purposeful at key narrative moments.

**One memorable signature, not 20 effects.** Its role is to make the intelligent web system visually understandable and to reinforce the identity of Raphael + Bruno.

### Foundational sources
- Website: `https://digitalegewinner.de`
- Moodboard approved as direction: founder and dog, elegant dark/cream/gold, limited growth accent, compelling Pflege and PV panel examples. Moodboard renders are illustrative; they are not authentic portraits of Raphael or Bruno.
- Brand photos already in repo: `assets/images/brand/raphael-bruno-office.webp`, `assets/images/brand/raphael-bruno-schreibtisch.webp`, `assets/images/brand/raphael-pdl-gespraech-bruno.webp`. Confirm suitability and originality before any derivative creative.
- Existing palette: background `#080705`, warm ivory `#f6efe5`, champagne gold `#d8a648`, gold highlight `#f1ce84`. Use electric lime ONLY as a rare functional outcome signal, not as a running decorative streak.

### Detailed visual language
- Background: onyx and warm charcoal, layered with very quiet depth, not loud particles, ambient video or rainbow gradients.
- Light signature: thin 1–1.5 px warm-gold SVG stroke. The blurred companion should remain faint: restrained opacity (roughly 0.12–0.25) and limited spatial extent. Revisit numbers after screenshots.
- Movement: slow, deliberate, physically credible, smooth without scroll hijack; no racing streaks, giant bloom, lens flare, laser effects, or dramatic pulses at every scroll.
- Hierarchy: typography, human portraits and proof ALWAYS take priority. The line must never compete with headlines or CTA buttons.
- Typeface: refine expressive editorial headlines and highly legible modern body; audit existing CSS before changing font stack; avoid gratuitous letter spacing and tiny mobile text.
- Brand architecture: same recognizable identity on homepage, Pflege and PV, with variations in photography and information hierarchy by industry. Human trust in Pflege; clarity and measurable business process in PV.
- The dog Bruno is a signature human-brand asset, not a stock mascot. Avoid fake animals, invented identities, cartoon treatments and misleading testimonials.

### First proposed visual sequence ("DG Signature Thread")
1. **Hero:** very faint champagne-gold arc behind Raphael and Bruno, not a line drawn across their faces. Intro transition should be barely noticeable.
2. **A website starts working:** a line follows the narrative from a visitor event into the product, where subtle nodes activate one at a time.
3. **Live system:** the same line elegantly connects inquiry, qualification, reminder and booked call; avoid visual data claims unless real or explicitly marked as demo.
4. **Pflege / PV:** purposeful variation to guide attention, not noisy visual ornaments; industry panels maintain photographic authenticity.
5. **Final CTA:** a brief refined glint as the visual story resolves, not a flashing button.

### Engineering source of truth (IMPORTANT)
- This is **not** a purely Next.js frontend. The static customer-facing pages are assembled by `build.sh` from `site/build_site.py`, `site/site.css`, `site/site.js`; the `payload-cms` workspace is separate.
- Editing `dist/` is ineffective. Editing root `index.html` is insufficient: the build overwrites generated output.
- Existing local GSAP / ScrollTrigger files are in `site/vendor/` and interaction code in `site/site.js`. There is also a hero network canvas; audit all motion before adding another background layer.
- `fx.js` documents a prior scroll/fixed-widget regression involving Lenis. **Do not introduce any additional smooth-scroll controller or global scroll hijacking.**
- Existing forms, consent, analytics, SEO, links, canonical paths, responsive layout, CMS-bridge and customer proof must continue functioning.
- Prefer a lean SVG path with GSAP ScrollTrigger scrub, e.g. SVG pathLength / stroke-dashoffset, over expensive 3D or continuous canvas redraw.
- Ensure path is decorative (`aria-hidden`, `pointer-events:none`) and layers behind text/CTAs.

### Responsive and accessible behavior
- Desktop 1440px+: full but restrained signature animation; tablet simplified; mobile 390px: short static/decelerated local motif, never giant global scroll effects.
- Respect `prefers-reduced-motion:reduce`, with fully usable and visually composed static alternative.
- No content shift, horizontal overflow, input obstruction, hover-only functionality or sudden audio.
- Keep the experience readable without JavaScript.

### Proof-of-quality checks
- Run the actual build path and confirm generated output contains new assets.
- Capture and inspect at 390, 768, 1440 and 1920px; include review of the first fold, long scroll sections, sticky nav, floating widgets and final CTA.
- Validate layout, tap targets, form submission, consent, keyboard interaction, CTA destinations, animation layering, SEO/canonical, and tracking event compatibility.
- Check Core Web Vitals targets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at p75 real traffic when measured. Avoid claiming numbers before testing.
- Provide before/after screenshots and detailed change log for review; do NOT deploy to production or merge into main without explicit approval.

### Claude Code execution instructions
1. Inspect `build.sh`, `site/build_site.py`, `site/site.css`, `site/site.js`, `site/README.md`, `fx.js`, `cms-bridge.js`, current hero images, and deployment setup.
2. Report conflicts and build path; write a minimal design proposal before modifying source.
3. Implement ONLY the flagship homepage hero + one storytelling transition for the first review, on branch `feat/signature-brand-experience`.
4. Reuse existing GSAP tooling; do not migrate the entire site to React or Next.js.
5. Run build and checks; give screenshots/mobile comparison and a PR link. Keep production untouched.

**Quality bar:** quiet confidence, rare memorable motion, bespoke and unmistakably Digitale Gewinner. Never generic "AI agency" sparkle.