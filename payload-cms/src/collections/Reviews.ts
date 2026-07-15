import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Bewertung',
    plural: 'Bewertungen',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'rating', 'reviewDate', 'published'],
    group: 'Vertrauensbeweise',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    { name: 'text', type: 'textarea', required: true },
    { name: 'reviewDate', type: 'date' },
    { name: 'sourceUrl', label: 'Google-Link', type: 'text' },
    { name: 'published', type: 'checkbox', defaultValue: true },
  ],
}
