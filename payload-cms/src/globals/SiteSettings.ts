import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Website-Einstellungen',
  admin: {
    group: 'SEO & GEO',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'brandName', type: 'text', required: true, defaultValue: 'Digitale Gewinner' },
        { name: 'expertName', type: 'text', required: true, defaultValue: 'Raphael Hermann' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', defaultValue: '+49 711 34063951' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'positioning',
      type: 'textarea',
      required: true,
      defaultValue: 'Digitale Gewinner macht Vertrauen online sichtbar – über Google, Website und Social Media – damit Unternehmen mehr passende Kundenanfragen und bessere Bewerbungen gewinnen.',
    },
    {
      name: 'proof',
      type: 'group',
      fields: [
        { name: 'yearsExperience', type: 'number', defaultValue: 8 },
        { name: 'managedAdBudget', type: 'number', defaultValue: 200000 },
        { name: 'googleRating', type: 'number', defaultValue: 5, min: 1, max: 5 },
        { name: 'googleReviewCount', type: 'number', defaultValue: 9 },
        { name: 'googleReviewUrl', type: 'text' },
      ],
    },
    {
      name: 'defaultSeo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 65, defaultValue: 'Mehr Kundenanfragen & bessere Bewerber | Digitale Gewinner' },
        { name: 'metaDescription', type: 'textarea', maxLength: 170 },
        { name: 'socialImage', type: 'upload', relationTo: 'media' },
        { name: 'canonicalBaseUrl', type: 'text', defaultValue: 'https://digitale-gewinner.de' },
      ],
    },
    {
      name: 'aiSummary',
      label: 'Faktenzusammenfassung für KI-Systeme',
      type: 'textarea',
      admin: {
        description: 'Klare, überprüfbare Zusammenfassung ohne übertriebene oder erfundene Aussagen.',
      },
    },
  ],
}
