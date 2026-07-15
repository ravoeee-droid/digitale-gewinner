import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sector', 'order', 'featured', 'status'],
    group: 'Website-Inhalte',
  },
  versions: {
    drafts: true,
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true, index: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'sector', type: 'text', required: true },
        { name: 'order', type: 'number', required: true, defaultValue: 1, min: 1 },
        { name: 'featured', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
    },
    {
      name: 'problem',
      label: 'Ausgangslage / Problem',
      type: 'textarea',
      required: true,
    },
    {
      name: 'solution',
      label: 'Umsetzung / Lösung',
      type: 'textarea',
      required: true,
    },
    {
      name: 'impact',
      label: 'Wirkung',
      type: 'textarea',
      required: true,
    },
    {
      name: 'resultLabel',
      label: 'Kurzes sichtbares Ergebnis',
      type: 'text',
      required: true,
      admin: {
        description: 'Zum Beispiel: „Weniger Preisvergleich“ oder „Sicherer Erstkontakt“ – keine erfundenen Kennzahlen.',
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'websiteUrl', type: 'text' },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#d8a648',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text', maxLength: 65 },
        { name: 'metaDescription', type: 'textarea', maxLength: 170 },
        { name: 'keywords', type: 'text' },
      ],
    },
  ],
}
