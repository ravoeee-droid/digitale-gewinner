# Digitale Gewinner SEO Radar

MVP für SEO-, Search-Visibility- und Kundenreporting.

## Bereits enthalten
- Live Website-Audit der eingegebenen URL
- Executive Dashboard mit Opportunity-Logik
- Keyword UI + vorbereiteter DataForSEO Live-Endpunkt
- Konkurrenz- und Social-Search-Ansichten
- Executive Report mit Browser-PDF/Print Export
- Responsive Oberfläche

## DataForSEO verbinden
In Vercel als Environment Variables hinterlegen:

- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`

Danach liefert `/api/keywords` echte Google-Ads-Suchvolumen-Daten über DataForSEO.

## Nächste Integrationen
- Google Search Console OAuth + Website Properties
- Search Console Platform Properties für Social Search
- PageSpeed / CrUX
- Supabase Snapshots und Kundenprojekte
- DataForSEO SERP / Competitors / Keyword Gap
