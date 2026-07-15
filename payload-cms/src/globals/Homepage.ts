import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Startseite',
  admin: {
    group: 'Website-Inhalte',
  },
  versions: {
    drafts: true,
    max: 25,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', defaultValue: 'Spezialist für digitalen Vertrauensaufbau' },
        { name: 'headline', type: 'text', required: true, defaultValue: 'Ich mache Vertrauen online sichtbar.' },
        { name: 'subline', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'primaryCtaLabel', type: 'text', defaultValue: 'Meine Vertrauenslücken prüfen lassen' },
        { name: 'secondaryCtaLabel', type: 'text', defaultValue: 'Case Studies ansehen' },
      ],
    },
    {
      name: 'trustProblems',
      label: 'Vertrauensproblem-Signale',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'featuredCaseStudies',
      type: 'relationship',
      relationTo: 'case-studies',
      hasMany: true,
      maxRows: 3,
      admin: {
        description: 'Die drei Vorschau-Cases auf der Startseite, in der gewünschten Reihenfolge.',
      },
    },
    {
      name: 'featuredReviews',
      type: 'relationship',
      relationTo: 'reviews',
      hasMany: true,
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
    },
  ],
}
